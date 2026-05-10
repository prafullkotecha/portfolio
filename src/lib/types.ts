export type Tier = "A" | "B" | "C";

export interface Project {
  id: string;
  title: string;
  repo: string;
  description: string;
  framework: string;
  tier: Tier;
  deploy_target: string;
  ai_providers: string[];
  env_vars: string[];
  tags: string[];
  source: string;
  last_commit: string;
  live_url: string | null;
  published?: boolean;     // CMS-managed; default true
  screenshot?: string | null;  // CMS-managed; path under /public/screenshots/
}
