# portfolio

Multi-page personal site for Sohan Dogra — Platform & DevOps Engineer — with an
AI assistant and a project enquiry form.

**Live:** https://portfolio.sohandogra703.workers.dev

## Pages

| Path | Contents |
|---|---|
| `/` | Hero, delivery pipeline, engineering principles, section cards |
| `/experience/` | Roles, four case studies, skills, certifications |
| `/blog/` | Published articles (OpsTree + Medium) |
| `/projects/` | repurpose-ai, this site |
| `/contact/` | Contact details + project enquiry form |

Each page links to the next via a pager at the bottom.

## Architecture

```
Cloudflare Worker  (src/index.js)
   |
   +-- /api/ask ------> Workers AI (env.AI)
   |                    @cf/google/gemma-4-26b-a4b-it
   |                    grounded in src/profile.js
   |
   +-- /api/contact --> D1 (env.DB), then email best-effort
   |
   +-- everything else -> static assets (env.ASSETS -> public/)
```

## Editing pages

**Do not edit `public/**/*.html` directly — they are generated.** The nav, head
and footer shell lives once in `tools/build-pages.mjs`, so five pages cannot
drift apart. Edit that file, then:

```bash
node tools/build-pages.mjs
npx wrangler deploy
```

`public/styles.css` and `public/app.js` are hand-written and not generated.

`src/profile.js` is the AI assistant's only source of truth. When you add
experience or an article, update it there as well as in the page generator, or
the assistant will not know about it.

## Cost

Free. Workers AI allows 10,000 Neurons/day on the Free plan with **no paid
overage** — it fails closed rather than billing. D1's free tier covers a
contact form many times over. Static assets consume no Worker CPU.

## Email

Every enquiry is stored in D1 first, then email is attempted. Storage never
depends on email working.

**To turn on notification email — one command, no domain needed:**

```bash
npx wrangler secret put RESEND_API_KEY
```

Sign up at [resend.com](https://resend.com) with `sohandogra703@gmail.com` and
create an API key. Resend's sandbox sender (`onboarding@resend.dev`) delivers
only to the account owner's own address — which is exactly where notifications
go, so this works immediately.

The **visitor acknowledgement** still needs a verified domain. Until then Resend
returns 403 for it; that is expected and handled, and the UI does not promise a
confirmation email that was not sent.

Once a domain is verified in Resend:

```bash
npx wrangler secret put RESEND_FROM     # Sohan Dogra <hello@yourdomain.com>
```

`CONTACT_TO` defaults to `sohandogra703@gmail.com` in `src/contact.js` — it is
already public on the contact page, so it is a constant rather than a secret.

Read stored enquiries at any time:

```bash
npx wrangler d1 execute portfolio-enquiries --remote   --command "SELECT * FROM enquiries ORDER BY created_at DESC LIMIT 20"
```

## Local development

```bash
npx wrangler dev --remote
```

`--remote` is needed for the AI and D1 bindings to behave as in production.
The AI binding always hits the real Workers AI API and draws from the same
daily free allocation.

## Still to add

- `public/avatar.jpg` — profile photo. Falls back to an "SD" monogram without it.
