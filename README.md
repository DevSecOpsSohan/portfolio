# portfolio

Personal site for Sohan Dogra — Platform & DevOps Engineer, with an AI assistant
that answers questions about his experience.

**Live:** https://portfolio.sohandogra703.workers.dev

## Architecture

```
Visitor
   |
   v
Cloudflare Worker  (src/index.js)
   |
   +-- /api/ask ----> Workers AI binding (env.AI)
   |                     @cf/google/gemma-4-26b-a4b-it
   |                     grounded in src/profile.js
   |
   +-- everything else --> static assets (env.ASSETS -> public/)
```

No API keys in the frontend. No separate AI server. No OpenAI account.

## Cost

Free. Workers AI gives **10,000 Neurons/day** on the Free plan, and the Free plan
has **no paid overage** — if the allocation runs out the call fails and the page
shows a fallback message. It cannot generate a bill by accident.

Static assets consume no Worker CPU, so the site itself is free at any traffic level.

## The knowledge base

`src/profile.js` is the single source of truth. The assistant's system prompt is
generated from it, so the model can only answer from documented facts. Verified
behaviours:

- Answers ground in real employers and real outcomes
- Refuses questions outside the knowledge base ("not covered in Sohan's portfolio")
- Resists prompt injection attempting to override instructions or leak the prompt
- Interview mode flips it into asking the visitor DevOps questions

To update site content and assistant knowledge together, edit `src/profile.js`
(assistant) and `public/index.html` (page).

## Local development

```bash
npx wrangler dev
```

Note: the AI binding always hits the real Workers AI API, even in local dev —
it draws from the same daily free allocation.

## Deploy

```bash
npx wrangler deploy
```

## Files

```
src/index.js       Worker: routing, validation, rate limiting, AI call
src/profile.js     Knowledge base + system-prompt text generation
public/index.html  The page
public/styles.css  Design system (CSS custom properties at the top)
public/app.js      Chat client, scroll reveal, avatar fallback
wrangler.jsonc     Worker config with AI + ASSETS bindings
```

## Still to add

- `public/avatar.jpg` — profile photo. Falls back to an "SD" monogram without it.
