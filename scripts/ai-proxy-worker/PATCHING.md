# Patching apps to use the AI Proxy Worker

After deploying the worker, point your apps at it. The change is **one line** per app, but you have to do it 27× for the AI Studio Gemini repos (or whichever subset you want to migrate first).

> **Reality check:** If you don't want to do this work right now, the **HTTP referrer restriction** route (RUNBOOK §5) gives you 90% of the security at 0% of the patching effort. Migrate to the worker incrementally — pick the apps that get most traffic first.

## Gemini apps (`@google/genai` SDK)

Find the constructor call (usually in `src/App.tsx`, `src/lib/gemini.ts`, or similar):

**Before**
```ts
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.API_KEY  // or process.env.GEMINI_API_KEY
});
```

**After**
```ts
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: "unused",
  httpOptions: {
    baseUrl: "https://ai-proxy.YOUR-SUBDOMAIN.workers.dev/gemini"
  }
});
```

Then in `vite.config.ts` you can **delete the `define` block** that injected the API key (key is no longer needed in the bundle):

```diff
 export default defineConfig(({ mode }) => {
-    const env = loadEnv(mode, '.', '');
     return {
-      define: {
-        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
-        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
-      },
       resolve: { alias: { '@': path.resolve(__dirname, '.') } }
     };
 });
```

**(Or keep the `define` block** for local development — proxy URL works in both contexts, the key is just ignored.)

## OpenAI apps (`openai` SDK)

**Before**
```ts
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});
```

**After**
```ts
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: "unused",
  baseURL: "https://ai-proxy.YOUR-SUBDOMAIN.workers.dev/openai/v1",
  dangerouslyAllowBrowser: true  // safe now — no real key on client
});
```

## ElevenLabs apps

ElevenLabs SDK uses `fetch` under the hood. If using the official client:

**Before**
```ts
import { ElevenLabsClient } from "elevenlabs";

const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });
```

**After**
```ts
import { ElevenLabsClient } from "elevenlabs";

const client = new ElevenLabsClient({
  apiKey: "unused",
  environment: "https://ai-proxy.YOUR-SUBDOMAIN.workers.dev/elevenlabs/v1"
});
```

If you're calling ElevenLabs via raw `fetch`, just swap the URL:
```diff
- const r = await fetch("https://api.elevenlabs.io/v1/text-to-speech/" + voiceId, {
+ const r = await fetch("https://ai-proxy.YOUR-SUBDOMAIN.workers.dev/elevenlabs/v1/text-to-speech/" + voiceId, {
    method: "POST",
-   headers: { "xi-api-key": KEY, "content-type": "application/json" },
+   headers: { "content-type": "application/json" },  // proxy adds the key
    body: JSON.stringify({ text, voice_settings })
  });
```

## Find every call site quickly

From the cloned-repos directory, this surfaces every constructor call:

```bash
grep -RnE 'new GoogleGenAI|new OpenAI|new ElevenLabsClient' \
  --include='*.ts' --include='*.tsx' --include='*.js' --include='*.jsx' \
  /path/to/your/repos/
```

## Test before you commit

After patching one app, build it locally and check the network tab:
```bash
npm run dev
# Open browser, exercise the AI feature, watch DevTools Network panel
# Requests should go to *.workers.dev, not generativelanguage.googleapis.com directly
```

## Migration strategy (recommended)

1. Deploy worker (this folder) ← done if you ran `./deploy.sh`
2. Pick **one** app you care about most (e.g., your most-shown demo)
3. Patch it, redeploy that app, verify the worker URL appears in DevTools
4. Hit your rate limiter on purpose to confirm 429s flow back correctly
5. Then batch-migrate the rest in a Saturday session

## Removing the env var from CF Pages after migration

Once an app calls the worker, you can **delete the `GEMINI_API_KEY` env var** in its CF Pages project settings. The key isn't needed in the build anymore.
