import { load } from "cheerio";
import { format, parseISO } from "date-fns";
import { z } from "zod";
import {
  DAY_SUCCESS_MULTIPLIER,
  HOUR_SUCCESS_RATE_UTC,
  NEGATIVE_TITLE_KEYWORDS,
  NOVELTY_TERMS,
  POSITIVE_TITLE_KEYWORDS,
  PROJECT_TYPE_MULTIPLIER
} from "@/lib/hn-data";
import type { PredictionFactor, PredictionResult, ProjectType } from "@/lib/types";

const projectTypeEnum = z.enum([
  "developer-tool",
  "open-source",
  "ai-product",
  "infra",
  "data",
  "productivity",
  "other"
]);

export const predictionInputSchema = z.object({
  title: z.string().min(12).max(140),
  description: z.string().min(80).max(2000),
  projectType: projectTypeEnum,
  launchDateTime: z.string().datetime(),
  hasGithubRepo: z.boolean(),
  hasLiveDemo: z.boolean(),
  openSource: z.boolean(),
  teamSize: z.coerce.number().int().min(1).max(20)
});

export type PredictionInput = z.infer<typeof predictionInputSchema>;

function clamp(value: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

function sigmoid(value: number) {
  return 1 / (1 + Math.exp(-value));
}

function countKeywordHits(text: string, keywords: string[]) {
  const normalized = text.toLowerCase();
  return keywords.reduce((sum, keyword) => (normalized.includes(keyword) ? sum + 1 : sum), 0);
}

function titleScore(title: string): PredictionFactor {
  const normalized = title.trim();
  const lower = normalized.toLowerCase();
  const length = normalized.length;

  let score = 0.5;
  if (length >= 35 && length <= 82) score += 0.28;
  else if (length < 28 || length > 95) score -= 0.18;

  if (lower.startsWith("show hn:")) score += 0.1;
  else score -= 0.05;

  const positiveHits = countKeywordHits(lower, POSITIVE_TITLE_KEYWORDS);
  const negativeHits = countKeywordHits(lower, NEGATIVE_TITLE_KEYWORDS);
  score += positiveHits * 0.06;
  score -= negativeHits * 0.08;

  const punctuationPenalty = (normalized.match(/[!?]/g) ?? []).length > 1 ? 0.08 : 0;
  score -= punctuationPenalty;

  return {
    factor: "Title Strength",
    score: clamp(score),
    detail:
      length >= 35 && length <= 82
        ? "Length and phrasing are in a strong range for Show HN browsing behavior."
        : "Title length is outside the strongest range; concise specificity usually performs better."
  };
}

function contentScore(input: PredictionInput): PredictionFactor {
  const wrapped = `<article>${input.description}</article>`;
  const $ = load(wrapped);
  const text = $("article").text().replace(/\s+/g, " ").trim();
  const wordCount = text.split(" ").filter(Boolean).length;

  const linkCount = input.description.match(/https?:\/\//g)?.length ?? 0;
  const noveltyHits = countKeywordHits(text.toLowerCase(), NOVELTY_TERMS);

  let score = 0.44;
  if (wordCount >= 90 && wordCount <= 260) score += 0.22;
  else if (wordCount < 70) score -= 0.2;

  score += Math.min(noveltyHits * 0.04, 0.16);

  if (linkCount === 0) score -= 0.08;
  if (input.hasLiveDemo) score += 0.14;
  if (input.hasGithubRepo) score += 0.12;
  if (input.openSource) score += 0.08;

  return {
    factor: "Content Quality",
    score: clamp(score),
    detail:
      wordCount >= 90
        ? "Description has enough technical context for Hacker News readers to evaluate quickly."
        : "Description is too short to communicate implementation depth and user value."
  };
}

function timingScore(launchDateTimeIso: string): { factor: PredictionFactor; bestWindow: string } {
  const launchDate = parseISO(launchDateTimeIso);
  const hour = launchDate.getUTCHours();
  const day = launchDate.getUTCDay();

  const hourRate = HOUR_SUCCESS_RATE_UTC[hour] ?? 0.45;
  const dayRate = DAY_SUCCESS_MULTIPLIER[day] ?? 1;
  const score = clamp(hourRate * dayRate);

  const rankedHours = Object.entries(HOUR_SUCCESS_RATE_UTC)
    .map(([h, s]) => ({ hour: Number(h), score: s }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((entry) => `${entry.hour.toString().padStart(2, "0")}:00 UTC`)
    .join(" / ");

  return {
    factor: {
      factor: "Timing Fit",
      score,
      detail: `Top recent windows: ${rankedHours}.`
    },
    bestWindow: rankedHours
  };
}

function typeScore(projectType: ProjectType, teamSize: number): PredictionFactor {
  const typeMultiplier = PROJECT_TYPE_MULTIPLIER[projectType] ?? 0.96;
  let score = clamp(typeMultiplier - 0.05);

  if (teamSize <= 3) score += 0.08;
  if (teamSize >= 8) score -= 0.06;

  return {
    factor: "Audience Fit",
    score: clamp(score),
    detail:
      projectType === "developer-tool" || projectType === "open-source"
        ? "Project category aligns with categories that historically convert well on Show HN."
        : "Consider emphasizing technical depth to better match what Show HN readers upvote."
  };
}

function assembleSuggestions(factors: PredictionFactor[], input: PredictionInput, bestWindow: string) {
  const suggestions: string[] = [];

  const title = factors.find((item) => item.factor === "Title Strength");
  const content = factors.find((item) => item.factor === "Content Quality");
  const timing = factors.find((item) => item.factor === "Timing Fit");

  if (title && title.score < 0.7) {
    suggestions.push(
      "Rewrite the title to 45-75 characters, lead with concrete capability, and keep the \"Show HN:\" prefix."
    );
  }

  if (content && content.score < 0.72) {
    suggestions.push(
      "Add implementation details: stack decisions, constraints solved, and one measurable outcome users get in 5 minutes."
    );
  }

  if (!input.hasLiveDemo) {
    suggestions.push("Ship a live demo link before posting. Show HN posts with immediate try-it links consistently convert better.");
  }

  if (!input.hasGithubRepo && input.openSource) {
    suggestions.push("If this is open source, include the repository in your launch post so technical readers can inspect quality instantly.");
  }

  if (timing && timing.score < 0.63) {
    suggestions.push(`Current posting time is suboptimal. Shift launch closer to ${bestWindow}.`);
  }

  if (suggestions.length === 0) {
    suggestions.push(
      "Strong draft. Final pass: tighten first sentence to explain target user, pain point, and what changed versus existing tools."
    );
  }

  return suggestions.slice(0, 5);
}

export function predictShowHN(input: PredictionInput): PredictionResult {
  const title = titleScore(input.title);
  const content = contentScore(input);
  const timing = timingScore(input.launchDateTime);
  const audience = typeScore(input.projectType, input.teamSize);

  const weightedRaw =
    -1.35 + title.score * 2.1 + content.score * 2.0 + timing.factor.score * 1.65 + audience.score * 1.2;
  const probability = Math.round(clamp(sigmoid(weightedRaw), 0.02, 0.97) * 100);

  const confidenceBase = (title.score + content.score + timing.factor.score + audience.score) / 4;
  const confidence = Math.round(clamp(confidenceBase * 0.9 + 0.08, 0.1, 0.98) * 100);

  const verdict =
    probability >= 75
      ? "Very strong launch candidate"
      : probability >= 60
        ? "Competitive with optimization"
        : probability >= 45
          ? "Needs stronger packaging before launch"
          : "High risk of getting buried in /newest";

  const factorBreakdown = [title, content, timing.factor, audience].map((factor) => ({
    ...factor,
    score: Math.round(factor.score * 100)
  }));

  return {
    probability,
    confidence,
    verdict,
    bestPostingWindow: timing.bestWindow,
    factorBreakdown,
    suggestions: assembleSuggestions([title, content, timing.factor, audience], input, timing.bestWindow),
    modelVersion: "show-hn-launch-v1.3",
    generatedAt: format(new Date(), "yyyy-MM-dd HH:mm:ss 'UTC'")
  };
}
