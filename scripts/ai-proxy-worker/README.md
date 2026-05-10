# AI Proxy Worker

Single Cloudflare Worker that proxies Gemini / OpenAI / ElevenLabs calls — keeps API keys server-side, rate-limits per IP.

## Why?

For Gemini: alternative to bundling the key in client (even with referrer restrictions, this is cleaner).
For OpenAI/ElevenLabs: required, since they don't support referrer restrictions.

## Deploy

```bash
npm install -g wrangler
cd scripts/ai-proxy-worker
wrangler login
wrangler deploy
wrangler secret put GEMINI_API_KEY      # paste when prompted
wrangler secret put OPENAI_API_KEY
wrangler secret put ELEVENLABS_API_KEY
```

After `deploy`, you get a URL like `https://ai-proxy.your-subdomain.workers.dev`.

## Edit `wrangler.toml`

Set `ALLOWED_ORIGINS` to your domains (CSV). Wildcard `*.yourdomain.com` works.

## Use in apps

Replace SDK base URLs:

```ts
// Before
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

// After — call worker directly with fetch
const r = await fetch(
  "https://ai-proxy.you.workers.dev/v1/gemini/gemini-2.0-flash-exp:generateContent",
  {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: "hello" }] }] }),
  }
);
const data = await r.json();
```

For OpenAI, point the base URL of the SDK:

```ts
const openai = new OpenAI({
  baseURL: "https://ai-proxy.you.workers.dev/v1/openai",
  apiKey: "x",  // ignored, proxy adds the real one
  dangerouslyAllowBrowser: true,
});
```

## Rate limit

Default 30 req/min per IP. Returns 429 with `{ error: "rate_limited" }`. Adjust `RATE_LIMIT_PER_MIN` constant in `src/index.js`.

For multi-region strict limiting, swap the in-memory map for a KV namespace or Durable Object. For a portfolio, the in-memory limiter per Worker instance is plenty.

## Cost

Free tier: 100,000 req/day. You won't hit this with a portfolio.
