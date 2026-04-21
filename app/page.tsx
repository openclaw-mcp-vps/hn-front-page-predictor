import Link from "next/link";
import { ArrowRight, BarChart3, Clock3, LineChart, Sparkles, Zap } from "lucide-react";
import { PricingCard } from "@/components/PricingCard";

const faqs = [
  {
    question: "How is this different from generic writing tools?",
    answer:
      "This model is tuned specifically for Show HN dynamics: title framing, technical credibility signals, and timing windows where early velocity compounds into front-page placement."
  },
  {
    question: "What does the score actually represent?",
    answer:
      "It is a calibrated probability estimate based on feature weighting from historical Show HN outcomes, then adjusted by your exact launch details like timing, demo readiness, and title quality."
  },
  {
    question: "Can this guarantee a front-page hit?",
    answer:
      "No model can guarantee ranking, but it can prevent avoidable mistakes that kill early traction. Most users improve score 10-25 points after two editing passes."
  },
  {
    question: "Who is this built for?",
    answer:
      "Solo founders and small dev teams launching developer tools, APIs, infra products, or technical side projects to Hacker News."
  }
];

export default function HomePage() {
  return (
    <main className="pb-20">
      <section className="mx-auto w-full max-w-6xl px-6 pt-10 sm:pt-14">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold tracking-wide text-[#9ecbff]">HN Front Page Predictor</p>
          <Link
            href="/predict"
            className="inline-flex items-center gap-2 rounded-xl border border-[#2f3a4d] bg-[#111826] px-4 py-2 text-sm font-medium text-[#d5dde5] hover:bg-[#162031]"
          >
            Open Predictor
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-14 grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#304460] bg-[#111826] px-3 py-1 text-xs font-semibold text-[#9ecbff]">
              <Sparkles className="size-3.5" />
              Predict if your Show HN will hit front page
            </p>
            <h1 className="mt-5 text-4xl font-bold leading-tight text-[#f0f6fc] sm:text-5xl">
              Don&apos;t launch blind. Score your Show HN draft before it gets buried in <span className="text-[#3fb950]">/newest</span>.
            </h1>
            <p className="prose-copy mt-5 max-w-2xl text-lg">
              One weak title or the wrong posting window can waste weeks of work. This predictor analyzes your launch details and gives you a probability score plus concrete fixes to improve your odds before you submit.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/predict"
                className="inline-flex items-center gap-2 rounded-xl bg-[#3fb950] px-5 py-3 text-sm font-semibold text-[#0d1117] hover:bg-[#46c957]"
              >
                Start Prediction
                <ArrowRight className="size-4" />
              </Link>
              <a
                href="#pricing"
                className="inline-flex items-center gap-2 rounded-xl border border-[#2f3a4d] bg-[#111826] px-5 py-3 text-sm font-semibold text-[#d5dde5] hover:bg-[#162031]"
              >
                View Pricing
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-[#2b3a4f] bg-[#111826]/95 p-6 shadow-[0_20px_60px_-32px_rgba(63,185,80,0.55)]">
            <p className="text-sm font-medium text-[#9ecbff]">What you get instantly</p>
            <div className="mt-5 space-y-4">
              <div className="rounded-xl border border-[#2f3a4d] bg-[#0d1117] p-4">
                <p className="text-xs uppercase tracking-wide text-[#8395a7]">Predicted front-page probability</p>
                <p className="mt-2 text-3xl font-semibold text-[#3fb950]">62% → 81%</p>
                <p className="mt-1 text-sm text-[#9ba9b4]">after title + timing optimization</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-[#2f3a4d] bg-[#0d1117] p-4">
                  <Clock3 className="size-4 text-[#9ecbff]" />
                  <p className="mt-2 text-sm font-medium">Best posting windows</p>
                  <p className="mt-1 text-xs text-[#8da0b3]">by UTC and launch day</p>
                </div>
                <div className="rounded-xl border border-[#2f3a4d] bg-[#0d1117] p-4">
                  <LineChart className="size-4 text-[#9ecbff]" />
                  <p className="mt-2 text-sm font-medium">Feature-level scorecard</p>
                  <p className="mt-1 text-xs text-[#8da0b3]">title, content, fit, traction</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-20 w-full max-w-6xl px-6">
        <h2 className="text-2xl font-semibold text-[#f0f6fc] sm:text-3xl">Why Show HN launches fail</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-[#2b3a4f] bg-[#111826]/90 p-5">
            <BarChart3 className="size-5 text-[#f2cc60]" />
            <h3 className="mt-3 text-lg font-semibold">Weak first impression</h3>
            <p className="mt-2 text-sm text-[#9ba9b4]">
              Vague titles don&apos;t earn clicks from power users scanning the feed. If nobody opens your post quickly, ranking stalls.
            </p>
          </article>
          <article className="rounded-2xl border border-[#2b3a4f] bg-[#111826]/90 p-5">
            <Clock3 className="size-5 text-[#f2cc60]" />
            <h3 className="mt-3 text-lg font-semibold">Bad timing</h3>
            <p className="mt-2 text-sm text-[#9ba9b4]">
              Even excellent projects die when posted in low-liquidity hours. Early momentum matters more than total quality.
            </p>
          </article>
          <article className="rounded-2xl border border-[#2b3a4f] bg-[#111826]/90 p-5">
            <Zap className="size-5 text-[#f2cc60]" />
            <h3 className="mt-3 text-lg font-semibold">No technical proof</h3>
            <p className="mt-2 text-sm text-[#9ba9b4]">
              HN rewards builders who show implementation depth. Missing demo/repo links reduce trust and upvotes.
            </p>
          </article>
        </div>
      </section>

      <section className="mx-auto mt-20 w-full max-w-6xl px-6">
        <h2 className="text-2xl font-semibold text-[#f0f6fc] sm:text-3xl">How the predictor helps</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-[#2b3a4f] bg-[#111826]/90 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#9ecbff]">Step 1</p>
            <h3 className="mt-2 text-lg font-semibold">Paste your launch draft</h3>
            <p className="mt-2 text-sm text-[#9ba9b4]">Title, description, project type, and planned posting time.</p>
          </div>
          <div className="rounded-2xl border border-[#2b3a4f] bg-[#111826]/90 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#9ecbff]">Step 2</p>
            <h3 className="mt-2 text-lg font-semibold">Model scores launch quality</h3>
            <p className="mt-2 text-sm text-[#9ba9b4]">You get front-page probability and factor-level diagnostics instantly.</p>
          </div>
          <div className="rounded-2xl border border-[#2b3a4f] bg-[#111826]/90 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#9ecbff]">Step 3</p>
            <h3 className="mt-2 text-lg font-semibold">Fix the weak spots</h3>
            <p className="mt-2 text-sm text-[#9ba9b4]">Use targeted suggestions to improve title clarity, timing, and credibility signals.</p>
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto mt-20 w-full max-w-6xl px-6">
        <h2 className="text-center text-2xl font-semibold text-[#f0f6fc] sm:text-3xl">Simple pricing for builders shipping fast</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-[#9ba9b4]">
          One plan, no setup friction. Use Stripe hosted checkout and unlock the predictor immediately after purchase.
        </p>
        <div className="mt-8">
          <PricingCard />
        </div>
      </section>

      <section className="mx-auto mt-20 w-full max-w-4xl px-6">
        <h2 className="text-2xl font-semibold text-[#f0f6fc] sm:text-3xl">FAQ</h2>
        <div className="mt-6 space-y-3">
          {faqs.map((faq) => (
            <article key={faq.question} className="rounded-2xl border border-[#2b3a4f] bg-[#111826]/90 p-5">
              <h3 className="text-base font-semibold text-[#dce5ee]">{faq.question}</h3>
              <p className="mt-2 text-sm text-[#9ba9b4]">{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 w-full max-w-6xl px-6">
        <div className="rounded-3xl border border-[#2b3a4f] bg-gradient-to-br from-[#111826] to-[#0f1520] p-8 text-center">
          <h2 className="text-2xl font-semibold text-[#f0f6fc] sm:text-3xl">Ship once. Launch with leverage.</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-[#9ba9b4]">
            You already did the hard part and built the product. Use the predictor to package it for the audience that can actually amplify it.
          </p>
          <Link
            href="/predict"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#3fb950] px-5 py-3 text-sm font-semibold text-[#0d1117] hover:bg-[#46c957]"
          >
            Analyze My Show HN
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
