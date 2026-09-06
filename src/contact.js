/**
 * Contact / project enquiry handling.
 *
 * Every submission is written to D1 first, so nothing is lost if email delivery
 * is unconfigured or fails. Email is sent afterwards, best-effort.
 *
 * To enable notification email — one secret, no domain needed:
 *
 *   npx wrangler secret put RESEND_API_KEY
 *
 * Sign up at resend.com with sohandogra703@gmail.com. Resend's sandbox sender
 * (onboarding@resend.dev) delivers only to the account owner's own address, so
 * the notification to Sohan works immediately while the visitor acknowledgement
 * returns 403. That 403 is expected and handled, not an error.
 *
 * Once a custom domain is verified in Resend, set RESEND_FROM to an address on
 * it and visitor acknowledgements start working too:
 *
 *   npx wrangler secret put RESEND_FROM        # Sohan Dogra <hello@yourdomain.com>
 *
 * Read stored enquiries at any time:
 *
 *   npx wrangler d1 execute portfolio-enquiries --remote \
 *     --command "SELECT * FROM enquiries ORDER BY created_at DESC LIMIT 20"
 */

const LIMITS = {
  first_name: 80,
  last_name: 80,
  email: 200,
  phone: 40,
  subject: 140,
  message: 4000,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Where enquiry notifications go. Already public on the contact page, so it is
// a default rather than a secret — only RESEND_API_KEY needs setting.
const CONTACT_TO = "sohandogra703@gmail.com";

// Resend's sandbox sender. Works with no domain verification, but can only
// deliver to the Resend account owner's own address. Override RESEND_FROM once
// a custom domain is verified, and visitor acknowledgements start working too.
const DEFAULT_FROM = "Sohan Dogra Portfolio <onboarding@resend.dev>";

// Where the WhatsApp ping goes. Already public on the contact page, so it is a
// default rather than a secret — only WHATSAPP_APIKEY needs setting.
const WHATSAPP_DEFAULT_TO = "+918287332760";

const TAB = 9;
const NEWLINE = 10;
const SPACE = 32;
const DEL = 127;

/**
 * Trim a form field to length and drop control characters, keeping tabs and
 * newlines so a multi-line message body survives. Done by character code
 * rather than regex — the escape sequences for a control-character class are
 * easy to get subtly wrong, and getting it wrong silently eats real content.
 */
function clean(value, max) {
  if (typeof value !== "string") return "";

  let out = "";
  for (const ch of value) {
    const code = ch.codePointAt(0);
    if (code === DEL) continue;
    if (code < SPACE && code !== TAB && code !== NEWLINE) continue;
    out += ch;
  }

  return out.trim().slice(0, max);
}

/**
 * Same, but for fields that are a single line by definition.
 *
 * A name carrying a line break ends up in the notification's subject line.
 * Resend takes JSON and builds the headers itself, so this cannot inject a
 * header today — but "the current transport happens to be safe" is a thin
 * reason to pass a newline into a header position, and it costs one call to
 * close off.
 */
function cleanLine(value, max) {
  return clean(value, max).replace(/[\t\n]+/g, " ").trim();
}

async function sendViaResend(env, { to, subject, text, replyTo }) {
  const payload = { from: env.RESEND_FROM || DEFAULT_FROM, to: [to], subject, text };
  if (replyTo) payload.reply_to = replyTo;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`resend ${res.status}: ${detail.slice(0, 200)}`);
  }
}

/**
 * Ping Sohan's phone when an enquiry lands.
 *
 * Deliberately minimal: first name and subject only, never the enquirer's
 * email, phone or message body. This routes through a third-party relay, and
 * there is no reason to hand a stranger's contact details to an extra service
 * when the purpose is only "go and look at your inbox". The full enquiry is in
 * D1 and in the notification email.
 *
 * Enable with:
 *   npx wrangler secret put WHATSAPP_APIKEY
 *
 * Optional override if the destination number ever changes:
 *   npx wrangler secret put WHATSAPP_TO
 */
async function notifyWhatsApp(env, enquiry) {
  const to = env.WHATSAPP_TO || WHATSAPP_DEFAULT_TO;
  const text = `New portfolio enquiry from ${enquiry.first_name}${
    enquiry.subject ? ` — ${enquiry.subject}` : ""
  }. Details are in your email and in D1.`;

  const url =
    "https://api.callmebot.com/whatsapp.php" +
    `?phone=${encodeURIComponent(to)}` +
    `&text=${encodeURIComponent(text)}` +
    `&apikey=${encodeURIComponent(env.WHATSAPP_APIKEY)}`;

  const res = await fetch(url, { method: "GET" });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`callmebot ${res.status}: ${detail.slice(0, 200)}`);
  }
}

function notificationText(e) {
  return `New project enquiry from your portfolio.

Name:     ${e.first_name} ${e.last_name}
Email:    ${e.email}
Phone:    ${e.phone || "(not given)"}
Subject:  ${e.subject || "(none)"}
Country:  ${e.ip_country || "unknown"}
Received: ${e.created_at}

Message
-------
${e.message}

Reply directly to this email to respond to them.`;
}

