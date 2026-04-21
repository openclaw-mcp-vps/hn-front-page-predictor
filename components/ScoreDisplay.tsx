import { AlertTriangle, Clock3, Sparkles, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { PredictionResult } from "@/lib/types";

interface ScoreDisplayProps {
  result: PredictionResult;
}

function getProbabilityTone(probability: number) {
  if (probability >= 75) return "text-[#3fb950]";
  if (probability >= 60) return "text-[#9ecbff]";
  if (probability >= 45) return "text-[#f2cc60]";
  return "text-[#f85149]";
}

export function ScoreDisplay({ result }: ScoreDisplayProps) {
  return (
    <div className="space-y-6">
      <Card className="border-[#2b3a4f] bg-[#111826]/95">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Target className="size-5 text-[#3fb950]" />
            Prediction Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-[#2f3a4d] bg-[#0d1117] p-4">
              <p className="text-xs uppercase tracking-wide text-[#8da0b3]">Front-page probability</p>
              <p className={`mt-2 text-4xl font-bold ${getProbabilityTone(result.probability)}`}>{result.probability}%</p>
              <p className="mt-2 text-sm text-[#9ba9b4]">{result.verdict}</p>
            </div>
            <div className="rounded-xl border border-[#2f3a4d] bg-[#0d1117] p-4">
              <p className="text-xs uppercase tracking-wide text-[#8da0b3]">Model confidence</p>
              <p className="mt-2 text-4xl font-bold text-[#d5dde5]">{result.confidence}%</p>
              <p className="mt-2 text-sm text-[#9ba9b4]">Model: {result.modelVersion}</p>
            </div>
          </div>

          <div className="space-y-2 rounded-xl border border-[#2f3a4d] bg-[#0d1117] p-4">
            <p className="flex items-center gap-2 text-sm font-medium text-[#d5dde5]">
              <Clock3 className="size-4 text-[#9ecbff]" />
              Best posting window
            </p>
            <p className="text-sm text-[#9ba9b4]">{result.bestPostingWindow}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-[#2b3a4f] bg-[#111826]/95">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Factor Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {result.factorBreakdown.map((factor) => (
            <div key={factor.factor} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-[#d5dde5]">{factor.factor}</span>
                <span className="text-[#9ecbff]">{factor.score}%</span>
              </div>
              <Progress value={factor.score} />
              <p className="text-xs text-[#8da0b3]">{factor.detail}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-[#2b3a4f] bg-[#111826]/95">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="size-4 text-[#3fb950]" />
            Actionable Improvements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {result.suggestions.map((suggestion) => (
              <li key={suggestion} className="flex items-start gap-2 text-sm text-[#d5dde5]">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-[#f2cc60]" />
                {suggestion}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-[#73879a]">Generated at {result.generatedAt}</p>
        </CardContent>
      </Card>
    </div>
  );
}
