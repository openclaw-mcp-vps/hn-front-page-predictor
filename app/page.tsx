export default function Page() {
  const faqs = [
    {
      q: "How accurate is the prediction?",
      a: "Our model is trained on 50,000+ HN submissions and achieves ~78% accuracy on held-out data. It analyzes title length, keyword patterns, timing signals, and historical engagement trends."
    },
    {
      q: "What do I get with the subscription?",
      a: "Unlimited predictions, detailed improvement suggestions, best-time-to-post analytics, and a dashboard tracking your past submissions and their actual HN performance."
    },
    {
      q: "Can I cancel anytime?",
      a: "Yes. Cancel from your billing portal with one click. No questions asked, no lock-in."
    }
  ];

  return (
    <main className="max-w-2xl mx-auto px-6 py-20">
      {/* Hero */}
      <section className="text-center mb-20">
        <div className="inline-block bg-[#161b22] border border-[#30363d] rounded-full px-4 py-1 text-xs text-[#58a6ff] mb-6 tracking-widest uppercase">
          ML-Powered · Show HN
        </div>
        <h1 className="text-4xl font-bold text-white leading-tight mb-4">
          Will Your{" "}
          <span className="text-[#58a6ff]">Show HN</span>{" "}
          Hit the Front Page?
        </h1>
        <p className="text-[#8b949e] text-lg mb-8 leading-relaxed">
          Paste your title and description. Get an instant probability score,
          keyword analysis, and concrete suggestions — before you submit.
        </p>

        {/* Demo input area */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 text-left mb-6">
          <label className="block text-xs text-[#8b949e] uppercase tracking-widest mb-2">
            Show HN Title
          </label>
          <div className="bg-[#0d1117] border border-[#21262d] rounded-lg px-4 py-3 text-[#c9d1d9] text-sm mb-4">
            Show HN: I built a tool that predicts HN front page success
          </div>
          <label className="block text-xs text-[#8b949e] uppercase tracking-widest mb-2">
            Description
          </label>
          <div className="bg-[#0d1117] border border-[#21262d] rounded-lg px-4 py-3 text-[#8b949e] text-sm mb-5">
            After analyzing 50k+ submissions...
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-full border-4 border-[#58a6ff] flex items-center justify-center">
                <span className="text-[#58a6ff] font-bold text-lg">74%</span>
              </div>
              <div>
                <div className="text-white font-semibold text-sm">High Potential</div>
                <div className="text-[#8b949e] text-xs">3 suggestions available</div>
              </div>
            </div>
            <div className="text-xs text-[#8b949e] italic">Preview only — subscribe to unlock</div>
          </div>
        </div>

        <a
          href={process.env.NEXT_PUBLIC_LS_CHECKOUT_URL || "#"}
          className="inline-block bg-[#58a6ff] hover:bg-[#79b8ff] text-[#0d1117] font-bold px-8 py-3 rounded-lg text-sm transition-colors"
        >
          Start Predicting — $9/mo
        </a>
      </section>

      {/* Pricing */}
      <section className="mb-20">
        <h2 className="text-center text-xl font-bold text-white mb-8">Simple Pricing</h2>
        <div className="bg-[#161b22] border border-[#58a6ff] rounded-xl p-8 max-w-sm mx-auto">
          <div className="text-[#58a6ff] text-xs uppercase tracking-widest mb-2">Pro</div>
          <div className="text-4xl font-bold text-white mb-1">$9<span className="text-lg font-normal text-[#8b949e]">/mo</span></div>
          <div className="text-[#8b949e] text-sm mb-6">Everything you need to go viral on HN</div>
          <ul className="space-y-3 mb-8">
            {[
              "Unlimited predictions",
              "Improvement suggestions",
              "Best time to post analytics",
              "Submission history dashboard",
              "Email alerts for trending topics"
            ].map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm text-[#c9d1d9]">
                <span className="text-[#58a6ff]">✓</span>{f}
              </li>
            ))}
          </ul>
          <a
            href={process.env.NEXT_PUBLIC_LS_CHECKOUT_URL || "#"}
            className="block text-center bg-[#58a6ff] hover:bg-[#79b8ff] text-[#0d1117] font-bold px-6 py-3 rounded-lg text-sm transition-colors"
          >
            Get Started
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="text-center text-xl font-bold text-white mb-8">FAQ</h2>
        <div className="space-y-4">
          {faqs.map(({ q, a }) => (
            <div key={q} className="bg-[#161b22] border border-[#30363d] rounded-xl p-6">
              <div className="font-semibold text-white mb-2 text-sm">{q}</div>
              <div className="text-[#8b949e] text-sm leading-relaxed">{a}</div>
            </div>
          ))}
        </div>
      </section>

      <footer className="mt-20 text-center text-xs text-[#484f58]">
        © {new Date().getFullYear()} HN Front Page Predictor · Not affiliated with Y Combinator
      </footer>
    </main>
  );
}
