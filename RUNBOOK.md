# Deployment Runbook

Operational guide for maintaining and extending the 89-project portfolio. The current live inventory is recorded in [docs/DEPLOYMENTS.md](./docs/DEPLOYMENTS.md).

## 1. Current production state

- Portfolio: <https://prafullkotecha.github.io/portfolio/>
- Live projects: **24/89 (27.0%)**
- Static project deployments: **22 on GitHub Pages**
- Existing custom deployments: **Beats by Pooja** and **Standby AI Studio**
- Portfolio prototypes: Catalog `/`, Terminal `/v2/`, Spec sheet `/v3/`
- Curated presentation: Case studies `/case-studies/`

GitHub Pages is the current static-hosting default because the GitHub CLI was authenticated when this batch was deployed, while Cloudflare and Vercel CLI sessions were not. Cloudflare and Vercel remain valid choices for projects that need their capabilities.

## 2. Portfolio deployment

The portfolio is a statically exported Next.js application. Its workflow is `.github/workflows/deploy-pages.yml`.

### Normal release

```bash
git add <changed-files>
git commit -m "docs: update portfolio deployment records"
git push origin main
```

The push triggers GitHub Actions. The workflow:

1. installs dependencies with `npm ci`;
2. builds with `NEXT_PUBLIC_BASE_PATH=/portfolio`;
3. uploads `out/` as a Pages artifact;
4. deploys with `actions/deploy-pages@v4`.

Repository Settings → Pages must use **GitHub Actions** as its source. The workflow requires `contents: read`, `pages: write`, and `id-token: write` permissions.

### Verify the release

Check all four public routes:

```text
https://prafullkotecha.github.io/portfolio/
https://prafullkotecha.github.io/portfolio/case-studies/
https://prafullkotecha.github.io/portfolio/v2/
https://prafullkotecha.github.io/portfolio/v3/
```

Confirm an HTTP 200 response and visually inspect the page, navigation, screenshots, and external project links.

## 3. Static project deployment to GitHub Pages

Each GitHub Pages project contains `.github/workflows/deploy-pages.yml`. The exact build step varies by framework, but every workflow produces a static directory, uploads it with `actions/upload-pages-artifact`, and publishes it with `actions/deploy-pages`.

### Repository setup

1. Add the workflow to the project's default branch.
2. Keep newly created portfolio project repositories private.
3. Add the proprietary `LICENSE` used by this portfolio unless the owner explicitly selects another restricted license.
4. In repository Settings → Pages, select **GitHub Actions**.
5. Ensure the workflow has `pages: write` and `id-token: write` permissions.
6. Push the workflow or run it manually.
7. Verify `https://prafullkotecha.github.io/<repo>/` returns HTTP 200 and loads its assets.

### Framework notes

- **Vite:** build with the repository base, usually `vite build --base=/<repo>/`.
- **React Router:** configure `BrowserRouter` with the same base path or use a hash router. The current workflows patch the basename during CI where necessary.
- **Plain HTML:** upload the directory containing `index.html` directly.
- **Slidev:** build with the repository base path.
- **Next.js static export:** set `output: "export"`, `basePath`, and `assetPrefix` for `/<repo>` during the CI build.
- Add `.nojekyll` when the artifact contains directories beginning with an underscore.

GitHub Pages can host only static output. Do not deploy projects that require server-side secrets, API routes, persistent databases, or background processes as static sites unless those dependencies have been safely replaced.

## 4. Recording a successful deployment

After verifying a project:

1. Update `content/projects/<id>.json`:
   - set `deploy_target` to the platform actually serving the site;
   - set `live_url` to the verified public URL.
   - record `repository_visibility` and `license` for newly created repositories.
2. Update `PROJECTS-CHECKLIST.csv`:
   - set the same `deploy_target`;
   - set `deployed?` to `yes`;
   - record the public URL and a short deployment note.
3. Run `npm run aggregate` to regenerate `src/data/projects.json`.
4. Update [docs/DEPLOYMENTS.md](./docs/DEPLOYMENTS.md), including the count and inventory.
5. Build the portfolio and commit all synchronized records together.

Use these target values consistently:

| Value | Meaning |
|---|---|
| `github-pages` | GitHub Pages currently serves the project |
| `cloudflare-pages` | Cloudflare Pages currently serves the project |
| `vercel` | Vercel currently serves the project |
| `google-cloud-run` | Google Cloud Run currently serves the project |
| `manual` | Hosted by another or manually managed service |
| `deferred` | Not currently deployed |

`deploy_target` records the current or selected host. Do not leave an old recommendation in that field after a project is deployed elsewhere.

## 5. Projects requiring configuration or secrets

Do not expose private API keys in a browser bundle. Projects needing secrets require a server-side runtime or proxy.

- Gemini/OpenAI/ElevenLabs frontends: use a server-side proxy and provider-side restrictions where available.
- Next.js projects with API routes: deploy to a server-capable host such as Vercel or a container runtime.
- Supabase projects: provision the database, migrations, authentication settings, and public environment values before deployment. See [docs/SELFHOSTED-SUPABASE.md](./docs/SELFHOSTED-SUPABASE.md).
- Commerce.js, maps, and similar integrations: provision and restrict their public keys before calling the site functional.

Cloudflare Workers can host the optional AI proxy in `scripts/ai-proxy-worker/`. Its secrets must be set in the Worker environment and must never be committed.

## 6. Backend-heavy projects

Tier C projects remain source-only until their required services exist. Likely homes are:

- Vercel for Next.js serverless applications;
- Cloudflare Workers for small edge APIs and proxies;
- a managed container platform or VPS for Express, Spring Boot, Keycloak, and persistent processes;
- self-hosted Supabase/Postgres where shared database and authentication infrastructure is appropriate.

Choose the runtime based on the application, then record the actual platform using the same process in section 4.

## 7. Release checklist

- [ ] Project build succeeds from a clean checkout.
- [ ] Required base path is configured.
- [ ] No private secrets are embedded in static assets.
- [ ] Newly created repository is private and carries the proprietary license.
- [ ] GitHub Actions deployment completes successfully.
- [ ] Public URL returns HTTP 200.
- [ ] Assets, navigation, and key interactions work in production.
- [ ] `content/projects/<id>.json` is updated.
- [ ] `PROJECTS-CHECKLIST.csv` is updated.
- [ ] `npm run aggregate` has regenerated the catalog.
- [ ] `docs/DEPLOYMENTS.md` matches the live inventory.
- [ ] Portfolio build succeeds and is republished.

## 8. Cost

The current GitHub Pages batch costs $0 at normal portfolio usage. The two custom-domain deployments retain their existing hosting arrangements. Future server-side, database, or container workloads may add service costs and should be documented when provisioned.
