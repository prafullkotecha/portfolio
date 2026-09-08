# Self-Hosted Supabase (Docker) — Runbook

**Decision (2026-09):** use **Supabase self-hosted in Docker on the VPS** as the
portfolio's shared backend — Postgres + Auth + Storage + Realtime + Edge
Functions + the Supabase dashboard — instead of creating projects on
supabase.com hosting.

Reference video: https://youtu.be/PENspNEvC0U (Supabase, "Every backend starts
like this"). Official docs: https://supabase.com/docs/guides/self-hosting

---

## Why self-host instead of supabase.com

| | supabase.com hosted | self-hosted (VPS + Docker) |
|---|---|---|
| Cost | Free tier: 2 projects, 500 MB total, projects **pause after 1 week inactivity** | ~€0 marginal — rides on the VPS you already want for Tier C; unlimited projects/DBs, no pausing |
| Projects/DBs | 2 free projects (a real limit — RUNBOOK already bumped into it with 3 Supabase apps) | One instance serves **all** apps: per-app schemas or databases, no collision limits |
| Auth | Included | Included (GoTrue) — same `supabase-js` API in apps |
| Ops | Zero | Yours (backups, updates) — acceptable at portfolio scale, mitigations below |
| When hosted wins | You want zero-ops for one production app | — |

Portfolio context: the apps that need Supabase (`tu-dekha`, other Lovable/v0
apps, future Tier B) mostly expect **only** `SUPABASE_URL` + a publishable/anon
key — they don't care who runs it. Self-hosted is a drop-in replacement for them.

---

## Architecture in one line

```
apps (Cloudflare/Vercel/Netlify/localhost)
   └── supabase-js / REST / postgres pooler ──► VPS :8000 (Kong gateway)
                                                    └── docker compose: postgres, gotcha(auth),
                                                        storage, realtime, edge-runtime, kong,
                                                        studio (dashboard), imgproxy, vector, meta…
```

Everything is plain Docker containers on the VPS — `docker ps` works normally.

---

## Minimum specs (from the docs/video)

- 2 vCPU / 4 GB RAM minimum (a ~€6/mo VPS is fine to start)
- Docker Engine + Docker Compose v2, git
- Ports open: **8000** (Kong/dashboard + API), optionally 5432 closed-to-world (use the pooler on 8000 or bind 5432 to localhost/WireGuard)
- One wrinkle: the `edge-runtime` service needs ≥ 2 GB memory to boot; on a 2 GB box, disable functions you don't use

## One-command setup (VPS)

On any Docker host (VPS, home server, even a Raspberry Pi):

```bash
# 1. Setup script — installs git/docker if missing, clones supabase/supabase,
#    configures .env with SECURELY GENERATED secrets (JWT, keys, dashboard password)
git clone --depth 1 https://github.com/supabase/supabase
cd supabase/docker
../setup/setup.sh     # prompts for: site URL, API external URL (http://<VPS-IP>:8000)

# 2. Start
docker compose up -d
```

Idempotent defaults the script handles: API keys, JWT secret, Postgres
password, dashboard password — all securely generated into `.env`. Don't edit
by hand except for deliberate overrides.

## After it's up

| Task | How |
|---|---|
| Dashboard | `http://<VPS-IP>:8000` — username `supabase`, password from secrets script |
| Print all secrets | `../setup/secrets.sh` (dashboard password, `sb_publishable_…` key, Postgres password, JWT) |
| Table editor / SQL editor | Dashboard GUI; wrap destructive SQL in `BEGIN; … ROLLBACK/COMMIT;` |
| Direct Postgres | Supavisor pooler string — note the literal tenant id `your-tenant-id` in self-hosted default: `postgresql://supabase_admin:<pg-password>@<VPS-IP>:8000/your-tenant-id/postgres` |
| App connection snippet | Dashboard → **Connect** → copy-paste per-service strings |
| Logs / status | Per-service log scripts in the project folder + `docker ps` (check `healthy`) |

**Production hardening (do before pointing real apps at it):**
- TLS: put Caddy/nginx in front with a hostname (e.g. `supabase.apps.<yourdomain>`) — don't ship basic-auth-over-HTTP
- Set `SITE_URL` to the real app origin(s) and configure redirect URLs for auth callbacks
- Backups: nightly `pg_dump` cron to off-box storage (R2/B2)
- Updates: `git pull && docker compose pull && docker compose up -d` monthly-ish

---

## Portfolio usage pattern (shared instance, many apps)

One instance, **per-app isolation** — pick one and stay consistent:

- **Schemas (default):** one Postgres schema per app (`tu_dekha`, `banquet…`),
  RLS enabled per table, per-app policies. All share the same anon key — fine
  because RLS is the boundary.
- **Databases:** for apps needing true separation (e.g. anything HIPAA-shaped),
  create an additional database in the same Postgres container and give that
  app its own DB user.

**RLS is non-negotiable:** every table gets `ENABLE ROW LEVEL SECURITY`, plus
policies (e.g. `select` for authenticated). With RLS on and no policy, queries
return **empty by design** — remember this when "data is invisible".

**Connecting apps (the video's Next.js flow, same for any app):**
1. `.env.local` → `SUPABASE_URL=http://<VPS-IP>:8000` (or the TLS hostname)
2. Publishable key from `sb_publishable_…` in secrets output
3. Create user via dashboard → Authentication, sign in from the app
4. Query tables via supabase-js; add RLS policies where reads are intended

**RUNBOOK update:** the "3 Supabase apps vs 2-project free tier" problem
(§6.1) dissolves — point all of them at the self-hosted instance.

---

## Cost impact on the hosting plan

- VPS (2 vCPU/4 GB, ~€6/mo) now hosts: Supabase stack + future Tier C backends
  (Keycloak, Spring Boot, Express apps)
- supabase.com spend: **$0** (nothing critical on hosted free tier)
- Steady-state total stays inside the $1–15/mo budget — the VPS is the only
  meaningful line item

## Related docs

- [HOSTING-OPTIONS.md](./HOSTING-OPTIONS.md) — platform comparison; §3 backend layer updated for this decision
- [../RUNBOOK.md](../RUNBOOK.md) — day plan; §6.1 Supabase apps note superseded by this runbook
- [grok-portfolio-sync-bot.md](./grok-portfolio-sync-bot.md) — deploy-tracking mission
