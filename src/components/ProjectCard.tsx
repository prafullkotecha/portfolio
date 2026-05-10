import type { Project } from "@/lib/types";

const TIER_INFO: Record<string, { dot: string; label: string }> = {
  A: { dot: "bg-tierA", label: "live" },
  B: { dot: "bg-tierB", label: "soon" },
  C: { dot: "bg-tierC", label: "source-only" },
};

export function ProjectCard({ project, index, delay }: { project: Project; index: number; delay: number }) {
  const tier = TIER_INFO[project.tier];
  const num = String(index).padStart(3, "0");
  const cleanDesc = project.description
    .replace(/^\*\*URL\*\*:.*$/gm, "")
    .replace(/^https?:\/\/\S+\s*/g, "")
    .replace(/^This contains everything you need to run your app locally\.?$/g, "")
    .trim();

  return (
    <article
      className="rise group bg-paper hover:bg-paperShade transition-colors duration-200 p-6 flex flex-col"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-ink/20">
        <span className="font-mono text-[11px] tracking-[0.15em] text-muted">№ {num}</span>
        <div className="flex items-center gap-1.5">
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${tier.dot}`} />
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">{tier.label}</span>
        </div>
      </div>

      {/* Title */}
      <h3 className="font-display text-2xl leading-tight text-ink mb-2 group-hover:text-rust transition-colors">
        {project.title}
      </h3>

      {/* Description */}
      <p className="font-mono text-[13px] leading-relaxed text-ink/75 mb-4 flex-1 min-h-[3.5em]">
        {cleanDesc || <span className="italic text-muted">— no description on file —</span>}
      </p>

      {/* Meta */}
      <div className="text-[10px] font-mono uppercase tracking-[0.1em] text-muted mb-3 space-y-0.5">
        <div><span className="text-ink/40">framework</span> · {project.framework}</div>
        <div><span className="text-ink/40">built with</span> · {project.source}</div>
        {project.ai_providers.length > 0 && (
          <div><span className="text-ink/40">ai</span> · {project.ai_providers.join(", ")}</div>
        )}
      </div>

      {/* Tags */}
      {project.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {project.tags.map(t => (
            <span key={t} className="tag text-muted">{t}</span>
          ))}
        </div>
      )}

      {/* Links */}
      <div className="flex items-center gap-3 text-xs font-mono pt-3 border-t border-ink/10">
        {project.live_url ? (
          <a
            href={project.live_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-rust font-medium underline decoration-dotted underline-offset-4 hover:no-underline"
          >
            Live demo →
          </a>
        ) : project.tier === "C" ? (
          <span className="text-muted italic">source available</span>
        ) : (
          <span className="text-tierB italic">coming soon</span>
        )}
        <a
          href={project.repo}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto text-ink/60 hover:text-ink underline decoration-dotted underline-offset-4"
        >
          GitHub ↗
        </a>
      </div>
    </article>
  );
}
