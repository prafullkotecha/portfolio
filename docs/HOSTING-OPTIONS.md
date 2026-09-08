# Hosting Options — Maker's Catalog

One document to rule them all: where to host the 87 catalog projects.

**Criteria, in order of importance:**
1. **Low cost** — steady-state target for the whole portfolio is ~$1–10/mo
2. **Ease of deployment** — git-push or single-command deploys, preview URLs, near-zero config for SPAs
3. **Backend integration** — databases, auth, serverless functions, secrets, env vars
4. **Popularity** — docs quality, community answers, agent/coding-tool familiarity, longevity
5. **Stack fit** — how naturally each platform fits the actual stacks in the catalog (Vite+React, Next.js, Astro, HTML, Three.js, Spring Boot, Kotlin/Flutter, Express+Postgres)

> Prices below are list prices as of writing (late 2025 / early 2026) and change often — verify before committing. Free tiers are the deciding factor for this portfolio, and they are summarized per platform.

---

## 1. Platform-by-platform evaluation

### Cloudflare Pages + Workers — ⭐ primary for Tier A

| Criterion | Assessment |
|---|---|
| Cost | **Best-in-class.** Pages: unlimited static requests free, 500 builds/mo. Workers free: 100k req/day. Paid $5/mo is effectively unlimited for hobby scale. Custom domains free (you pay only DNS/domain). |
| Ease | `wrangler pages deploy dist` or connect Git repo; every push builds + previews per PR. proven in this portfolio (beats-by-pooja, this site pattern). |
| Backend | Workers (serverless JS/TS at edge), D1 (SQLite), R2 (S3-like), KV, Durable Objects, Queues. AI proxy Worker already in this repo (`scripts/ai-proxy-worker`). No long-running processes. |
| Popularity | Very high and rising; excellent docs; wrangler well understood by AI coding tools. |
| Stack fit | Perfect for the ~55 Tier A statics/SPAs (Vite, Astro, plain HTML, Three.js). Not for Spring Boot/Kotlin/Android or Next.js SSR (limited via OpenNext, but friction). |

**Use for:** all Tier A, and Tier B apps whose "backend" is just an API proxy or simple KV. This is the default answer.

### Vercel — ⭐ primary for Next.js / Tier B

