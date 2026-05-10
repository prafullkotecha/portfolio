#!/usr/bin/env node
/**
 * One-time migration: split src/data/projects.json into per-project files
 * under content/projects/{id}.json, adding `published` and `screenshot` fields.
 *
 * Idempotent — safe to re-run; existing files are overwritten with current data.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "src/data/projects.json");
const DEST_DIR = path.join(ROOT, "content/projects");

if (!fs.existsSync(SRC)) {
  console.error(`✗ ${SRC} not found`);
  process.exit(1);
}

fs.mkdirSync(DEST_DIR, { recursive: true });

const projects = JSON.parse(fs.readFileSync(SRC, "utf8"));
console.log(`Splitting ${projects.length} projects into ${DEST_DIR}/...`);

let written = 0;
for (const p of projects) {
  // Add CMS-managed fields with safe defaults
  const enriched = {
    id: p.id,
    title: p.title,
    repo: p.repo,
    description: p.description || "",
    framework: p.framework,
    tier: p.tier,
    deploy_target: p.deploy_target,
    ai_providers: p.ai_providers || [],
    env_vars: p.env_vars || [],
    tags: p.tags || [],
    source: p.source,
    last_commit: p.last_commit,
    live_url: p.live_url || null,
    // New CMS fields:
    published: true,
    screenshot: null,
  };

  const filename = path.join(DEST_DIR, `${p.id}.json`);
  fs.writeFileSync(filename, JSON.stringify(enriched, null, 2) + "\n");
  written++;
}

console.log(`✓ Wrote ${written} files`);
