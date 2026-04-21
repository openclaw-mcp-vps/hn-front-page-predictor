export type ProjectType =
  | "developer-tool"
  | "open-source"
  | "ai-product"
  | "infra"
  | "data"
  | "productivity"
  | "other";

export interface PredictionFactor {
  factor: string;
  score: number;
  detail: string;
}

export interface PredictionResult {
  probability: number;
  confidence: number;
  verdict: string;
  bestPostingWindow: string;
  factorBreakdown: PredictionFactor[];
  suggestions: string[];
  modelVersion: string;
  generatedAt: string;
}

export interface PredictApiSuccess {
  success: true;
  result: PredictionResult;
}

export interface PredictApiError {
  success: false;
  error: string;
}

export type PredictApiResponse = PredictApiSuccess | PredictApiError;
