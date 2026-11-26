import type { CardLabel, Project } from "./types";

/**
 * What a card can honestly promise a visitor.
 * - live: the link opens a working app or site.
 * - private-demo: the link needs a sign-in; the card shows a video instead.
 * - source: no public link.
 */
export type Status = "live" | "private-demo" | "source";

export function statusOf(p: Project): Status {
  if (p.label === "private-demo") return "private-demo";
  return p.live_url ? "live" : "source";
}

export const STATUS_INFO: Record<Status, { label: string; dot: string; text: string }> = {
  live: { label: "live", dot: "bg-tierA", text: "text-tierA" },
  "private-demo": { label: "private demo", dot: "bg-tierB", text: "text-tierB" },
  source: { label: "source-only", dot: "bg-tierC", text: "text-tierC" },
};

export const LABEL_TEXT: Record<CardLabel, string> = {
  "private-demo": "Private demo",
  "redesign-prototype": "Redesign prototype",
};

/** Private repos 404 for visitors, so only public ones get a GitHub link. */
export function showRepo(p: Project): boolean {
  return p.repository_visibility === "public";
}
