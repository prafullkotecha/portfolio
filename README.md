# Maker's Catalog — Portfolio

Static Next.js site listing 71 hobby projects. Reads from `src/data/projects.json` and renders cards with filters, search, and live demo links.

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

## Adding a live URL after deploying a project

Easy way:
```bash
# from the deliverables/ root:
./scripts/set-live-url.sh chat-with-docs-pk https://chat-with-docs-pk.yourdomain.com
git -C portfolio add -A && git -C portfolio commit -m "live: chat-with-docs-pk" && git -C portfolio push
```

Manual way: edit `src/data/projects.json`, find the project's `id`, set its `live_url`, push.

## Adding screenshots (optional, future)

1. Drop images in `public/screenshots/` named `<project-id>.png`
2. Update `ProjectCard.tsx` to render `/screenshots/${project.id}.png` if it exists
3. Vercel will serve them statically

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

## License

MIT — content (project descriptions) is yours; portfolio template you can do whatever with.
