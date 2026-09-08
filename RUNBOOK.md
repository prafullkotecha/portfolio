# Deployment Runbook

A step-by-step guide to get your 71-project portfolio live on a **~$1/mo budget**.

Total time: ~3–4 hours (mostly clicks). Can be done in a single session or split across days.

---

## 0. Pre-flight — accounts & keys

Create accounts (all free):

| Service | Why | URL |
|---|---|---|
| Cloudflare | Pages (host SPAs), Workers (AI proxy) | https://dash.cloudflare.com/sign-up |
| Vercel | Host Next.js apps + portfolio | https://vercel.com/signup |
| Supabase | **Self-hosted in Docker on the VPS** — Postgres + Auth + Storage for all apps; see [docs/SELFHOSTED-SUPABASE.md](./docs/SELFHOSTED-SUPABASE.md). (supabase.com hosting not used.) |
| Neon (optional) | Backup DB option | https://neon.tech |

Get/check API keys:

| Key | Where | Restriction |
|---|---|---|
| **Gemini API key** | https://aistudio.google.com/apikey | Restrict to `*.pages.dev` + your domain (HTTP referrer) — see §5 |
| **OpenAI API key** | https://platform.openai.com/api-keys | Set monthly hard limit ($5–10) |
| **ElevenLabs API key** | https://elevenlabs.io/app/settings/api-keys | Free tier has built-in caps |

> **Why referrer restriction?** Gemini SPA apps embed the key in client JS at build time. Restricting by referrer at Google's side means the key only works from your deployed domains — anyone copy-pasting it gets 403.

---

## 1. Domain — point at Cloudflare

(You said you have a domain.)

1. Log into your registrar.
2. Add Cloudflare nameservers (CF dashboard will show them after adding the domain).
3. In CF dashboard → your domain → enable proxy on root (orange cloud).

You'll wire individual subdomains as we deploy each thing.

**Subdomain strategy** (pick one):
- `app.yourdomain.com` per project — clean but you'll have 50+ DNS records
- `yourdomain.com/p/{slug}` paths via a single proxy — more work, prettier
- `*.yourdomain.com` wildcard CNAME → CF Pages — simplest, what I'd recommend

**Recommended:** `<project-id>.yourdomain.com` for each, plus `yourdomain.com` for portfolio. This is what we'll set up.

---

## 2. Deploy the portfolio site (do this first — it'll show "coming soon" everywhere, then fill in as you deploy)

The portfolio is a static Next.js site reading `src/data/projects.json`.

### One-time setup
```bash
# In the portfolio/ folder I gave you:
cd portfolio
git init
git add .
git commit -m "init: maker's catalog"
gh repo create prafullkotecha/portfolio --public --push --source .
```

### Deploy to Vercel
1. https://vercel.com/new → Import `prafullkotecha/portfolio`
2. Framework: Next.js (auto-detected)
3. Build command: `npm run build` (default)
4. Output directory: `out` (next.config has `output: 'export'`)
5. Click Deploy
6. Project Settings → Domains → add `yourdomain.com`

That's it. Portfolio is live. Every time you add a `live_url` to `src/data/projects.json` and push, Vercel rebuilds in ~30s.

---

## 3. Deploy Tier A (48 SPAs) to Cloudflare Pages

These are mostly Vite+React Gemini apps. Cloudflare auto-detects the Vite build.

### One-time CF setup
1. CF Dashboard → **Workers & Pages** → **Connect to Git** → Authorize GitHub → grant access to **all** repos (you can scope later)
2. CF Dashboard → **Workers & Pages** → **Create** → take note of the URL

### For each Tier A project (~30 sec each)
1. **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. Pick repo
3. Build settings:
   - Framework preset: **Vite** (or **Create React App** for the rare CRA repo, **Next.js (Static HTML Export)** for static Next.js)
   - Build command: `npm run build`
   - Build output: `dist` (or `build` for CRA, `out` for Next.js export)
