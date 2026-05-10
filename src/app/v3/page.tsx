"use client";

import { useMemo, useState } from "react";
import projectsRaw from "@/data/projects.json";
import type { Project } from "@/lib/types";
import Link from "next/link";

const projects = projectsRaw as Project[];

// Category code from tags
const CAT_CODE: Record<string, string> = {
  "AI": "AI",
  "Generative": "GEN",
  "Productivity": "PRD",
  "Healthcare": "HLT",
  "Business": "BIZ",
  "Demo": "DMO",
  "Static/Landing": "STC",
  "Supabase": "DAT",
  "Next.js": "WEB",
};

function partNo(p: Project, index: number) {
  // Format: PK-{tier}-{index}
  return `PK·${p.tier}·${String(index).padStart(3, "0")}`;
}

function category(p: Project) {
  for (const t of p.tags) if (CAT_CODE[t]) return CAT_CODE[t];
  return "GEN";
}

const STATUS_LABEL: Record<string, { label: string; bg: string; color: string }> = {
  A: { label: "IN STOCK", bg: "bg-[#0a0a0a]", color: "text-white" },
  B: { label: "ON ORDER", bg: "bg-[#ffd400]", color: "text-[#0a0a0a]" },
  C: { label: "DATASHEET", bg: "bg-transparent", color: "text-[#0a0a0a] border border-[#0a0a0a]" },
};

