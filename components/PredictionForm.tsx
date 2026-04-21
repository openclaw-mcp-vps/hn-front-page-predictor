"use client";

import { useMemo, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScoreDisplay } from "@/components/ScoreDisplay";
import type { PredictApiResponse, PredictionResult, ProjectType } from "@/lib/types";

const projectTypes: { value: ProjectType; label: string }[] = [
  { value: "developer-tool", label: "Developer Tool" },
  { value: "open-source", label: "Open Source Project" },
  { value: "ai-product", label: "AI Product" },
  { value: "infra", label: "Infrastructure" },
  { value: "data", label: "Data / Analytics" },
  { value: "productivity", label: "Productivity App" },
  { value: "other", label: "Other" }
];

const formSchema = z.object({
  title: z.string().min(12, "Title should be at least 12 characters."),
  description: z.string().min(80, "Description should be at least 80 characters."),
  launchDateTime: z.string().min(1, "Choose a launch date and time."),
  teamSize: z.coerce.number().int().min(1).max(20)
});

export function PredictionForm() {
  const [title, setTitle] = useState("Show HN: I built a terminal-native SQL playground with query plan visualizations");
  const [description, setDescription] = useState(
    "I built this because debugging slow SQL in production is painful. The app connects to Postgres read replicas, profiles query plans, and suggests index changes with side-by-side benchmarks. It supports local Docker and cloud databases."
  );
  const [projectType, setProjectType] = useState<ProjectType>("developer-tool");
  const [launchDateTime, setLaunchDateTime] = useState("");
  const [teamSize, setTeamSize] = useState(1);
  const [hasGithubRepo, setHasGithubRepo] = useState(true);
  const [hasLiveDemo, setHasLiveDemo] = useState(true);
  const [openSource, setOpenSource] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);

  const inputLength = useMemo(() => description.trim().split(/\s+/).filter(Boolean).length, [description]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const validation = formSchema.safeParse({
      title,
      description,
      launchDateTime,
      teamSize
    });

    if (!validation.success) {
      setError(validation.error.issues[0]?.message ?? "Please review your input.");
      return;
    }

    const launchDate = new Date(launchDateTime);
    if (Number.isNaN(launchDate.getTime())) {
      setError("Launch date is not valid.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          description,
          projectType,
          launchDateTime: launchDate.toISOString(),
          hasGithubRepo,
          hasLiveDemo,
          openSource,
          teamSize
        })
      });

      const payload = (await response.json()) as PredictApiResponse;
      if (!response.ok || !payload.success) {
        setError(payload.success ? "Prediction failed." : payload.error);
        return;
      }

      setResult(payload.result);
    } catch {
      setError("Prediction failed. Try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      <Card className="border-[#2b3a4f] bg-[#111826]/95">
        <CardHeader>
          <CardTitle className="text-2xl">Analyze Your Show HN Draft</CardTitle>
          <CardDescription>
            Enter the exact post you plan to submit. You will get a score plus clear fixes before launch.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="title">Show HN Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Show HN: ..."
                maxLength={140}
                required
              />
              <p className="text-xs text-[#8da0b3]">{title.length}/140 characters</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Launch Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="What did you build, who is it for, and why is it different?"
                required
              />
              <p className="text-xs text-[#8da0b3]">{inputLength} words</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="projectType">Project Type</Label>
                <select
                  id="projectType"
                  className="h-11 w-full rounded-xl border border-[#2f3a4d] bg-[#0d1117] px-3 text-sm text-[#e6edf3] focus:outline-none focus:ring-2 focus:ring-[#3fb950]"
                  value={projectType}
                  onChange={(event) => setProjectType(event.target.value as ProjectType)}
                >
                  {projectTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="launchDateTime">Planned Post Time</Label>
                <Input
                  id="launchDateTime"
                  type="datetime-local"
                  value={launchDateTime}
                  onChange={(event) => setLaunchDateTime(event.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="teamSize">Team Size</Label>
                <Input
                  id="teamSize"
                  type="number"
                  min={1}
                  max={20}
                  value={teamSize}
                  onChange={(event) => setTeamSize(Number(event.target.value))}
                />
              </div>
              <div className="space-y-2 rounded-xl border border-[#2f3a4d] bg-[#0d1117] p-3">
                <Label className="mb-2 block">Launch Signals</Label>
                <div className="space-y-2 text-sm text-[#d5dde5]">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={hasLiveDemo}
                      onChange={(event) => setHasLiveDemo(event.target.checked)}
                      className="size-4 rounded border-[#2f3a4d] bg-[#111826]"
                    />
                    Live demo is ready
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={hasGithubRepo}
                      onChange={(event) => setHasGithubRepo(event.target.checked)}
                      className="size-4 rounded border-[#2f3a4d] bg-[#111826]"
                    />
                    GitHub repository is public
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={openSource}
                      onChange={(event) => setOpenSource(event.target.checked)}
                      className="size-4 rounded border-[#2f3a4d] bg-[#111826]"
                    />
                    Open source positioning
                  </label>
                </div>
              </div>
            </div>

            {error ? <p className="rounded-lg border border-[#5a2d2d] bg-[#2a1a1a] px-3 py-2 text-sm text-[#ffb4b4]">{error}</p> : null}

            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Running prediction...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 size-4" />
                  Predict Front-Page Probability
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result ? <ScoreDisplay result={result} /> : null}
    </div>
  );
}
