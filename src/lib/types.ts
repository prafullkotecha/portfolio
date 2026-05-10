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
}
