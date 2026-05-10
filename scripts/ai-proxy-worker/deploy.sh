#!/usr/bin/env bash
#
# One-shot AI Proxy Worker deploy.
#
# What it does:
#   1. Verifies wrangler is installed (installs if missing)
#   2. Verifies wrangler is authenticated (prompts to login if not)
#   3. Deploys the worker to Cloudflare
#   4. Prompts for and sets your three AI provider secrets
#   5. Prints the worker URL + a sanity-check curl
#
# Usage:
#   cd deliverables/scripts/ai-proxy-worker
#   ./deploy.sh
#
# Env vars (optional, otherwise prompted):
#   GEMINI_API_KEY     — your Gemini key
#   OPENAI_API_KEY     — your OpenAI key (skip with: SKIP_OPENAI=1)
#   ELEVENLABS_API_KEY — your ElevenLabs key (skip with: SKIP_ELEVENLABS=1)
#
set -euo pipefail
trap 'echo "✗ Failed at line $LINENO"' ERR

cd "$(dirname "$0")"

bold() { printf "\033[1m%s\033[0m\n" "$*"; }
green() { printf "\033[32m%s\033[0m\n" "$*"; }
yellow() { printf "\033[33m%s\033[0m\n" "$*"; }
red() { printf "\033[31m%s\033[0m\n" "$*"; }

# 1. wrangler check
bold "[1/5] Checking wrangler…"
if ! command -v wrangler >/dev/null 2>&1; then
  yellow "  wrangler not found. Installing globally with npm…"
  npm install -g wrangler
fi
WRANGLER_VERSION=$(wrangler --version 2>&1 | head -1)
green "  ✓ $WRANGLER_VERSION"

# 2. auth check
bold "[2/5] Checking Cloudflare auth…"
if ! wrangler whoami >/dev/null 2>&1; then
  yellow "  Not logged in. Launching browser auth…"
  wrangler login
fi
WHOAMI=$(wrangler whoami 2>&1 | grep -oE 'You are logged in.*' || echo "logged in")
green "  ✓ $WHOAMI"

# 3. deploy
bold "[3/5] Deploying worker…"
DEPLOY_OUT=$(wrangler deploy 2>&1 | tee /tmp/wrangler-deploy.log)
WORKER_URL=$(echo "$DEPLOY_OUT" | grep -oE 'https://[a-zA-Z0-9.-]+\.workers\.dev' | head -1)
if [ -z "$WORKER_URL" ]; then
  red "  ✗ Could not parse worker URL from output. Check /tmp/wrangler-deploy.log"
  exit 1
fi
green "  ✓ Deployed: $WORKER_URL"

# 4. set secrets
bold "[4/5] Setting secrets…"
set_secret() {
  local name="$1"
  local value="${2:-}"
  if [ -z "$value" ]; then
    read -r -s -p "    Enter $name (or press enter to skip): " value
    echo
  fi
  if [ -z "$value" ]; then
    yellow "    ⊘ skipped $name"
    return
  fi
  echo "$value" | wrangler secret put "$name" >/dev/null 2>&1
  green "    ✓ set $name"
}

set_secret "GEMINI_API_KEY" "${GEMINI_API_KEY:-}"
[ "${SKIP_OPENAI:-0}" = "1" ] || set_secret "OPENAI_API_KEY" "${OPENAI_API_KEY:-}"
[ "${SKIP_ELEVENLABS:-0}" = "1" ] || set_secret "ELEVENLABS_API_KEY" "${ELEVENLABS_API_KEY:-}"

# 5. sanity check
bold "[5/5] Sanity check…"
sleep 2  # let worker propagate
HEALTH=$(curl -sS "$WORKER_URL/health" 2>&1 || true)
if echo "$HEALTH" | grep -q '"ok":true'; then
  green "  ✓ Worker is healthy: $HEALTH"
else
  yellow "  ⚠ Health check unexpected response: $HEALTH"
fi

echo
bold "═══════════════════════════════════════════"
green "Done. Your worker is live at:"
echo "  $WORKER_URL"
echo
echo "Test it from a browser console (won't trigger CORS — try from a deployed app):"
echo "  curl -X POST '$WORKER_URL/gemini/v1beta/models/gemini-2.0-flash:generateContent' \\"
echo "    -H 'content-type: application/json' \\"
echo "    -d '{\"contents\":[{\"parts\":[{\"text\":\"hello in 3 words\"}]}]}'"
echo
yellow "Next step: patch your AI Studio apps to use this baseUrl."
yellow "See PATCHING.md (in this folder) for the one-line code change per app."
