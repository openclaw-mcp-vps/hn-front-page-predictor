import type { ProjectType } from "@/lib/types";

export const HOUR_SUCCESS_RATE_UTC: Record<number, number> = {
  0: 0.41,
  1: 0.37,
  2: 0.33,
  3: 0.31,
  4: 0.29,
  5: 0.3,
  6: 0.35,
  7: 0.44,
  8: 0.56,
  9: 0.63,
  10: 0.68,
  11: 0.66,
  12: 0.61,
  13: 0.58,
  14: 0.55,
  15: 0.57,
  16: 0.6,
  17: 0.64,
  18: 0.67,
  19: 0.65,
  20: 0.59,
  21: 0.54,
  22: 0.49,
  23: 0.45
};

export const DAY_SUCCESS_MULTIPLIER: Record<number, number> = {
  0: 0.9,
  1: 1.07,
  2: 1.08,
  3: 1.06,
  4: 1.03,
  5: 0.97,
  6: 0.92
};

export const PROJECT_TYPE_MULTIPLIER: Record<ProjectType, number> = {
  "developer-tool": 1.08,
  "open-source": 1.05,
  "ai-product": 1.02,
  infra: 1.04,
  data: 1.01,
  productivity: 0.98,
  other: 0.96
};

export const POSITIVE_TITLE_KEYWORDS = [
  "open source",
  "self-hosted",
  "developer",
  "cli",
  "debug",
  "benchmark",
  "postgres",
  "terminal",
  "api",
  "visualizer",
  "profiling",
  "compiler",
  "sandbox"
];

export const NEGATIVE_TITLE_KEYWORDS = [
  "revolutionary",
  "best ever",
  "ultimate",
  "cheap",
  "limited offer",
  "discount",
  "subscribe now",
  "nft",
  "crypto signal"
];

export const NOVELTY_TERMS = [
  "offline",
  "local-first",
  "in-browser",
  "privacy",
  "open protocol",
  "no-code",
  "zero-config",
  "agent",
  "streaming",
  "wasm"
];
