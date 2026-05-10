#!/usr/bin/env bash
# Usage: ./scripts/set-live-url.sh <project-id> <live-url>
# Updates content/projects/<project-id>.json with the given project's live URL.
set -euo pipefail

if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <project-id> <live-url>"
  echo "Example: $0 chat-with-docs-pk https://chat-with-docs-pk.yourdomain.com"
  exit 1
fi

PROJECT_ID="$1"
LIVE_URL="$2"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FILE="$SCRIPT_DIR/../content/projects/$PROJECT_ID.json"

if [ ! -f "$FILE" ]; then
  echo "Error: $FILE not found."
  echo "Available projects:"
  ls "$SCRIPT_DIR/../content/projects/" | sed 's/\.json$//' | head -10
  echo "..."
  exit 1
fi

python3 - "$LIVE_URL" "$FILE" <<'PY'
import json, sys
live_url, file_path = sys.argv[1], sys.argv[2]
with open(file_path) as f: data = json.load(f)
data["live_url"] = live_url
with open(file_path, "w") as f:
    json.dump(data, f, indent=2)
    f.write("\n")
print(f"✓ {data['id']} → {live_url}")
PY

echo "Don't forget: git add -A && git commit -m 'live: $PROJECT_ID' && git push"
