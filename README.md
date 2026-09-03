# portfolio

Personal site for Sohan Dogra — Platform & DevOps Engineer.

Static HTML and CSS. No framework, no build step, no dependencies. Deploys to
Cloudflare Workers static assets, which stays free at any traffic level because
static assets consume no Worker CPU.

## Content

Built from the GitLab Platform Engineer CV (Aug 2026). Everything on the page is
real: three roles, active AWS SAA and CKA certifications, and the measured
outcomes (30% cloud spend reduction, ~25 audit hours saved monthly).

## Two files you still need to add

Both are referenced by the page and will 404 until you drop them in:

| File | Path | Notes |
|---|---|---|
| Profile photo | `public/avatar.jpg` | Square crop works best. Without it the page shows an "SD" monogram — it degrades cleanly, so this is optional. |
| Résumé | `public/Sohan_Dogra_Resume.pdf` | See the privacy note below before adding. |

**Privacy note on the résumé.** Your CV PDF contains your phone number. I left
the phone off the web page deliberately — public phone numbers attract spam and
recruiter cold-calls — and did not copy the PDF into `public/` for the same
reason. If you want the résumé downloadable, either accept that, or export a
version with the phone removed and save it to that path. Your call, not mine.

## Local preview

Open `public/index.html` directly, or serve it the way Cloudflare will:

```bash
npx wrangler dev
```

## Deploy

```bash
npx wrangler login   # once
npx wrangler deploy
```

Lands on `portfolio.<your-subdomain>.workers.dev`. Add a custom domain from the
Worker's settings in the Cloudflare dashboard — custom domains are free.

## Editing

Everything is in `public/index.html`. Sections in order: hero, experience,
skills, projects, certifications, contact. Styling is `public/styles.css`,
driven by CSS custom properties at the top — change `--accent` to restyle the
whole page.