| Criterion | Assessment |
|---|---|
| Cost | Hobby (Pro is $20/user/mo): free, 100 GB bandwidth/mo, serverless fns included. The gotcha: per-function invocations and bandwidth can surprise on traffic spikes — fine for portfolio traffic. |
| Ease | Best-in-class for Next.js (it *is* Next.js's platform). Git-push, preview deploys, env vars in dashboard. |
| Backend | Serverless/edge functions, Vercel Postgres (Neon-backed), Blob, KV, Cron. Pairs naturally with external Supabase/Neon. |
| Popularity | Highest for frontend/Next.js; default assumption of most AI tooling (v0, Lovable, Copilot). |
| Stack fit | Next.js apps (therapy-clinic-* if revived, portfolio site itself), Vite/React also fine. Java/Kotlin: no. |

**Use for:** the portfolio site, any Next.js/Vite app needing SSR or serverless, Tier B "minor work" apps.

### Netlify

| Criterion | Assessment |
|---|---|
| Cost | Free tier: 100 GB bandwidth, 300 build min/mo. Paid $19/mo. |
| Ease | On par with Cloudflare/Vercel for statics; `netlify.toml` already familiar (bloominghorizons-site uses it). |
| Backend | Netlify Functions (AWS Lambda-based), Forms, Identity (auth). DB via external (Neon/Supabase). |
| Popularity | High, slightly behind Vercel for modern AI-tooling workflows. |
| Stack fit | Statics + Astro + Vite: great. Nothing the others can't do for this catalog — mainly valuable as the **multi-platform spread** option #3. |

**Use for:** diversification (goal: not all eggs in one basket), and any repo that already has `netlify.toml`.

### Google Cloud — Firebase (App Hosting / Hosting) + Cloud Run

| Criterion | Assessment |
|---|---|
| Cost | Firebase Hosting free: 10 GB storage, 360 MB/day transfer (low — the main downside). Cloud Run: generous free tier (2M req/mo), scale-to-zero. Firestore has a real free tier. |
| Ease | Firebase Hosting is easy for statics/SPAs; Cloud Run = build container, deploy. The 4 AI-Studio applet repos already have Firebase project configs (`firebase-applet-config.json`) — reusing those projects is the path of least resistance. |
| Backend | **Firebase is the strongest free backend bundle:** Firestore, Auth (incl. anonymous + social), Storage, Functions, App Hosting (Next.js/Angular). |
| Popularity | Very high; Gemini/AI-Studio ecosystem synergy. |
| Stack fit | The 4 applet repos (qrcode, tickr, done_and_dusted, budgeted) were born here — deploy them back to Firebase rather than porting. Cloud Run covers Spring Boot/Java (cloakwork, 340b-refgraph) as containers. |

**Use for:** the 4 Firebase-native applets; Cloud Run as the "real container" home for Java backend Tier C.

### AWS — Amplify Hosting / S3+CloudFront / Lightsail

| Criterion | Assessment |
|---|---|
| Cost | The trap: many services, easy to leak spend. Amplify free tier is modest (SSR pay-per-use); S3+CloudFront statics ≈ free at hobby traffic; Lightsail from $3.5–5/mo. Requires billing alarms, always. |
| Ease | Worst of the group — IAM, region choice, certs, multiple consoles. Amplify connecting a Git repo is OK; everything else is more work. |
| Backend | Everything exists (RDS, Cognito, Lambda, ECS) — that's the problem: everything is yours to wire. |
| Popularity | Highest overall cloud; most transferable resume value; AI tools know it but need more hand-holding. |
| Stack fit | S3+CloudFront is a fine static fallback; Lightsail/ECR+ECS for containers; Cognito is clunkier than Supabase/Firebase auth. |

**Use for:** learning/resume value; keep **one** simple thing here eventually (e.g., a static site on S3+CloudFront behind your own domain) rather than anything critical.

### Azure — Static Web Apps + Container Apps

| Criterion | Assessment |
|---|---|
| Cost | SWA free tier: 100 GB bandwidth, 2 staging envs. Container Apps has a decent free grant (180k vCPU-sec/mo). Pay-as-you-go only, no surprise "enterprise" gating. |
| Ease | SWA is easy for statics/SPAs with GitHub Actions integration; Container Apps moderate. |
| Backend | SWA linked "database connections" (Neon/Supabase/ Cosmos DB), managed functions; Entra ID (Azure AD) auth is genuinely good — relevant since you already run **Keycloak** (cloakwork) for SSO patterns. |
| Popularity | High in enterprise, lower in hobby/AI-tooling culture. Docs are thorough but sprawling. |
| Stack fit | SWA fine for statics; Container Apps fine for Java. Usually the 4th choice unless aiming for enterprise-stack breadth. |

**Use for:** multi-platform spread + enterprise-stack resume breadth (Entra ID, Container Apps). Low priority.

### Private VPS (Hetzner / OVH / Netcup / Racknerd…) — 🆕 the new option

| Criterion | Assessment |
|---|---|
| Cost | **Best raw value once shared across many services:** ~€4–8/mo buys 2–4 vCPU / 4–8 GB RAM that can host dozens of small containers. Beats every per-service free tier if you consolidate. Fixed price = no surprise bills. |
| Ease | Worst initially, best after setup: install Caddy (auto-HTTPS) + Docker + a Compose file once; then every new project is ~5 lines of YAML. No per-project dashboard; deploy = `git pull && docker compose up -d --build` or a tiny CI. Backups are your job (or a cheap object-storage cron). |
| Backend | Unlimited: Postgres (one shared instance, multiple DBs), Keycloak (already your SSO pattern), Redis, n8n, anything containerized. This is the only option where a shared Postgres + shared Keycloak serve the whole portfolio natively. |
| Popularity | Docker/Compose/Caddy are universally known; self-hosting community huge (r/selfhosted). |
| Stack fit | Perfect for everything Tier C: Spring Boot (cloakwork), Node/Express+Postgres apps (ClinicConnect, field-service-pro-sa, StickerSage…), even Next.js SSR via container. Also the natural home for the shared Keycloak/Supabase-style auth layer. Statics *can* live here but Cloudflare Pages is still easier per-project. |

**Use for:** the Tier C consolidation target. One VPS + Caddy wildcard DNS (`*.apps.yourdomain.com`) turns "13 deferred backend projects" into a weekend of copying compose snippets. Recommended spec: 4 vCPU/8 GB (Hetzner CPX21-class, ~€13) or start 2 vCPU/4 GB (~€6).

---

## 2. Side-by-side summary

| Platform | Free tier | Ease | Backend | Popularity | Best for in catalog |
|---|---|---|---|---|---|
| **Cloudflare** | ★★★★★ | ★★★★★ | ★★★☆ (serverless only) | ★★★★★ | Tier A statics/SPAs, AI proxies |
| **Vercel** | ★★★★ | ★★★★★ | ★★★★ | ★★★★★ | Portfolio, Next.js, Tier B |
| **Netlify** | ★★★★ | ★★★★★ | ★★★ | ★★★★ | Diversification, netlify.toml repos |
| **Firebase/GCP** | ★★★☆ (transfer cap) | ★★★★ | ★★★★★ (Auth+Firestore bundle) | ★★★★★ | 4 applet repos; Cloud Run for Java |
| **AWS** | ★★★ (leaky) | ★★ | ★★★★★ (if you wire it) | ★★★★★ | Resume value; S3+CF static fallback |
| **Azure** | ★★★★ | ★★★ | ★★★★ (Entra ID) | ★★★★ | Spread + enterprise breadth |
| **VPS** | n/a (~$5–13/mo flat) | ★★→★★★★ | ★★★★★ (full containers) | ★★★★ | Tier C consolidation, shared PG+Keycloak |

---

## 3. Backend services (databases / auth) — the shared layer

Whatever hosts the frontend, reuse the same backends to keep cost near zero and ops simple:

| Need | Primary choice | Why / notes |
|---|---|---|
| Postgres | **Supabase** (1 shared project, per-app schemas/DBs) | Free tier: 500 MB, auth included, generous. Already the RUNBOOK plan. Fallback: **Neon** (scale-to-zero branching, generous free). |
| Auth | **Supabase Auth** for Supabase apps; **Firebase Auth** for the applets; **Keycloak on the VPS** for anything SSO/enterprise-shaped (cloakwork pattern) | Avoid one auth system per app. |
| Serverless API proxy | **Cloudflare Worker** (`scripts/ai-proxy-worker` already exists) | Hides Gemini/OpenAI keys server-side; pair with referrer-restricted keys per RUNBOOK. |
| Object storage | Cloudflare R2 (no egress fees) or Supabase Storage | Screenshots, uploads. |
| Containers/long-running | **VPS (Docker)** first; Cloud Run / Azure Container Apps as managed alternatives | For Spring Boot, Express, Keycloak. |

---

## 4. Recommended allocation (decision defaults)

**When in doubt, place a project like this:**

1. Pure static/SPA, no secrets server-side → **Cloudflare Pages**
2. Next.js / needs SSR or serverless → **Vercel**
3. Already has Firebase applet config / needs Firestore+Auth free bundle → **Firebase Hosting**
4. Needs real backend process (Express, Spring Boot, Keycloak, shared Postgres) → **VPS via Docker + Caddy**; Cloud Run if you want it managed
5. Explicit goal of platform diversity or the repo already has platform config (`netlify.toml`, `vercel.json`) → follow the repo
6. AWS/Azure → one showcase project each, chosen for learning value, never the critical path

**Steady-state cost with this allocation:** domain (~$10/yr) + VPS (~€6–13/mo, optional until Tier C work starts) + $0 everywhere else ≈ **$1–15/mo total**, inside the stated budget.

---

## 5. Multi-platform spread (the stated goal)

A pragmatic diversification that keeps ops cheap:

- **Cloudflare** — the bulk (Tier A) + edge proxies. Cheapest at volume.
- **Vercel** — portfolio + Next.js Tier B.
- **Netlify** — 2–3 statics (already started with bloominghorizons-site pattern).
- **Firebase/GCP** — the 4 applet repos + Cloud Run for Java Tier C if not self-hosting.
- **VPS** — Tier C consolidation + shared Keycloak/Postgres.
- **AWS** — one S3+CloudFront static showcase.
- **Azure** — one SWA deployment showcase (only if enterprise breadth matters).

Rule of thumb: **no platform hosts anything critical alone**, DNS stays at Cloudflare regardless of where apps run (free, makes moving trivial), and every project records its platform in `deploy_target` + `PROJECTS-CHECKLIST.csv` so the Portfolio Sync Bot can track platform usage.

---

## 6. Quick-deploy cheat sheet

```bash
# Cloudflare Pages (Tier A default)
npx wrangler pages deploy dist --project-name=<id>

# Vercel (Next.js / Tier B)
npx vercel --prod

# Netlify
npx netlify deploy --prod --dir=dist

# Firebase Hosting (applet repos)
npx firebase-tools deploy --only hosting

# S3 + CloudFront (AWS showcase)
aws s3 sync dist/ s3://<bucket> --delete && aws cloudfront create-invalidation ...

# Azure Static Web Apps
az staticwebapp deploy ...   # or GitHub Actions workflow

# VPS (after one-time Caddy+Docker setup)
ssh vps "cd /opt/apps/<id> && git pull && docker compose up -d --build"
```

After any deploy: set the resulting URL in `content/projects/{id}.json` (`live_url`) — e.g. `./scripts/set-live-url.sh <id> https://<url>` — and tick `deployed?=yes` in `PROJECTS-CHECKLIST.csv`. The Grok sync bot (see [grok-portfolio-sync-bot.md](./grok-portfolio-sync-bot.md)) verifies these by probing, so keep them honest.

---

## Related docs

- [RUNBOOK.md](../RUNBOOK.md) — day plan, accounts, key setup
- [docs/TRIAGE.md](./TRIAGE.md) — per-project tier rationale
- [docs/grok-portfolio-sync-bot.md](./grok-portfolio-sync-bot.md) — the bot that tracks sync + deployment progress against these targets
