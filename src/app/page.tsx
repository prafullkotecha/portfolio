"use client";

import { useMemo, useState } from "react";
import projectsRaw from "@/data/projects.json";
import type { Project } from "@/lib/types";
import { ProjectCard } from "@/components/ProjectCard";

const projects = projectsRaw as Project[];

const TIER_LABELS: Record<string, { label: string; color: string }> = {
  A: { label: "Live", color: "text-tierA" },
  B: { label: "Soon", color: "text-tierB" },
  C: { label: "Source", color: "text-tierC" },
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [tier, setTier] = useState<string | null>(null);
  const [tag, setTag] = useState<string | null>(null);
  const [source, setSource] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const m = new Map<string, number>();
    projects.forEach(p => p.tags.forEach(t => m.set(t, (m.get(t) || 0) + 1)));
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, []);

  const allSources = useMemo(() => {
    const m = new Map<string, number>();
    projects.forEach(p => m.set(p.source, (m.get(p.source) || 0) + 1));
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return projects.filter(p => {
      if (tier && p.tier !== tier) return false;
      if (tag && !p.tags.includes(tag)) return false;
      if (source && p.source !== source) return false;
      if (q) {
        const hay = `${p.title} ${p.description} ${p.tags.join(" ")} ${p.id}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [query, tier, tag, source]);

  const stats = useMemo(() => {
    const total = projects.length;
    const liveCount = projects.filter(p => p.live_url).length;
    const aiCount = projects.filter(p => p.ai_providers.length > 0).length;
    const sourcesCount = new Set(projects.map(p => p.source)).size;
    return { total, liveCount, aiCount, sourcesCount };
  }, []);

  return (
    <main className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 py-12 md:py-16">

      {/* HEADER */}
      <header className="mb-16 md:mb-24">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted mb-3">Vol. I · Edition 2026</p>
            <h1 className="font-display font-light text-[clamp(3.5rem,9vw,7.5rem)] leading-[0.85] tracking-tightest text-ink">
              Maker&apos;s
              <br />
              <span className="italic font-normal text-rust">Catalog</span>
            </h1>
          </div>
          <div className="md:text-right max-w-md">
            <p className="font-mono text-sm leading-relaxed text-ink/80 mb-3">
              A working index of {stats.total} hobby projects built by <strong className="text-rust">Prafull Kotecha</strong> across 18 months of late-night experiments — AI agents, full-stack, generative play.
            </p>
            <div className="flex flex-wrap gap-2 md:justify-end font-mono text-xs">
              <a href="https://github.com/prafullkotecha" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted underline-offset-4 hover:text-rust">GitHub →</a>
              <span className="text-muted">·</span>
              <a href="https://www.linkedin.com/in/prafullkotecha/" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted underline-offset-4 hover:text-rust">LinkedIn →</a>
            </div>
          </div>
        </div>

        {/* STATS RULE */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-line border border-line">
          <Stat n={stats.total} label="Projects" />
          <Stat n={stats.aiCount} label="AI-Powered" />
          <Stat n={stats.sourcesCount} label="AI Tools Used" />
          <Stat n={stats.liveCount} label="Live Demos" sub={stats.liveCount === 0 ? "deploying…" : undefined} />
        </div>
      </header>

      {/* FILTERS */}
      <section className="mb-10 md:mb-16">
        <div className="grid md:grid-cols-[1fr_auto] gap-6 md:gap-12 mb-8">
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-muted mb-2">Search</label>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="title, description, tag…"
              className="w-full bg-transparent border-b border-ink/40 focus:border-rust py-2 font-mono text-base placeholder:text-muted/60"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-muted mb-2">Status</label>
            <div className="flex gap-2">
              <FilterChip active={tier === null} onClick={() => setTier(null)}>All</FilterChip>
              {(["A", "B", "C"] as const).map(t => (
                <FilterChip key={t} active={tier === t} onClick={() => setTier(t === tier ? null : t)} accent={TIER_LABELS[t].color}>
                  {TIER_LABELS[t].label}
                </FilterChip>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase tracking-[0.2em] text-muted mr-2 shrink-0">Topic</span>
            {allTags.map(([t, c]) => (
              <FilterChip key={t} active={tag === t} onClick={() => setTag(t === tag ? null : t)}>
                {t} <span className="text-muted/70 ml-1">{c}</span>
              </FilterChip>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase tracking-[0.2em] text-muted mr-2 shrink-0">Built&nbsp;with</span>
            {allSources.map(([s, c]) => (
              <FilterChip key={s} active={source === s} onClick={() => setSource(s === source ? null : s)}>
                {s} <span className="text-muted/70 ml-1">{c}</span>
              </FilterChip>
            ))}
          </div>
        </div>
      </section>

      {/* RESULTS COUNT */}
      <div className="flex items-baseline justify-between mb-6 pb-3 border-b border-ink/30">
        <p className="font-display italic text-2xl text-ink">
          {filtered.length === projects.length
            ? <>The complete catalog</>
            : <>Showing <span className="text-rust">{filtered.length}</span> of {projects.length}</>}
        </p>
        {(tier || tag || source || query) && (
          <button onClick={() => { setTier(null); setTag(null); setSource(null); setQuery(""); }}
            className="font-mono text-xs uppercase tracking-wider text-muted hover:text-rust">
            Reset ↻
          </button>
        )}
      </div>

      {/* GRID */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-line border border-line">
        {filtered.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={projects.indexOf(p) + 1} delay={Math.min(i, 12) * 30} />
        ))}
        {filtered.length === 0 && (
          <div className="md:col-span-2 lg:col-span-3 bg-paper py-24 text-center font-display italic text-3xl text-muted">
            Nothing in this drawer.
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="mt-24 md:mt-32 pt-8 border-t-2 border-ink/30 text-xs font-mono text-muted">
        <div className="flex flex-col md:flex-row md:justify-between gap-3">
          <p>© {new Date().getFullYear()} Prafull Kotecha · San Diego, CA</p>
          <p>
            Hand-built. Hosted on Cloudflare Pages + Vercel.
            {" "}
            <a href="https://github.com/prafullkotecha" className="underline decoration-dotted underline-offset-4 hover:text-rust">View source</a>
          </p>
        </div>
      </footer>
    </main>
  );
}

function Stat({ n, label, sub }: { n: number; label: string; sub?: string }) {
  return (
    <div className="bg-paper p-5 md:p-6">
      <div className="font-display text-5xl md:text-6xl leading-none text-ink mb-1">{n}</div>
      <div className="text-xs uppercase tracking-[0.2em] text-muted">{label}</div>
      {sub && <div className="text-[10px] italic text-rust mt-1 font-display">{sub}</div>}
    </div>
  );
}

function FilterChip({ active, onClick, children, accent }: { active: boolean; onClick: () => void; children: React.ReactNode; accent?: string }) {
  return (
    <button
      onClick={onClick}
      className={`text-xs font-mono uppercase tracking-wider px-2.5 py-1 border transition-colors ${
        active
          ? "bg-ink text-paper border-ink"
          : `bg-transparent border-ink/30 ${accent ?? "text-ink"} hover:border-ink hover:bg-ink/5`
      }`}
    >
      {children}
    </button>
  );
}
