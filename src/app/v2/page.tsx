"use client";

import { useMemo, useState } from "react";
import projectsRaw from "@/data/projects.json";
import type { Project } from "@/lib/types";
import Link from "next/link";

const projects = projectsRaw as Project[];

// ANSI-ish color per tier
const TIER_COLOR: Record<string, string> = {
  A: "text-[#3fb950]",   // green
  B: "text-[#d29922]",   // yellow
  C: "text-[#8b949e]",   // grey
};
const TIER_TAG: Record<string, string> = { A: "live", B: "wip ", C: "src " };

function asPerm(tier: string) {
  // Fake permission strings: live = full read/exec, wip = restricted, src = read-only
  if (tier === "A") return "drwxr-xr-x";
  if (tier === "B") return "drwxr-x---";
  return "drw-r-----";
}
function asSize(idx: number) {
  // Pseudo-deterministic size based on index
  const b = ((idx * 7919) % 950) + 50;
  return `${String(b).padStart(3, " ")}K`;
}
function asDate(commit: string) {
  if (!commit || commit === "?") return "         ";
  // commit is YYYY-MM-DD → output as "Mar  3 19:24" style
  const d = new Date(commit);
  if (isNaN(d.getTime())) return "         ";
  const mo = d.toLocaleString("en-US", { month: "short" });
  const day = String(d.getDate()).padStart(2, " ");
  return `${mo} ${day} 14:08`;
}

