export type Tier = "A" | "B" | "C";

/** The eight catalog sections, in display order. */
export const GROUPS = [
  "Healthcare",
  "Entertainment",
  "Community",
  "AI",
  "Services",
  "Hardware",
  "IoT",
  "Productivity",
] as const;
export type Group = (typeof GROUPS)[number];

/**
 * Optional card label.
 * - private-demo: the live link needs a sign-in, so the card carries a short video.
 * - redesign-prototype: a concept made for a client or community, not their official site.
 */
export type CardLabel = "private-demo" | "redesign-prototype";

export interface Project {
  id: string;
  title: string;
  repo: string;
  description: string;
  framework: string;
  tier: Tier;
  deploy_target: string;
  repository_visibility?: "private" | "public";
  license?: string;
  backend_services?: string[];
  ai_providers: string[];
  env_vars: string[];
  tags: string[];
  source: string;
  last_commit: string;
  live_url: string | null;
  group?: Group;           // required on published cards (checked by the aggregator)
  label?: CardLabel | null;
  extra_links?: ProjectLink[]; // secondary links shown after the live link
  includes?: string[];     // for a card that folds several small apps into one
  published?: boolean;     // CMS-managed; default true
  screenshot?: string | null;  // CMS-managed; path under /public/screenshots/
  video?: ProjectVideo | null; // CMS-managed; files under /public/videos/
}

export interface ProjectLink {
  label: string;
  url: string;
}

export interface ProjectVideo {
  src: string;      // path under /public/videos/
  poster: string;   // still frame shown before play
  caption: string;  // one line on what the clip proves
}