export default function SpecSheet() {
  const [query, setQuery] = useState("");
  const [tier, setTier] = useState<string | null>(null);
  const [aiOnly, setAiOnly] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen w-full bg-[#f5f4ee] text-[#0a0a0a] selection:bg-[#ffd400]" style={{ fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif" }}>

      {/* Top utility bar */}
      <div className="bg-[#0a0a0a] text-[#f5f4ee] text-[11px] font-medium tracking-[0.04em] uppercase">
        <div className="max-w-[1400px] mx-auto px-6 py-2 flex items-center justify-between">
          <span>Prafull Kotecha · Project Catalog · 2024–2026</span>
          <span>
            <Link href="/" className="hover:text-[#ffd400] mr-4">/ catalog</Link>
            <Link href="/v2" className="hover:text-[#ffd400] mr-4">/ terminal</Link>
            <span className="text-[#ffd400]">/ spec sheet</span>
          </span>
        </div>
      </div>

      {/* Masthead — small, factual, no marketing copy */}
      <header className="border-b-2 border-[#0a0a0a] bg-[#f5f4ee]">
        <div className="max-w-[1400px] mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-6 md:gap-8 items-end">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#0a0a0a]/60 mb-1">Issue 01 · Rev. 2026.05</p>
              <h1 className="text-[32px] md:text-[40px] font-bold leading-[0.95] tracking-tight">Side-Project Parts Catalog</h1>
              <p className="text-[13px] text-[#0a0a0a]/70 mt-2 max-w-md">{projects.length} units catalogued. AI agents, full-stack tooling, generative UI experiments. Built nights and weekends in San Diego, CA.</p>
            </div>
            <Stat label="Units" value={projects.length} />
            <Stat label="In Stock" value={projects.filter(p => p.tier === "A").length} accent />
            <Stat label="AI-Enabled" value={projects.filter(p => p.ai_providers.length > 0).length} />
            <Stat label="Distinct Vendors" value={new Set(projects.map(p => p.source)).size} />
          </div>
        </div>
      </header>

      {/* Filter rail */}
      <div className="border-b border-[#0a0a0a] bg-[#ebe9e0] sticky top-0 z-10">
        <div className="max-w-[1400px] mx-auto px-6 py-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px]">
          <label className="flex items-center gap-2">
            <span className="font-bold uppercase tracking-[0.1em] text-[11px]">Search</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="part #, description, vendor..."
              className="border border-[#0a0a0a] bg-[#f5f4ee] px-2 py-1 w-[260px] text-[12px] focus:outline-none focus:bg-[#ffd400]/30"
            />
          </label>

          <span className="text-[#0a0a0a]/40">|</span>

          <span className="font-bold uppercase tracking-[0.1em] text-[11px]">Stock</span>
          <FilterRadio label="All" active={tier === null} onClick={() => setTier(null)} />
          <FilterRadio label="A · in stock" active={tier === "A"} onClick={() => setTier("A")} />
          <FilterRadio label="B · on order" active={tier === "B"} onClick={() => setTier("B")} />
          <FilterRadio label="C · datasheet" active={tier === "C"} onClick={() => setTier("C")} />

          <span className="text-[#0a0a0a]/40">|</span>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={aiOnly} onChange={(e) => setAiOnly(e.target.checked)} className="w-3.5 h-3.5 accent-[#ffd400]" />
            <span className="font-bold uppercase tracking-[0.1em] text-[11px]">AI-enabled only</span>
          </label>

          <span className="ml-auto text-[11px] text-[#0a0a0a]/60">
            <span className="font-bold text-[#0a0a0a]">{filtered.length}</span> of {projects.length} shown
          </span>
        </div>
      </div>

      {/* Data table */}
      <main className="max-w-[1400px] mx-auto px-6 py-2">
        {/* table header */}
        <div className="grid grid-cols-[110px_1fr_70px_120px_90px_120px_30px] gap-4 px-2 py-2 border-b-2 border-[#0a0a0a] text-[10px] font-bold uppercase tracking-[0.15em]">
          <span>Part No.</span>
          <span>Description</span>
          <span>Cat.</span>
          <span>Framework</span>
          <span>AI</span>
          <span>Status</span>
          <span></span>
        </div>

        {filtered.map((p, i) => {
          const idx = projects.indexOf(p) + 1;
          const isExpanded = expanded === p.id;
          const status = STATUS_LABEL[p.tier];
          return (
            <div key={p.id} className="border-b border-[#0a0a0a]/15">
              <div
                onClick={() => setExpanded(isExpanded ? null : p.id)}
                className="grid grid-cols-[110px_1fr_70px_120px_90px_120px_30px] gap-4 px-2 py-3 items-baseline cursor-pointer hover:bg-[#ffd400]/15 transition-colors"
              >
                <code className="text-[11px] font-medium text-[#0a0a0a]/70">{partNo(p, idx)}</code>
                <div className="min-w-0">
                  <p className="text-[14px] font-bold leading-tight">{p.title}</p>
                  <p className="text-[12px] text-[#0a0a0a]/65 truncate mt-0.5">{p.description}</p>
                </div>
                <code className="text-[10px] font-medium tracking-wider text-[#0a0a0a]/70">{category(p)}</code>
                <span className="text-[12px] text-[#0a0a0a]/80">{p.framework}</span>
                <span className="text-[11px] text-[#0a0a0a]/70">{p.ai_providers.length ? p.ai_providers.join(", ") : "—"}</span>
                <span className={`text-[10px] font-bold uppercase tracking-[0.1em] px-2 py-1 inline-block w-max ${status.bg} ${status.color}`}>{status.label}</span>
                <span className="text-[14px] text-[#0a0a0a]/40">{isExpanded ? "−" : "+"}</span>
              </div>
              {isExpanded && (
                <div className="bg-[#0a0a0a] text-[#f5f4ee] px-6 py-5 grid grid-cols-1 md:grid-cols-[1fr_1fr_280px] gap-8">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#ffd400] mb-2">Datasheet</p>
                    <p className="text-[14px] leading-relaxed">{p.description}</p>
                  </div>
                  <div className="text-[12px] space-y-1">
                    <SpecRow k="Part No." v={partNo(p, idx)} />
                    <SpecRow k="Title" v={p.title} />
                    <SpecRow k="Repo ID" v={<code>{p.id}</code>} />
                    <SpecRow k="Framework" v={p.framework} />
                    <SpecRow k="Vendor" v={p.source} />
                    <SpecRow k="Category" v={category(p)} />
                    <SpecRow k="AI" v={p.ai_providers.length ? p.ai_providers.join(", ") : "none"} />
                    <SpecRow k="Tags" v={p.tags.length ? p.tags.join(" · ") : "—"} />
                    <SpecRow k="Last commit" v={p.last_commit} />
                    <SpecRow k="Deploy target" v={p.deploy_target} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#ffd400] mb-2">Order / Inspect</p>
                    {p.live_url ? (
                      <a href={p.live_url} target="_blank" rel="noopener noreferrer" className="block bg-[#ffd400] text-[#0a0a0a] text-center py-3 font-bold uppercase tracking-[0.1em] text-[12px] hover:bg-white">Open live demo →</a>
                    ) : (
                      <span className="block bg-[#0a0a0a] border border-[#ffd400] text-[#ffd400] text-center py-3 font-bold uppercase tracking-[0.1em] text-[12px]">{p.tier === "C" ? "Datasheet only" : "Awaiting deploy"}</span>
                    )}
                    <a href={p.repo} target="_blank" rel="noopener noreferrer" className="block border border-[#f5f4ee] text-[#f5f4ee] text-center py-3 font-bold uppercase tracking-[0.1em] text-[12px] hover:bg-[#f5f4ee] hover:text-[#0a0a0a]">View source ↗</a>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <p className="py-24 text-center text-[14px]">
            No units match. <button onClick={() => { setQuery(""); setTier(null); setAiOnly(false); }} className="underline font-bold">Reset filters</button>
          </p>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-[#0a0a0a] bg-[#0a0a0a] text-[#f5f4ee] mt-12">
        <div className="max-w-[1400px] mx-auto px-6 py-6 text-[11px] uppercase tracking-[0.15em] flex flex-col md:flex-row justify-between gap-3">
          <span>© {new Date().getFullYear()} Prafull Kotecha · San Diego, CA</span>
          <span>End of catalog · No returns on free demos</span>
          <span><a href="https://github.com/prafullkotecha" className="hover:text-[#ffd400]">github.com/prafullkotecha</a></span>
        </div>
      </footer>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className={`border-l-2 ${accent ? "border-[#ffd400]" : "border-[#0a0a0a]"} pl-3`}>
      <p className="text-[10px] uppercase tracking-[0.2em] text-[#0a0a0a]/60 mb-1">{label}</p>
      <p className="text-[28px] font-bold leading-none tabular-nums">{value}</p>
    </div>
  );
}

function FilterRadio({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`text-[11px] uppercase tracking-[0.05em] px-2 py-1 transition-colors ${active ? "bg-[#ffd400] text-[#0a0a0a] font-bold" : "text-[#0a0a0a]/70 hover:text-[#0a0a0a]"}`}
    >
      {label}
    </button>
  );
}

function SpecRow({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[110px_1fr] gap-3 border-b border-[#f5f4ee]/10 py-1">
      <span className="text-[#f5f4ee]/50 text-[10px] uppercase tracking-[0.15em]">{k}</span>
      <span>{v}</span>
    </div>
  );
}
