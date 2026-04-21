import Link from "next/link";
import { cookies } from "next/headers";
import { Lock, ShieldCheck } from "lucide-react";
import { PredictionForm } from "@/components/PredictionForm";
import { PricingCard } from "@/components/PricingCard";
import { hasAccessCookie, ACCESS_COOKIE_NAME } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Predictor",
  description: "Score your Show HN launch probability with model-driven recommendations."
};

type PredictPageProps = {
  searchParams: Promise<{
    claim?: string;
  }>;
};

function claimMessage(claim: string | undefined) {
  if (claim === "success") return "Access unlocked. You can now run predictions.";
  if (claim === "invalid-email") return "Use the same purchase email used at Stripe checkout.";
  if (claim === "not-found") return "No purchase found for that email yet. If you just paid, wait 10-20 seconds and retry.";
  return null;
}

export default async function PredictPage({ searchParams }: PredictPageProps) {
  const cookieStore = await cookies();
  const params = await searchParams;
  const unlocked = hasAccessCookie(cookieStore.get(ACCESS_COOKIE_NAME)?.value);
  const message = claimMessage(params.claim);

  return (
    <main className="mx-auto w-full max-w-5xl px-6 pb-20 pt-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#f0f6fc] sm:text-4xl">Show HN Front-Page Predictor</h1>
          <p className="mt-2 text-sm text-[#9ba9b4]">
            Score your launch before posting and fix the factors that suppress early HN traction.
          </p>
        </div>
        <Link
          href="/"
          className="rounded-xl border border-[#2f3a4d] bg-[#111826] px-4 py-2 text-sm text-[#d5dde5] hover:bg-[#162031]"
        >
          Back Home
        </Link>
      </div>

      {message ? (
        <p
          className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
            params.claim === "success"
              ? "border-[#295c39] bg-[#13281c] text-[#9de2aa]"
              : "border-[#5b3535] bg-[#2a1a1a] text-[#ffc1c1]"
          }`}
        >
          {message}
        </p>
      ) : null}

      {unlocked ? (
        <PredictionForm />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-[#2b3a4f] bg-[#111826]/95">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Lock className="size-5 text-[#f2cc60]" />
                Premium Tool Locked
              </CardTitle>
              <CardDescription>
                The prediction engine is available to subscribers. Purchase access, then unlock with your Stripe checkout email.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form action="/api/access/claim" method="post" className="space-y-3">
                <label htmlFor="email" className="block text-sm font-medium text-[#d5dde5]">
                  Purchase Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@company.com"
                  className="h-11 w-full rounded-xl border border-[#2f3a4d] bg-[#0d1117] px-3 text-sm text-[#e6edf3] placeholder:text-[#718096] focus:outline-none focus:ring-2 focus:ring-[#3fb950]"
                />
                <button
                  type="submit"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-[#3fb950] px-5 text-sm font-semibold text-[#0d1117] hover:bg-[#46c957]"
                >
                  Unlock Predictor
                </button>
              </form>
              <div className="rounded-xl border border-[#2f3a4d] bg-[#0d1117] p-4 text-sm text-[#9ba9b4]">
                <p className="flex items-center gap-2 font-medium text-[#dce5ee]">
                  <ShieldCheck className="size-4 text-[#9ecbff]" />
                  Access control
                </p>
                <p className="mt-2">
                  After verification, we set a secure cookie on this browser so you can use the tool without logging in on every visit.
                </p>
              </div>
            </CardContent>
          </Card>

          <PricingCard />
        </div>
      )}
    </main>
  );
}
