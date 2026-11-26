import type { Project } from "@/lib/types";
import { LABEL_TEXT, STATUS_INFO, showRepo, statusOf } from "@/lib/status";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function ProjectCard({ project, index, delay }: { project: Project; index: number; delay: number }) {
  const status = statusOf(project);
  const badge = STATUS_INFO[status];
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
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${badge.dot}`} />
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">{badge.label}</span>
        </div>
      </div>

      {/* Screenshot (when present) */}
      {project.screenshot && (
        <div className="mb-3 -mx-1 overflow-hidden border border-ink/10 bg-paperShade aspect-[16/10]">
          <img
            src={project.screenshot}
            alt={`Screenshot of ${project.title}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      {/* Walkthrough video (when present) */}
      {project.video && (
        <figure className="mb-3 -mx-1">
          <div className="overflow-hidden border border-ink/10 bg-ink aspect-video">
            <video
              src={`${BASE_PATH}${project.video.src}`}
              poster={`${BASE_PATH}${project.video.poster}`}
              controls
              muted
              playsInline
              preload="none"
              className="w-full h-full object-contain"
              aria-label={`Walkthrough of ${project.title}`}
            />
          </div>
          <figcaption className="mt-1.5 font-mono text-[11px] leading-snug text-muted">
            {project.video.caption}
          </figcaption>
        </figure>
      )}

      {/* Label: private demo or redesign prototype */}
      {project.label && (
        <p className="mb-2">
          <span className="inline-block font-mono text-[10px] uppercase tracking-[0.15em] px-1.5 py-0.5 border border-rust/50 text-rust">
            {LABEL_TEXT[project.label]}
          </span>
        </p>
      )}

      {/* Title */}
      <h3 className="font-display text-2xl leading-tight text-ink mb-2 group-hover:text-rust transition-colors">
        {project.title}
      </h3>

      {/* Description */}
      <p className="font-mono text-[13px] leading-relaxed text-ink/75 mb-4 flex-1 min-h-[3.5em]">
        {cleanDesc || <span className="italic text-muted">— no description on file —</span>}
      </p>

      {/* Folded apps (one card standing for several small builds) */}
      {project.includes && project.includes.length > 0 && (
        <details className="mb-4 font-mono text-[12px] text-ink/70">
          <summary className="cursor-pointer text-[11px] uppercase tracking-[0.1em] text-muted hover:text-rust">
            {project.includes.length} apps inside
          </summary>
          <p className="mt-2 leading-relaxed">{project.includes.join(" · ")}</p>
        </details>
      )}

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
            {status === "private-demo" ? "Open (sign-in) →" : "Live demo →"}
          </a>
        ) : (
          <span className="text-muted italic">no public demo</span>
        )}
        {project.extra_links?.map((l) => (
          <a
            key={l.url}
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink/70 hover:text-ink underline decoration-dotted underline-offset-4"
          >
            {l.label} ↗
          </a>
        ))}
        {showRepo(project) && (
          <a
            href={project.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto text-ink/60 hover:text-ink underline decoration-dotted underline-offset-4"
          >
            GitHub ↗
          </a>
        )}
      </div>
    </article>
  );
}
