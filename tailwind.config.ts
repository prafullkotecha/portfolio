import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#f4ede4",
        paperShade: "#ebe2d4",
        ink: "#0f0e0c",
        rust: "#bc3a17",
        muted: "#807461",
        line: "#dcd2bf",
        tierA: "#3d6b35",
        tierB: "#a87622",
        tierC: "#666056",
      },
      fontFamily: {
        display: ["var(--font-display)", "Fraunces", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
    },
  },
  plugins: [],
};

export default config;
