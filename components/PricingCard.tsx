import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  "Unlimited Show HN score predictions",
  "Best posting-time windows by timezone",
  "Title rewrite suggestions from model factors",
  "Content readiness checks for technical audiences",
  "Launch-day checklist tuned for Hacker News"
];

export function PricingCard() {
  return (
    <Card className="mx-auto max-w-md border-[#2b3a4f] bg-[#111826]/95 shadow-[0_20px_60px_-30px_rgba(63,185,80,0.35)]">
      <CardHeader>
        <p className="inline-flex w-fit items-center rounded-full border border-[#335068] px-3 py-1 text-xs font-medium text-[#9bc7ff]">
          Developer Tools Plan
        </p>
        <CardTitle className="mt-2 text-3xl">$9<span className="text-base text-[#9ba9b4]">/month</span></CardTitle>
        <CardDescription>
          Built for solo founders shipping dev tools, APIs, and side projects who want a real chance at front-page distribution.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {features.map((feature) => (
          <div key={feature} className="flex items-start gap-2 text-sm text-[#d5dde5]">
            <CheckCircle2 className="mt-0.5 size-4 text-[#3fb950]" />
            <span>{feature}</span>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <a
          href={process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK ?? "#"}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#3fb950] px-4 py-3 text-sm font-semibold text-[#0d1117] transition hover:bg-[#46c957]"
        >
          Buy Access on Stripe
          <ArrowRight className="size-4" />
        </a>
      </CardFooter>
    </Card>
  );
}
