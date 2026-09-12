import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Selected Work — Prafull Kotecha",
  description:
    "Selected product experiments, useful tools, and working prototypes by Prafull Kotecha.",
};

const featured = [
  {
    title: "QR Studio Pro",
    discipline: "Product · Utility",
    description:
      "A production-minded QR workspace that turns a simple generator into a flexible design, batch, and analytics tool.",
    image: "/screenshots/case-studies/qrcode.png",
    live: "https://prafullkotecha.github.io/qrcode-custom-erator/",
    repo: "https://github.com/prafullkotecha/qrcode-custom-erator",
    tone: "olive",
  },
  {
    title: "TempFlow",
    discipline: "AI · Recruiting",
    description:
      "An AI-assisted recruiting console for moving from open roles to shortlists, candidate review, and outreach.",
    image: "/screenshots/case-studies/tempflow.png",
    live: "https://prafullkotecha.github.io/ai-temp-recruiter/",
    repo: "https://github.com/prafullkotecha/ai-temp-recruiter",
    tone: "blue",
  },
  {
    title: "340B Claims Adjudicator",
    discipline: "Healthcare · Operations",
    description:
      "A complex healthcare workflow reframed as an approachable claims, eligibility, pricing, and reporting workspace.",
    image: "/screenshots/case-studies/claims.png",
    live: "https://prafullkotecha.github.io/b-claim-alchemy/",
    repo: "https://github.com/prafullkotecha/b-claim-alchemy",
    tone: "cyan",
  },
  {
    title: "Roopsie Boutique",
    discipline: "Commerce · Brand",
    description:
      "A fashion storefront concept with editorial scale, confident art direction, and a clearer path from collection to fitting.",
    image: "/screenshots/case-studies/roopsie.png",
    live: "https://prafullkotecha.github.io/roopsie-boutique/",
    repo: "https://github.com/prafullkotecha/roopsie-boutique",
    tone: "plum",
  },
  {
    title: "Beat Stitch Studio",
    discipline: "Creative tools · Audio",
    description:
      "A browser-based DJ workspace for combining loops, shaping transitions, and turning fragments into a coherent set.",
    image: "/screenshots/case-studies/beat-stitch.png",
    live: "https://prafullkotecha.github.io/beat-stitch-studio/",
    repo: "https://github.com/prafullkotecha/beat-stitch-studio",
    tone: "orange",
  },
  {
    title: "FreshConnect",
    discipline: "Marketplace · Civic tech",
    description:
      "An ONDC-inspired marketplace that gives village producers a direct, comprehensible route to city customers.",
    image: "/screenshots/case-studies/freshconnect.png",
    live: "https://prafullkotecha.github.io/gram-connect-on-net/",
    repo: "https://github.com/prafullkotecha/gram-connect-on-net",
    tone: "green",
  },
] as const;

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default function CaseStudiesPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/case-studies" className={styles.identity}>
          <span className={styles.monogram}>PK</span>
          <span>Prafull Kotecha</span>
        </Link>

        <nav className={styles.nav} aria-label="Portfolio navigation">
          <Link href="/case-studies" aria-current="page">Case studies</Link>
          <Link href="/">Catalog</Link>
          <Link href="/v2">Terminal</Link>
          <Link href="/v3">Spec sheet</Link>
        </nav>

        <a
          className={styles.contact}
          href="https://www.linkedin.com/in/prafullkotecha/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Let&apos;s connect <span aria-hidden="true">↗</span>
        </a>
      </header>

      <section className={styles.hero}>
        <p className={styles.eyebrow}>Selected work · 2024–2026</p>
        <h1>Useful ideas,<br />made tangible.</h1>
        <p className={styles.intro}>
          A selection of working products and experiments across AI, healthcare,
          commerce, and creative tools. Each one is live—open it, click around,
          and see how it works.
        </p>
      </section>

      <section className={styles.grid} aria-label="Selected case studies">
        {featured.map((project, index) => (
          <article className={styles.card} key={project.title}>
            <a
              className={`${styles.visual} ${styles[project.tone]}`}
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${project.title} live demo`}
            >
              <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
              <img src={`${basePath}${project.image}`} alt={`Interface from ${project.title}`} />
              <span className={styles.open}>Open live <span aria-hidden="true">↗</span></span>
            </a>

            <div className={styles.cardCopy}>
              <div>
                <p className={styles.discipline}>{project.discipline}</p>
                <h2>{project.title}</h2>
              </div>
              <div className={styles.summary}>
                <p>{project.description}</p>
                <a href={project.repo} target="_blank" rel="noopener noreferrer">
                  View source <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </article>
        ))}
      </section>

      <footer className={styles.footer}>
        <p className={styles.eyebrow}>More experiments are always in motion.</p>
        <h2>See the whole catalog.</h2>
        <div className={styles.footerLinks}>
          <Link href="/">Browse all projects <span aria-hidden="true">→</span></Link>
          <a href="https://github.com/prafullkotecha" target="_blank" rel="noopener noreferrer">
            GitHub <span aria-hidden="true">↗</span>
          </a>
          <a href="https://www.linkedin.com/in/prafullkotecha/" target="_blank" rel="noopener noreferrer">
            LinkedIn <span aria-hidden="true">↗</span>
          </a>
        </div>
      </footer>
    </main>
  );
}
