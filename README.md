# Maker's Catalog — Portfolio

Static Next.js site listing 87 hobby projects. Reads from `src/data/projects.json` and renders cards with filters, search, and live demo links.

## At a glance

| Tier | Count | Where | Effort |
|---|---|---|---|
| **A** — deploy as-is | 55 | Cloudflare Pages | ~30 sec each |
| **B** — minor work | 12 | Vercel + Supabase | ~5 min each |
| **C** — backend-heavy | 20 | Defer | source-only on portfolio |

Steady-state cost target: **~$1/mo** (just the domain). Free tiers cover everything else.

- See also: [docs/HOSTING-OPTIONS.md](./docs/HOSTING-OPTIONS.md) — platform comparison and deployment defaults · [docs/TRIAGE.md](./docs/TRIAGE.md) — per-project tier rationale · [docs/grok-portfolio-sync-bot.md](./docs/grok-portfolio-sync-bot.md) — the bot that keeps this catalog synced with GitHub and tracks live deployments

## Day plan

1. Read [RUNBOOK.md](./RUNBOOK.md) (~10 min)
2. Deploy this portfolio site to Vercel — it'll show all 87 with "coming soon" labels
3. Knock out Tier A on Cloudflare Pages, ticking off [PROJECTS-CHECKLIST.csv](./PROJECTS-CHECKLIST.csv) as you go
4. Tier B (Vercel for v0/Next.js apps, Supabase shared project for the 3 that need it)
5. Tier C stays source-only on the portfolio for now — tackle later with Neon + Railway

## Editing projects (admin UI)

