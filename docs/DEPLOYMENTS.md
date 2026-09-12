# Deployment Inventory

Canonical record of the portfolio's live deployments. Last verified: **2026-09-12**.

## Current status

- **26 of 91 projects are live (28.6%).**
- **24 projects** are hosted by GitHub Pages at `https://prafullkotecha.github.io/<repo>/`.
- **2 projects** retain their existing custom-domain deployments: one on Cloudflare Pages and one on Google Cloud Run.
- The portfolio itself is hosted by GitHub Pages at <https://prafullkotecha.github.io/portfolio/>.
- The portfolio's three existing prototypes remain at `/`, `/v2/`, and `/v3/`; the case-studies page is at `/case-studies/`.

## Portfolio routes

| View | URL |
|---|---|
| Catalog | <https://prafullkotecha.github.io/portfolio/> |
| Case studies | <https://prafullkotecha.github.io/portfolio/case-studies/> |
| Terminal prototype | <https://prafullkotecha.github.io/portfolio/v2/> |
| Spec-sheet prototype | <https://prafullkotecha.github.io/portfolio/v3/> |

## Live projects

| Project | Host | Live URL |
|---|---|---|
| AI Temp Recruiter | GitHub Pages | <https://prafullkotecha.github.io/ai-temp-recruiter/> |
| B Claim Alchemy | GitHub Pages | <https://prafullkotecha.github.io/b-claim-alchemy/> |
| Beat Stitch Studio | GitHub Pages | <https://prafullkotecha.github.io/beat-stitch-studio/> |
| Bloom Align Connect | GitHub Pages | <https://prafullkotecha.github.io/bloom-align-connect/> |
| Blooming Horizons replacement | GitHub Pages | <https://prafullkotecha.github.io/bloominghorizons-site/> |
| Cheap Tour Hopper 79 | GitHub Pages | <https://prafullkotecha.github.io/cheap-tour-hopper-79/> |
| College Job Finder Landing Page | GitHub Pages | <https://prafullkotecha.github.io/bolt-college-job-finder-landing-page/> |
| Design Templates | GitHub Pages | <https://prafullkotecha.github.io/design-templates/> |
| Document Zenith View | GitHub Pages | <https://prafullkotecha.github.io/document-zenith-view/> |
| Enlight Productions | GitHub Pages | <https://prafullkotecha.github.io/enlight-productions/> |
| Gram Connect on Net | GitHub Pages | <https://prafullkotecha.github.io/gram-connect-on-net/> |
| Monky Dashboard Concept | GitHub Pages | <https://prafullkotecha.github.io/monky-dashboard-concept-v0/> |
| Mujtama Goal Getters Unite 69 | GitHub Pages | <https://prafullkotecha.github.io/mujtama-goal-getters-unite-69/> |
| Photography Portfolio | GitHub Pages | <https://prafullkotecha.github.io/bolt-photography-portfolio/> |
| PlantKit | GitHub Pages | <https://prafullkotecha.github.io/plantkit/> |
| Pulse | GitHub Pages | <https://prafullkotecha.github.io/pulse/> |
| QR Code Custom-erator | GitHub Pages | <https://prafullkotecha.github.io/qrcode-custom-erator/> |
| Rainbow Button Component | GitHub Pages | <https://prafullkotecha.github.io/bolt-rainbow-button-component/> |
| Riverside Temple Site | GitHub Pages | <https://prafullkotecha.github.io/riverside-temple-site/> |
| Roopsie Boutique | GitHub Pages | <https://prafullkotecha.github.io/roopsie-boutique/> |
| Royal CRM | GitHub Pages | <https://prafullkotecha.github.io/royal-crm/> |
| Seek Synergy | GitHub Pages | <https://prafullkotecha.github.io/seek-synergy/> |
| Slidev Forked | GitHub Pages | <https://prafullkotecha.github.io/bolt-slidev-forked/> |
| Tech Event Website | GitHub Pages | <https://prafullkotecha.github.io/tech-event-website/> |
| Beats by Pooja | Cloudflare Pages (custom domain) | <https://beatsbypooja.com> |
| Standby AI Studio | Google Cloud Run (custom domain) | <https://standby.ai.studio> |

`bloominghorizons.com` is not the replacement deployment and is not owned by this portfolio. Use the GitHub Pages URL above until an owned custom domain is connected.

Standby AI Studio runs its Express application on **Google Cloud Run** and uses **Firebase** for backend services. Cloud Run is visible in the repository's `.env.example` and server-oriented build; the Firebase association is owner-confirmed deployment infrastructure and is not currently represented by Firebase configuration or SDK references in the checked-in project files.

The Enlight Productions and Riverside Temple Site source repositories are private and use the portfolio's proprietary all-rights-reserved license. Their GitHub Pages sites remain publicly accessible.

PlantKit and Pulse follow the same private-source/public-demo model. Standby DJ/MC Companion is source-only: its Flutter client requires Firebase production configuration and a protected A2A agent, and its upstream BSD 3-Clause notice is preserved alongside the proprietary license for Prafull Kotecha's modifications.

## How GitHub Pages deployment works

The portfolio and each of the 24 GitHub Pages projects contain `.github/workflows/deploy-pages.yml`. A push to the configured deployment branch triggers the workflow, builds or stages the static site, uploads a Pages artifact, and deploys it with `actions/deploy-pages@v4`.

For the portfolio:

- `NEXT_PUBLIC_BASE_PATH=/portfolio` is set during the build.
- Next.js produces a static export in `out/`.
- The workflow uploads `out/` and deploys it to GitHub Pages.

For project sites:

- Vite builds receive the repository base path so assets resolve below `/<repo>/`.
- React Router projects receive the matching basename during the CI build.
- Static HTML projects upload their existing static directory.
- The Slidev and Next.js projects use their repository base paths during static export.

GitHub Pages must remain configured with **Source: GitHub Actions** in each repository's Pages settings. Workflow permissions require `pages: write` and `id-token: write`.

## Updating this record

After a deployment is verified with an HTTP 200 response:

1. Set `live_url` and the actual `deploy_target` in `content/projects/<id>.json`.
   Record `repository_visibility` and `license` for newly created repositories.
2. Set `deployed?=yes`, the actual target, and the URL in `PROJECTS-CHECKLIST.csv`.
3. Run `npm run aggregate` to regenerate `src/data/projects.json`.
4. Update the counts and inventory in this file.
5. Commit and push; the portfolio's Pages workflow republishes the catalog.

The deployed platform must describe the current host, not an earlier recommendation. Use `github-pages`, `cloudflare-pages`, `vercel`, `google-cloud-run`, `manual`, or `deferred` as appropriate. Record associated services such as Firebase in `backend_services`.
