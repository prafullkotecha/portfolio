# Hosting Options — Maker's Catalog

Hosting strategy for the 87-project portfolio. For the authoritative list of what is live today, see [DEPLOYMENTS.md](./DEPLOYMENTS.md).

## Current decision

GitHub Pages is the active host for the portfolio and 20 static projects. It was selected for the September 2026 deployment batch because GitHub authentication was available, the projects could be exported as static assets, and repository-scoped GitHub Actions provided repeatable deployments at no additional cost.

GitHub Pages is not a universal target. Projects requiring server-side secrets, API routes, persistent storage, databases, or long-running processes need another runtime.

## Selection guide

| Requirement | Preferred option | Notes |
|---|---|---|
| Static HTML, Vite SPA, Slidev, or static Next.js export | **GitHub Pages** | Current default; deploy with a repository workflow and correct base path |
| Static frontend plus edge API/proxy | **Cloudflare Pages + Workers** | Appropriate when Cloudflare credentials and Worker secrets are configured |
| Next.js API routes or serverless functions | **Vercel** | Natural fit for Next.js applications that cannot be statically exported |
| Firebase-native application | **Firebase Hosting/App Hosting** | Use when Firestore/Auth/App Hosting are actual dependencies |
| Existing Google App Engine application | **Google App Engine** | Preserve a functioning App Engine deployment unless migration has a clear benefit |
| Express, Spring Boot, Keycloak, or persistent process | **Container host or VPS** | Use a managed container platform or Docker/Caddy VPS |
| Static site already configured for another provider | **Existing provider** | Preserve a working custom deployment unless migration has a clear benefit |

## Platform notes

### GitHub Pages

Best for public, static portfolio demos. It provides free HTTPS, repository-native deployments, and a predictable URL:

```text
https://prafullkotecha.github.io/<repository>/
```

Limitations:

- no server-side runtime or secret storage;
- project sites run below a repository base path;
- SPA routing and asset URLs must account for that base path;
- GitHub Actions and Pages must be enabled on every repository.

### Cloudflare Pages and Workers

Use for static sites that benefit from Cloudflare DNS, edge functions, or the AI proxy. Cloudflare Pages remains a good future target, but a `cloudflare-pages` metadata value should be used only when Cloudflare actually serves the current project or has been selected for an undeployed project.

### Vercel

Use for Next.js projects with API routes, server-side rendering, or serverless functions. The static portfolio does not currently run on Vercel; documentation that described it as deployed there was an earlier plan.

### Firebase

Use for projects that already depend on Firebase Auth, Firestore, Storage, or App Hosting. A Firebase configuration file alone does not prove that a public deployment exists.

### Containers or VPS

Use for backend-heavy Tier C projects. A shared Docker host can run Express, Spring Boot, Keycloak, Postgres, and self-hosted Supabase, but it introduces patching, monitoring, backups, and operational cost.

## Data and authentication services

| Need | Candidate | Guidance |
|---|---|---|
| Postgres | Self-hosted Supabase/Postgres or managed Postgres | Use per-app schemas/databases and retain migrations |
| Authentication | Supabase Auth, Firebase Auth, or Keycloak | Match the app's existing architecture; avoid unnecessary duplication |
| AI/API proxy | Cloudflare Worker or serverless function | Keep provider secrets out of browser bundles |
| Object storage | R2, Supabase Storage, or provider-native storage | Choose based on the backend already in use |

See [SELFHOSTED-SUPABASE.md](./SELFHOSTED-SUPABASE.md) for the existing self-hosted Supabase plan.

## Deployment commands

```bash
# GitHub Pages: normal path after the deploy-pages workflow exists
git push origin main

# Cloudflare Pages
npx wrangler pages deploy dist --project-name=<id>

# Vercel
npx vercel --prod

# Firebase Hosting
npx firebase-tools deploy --only hosting

# Example VPS update
ssh <host> "cd /opt/apps/<id> && git pull && docker compose up -d --build"
```

## Recording the result

After deployment, record the host that actually serves the site:

1. set `deploy_target` and `live_url` in `content/projects/<id>.json`;
2. update `PROJECTS-CHECKLIST.csv`;
3. regenerate `src/data/projects.json` with `npm run aggregate`;
4. update [DEPLOYMENTS.md](./DEPLOYMENTS.md);
5. probe the URL and visually verify it before marking the project live.

Supported target labels are `github-pages`, `cloudflare-pages`, `vercel`, `google-app-engine`, `manual`, and `deferred`.

## Cost posture

The current GitHub Pages deployment batch is free at normal portfolio usage. Custom domains still incur registration cost. Server-side applications may add database, function, or container charges; document those costs when the services are provisioned.

## Related documents

- [DEPLOYMENTS.md](./DEPLOYMENTS.md) — current live inventory
- [RUNBOOK.md](../RUNBOOK.md) — release and verification procedure
- [TRIAGE.md](./TRIAGE.md) — historical technical triage
- [grok-portfolio-sync-bot.md](./grok-portfolio-sync-bot.md) — automated inventory and deployment verification rules