4. **Environment variables** (Production) — see §4 below per project
5. **Save and deploy**
6. Once green: **Custom domains** → add `<project-id>.yourdomain.com`
7. Copy the live URL → paste into `portfolio/src/data/projects.json` for that project's `live_url`
8. Push portfolio repo → portfolio rebuilds with the new link

**Pro tip:** open `PROJECTS-CHECKLIST.csv` and tick off as you go — keeps you sane across 48 deploys.

### Bulk path (optional, if you'd rather script)
See `scripts/cf-deploy.sh`. Requires CF API token with `Pages:Edit` permission. Skim & adapt before running.

---

## 4. Environment variables per project

Most Tier A repos need only `GEMINI_API_KEY`. A few need others. The script `scripts/list-env-vars.sh` reads each repo and prints its env requirements.

| Project ID | Env vars needed | Notes |
|---|---|---|
| All `gemini-ai-studio-*` and `google-ai-studio-*` | `GEMINI_API_KEY` | Restrict at Google by referrer |
| `tu-dekha` | `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_GOOGLE_MAPS_API_KEY`, `VITE_OPENAI_API_KEY` | Tier B — see §6 |
| `ai-artifact-vault` | `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID` | Tier B — see §6 |
| `bolt-commerce-js-store` | `VITE_COMMERCEJS_PUBLIC_KEY` | Use commerce.js sandbox key |
| `bookmark-organizer` | `REACT_APP_USE_MOCK_API=true` | Tier C — runs with mock data only |

---

## 5. Restrict Gemini API key by HTTP referrer

This is what makes "key bundled in client" safe.

1. https://aistudio.google.com/apikey → click your key
2. **Application restrictions** → **HTTP referrers**
3. Add referrers (one per line):
   ```
   https://*.pages.dev/*
   https://*.yourdomain.com/*
   https://yourdomain.com/*
   ```
4. **API restrictions** → restrict to **Generative Language API**
5. Save. Wait 5 min for propagation.

Now any non-allowed origin gets 403 even with the key.

---

## 6. Tier B — apps needing minor work (10 apps)

### 6.1 Supabase apps (`ai-artifact-vault`, `tu-dekha`, `banquet-seating-arrangements-v0`)
Each Lovable/v0 project that uses Supabase typically expects a project the AI tool created. **Decision (2026-09):** all of them point at the **self-hosted Supabase instance on the VPS** — see [docs/SELFHOSTED-SUPABASE.md](./docs/SELFHOSTED-SUPABASE.md). Run each app's migration scripts (look in `supabase/migrations/`) against the shared instance, one schema per app, RLS on every table. Same `SUPABASE_URL` and publishable key for all three — no hosted-project limits apply.

Legacy note (hosted era): the old "quickest vs cleaner" tradeoff of shared vs per-app supabase.com projects (2-project free-tier cap) is superseded and only relevant if you ever fall back to hosting.

Steps:
1. https://supabase.com/dashboard → New project (free)
2. SQL editor → paste each repo's `supabase/migrations/*.sql` files in order
3. Settings → API → copy URL + anon key
4. Set as env vars in CF Pages / Vercel for those 3 apps

### 6.2 v0 ElevenLabs Next.js apps (4 apps)
- `v0-eleven-labs-agents-starter` — env: `ELEVENLABS_API_KEY`, `AGENT_ID`
- `v0-eleven-labs-music-starter` — env: `ELEVENLABS_API_KEY`
- `v0-eleven-labs-v3-podcast-generator` — env: `ELEVENLABS_API_KEY`, `OPENAI_API_KEY`, `NEXT_PUBLIC_SUPABASE_*`
- `pwa-website-chatbot-v0` — env: `OPENAI_API_KEY`

These are Next.js with API routes (server-side keys, safe). Deploy to **Vercel**, not CF Pages:
1. Vercel → Import → repo
2. Set env vars in Project Settings → Environment Variables
3. Deploy
4. Custom domain → `<id>.yourdomain.com`

