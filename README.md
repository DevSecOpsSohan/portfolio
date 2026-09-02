# portfolio

Personal site for Sohan Dogra. Static HTML and CSS — no framework, no build
step, no dependencies. Deploys to Cloudflare Workers static assets, which is
free at any traffic level.

## Editing

Everything lives in `public/index.html`. Sections marked **TODO** are
placeholders that need your real content:

- headline summary
- LinkedIn URL and résumé link
- two project entries
- all four skill groups
- the About paragraph

Search the file for `TODO` — the markers are visible on the page on purpose, so
an unfinished site never reads as a finished one.

Your job title is currently "DevSecOps Engineer", inferred from your GitHub
handle. Correct it if that is not right.

## Local preview

No tooling needed — open `public/index.html` in a browser.

Or serve it the way Cloudflare will:

```bash
npx wrangler dev
```

## Deploy

```bash
npx wrangler deploy
```

Lands on `portfolio.<your-subdomain>.workers.dev`. To use your own domain, add
a custom domain under the Worker's settings in the Cloudflare dashboard.

## Why no framework

A portfolio is a handful of static pages. Static assets served from Cloudflare's
edge cost nothing and burn no Worker CPU, so this stays on the free plan
permanently regardless of traffic. A React build would add a toolchain, a build
step and CPU time for no benefit anyone visiting would notice.
