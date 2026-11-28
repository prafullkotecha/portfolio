# Deployment Inventory

Canonical record of the portfolio's live deployments. Last verified: **2026-11-28**.

## Current status

- **54 cards are published, in eight sections; 24 of them have a working link.**
- 19 open without a sign-in. Five are private demos that ask for one (aislewise, Standby AI Studio, Field Dispatch on Vercel eve, Field Service Pro, Therapy Clinic), so their cards carry a short video instead.
- 16 on GitHub Pages, 2 on Azure Container Apps, 1 on Cloudflare Pages (custom domain), 3 on Vercel, 1 on Google Cloud Run (custom domain), 1 on AWS ECS Fargate (custom domain).
- DJ Set Planner's app is served from GitHub Pages (`prafullkotecha/dj-set-planner`); its Muse video is the card's second link.
- 11 deployments stay up but are no longer in the catalog: beat-stitch-studio, bloom-align-connect, bolt-college-job-finder-landing-page, bolt-photography-portfolio, bolt-rainbow-button-component, cheap-tour-hopper-79, document-zenith-view, mujtama-goal-getters-unite-69, royal-crm, seek-synergy, tech-event-website.
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

| Project | Section | Host | Live URL |
|---|---|---|---|
| 340B Claims Adjudicator | Healthcare | GitHub Pages | <https://prafullkotecha.github.io/b-claim-alchemy/> |
| AI Temp Recruiter | AI | GitHub Pages | <https://prafullkotecha.github.io/ai-temp-recruiter/> |
| aislewise (private demo, sign-in) | IoT | Azure Container Apps | <https://ca-aislewise-core.proudglacier-51df53ce.eastus2.azurecontainerapps.io> |
| Beats by Pooja | Entertainment | Cloudflare Pages (custom domain) | <https://beatsbypooja.com> |
| Blooming Horizons | Community | GitHub Pages | <https://prafullkotecha.github.io/bloominghorizons-site/> |
| City Events | Community | Vercel | <https://city-events-three.vercel.app> |
| Design Templates | Productivity | GitHub Pages | <https://prafullkotecha.github.io/design-templates/> |
| DJ Set Planner | Entertainment | GitHub Pages | <https://prafullkotecha.github.io/dj-set-planner/> |
| Enlight Productions | Entertainment | GitHub Pages | <https://prafullkotecha.github.io/enlight-productions/> |
| Field Dispatch on Vercel eve (private demo, sign-in) | Services | Vercel | <https://eve-field-dispatch.vercel.app> |
| Field Service Pro (private demo, sign-in) | Services | Azure Container Apps | <https://servicepro-app.orangewater-2e58a500.centralus.azurecontainerapps.io> |
| Fremont Gurdwara Site | Community | GitHub Pages | <https://prafullkotecha.github.io/fremont-gurdwara-site/> |
| FreshConnect | Community | GitHub Pages | <https://prafullkotecha.github.io/gram-connect-on-net/> |
| Job Aggregator | Community | Vercel | <https://job-aggregator-nu.vercel.app> |
| Monky Dashboard | Productivity | GitHub Pages | <https://prafullkotecha.github.io/monky-dashboard-concept-v0/> |
| PlantKit | IoT | GitHub Pages | <https://prafullkotecha.github.io/plantkit/> |
| Pulse | Productivity | GitHub Pages | <https://prafullkotecha.github.io/pulse/> |
| QR Studio Pro | Services | GitHub Pages | <https://prafullkotecha.github.io/qrcode-custom-erator/> |
| Riverside Temple Site | Community | GitHub Pages | <https://prafullkotecha.github.io/riverside-temple-site/> |
| Roopsie Boutique | Community | GitHub Pages | <https://prafullkotecha.github.io/roopsie-boutique/> |
| Slidev | Productivity | GitHub Pages | <https://prafullkotecha.github.io/bolt-slidev-forked/> |
| Standby AI Studio (private demo, sign-in) | Entertainment | Google Cloud Run (custom domain) | <https://standby.direkshan.digital> |
| Sunnyvale Temple Site | Community | GitHub Pages | <https://prafullkotecha.github.io/sunnyvale-temple-site/> |
| Therapy Clinic (private demo, sign-in) | Healthcare | AWS ECS Fargate (custom domain) | <https://bloominghorizons.direkshan.digital> |

`bloominghorizons.com` is not the replacement deployment and is not owned by this portfolio. Use the GitHub Pages URL above until an owned custom domain is connected.

Standby AI Studio runs on **Google Cloud Run** at <https://standby.direkshan.digital>, which replaced the earlier `standby.ai.studio` address in November 2026. The repository's `PROJECT.md` and `cloudbuild.yaml` describe a React 19 web app in front of Fastify microservices (API gateway, auth, events, scoring, AI studio and media) backed by Firestore, Redis and Cloud Storage, with Firebase Auth for Google sign-in. Access is invite-only.

The Enlight Productions and Riverside Temple Site source repositories are private and use the portfolio's proprietary all-rights-reserved license. Their GitHub Pages sites remain publicly accessible.

PlantKit and Pulse follow the same private-source/public-demo model. Standby DJ/MC Companion is source-only: its Flutter client requires Firebase production configuration and a protected A2A agent, and its upstream BSD 3-Clause notice is preserved alongside the proprietary license for Prafull Kotecha's modifications.

BeatDrop and Agent Bench Factory are private and source-only. BeatDrop is a macOS/Windows desktop app with no web build and no signed release yet; Agent Bench Factory is a command-line pipeline that runs on Docker or Kubernetes.

The EDI Hub (spring-informatica-replacement) is private and source-only. It runs as a Docker Compose stack (Spring Boot, Postgres, Kafka, Debezium, DataHub) on synthetic data and has no hosted environment.

City Events, DJ Set Planner, and Job Aggregator are private repositories with publicly accessible demos. Mixtape is private and source-only until its licensing decisions and real-machine QA are complete.

The Guest Experience App, three of the agent-framework courses (Microsoft Agent Framework, Strands Agents and Google ADK), RoamReel and the Proactive Co-Creator remix are private and source-only on the portfolio. Those courses' capstones run privately in their own clouds behind sign-ins and are not linked.

aislewise, Field Dispatch on Vercel eve, Field Service Pro and Therapy Clinic link to their private demos. Field Dispatch's landing page opens for anyone, but only the owner's Google account can sign in. aislewise's demo on Azure Container Apps goes straight to a Microsoft sign-in, Field Service Pro's opens on its own sign-in page, and Therapy Clinic's landing page opens for anyone but the app needs a sign-in. All four cards say so. The WebAI 2026 Badge is badge firmware, flashed onto the device by hand, so it has nothing to host.

## How GitHub Pages deployment works

The portfolio and each of the 25 GitHub Pages projects contain `.github/workflows/deploy-pages.yml`. A push to the configured deployment branch triggers the workflow, builds or stages the static site, uploads a Pages artifact, and deploys it with `actions/deploy-pages@v4`.

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