### 6.3 Misc Tier B
- `ondc-farmer-connect-v0` — has ONDC env vars; for demo purposes set them to placeholder values, app should still render UI
- `bolt-slidev-forked` — Slidev presentation. Build: `npm run build`, output: `dist`. Deploys fine on CF Pages.
- `ondc-farmer-connect-bolt` — static React via CDN. Just upload `index.html` + assets to CF Pages "direct upload"
- `SocialSpark` — framework unknown; inspect `package.json` and adjust build command
- `tech-event-website` — small node-server but has a static HTML version; build static
- `metaphor-mindIT` — multi-service; defer to Tier C bucket for now

---

## 7. Tier C — defer (13 apps, source-only on portfolio)

These have heavy backends (Postgres + Express + Drizzle). Showing as "Source available" on portfolio for now. To deploy later:

| Project | What it needs |
|---|---|
| `therapy-clinic-nextjs` | Keycloak, Postgres, NextAuth — the big one |
| `field-service-pro-sa` | Multi-tenant Express+DB |
| `ClinicConnect`, `DJProposals`, `HomeInventory`, `PassGenius`, `StickerSage` | Replit-style Express+Drizzle+Postgres apps |
| `gemini-ai-studio-budgeted-*`, `*-done_and_dusted-*`, `pk-ai-studio-remix-geoseeker`, `gemini-ai-studio-therapy-assistant` | Have node-server proxies — could be simplified to CF Worker proxy + static SPA |
| `metaphor-mindIT` | Microservices |
| `bookmark-organizer` | Express backend |

**Future path:** spin up a single Neon Postgres (free tier supports many DBs), deploy each Express backend to **Render** or **Railway** ($5/mo Railway plan covers ~3-4 small services). Total later cost: ~$5-10/mo for backend tier when you tackle this.

---

## 8. Future: AI proxy Worker (when you want to remove client-exposed keys)

Currently your Gemini keys are bundled in client JS but referrer-restricted. Future-proofing: use the included `scripts/ai-proxy-worker.js` as a Cloudflare Worker that proxies AI calls server-side with rate limiting. Apps then call your worker URL instead of Google's. Worker holds the key.

To deploy:
```bash
npm install -g wrangler
cd scripts/ai-proxy-worker
wrangler deploy
# Set secrets:
wrangler secret put GEMINI_API_KEY
wrangler secret put OPENAI_API_KEY
wrangler secret put ELEVENLABS_API_KEY
```

Then patch each app to point at `https://your-worker.workers.dev/v1/...` instead of provider URLs. This is more work but is the proper long-term architecture.

---

## 9. Updating the portfolio with live URLs

After each Tier A/B deploy:

1. Open `portfolio/src/data/projects.json`
2. Find the project by `id`
3. Set `"live_url": "https://<project-id>.yourdomain.com"`
4. Commit, push — Vercel auto-redeploys in 30s

Or batch: edit all at once, push once. Up to you.

---

## 10. Done — what next?

After portfolio is live with most things deployed:

- [ ] Tackle Tier C apps gradually (one Saturday afternoon each — they have real value)
- [ ] Add screenshots to project cards (extend `projects.json` with `screenshot` field, store images in `public/screenshots/`)
- [ ] Add "Last updated" auto-pulled from GitHub last-commit date (already in data, just render it)
- [ ] Migrate to AI Proxy Worker for cleaner architecture
- [ ] Consider consolidating duplicate themes/styling across projects to reduce maintenance

---

## Cost summary (steady state)

| Item | Monthly |
|---|---|
| Cloudflare Pages (50+ sites) | $0 |
| Vercel Hobby (portfolio + Next.js apps) | $0 |
| Supabase free (1-2 projects) | $0 |
| Cloudflare Worker (free tier 100k req/day) | $0 |
| Domain | ~$1 |
| **Total** | **~$1/mo** |

Headroom in your $20 budget if you later add Railway for Tier C backends ($5).
