/**
 * AI Proxy Worker — transparent passthrough
 *
 * Routes:
 *   /gemini/{path…}      → https://generativelanguage.googleapis.com/{path…}?key=GEMINI_API_KEY
 *   /openai/{path…}      → https://api.openai.com/{path…}              (Authorization: Bearer …)
 *   /elevenlabs/{path…}  → https://api.elevenlabs.io/{path…}           (xi-api-key: …)
 *
 * Designed so SDK clients can just override baseUrl:
 *
 *   import { GoogleGenAI } from "@google/genai";
 *   const ai = new GoogleGenAI({
 *     apiKey: "unused",
 *     httpOptions: { baseUrl: "https://ai-proxy.YOU.workers.dev/gemini" }
 *   });
 *
 *   import OpenAI from "openai";
 *   const client = new OpenAI({
 *     apiKey: "unused",
 *     baseURL: "https://ai-proxy.YOU.workers.dev/openai/v1",
 *     dangerouslyAllowBrowser: true
 *   });
 *
 * Per-IP rate limit: 30 req / minute (in-memory, per Worker instance).
 * CORS: configure ALLOWED_ORIGINS in wrangler.toml (comma-separated, supports `*.domain` wildcards).
 *
 * Setup:
 *   wrangler deploy
 *   wrangler secret put GEMINI_API_KEY
 *   wrangler secret put OPENAI_API_KEY
 *   wrangler secret put ELEVENLABS_API_KEY
 */

const RATE_LIMIT_PER_MIN = 30;
const WINDOW_MS = 60_000;
const buckets = new Map();

function rateLimit(ip) {
  const now = Date.now();
  const arr = (buckets.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (arr.length >= RATE_LIMIT_PER_MIN) return false;
  arr.push(now);
  buckets.set(ip, arr);
  if (buckets.size > 5000) {
    const cutoff = now - WINDOW_MS;
    for (const [k, v] of buckets) {
      const fresh = v.filter((t) => t > cutoff);
      if (fresh.length === 0) buckets.delete(k);
      else buckets.set(k, fresh);
    }
  }
  return true;
}

function originAllowed(origin, allowed) {
  if (!origin) return false;
  if (allowed.includes("*") || allowed.includes(origin)) return true;
  return allowed.some((a) => {
    if (!a.startsWith("*.")) return false;
    const suffix = a.slice(1); // ".domain.com"
    return origin.endsWith(suffix);
  });
}

function corsHeaders(origin, allowed) {
  const h = {
    "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
    "access-control-allow-headers": "content-type, authorization, x-goog-api-client, x-goog-user-project",
    "access-control-expose-headers": "content-type",
    "access-control-max-age": "86400",
  };
  if (originAllowed(origin, allowed)) {
    h["access-control-allow-origin"] = origin;
    h["vary"] = "Origin";
  }
  return h;
}

const PROVIDERS = {
  gemini: {
    target: "https://generativelanguage.googleapis.com",
    auth: (key, url) => {
      // Gemini uses ?key= query param
      const u = new URL(url);
      u.searchParams.set("key", key);
      return { url: u.toString(), headers: {} };
    },
  },
  openai: {
    target: "https://api.openai.com",
    auth: (key, url) => ({
      url,
      headers: { authorization: `Bearer ${key}` },
    }),
  },
  elevenlabs: {
    target: "https://api.elevenlabs.io",
    auth: (key, url) => ({
      url,
      headers: { "xi-api-key": key },
    }),
  },
};

const SECRET_NAME = {
  gemini: "GEMINI_API_KEY",
  openai: "OPENAI_API_KEY",
  elevenlabs: "ELEVENLABS_API_KEY",
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("origin") || "";
    const allowed = (env.ALLOWED_ORIGINS || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const cors = corsHeaders(origin, allowed);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    if (url.pathname === "/" || url.pathname === "/health") {
      return Response.json(
        { ok: true, providers: Object.keys(PROVIDERS), rate_limit: `${RATE_LIMIT_PER_MIN}/min/ip` },
        { headers: cors }
      );
    }

    const m = url.pathname.match(/^\/(gemini|openai|elevenlabs)(\/.*)?$/);
    if (!m) {
      return new Response(`not found · use /gemini/<path>, /openai/<path>, or /elevenlabs/<path>`, {
        status: 404,
        headers: cors,
      });
    }
    const [, provider, rest = ""] = m;

    // Rate limit
    const ip = request.headers.get("cf-connecting-ip") || "unknown";
    if (!rateLimit(ip)) {
      return Response.json(
        { error: "rate_limited", limit: RATE_LIMIT_PER_MIN, window_seconds: 60 },
        { status: 429, headers: { ...cors, "retry-after": "60" } }
      );
    }

    const key = env[SECRET_NAME[provider]];
    if (!key) {
      return Response.json(
        { error: "key_not_configured", missing: SECRET_NAME[provider] },
        { status: 500, headers: cors }
      );
    }

    // Build target URL: <provider_base> + <rest_of_path> + <original_query>
    const cfg = PROVIDERS[provider];
    const targetUrl = `${cfg.target}${rest}${url.search}`;
    const { url: finalUrl, headers: extraHeaders } = cfg.auth(key, targetUrl);

    // Forward request, scrubbing client auth headers
    const fwdHeaders = new Headers();
    const ctype = request.headers.get("content-type");
    if (ctype) fwdHeaders.set("content-type", ctype);
    const accept = request.headers.get("accept");
    if (accept) fwdHeaders.set("accept", accept);
    for (const [k, v] of Object.entries(extraHeaders)) fwdHeaders.set(k, v);

    let body;
    if (request.method !== "GET" && request.method !== "HEAD") {
      body = await request.arrayBuffer();
    }

    let upstream;
    try {
      upstream = await fetch(finalUrl, { method: request.method, headers: fwdHeaders, body });
    } catch (e) {
      return Response.json(
        { error: "upstream_error", message: String(e) },
        { status: 502, headers: cors }
      );
    }

    // Stream response back, drop hop-by-hop headers, add CORS
    const respHeaders = new Headers(upstream.headers);
    for (const h of ["transfer-encoding", "connection", "content-encoding"]) respHeaders.delete(h);
    for (const [k, v] of Object.entries(cors)) respHeaders.set(k, v);

    return new Response(upstream.body, { status: upstream.status, headers: respHeaders });
  },
};