function acknowledgementText(e) {
  return `Hi ${e.first_name},

Thanks for getting in touch through my portfolio. I've received your message
and will get back to you personally, usually within a couple of working days.

For your reference, here is what you sent:

${e.message}

Best regards,
Sohan Dogra
Platform & DevOps Engineer
https://portfolio.sohandogra703.workers.dev`;
}

export async function handleContact(request, env, rateLimited) {
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";

  if (rateLimited(`contact:${ip}`)) {
    return Response.json(
      { error: "Too many submissions. Try again in a minute." },
      { status: 429 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Malformed request." }, { status: 400 });
  }

  // Honeypot: hidden from humans, filled by bots. Return success so they don't
  // learn they were caught, but write nothing.
  if (typeof body?.website === "string" && body.website.trim() !== "") {
    return Response.json({ ok: true });
  }

  const enquiry = {
    first_name: cleanLine(body?.first_name, LIMITS.first_name),
    last_name: cleanLine(body?.last_name, LIMITS.last_name),
    email: cleanLine(body?.email, LIMITS.email),
    phone: cleanLine(body?.phone, LIMITS.phone),
    subject: cleanLine(body?.subject, LIMITS.subject),
    message: clean(body?.message, LIMITS.message),
    ip_country: request.headers.get("CF-IPCountry") || null,
    created_at: new Date().toISOString(),
  };

  const errors = {};
  if (!enquiry.first_name) errors.first_name = "First name is required.";
  if (!enquiry.last_name) errors.last_name = "Last name is required.";
  if (!enquiry.email) errors.email = "Email is required.";
  else if (!EMAIL_RE.test(enquiry.email)) errors.email = "That email doesn't look right.";
  if (!enquiry.message) errors.message = "Tell me a little about the project.";
  else if (enquiry.message.length < 15)
    errors.message = "A bit more detail would help — at least a sentence.";

  if (Object.keys(errors).length) {
    return Response.json({ error: "Please check the form.", fields: errors }, { status: 400 });
  }

  // 1. Persist first. This is the step that must not fail silently.
  let id;
  try {
    const result = await env.DB.prepare(
      `INSERT INTO enquiries
         (created_at, first_name, last_name, email, phone, subject, message, ip_country)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        enquiry.created_at,
        enquiry.first_name,
        enquiry.last_name,
        enquiry.email,
        enquiry.phone || null,
        enquiry.subject || null,
        enquiry.message,
        enquiry.ip_country
      )
      .run();
    id = result.meta?.last_row_id;
  } catch (err) {
    console.error("enquiry insert failed:", err?.message ?? err);
    return Response.json(
      { error: "Couldn't save your message. Please email sohandogra703@gmail.com directly." },
      { status: 500 }
    );
  }

  // 2. Email is best-effort. A delivery failure must not lose a stored enquiry.
  //
  // The two sends are tracked separately on purpose. Without a verified domain,
  // Resend allows sending only from onboarding@resend.dev and only to the
  // account owner's own address — so the notification to Sohan succeeds while
  // the visitor acknowledgement returns 403. One shared try block would have
  // let that expected 403 mask a notification that actually went out.
  let notified = false;
  let acknowledged = false;

  if (env.RESEND_API_KEY) {
    try {
      await sendViaResend(env, {
        to: CONTACT_TO,
        subject: `Portfolio enquiry — ${enquiry.first_name} ${enquiry.last_name}`,
        text: notificationText(enquiry),
        replyTo: enquiry.email,
      });
      notified = true;
    } catch (err) {
      console.error(`enquiry #${id} notification failed:`, err?.message ?? err);
    }

    try {
      await sendViaResend(env, {
        to: enquiry.email,
        subject: "Thanks — I've received your message",
        text: acknowledgementText(enquiry),
      });
      acknowledged = true;
    } catch (err) {
      // Expected until a sender domain is verified; not an error worth alarm.
      console.log(`enquiry #${id} acknowledgement skipped:`, err?.message ?? err);
    }

    if (notified || acknowledged) {
      await env.DB.prepare("UPDATE enquiries SET emailed = 1 WHERE id = ?").bind(id).run();
    }
  } else {
    console.log(`enquiry #${id} stored; RESEND_API_KEY not set, no email attempted`);
  }

  // 3. WhatsApp ping, also best-effort and also independent of the above — a
  // relay outage must not lose an enquiry that is already safely stored.
  if (env.WHATSAPP_APIKEY) {
    try {
      await notifyWhatsApp(env, enquiry);
    } catch (err) {
      console.error(`enquiry #${id} whatsapp ping failed:`, err?.message ?? err);
    }
  }

  // The UI only promises the visitor a confirmation when one actually reached them.
  return Response.json({ ok: true, emailed: acknowledged, notified });
}