export default function StandardOutput() {
  const [query, setQuery] = useState("");
  const [tier, setTier] = useState<string | null>(null);
  const [aiOnly, setAiOnly] = useState(false);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return projects.filter(p => {
      if (tier && p.tier !== tier) return false;
      if (aiOnly && p.ai_providers.length === 0) return false;
      if (q) {
        const hay = `${p.title} ${p.description} ${p.tags.join(" ")} ${p.id}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [query, tier, aiOnly]);

  const stats = useMemo(() => ({
    total: projects.length,
    aiCount: projects.filter(p => p.ai_providers.length > 0).length,
    sourcesCount: new Set(projects.map(p => p.source)).size,
    liveCount: projects.filter(p => p.live_url).length,
    repos: "github.com/prafullkotecha",
    host: "san-diego (PST)",
    uptime: "18 mo",
    shell: "claude code, neovim",
  }), []);

  return (
    <div className="min-h-screen w-full bg-[#0d1117] text-[#c9d1d9] font-mono text-[13px] leading-[1.55] selection:bg-[#f0883e] selection:text-[#0d1117]">
      <div className="max-w-[1100px] mx-auto px-5 md:px-8 py-6">

        {/* Window chrome */}
        <div className="flex items-center gap-1.5 mb-3 text-[10px] text-[#6e7681]">
          <span className="w-3 h-3 rounded-full bg-[#ff5f56]"></span>
          <span className="w-3 h-3 rounded-full bg-[#ffbd2e]"></span>
          <span className="w-3 h-3 rounded-full bg-[#27c93f]"></span>
          <span className="ml-3 tracking-wider">prafull@portfolio: ~/projects — zsh — 184x52</span>
          <span className="ml-auto"><Link href="/" className="hover:text-[#79c0ff]">› /</Link>  <Link href="/v3" className="hover:text-[#79c0ff]">› /v3</Link></span>
        </div>

        {/* neofetch-style header */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-12 mb-8 mt-4">
          <pre className="text-[#f0883e] text-[10px] leading-[1.1] shrink-0 hidden md:block">
{`  ██████  ██   ██
  ██  ██  ██  ██
  ██████  █████
  ██      ██  ██
  ██      ██   ██

   prafull
   kotecha`}
          </pre>
          <div className="text-[12px]">
            <p className="text-[#f0883e] font-medium">prafull@portfolio</p>
            <p className="text-[#6e7681]">─────────────────</p>
            <Row k="OS" v="MacOS · 92128 · San Diego" />
            <Row k="Host" v={stats.host} />
            <Row k="Shell" v={stats.shell} />
            <Row k="Uptime" v={`${stats.uptime} of side projects`} />
            <Row k="Packages" v={`${stats.total} repos · ${stats.aiCount} AI-powered · ${stats.sourcesCount} sources`} />
            <Row k="Live" v={stats.liveCount === 0 ? <span className="text-[#d29922]">deploying...</span> : `${stats.liveCount} URLs`} />
            <Row k="Repos" v={<a href={`https://${stats.repos}`} className="text-[#79c0ff] hover:underline">{stats.repos}</a>} />
            <Row k="Contact" v={<a href="https://www.linkedin.com/in/prafullkotecha/" className="text-[#79c0ff] hover:underline">linkedin.com/in/prafullkotecha</a>} />
          </div>
        </div>

        {/* prompt + filters */}
        <div className="border-t border-[#21262d] pt-4 mb-4">
          <p className="mb-3">
            <span className="text-[#3fb950]">prafull@portfolio</span>
            <span className="text-[#c9d1d9]">:</span>
            <span className="text-[#79c0ff]">~/projects</span>
            <span className="text-[#c9d1d9]">$ </span>
            <span className="text-[#c9d1d9]">ls -la --color </span>
            <Flag active={tier === "A"} onClick={() => setTier(tier === "A" ? null : "A")}>--tier=A</Flag>{" "}
            <Flag active={tier === "B"} onClick={() => setTier(tier === "B" ? null : "B")}>--tier=B</Flag>{" "}
            <Flag active={tier === "C"} onClick={() => setTier(tier === "C" ? null : "C")}>--tier=C</Flag>{" "}
            <Flag active={aiOnly} onClick={() => setAiOnly(!aiOnly)}>--ai</Flag>
          </p>

          <p className="mb-3">
            <span className="text-[#c9d1d9]">/</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="grep pattern..."
              className="bg-transparent border-none outline-none text-[#c9d1d9] placeholder-[#484f58] w-[300px] focus:placeholder-[#6e7681] caret-[#f0883e]"
              autoFocus
            />
            <span className="animate-pulse text-[#f0883e]">▊</span>
          </p>

          <p className="text-[#6e7681] text-[11px]">
            {"//"} total {filtered.length} of {projects.length}, sorted by tier asc
          </p>
        </div>

        {/* file listing */}
        <div className="space-y-0.5">
          {filtered.map((p, i) => (
            <FileRow key={p.id} project={p} index={i + 1} />
          ))}
          {filtered.length === 0 && (
            <p className="text-[#6e7681] py-12 text-center">
              <span className="text-[#f85149]">grep:</span> no matches.
            </p>
          )}
        </div>

        {/* footer prompt */}
        <div className="mt-12 border-t border-[#21262d] pt-4 text-[#6e7681] text-[11px]">
          <p>
            <span className="text-[#3fb950]">prafull@portfolio</span>
            <span className="text-[#c9d1d9]">:</span>
            <span className="text-[#79c0ff]">~/projects</span>
            <span className="text-[#c9d1d9]">$ </span>
            <span className="animate-pulse text-[#f0883e]">▊</span>
          </p>
          <p className="mt-3">
            {"//"} hosted on cloudflare pages + vercel · {new Date().getFullYear()} · <Link href="/" className="text-[#79c0ff] hover:underline">browse `/` (catalog view)</Link> · <Link href="/v3" className="text-[#79c0ff] hover:underline">browse `/v3` (spec-sheet view)</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <p className="grid grid-cols-[80px_1fr] gap-3">
      <span className="text-[#f0883e]">{k}</span>
      <span>{v}</span>
    </p>
  );
}

function Flag({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-1 transition-colors ${active ? "bg-[#f0883e] text-[#0d1117]" : "text-[#79c0ff] hover:bg-[#21262d]"}`}
    >
      {children}
    </button>
  );
}

function FileRow({ project: p, index }: { project: Project; index: number }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <div
        onClick={() => setExpanded(!expanded)}
        className="cursor-pointer hover:bg-[#161b22] py-0.5 px-2 -mx-2 grid grid-cols-[100px_60px_180px_110px_1fr_70px] gap-3 items-baseline whitespace-nowrap"
      >
        <span className="text-[#6e7681]">{asPerm(p.tier)}</span>
        <span className="text-[#6e7681]">{asSize(index)}</span>
        <span className="text-[#6e7681] text-[11px]">{asDate(p.last_commit)}</span>
        <span className={`${TIER_COLOR[p.tier]} text-[11px]`}>[{TIER_TAG[p.tier]}]</span>
        <span>
          <span className="text-[#c9d1d9] font-medium">{p.id}</span>
          {p.ai_providers.length > 0 && (
            <span className="text-[#a371f7] ml-2 text-[11px]">@{p.ai_providers.join(",")}</span>
          )}
          <span className="text-[#6e7681] ml-2 text-[11px] truncate">{"//"} {p.description.slice(0, 70)}{p.description.length > 70 ? "..." : ""}</span>
        </span>
        <span className="text-[#6e7681] text-right text-[11px]">{expanded ? "▼" : "▶"}</span>
      </div>
      {expanded && (
        <div className="bg-[#161b22] border-l-2 border-[#f0883e] px-4 py-3 mb-1 text-[12px] grid grid-cols-[120px_1fr] gap-x-4 gap-y-1">
          <span className="text-[#6e7681]">title</span><span>{p.title}</span>
          <span className="text-[#6e7681]">description</span><span>{p.description}</span>
          <span className="text-[#6e7681]">framework</span><span>{p.framework}</span>
          <span className="text-[#6e7681]">built_with</span><span>{p.source}</span>
          {p.ai_providers.length > 0 && <><span className="text-[#6e7681]">ai_providers</span><span>{p.ai_providers.join(", ")}</span></>}
          {p.tags.length > 0 && <><span className="text-[#6e7681]">tags</span><span>{p.tags.join(" · ")}</span></>}
          <span className="text-[#6e7681]">deploy</span><span>{p.deploy_target}</span>
          <span className="text-[#6e7681]">last_commit</span><span>{p.last_commit}</span>
          <span className="text-[#6e7681]">$ open</span>
          <span className="space-x-3">
            {p.live_url ? (
              <a href={p.live_url} target="_blank" rel="noopener noreferrer" className="text-[#3fb950] hover:underline">live →</a>
            ) : <span className="text-[#d29922]">[awaiting deploy]</span>}
            <a href={p.repo} target="_blank" rel="noopener noreferrer" className="text-[#79c0ff] hover:underline">github →</a>
          </span>
        </div>
      )}
    </>
  );
}
