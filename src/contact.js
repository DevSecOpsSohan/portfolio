/**
 * Contact / project enquiry handling.
 *
 * Every submission is written to D1 first, so nothing is lost if email delivery
 * is unconfigured or fails. Email is sent afterwards, best-effort.
 *
 * Email needs a verified sender domain — both Cloudflare's send_email binding
 * and Resend require one. Until a custom domain exists, leave the secrets unset:
 * the form still captures enquiries. Read them with:
 *
 *   npx wrangler d1 execute portfolio-enquiries --remote \
 *     --command "SELECT * FROM enquiries ORDER BY created_at DESC LIMIT 20"
 *
 * To turn email on later:
 *   npx wrangler secret put RESEND_API_KEY     # resend.com, free tier
 *   npx wrangler secret put CONTACT_TO         # where enquiries land
 *   npx wrangler secret put RESEND_FROM        # Sohan Dogra <hello@yourdomain.com>
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

async function sendViaResend(env, { to, subject, text, replyTo }) {
  const payload = { from: env.RESEND_FROM, to: [to], subject, text };
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
    first_name: clean(body?.first_name, LIMITS.first_name),
    last_name: clean(body?.last_name, LIMITS.last_name),
    email: clean(body?.email, LIMITS.email),
    phone: clean(body?.phone, LIMITS.phone),
    subject: clean(body?.subject, LIMITS.subject),
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
  const canEmail = Boolean(env.RESEND_API_KEY && env.CONTACT_TO && env.RESEND_FROM);
  let emailed = false;

  if (canEmail) {
    try {
      await sendViaResend(env, {
        to: env.CONTACT_TO,
        subject: `Portfolio enquiry — ${enquiry.first_name} ${enquiry.last_name}`,
        text: notificationText(enquiry),
        replyTo: enquiry.email,
      });

      await sendViaResend(env, {
        to: enquiry.email,
        subject: "Thanks — I've received your message",
        text: acknowledgementText(enquiry),
      });

      await env.DB.prepare("UPDATE enquiries SET emailed = 1 WHERE id = ?").bind(id).run();
      emailed = true;
    } catch (err) {
      // Logged, never surfaced. The enquiry is stored either way.
      console.error("enquiry email failed:", err?.message ?? err);
    }
  } else {
    console.log(
      `enquiry #${id} stored; email not configured (needs RESEND_API_KEY, CONTACT_TO, RESEND_FROM)`
    );
  }

  return Response.json({ ok: true, emailed });
}
