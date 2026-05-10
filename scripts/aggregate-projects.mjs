#!/usr/bin/env node
/**
 * Build-time aggregator: read content/projects/*.json, filter unpublished,
 * write src/data/projects.json that the React pages import.
 *
 * Runs automatically via `predev` and `prebuild` npm hooks.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC_DIR = path.join(ROOT, "content/projects");
const DEST = path.join(ROOT, "src/data/projects.json");

if (!fs.existsSync(SRC_DIR)) {
  console.error(`✗ ${SRC_DIR} not found — has the migration run?`);
  process.exit(1);
}

const files = fs
  .readdirSync(SRC_DIR)
  .filter((f) => f.endsWith(".json"))
  .sort();

const all = files.map((f) => {
  const raw = fs.readFileSync(path.join(SRC_DIR, f), "utf8");
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error(`✗ malformed JSON in ${f}: ${e.message}`);
    process.exit(1);
  }
});

const published = all.filter((p) => p.published !== false);
const hidden = all.length - published.length;

// Sort: tier asc (A,B,C), then alphabetical by title
published.sort((a, b) => {
  if (a.tier !== b.tier) return a.tier.localeCompare(b.tier);
  return (a.title || "").toLowerCase().localeCompare((b.title || "").toLowerCase());
});

fs.mkdirSync(path.dirname(DEST), { recursive: true });
fs.writeFileSync(DEST, JSON.stringify(published, null, 2) + "\n");

console.log(
  `✓ Aggregated ${published.length} published projects → src/data/projects.json` +
  (hidden ? ` (${hidden} hidden)` : "")
);
