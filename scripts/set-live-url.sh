#!/usr/bin/env bash
# Usage: ./scripts/set-live-url.sh <project-id> <live-url>
# Updates src/data/projects.json with the given project's live URL.
set -euo pipefail

if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <project-id> <live-url>"
  echo "Example: $0 chat-with-docs-pk https://chat-with-docs-pk.yourdomain.com"
  exit 1
fi

PROJECT_ID="$1"
LIVE_URL="$2"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FILE="$SCRIPT_DIR/../src/data/projects.json"

if [ ! -f "$FILE" ]; then
  echo "Error: $FILE not found. Are you running this from inside the repo?"
  exit 1
fi

python3 - "$PROJECT_ID" "$LIVE_URL" "$FILE" <<'PY'
import json, sys
project_id, live_url, file_path = sys.argv[1], sys.argv[2], sys.argv[3]
with open(file_path) as f: data = json.load(f)
found = False
for p in data:
    if p["id"] == project_id:
        p["live_url"] = live_url
        found = True
        break
if not found:
    print(f"Project '{project_id}' not found in {file_path}")
    sys.exit(1)
with open(file_path, "w") as f: json.dump(data, f, indent=2)
print(f"✓ {project_id} → {live_url}")
PY

echo "Don't forget: git add -A && git commit -m 'live: $PROJECT_ID' && git push"