The catalog is editable via [Pages CMS](https://pagescms.org) — a free, hosted, git-backed CMS. No coding required.

### One-time setup

1. Visit https://pagescms.org and log in with GitHub
2. Authorize access to the `prafullkotecha/portfolio` repo
3. Pages CMS reads `.pages.yml` and renders an admin UI matching the schema

### Day-to-day

- **Add a project**: New entry → fill the form → save (Pages CMS commits a new file to `content/projects/{id}.json`)
- **Edit details**: Click any project → edit fields → save
- **Hide a project**: Uncheck "Published" (filters it out without deleting)
- **Add a screenshot**: Upload via the Screenshot field (commits to `public/screenshots/`)
- **Set live URL after deploy**: Just paste it into the Live URL field

Each save commits to GitHub → Vercel auto-rebuilds → live in ~30 seconds.

### How it works under the hood

- Source of truth: `content/projects/*.json` (one file per project, ~87 today)
- Build-time aggregator: `scripts/aggregate-projects.mjs` runs at `predev` and `prebuild`, reading all files in `content/projects/`, filtering out unpublished entries, and writing the result to `src/data/projects.json`
- The three React pages (`/`, `/v2`, `/v3`) import from `src/data/projects.json` as before — they don't know the CMS exists
- `src/data/projects.json` is git-ignored (regenerated on each build) so there's only one source of truth

### Editing without the CMS

You can always edit `content/projects/{id}.json` directly — via GitHub's web editor (press `.` on the repo) or in your editor of choice. Same effect.

To bulk-edit (e.g., set `live_url` for 20 projects in one go), use:

```bash
./scripts/set-live-url.sh chat-with-docs-pk https://chat-with-docs-pk.yourdomain.com
```

It updates the right file in `content/projects/`. Commit and push as usual.

## Repo layout

```
.
├── content/projects/   # ← source of truth, one .json per project (edit via Pages CMS)
├── src/                # Next.js portfolio site
│   ├── app/{,/v2,/v3}/page.tsx  # three design alternatives
│   ├── components/ProjectCard.tsx
│   ├── data/projects.json       # ← GENERATED at build time from content/projects/
│   └── lib/types.ts
├── public/screenshots/ # uploaded via Pages CMS
├── scripts/
│   ├── aggregate-projects.mjs   # runs at predev/prebuild — aggregates content/projects → src/data/projects.json
│   ├── migrate-to-content.mjs   # one-time, already run
│   ├── set-live-url.sh
│   ├── cf-bulk-create.sh
│   └── ai-proxy-worker/         # CF Worker for AI key proxy
├── docs/
│   ├── TRIAGE.md
│   └── triage-raw.json
├── .pages.yml          # Pages CMS configuration (admin UI schema)
├── RUNBOOK.md
└── PROJECTS-CHECKLIST.csv
```

The Next.js project lives at the repo root; everything else (`docs/`, `scripts/`, `RUNBOOK.md`, `PROJECTS-CHECKLIST.csv`) is operational and ignored by Vercel's build.

## Stack
- Next.js 14 (static export)
- Tailwind CSS
- Fraunces (display) + IBM Plex Mono (body) — Google Fonts
- ~95 KB first-load JS, fully static, deploys anywhere

## Develop locally

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Build

```bash
npm run build
# → static export in ./out/
```

## Deploy

### Vercel (recommended)
1. https://vercel.com/new → import this repo
2. Defaults work (Next.js auto-detected)
3. Add custom domain in Project Settings → Domains

### Cloudflare Pages
1. CF dashboard → Pages → Create → connect this repo
2. Framework preset: **Next.js (Static HTML Export)**
3. Build command: `npm run build`
4. Output directory: `out`

## Customizing

- **Personal info** (name, social links, tagline): `src/app/page.tsx` — header section
- **Aesthetic** (colors, fonts): `tailwind.config.ts` and `src/app/globals.css`
- **Tier labels** ("Live" / "Soon" / "Source"): top of `src/app/page.tsx`

## Data source

`src/data/projects.json` is the source of truth. Schema in `src/lib/types.ts`:

```ts
{
  id: string,            // GitHub repo name
  title: string,         // pretty display title
  repo: string,          // GitHub URL
  description: string,
  framework: string,     // Vite+React | Next.js | ...
  tier: "A" | "B" | "C", // controls badge + filter
  deploy_target: string, // cloudflare-pages | vercel | deferred
  ai_providers: string[],
  env_vars: string[],
  tags: string[],
  source: string,        // Lovable | Bolt | v0 | Google AI Studio | Replit
  last_commit: string,   // YYYY-MM-DD
  live_url: string | null
}
```


## All 71 projects at a glance

<details>
<summary><strong>🟢 Live (deploy-ready) — 48 projects</strong></summary>

| Title | What it does | Built with | AI |
|---|---|---|---|
| **[340B Platform](https://github.com/prafullkotecha/340b-platform)** | Reference UI for a 340B drug discount program platform — eligibility, claims, reporting. | Mixed | gemini |
| **[AI DJ Playset Generator](https://github.com/prafullkotecha/ai-dj-playset-generator)** | Generate themed DJ setlists with Gemini — moods, BPM curves, transitions. | Mixed | gemini |
| **[AI Temp Recruiter](https://github.com/prafullkotecha/ai-temp-recruiter)** | AI-assisted temp staffing flow — match candidates, score fits, draft outreach. | Lovable | — |
| **[B Claim Alchemy](https://github.com/prafullkotecha/b-claim-alchemy)** | Healthcare claims alchemy — transform raw claims data through ETL pipelines. | Lovable | — |
| **[Beat by DJ Pooja](https://github.com/prafullkotecha/beat-by-dj-pooja)** | Promo site for DJ Pooja — mixes, events, contact. | v0 | — |
| **[Beat Stitch Studio](https://github.com/prafullkotecha/beat-stitch-studio)** | Beat-stitching studio — combine loops and samples in-browser. | Lovable | — |
| **[Bloom Align Connect](https://github.com/prafullkotecha/bloom-align-connect)** | Wellness platform connecting practitioners and clients with intake flows. | Lovable | — |
| **[Booth Lead Pro](https://github.com/prafullkotecha/booth-lead-pro)** | Lead capture for trade shows — kiosk-mode form + post-event email handoff. | Mixed | gemini |
| **[Chat with Docs](https://github.com/prafullkotecha/chat-with-docs-pk)** | Upload documents and chat with them via Gemini — RAG without a backend. | Google AI Studio | gemini |
| **[Cheap Tour Hopper 79](https://github.com/prafullkotecha/cheap-tour-hopper-79)** | Discount tour aggregator UI — search, compare, save itineraries. | Lovable | — |
| **[College Job Finder Landing Page](https://github.com/prafullkotecha/bolt-college-job-finder-landing-page)** | bolt-college-job-finder-landing-page | Bolt | — |
| **[Commerce JS Store](https://github.com/prafullkotecha/bolt-commerce-js-store)** | bolt-commerce-js-store | Bolt | — |
| **[Dashboard Prototype Playful](https://github.com/prafullkotecha/dashboard-prototype-playful)** | Playful analytics dashboard prototype with whimsical micro-interactions. | Mixed | gemini |
| **[Dictation App](https://github.com/prafullkotecha/dictation-app-pk)** | Voice dictation app — record, transcribe with Gemini, export. | Google AI Studio | gemini |
| **[Digital Garage AI](https://github.com/prafullkotecha/digital-garage-ai)** | AI assistant for car maintenance and DIY garage workflows. | Mixed | gemini |
| **[Document Zenith View](https://github.com/prafullkotecha/document-zenith-view)** | Document viewer with zen reading mode and annotation overlays. | Lovable | — |
| **[Echoscript](https://github.com/prafullkotecha/gemini-ai-studio-echoscript-pk)** | Voice → script → action workflow with Gemini live audio. | Google AI Studio | gemini |
| **[Ecommerce Category Generator](https://github.com/prafullkotecha/gemini-ai-studio-ecommerce-category-generator-pk)** | Generate ecommerce category trees with Gemini — taxonomy at scale. | Google AI Studio | gemini |
| **[Fit Check](https://github.com/prafullkotecha/fit-check-pk)** | Outfit-check using Gemini vision — feedback on clothing combinations. | Google AI Studio | gemini |
| **[Flashcard Maker](https://github.com/prafullkotecha/flashcard-maker-pk)** | Flashcard generator from any topic via Gemini — Anki-friendly export. | Google AI Studio | gemini |
| **[GemBooth](https://github.com/prafullkotecha/GemBooth-pk)** | Photo booth experience powered by Gemini — fun filters and AI captions. | Google AI Studio | gemini |
| **[Gemini Co Drawing](https://github.com/prafullkotecha/gemini-co-drawing-pk)** | Collaborative drawing canvas with Gemini turn-by-turn assistance. | Google AI Studio | gemini |
| **[Get Started with Gemini JS SDK](https://github.com/prafullkotecha/get-started-with-gemini-js-sdk-pk)** | Starter for the Gemini JS SDK — minimal, dependency-light. | Google AI Studio | gemini |
| **[Gram Connect on Net](https://github.com/prafullkotecha/gram-connect-on-net)** | Gram Panchayat connect — village-level civic info portal. | Lovable | — |
| **[Infinite Zoom Enhance](https://github.com/prafullkotecha/infinite-zoom-enhance-pk)** | Infinite zoom-and-enhance effect using Gemini upscaling. | Google AI Studio | gemini |
| **[LiveAudio](https://github.com/prafullkotecha/LiveAudio-pk)** | Live audio capture and Gemini Live API integration demo. | Google AI Studio | gemini |
| **[Lumina Scheduling](https://github.com/prafullkotecha/google-ai-studio-lumina-scheduling)** | Smart scheduling assistant — Lumina-themed AI calendar. | Google AI Studio | gemini |
| **[MCP Maps 3D](https://github.com/prafullkotecha/mcp-maps-3d-pk)** | MCP server demo with 3D maps integration. | Google AI Studio | gemini |
| **[Mediaslim](https://github.com/prafullkotecha/mediaslim-pk)** | Trim and compress media files in-browser with FFmpeg.wasm. | Google AI Studio | gemini |
| **[Modern Directory Listings](https://github.com/prafullkotecha/modern-directory-listings)** | Modern directory listings template — businesses, filters, maps. | Mixed | gemini |
| **[Monky Dashboard Concept](https://github.com/prafullkotecha/monky-dashboard-concept-v0)** | Concept dashboard with monkey theme — built with v0. | v0 | — |
| **[Mujtama Goal Getters Unite 69](https://github.com/prafullkotecha/mujtama-goal-getters-unite-69)** | Community goal-tracking platform — accountability circles. | Lovable | — |
| **[PastForward](https://github.com/prafullkotecha/pastForward-pk)** | Time-travel through historical events with Gemini-narrated walkthroughs. | Google AI Studio | gemini |
| **[Photography Portfolio](https://github.com/prafullkotecha/bolt-photography-portfolio)** | bolt-photography-portfolio | Bolt | — |
| **[Pixshop](https://github.com/prafullkotecha/gemini-ai-studio-pixshop-pk)** | AI image editing with Gemini Image — inpaint, edit, transform. | Google AI Studio | gemini |
| **[Rainbow Button Component](https://github.com/prafullkotecha/bolt-rainbow-button-component)** | bolt-rainbow-button-component | Bolt | — |
| **[Remix Bring Ideas to Life](https://github.com/prafullkotecha/gemini-aistudio-remix-bring-ideas-to-life-pk)** | Idea-to-prototype remix using Gemini — sketch → spec → UI. | Google AI Studio | gemini |
| **[Research Visualization](https://github.com/prafullkotecha/google-ai-studio-research-visualization-pk)** | Visualize research papers and concepts via interactive Gemini-powered diagrams. | Google AI Studio | gemini |
| **[Robotics Spatial Understanding](https://github.com/prafullkotecha/gemini-ai-studio-robotics-spatial-understanding-pk)** | Spatial understanding demo for robotics with Gemini multi-modal. | Google AI Studio | gemini |
| **[Royal CRM](https://github.com/prafullkotecha/royal-crm)** | This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules. | Mixed | — |
| **[Seek Synergy](https://github.com/prafullkotecha/seek-synergy)** | Team-finding platform for collaborators on side projects. | Lovable | — |
| **[Signswift Esignature](https://github.com/prafullkotecha/signswift-esignature)** | E-signature flow — drag-drop fields, signing order, audit log. | Mixed | gemini |
| **[Slidev Forked](https://github.com/prafullkotecha/bolt-slidev-forked)** | [Edit on StackBlitz ⚡️](https://sli.dev/new) | Bolt | — |
| **[Tech Event Website](https://github.com/prafullkotecha/tech-event-website)** | Tech conference schedule site — static HTML in `public/`, deployable as-is (no build needed). | Mixed | — |
| **[Type Motion](https://github.com/prafullkotecha/type-motion-pk)** | Kinetic typography playground — animated type with motion presets. | Google AI Studio | gemini |
| **[UI Generator](https://github.com/prafullkotecha/gemini-flash-ui-generator-pk)** | Generate React UI from text prompts using Gemini Flash. | Google AI Studio | gemini |
| **[Veo3 Gallery](https://github.com/prafullkotecha/gemini-ai-studio-veo3-gallery-pk)** | Gallery for Veo3-generated videos with prompt history. | Google AI Studio | gemini |
| **[Video Analyzer](https://github.com/prafullkotecha/video-analyzer-pk)** | Video upload + frame analysis via Gemini multimodal. | Google AI Studio | gemini |

</details>

<details>
<summary><strong>🟡 Soon (minor work) — 10 projects</strong></summary>

| Title | What it does | Built with | AI |
|---|---|---|---|
| **[AI Artifact Vault](https://github.com/prafullkotecha/ai-artifact-vault)** | Personal vault for AI-generated artifacts — chat snippets, prompts, outputs. | Lovable | — |
| **[Banquet Seating Arrangements](https://github.com/prafullkotecha/banquet-seating-arrangements-v0)** | Drag-and-drop banquet seating planner with table layouts and guest constraints. | v0 | — |
| **[Eleven Labs Agents Starter](https://github.com/prafullkotecha/v0-eleven-labs-agents-starter)** | ElevenLabs voice-agent starter (Next.js + API routes). | v0 | elevenlabs |
| **[Eleven Labs Music Starter](https://github.com/prafullkotecha/v0-eleven-labs-music-starter)** | ElevenLabs music generation starter. | v0 | elevenlabs |
| **[Eleven Labs V3 Podcast Generator](https://github.com/prafullkotecha/v0-eleven-labs-v3-podcast-generator)** | End-to-end podcast generator — script (OpenAI) + voice (ElevenLabs) + storage (Supabase). | v0 | elevenlabs, openai |
| **[ONDC Farmer Connect](https://github.com/prafullkotecha/ondc-farmer-connect-v0)** | ONDC farmer-buyer marketplace prototype (v0/Next.js). | v0 | — |
| **[ONDC Farmer Connect Bolt](https://github.com/prafullkotecha/ondc-farmer-connect-bolt)** | ONDC farmer-buyer marketplace prototype — Expo Router app exported to web (`expo export --platform web`). | Mixed | — |
| **[PWA Website Chatbot](https://github.com/prafullkotecha/pwa-website-chatbot-v0)** | PWA chatbot embedded on a marketing site — Next.js + OpenAI. | v0 | openai |
| **[SocialSpark](https://github.com/prafullkotecha/SocialSpark)** | Social media content scheduling and inspiration tool. | Mixed | — |
| **[Tu Dekha](https://github.com/prafullkotecha/tu-dekha)** | A modern, full-stack event management platform built with React, TypeScript, and Lovable Cloud. Create, discover, and ma | Lovable | openai |

</details>

<details>
<summary><strong>⚪ Source-only (backend-heavy) — 13 projects</strong></summary>

| Title | What it does | Built with | AI |
|---|---|---|---|
| **[Bookmark Organizer](https://github.com/prafullkotecha/bookmark-organizer)** | Bookmark Organizer is a web application that helps you manage and organize your bookmarks. It allows you to save, catego | Mixed | — |
| **[Budgeted Shared Expenses](https://github.com/prafullkotecha/gemini-ai-studio-budgeted-shared-expenses-pk)** | Shared expense tracker with budget AI suggestions — splits, categories. | Google AI Studio | gemini |
| **[ClinicConnect](https://github.com/prafullkotecha/ClinicConnect)** | Clinic management — patient records, scheduling, billing (Express+Drizzle+Postgres). | Replit | — |
| **[DJProposals](https://github.com/prafullkotecha/DJProposals)** | DJ business proposal generator — packages, pricing, contracts (Express+Postgres). | Replit | — |
| **[Done and Dusted Family Chores](https://github.com/prafullkotecha/gemini-ai-studio-done_and_dusted-family-chores-pk)** | Family chore manager — assignments, streaks, AI nudges. | Google AI Studio | gemini |
| **[Field Service Pro](https://github.com/prafullkotecha/field-service-pro-sa)** | ServicePro is a comprehensive, multi-tenant SaaS platform designed to empower small to medium professional service busin | Mixed | — |
| **[HomeInventory](https://github.com/prafullkotecha/HomeInventory)** | Home inventory tracker with photos, warranties, and rooms. | Replit | — |
| **[Metaphor MindIT](https://github.com/prafullkotecha/metaphor-mindIT)** | > Transform complex technical concepts into culturally grounded metaphors that resonate across diverse learning backgrou | Mixed | elevenlabs, openai |
| **[PassGenius](https://github.com/prafullkotecha/PassGenius)** | Password manager with vault, tags, and breach checking. | Replit | — |
| **[Remix Geoseeker](https://github.com/prafullkotecha/pk-ai-studio-remix-geoseeker)** | Geo-seek game using Gemini and Google Maps. | Google AI Studio | gemini |
| **[StickerSage](https://github.com/prafullkotecha/StickerSage)** | AI sticker generator with OpenAI image API — themes, packs. | Replit | openai |
| **[Therapy Assistant](https://github.com/prafullkotecha/gemini-ai-studio-therapy-assistant)** | Therapy assistant — session notes, sentiment tracking via Gemini. | Google AI Studio | gemini |
| **[Therapy Clinic Nextjs](https://github.com/prafullkotecha/therapy-clinic-nextjs)** | Multi-tenant HIPAA-compliant behavioral therapy clinic management system | Mixed | — |

</details>

## License

MIT — content (project descriptions) is yours; portfolio template you can do whatever with.
