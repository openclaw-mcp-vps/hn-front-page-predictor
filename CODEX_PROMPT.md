# Build Task: hn-front-page-predictor

Build a complete, production-ready Next.js 15 App Router application.

PROJECT: hn-front-page-predictor
HEADLINE: Predict if your Show HN will hit front page
WHAT: None
WHY: None
WHO PAYS: None
NICHE: developer-tools
PRICE: $$9/mo

ARCHITECTURE SPEC:
A Next.js web app that analyzes Hacker News submission patterns and uses ML to predict front page success probability. Users paste their Show HN title/description, get a prediction score with improvement suggestions, and access historical analytics through a subscription model.

PLANNED FILES:
- app/page.tsx
- app/predict/page.tsx
- app/dashboard/page.tsx
- app/api/predict/route.ts
- app/api/webhooks/lemonsqueezy/route.ts
- app/api/auth/[...nextauth]/route.ts
- components/PredictionForm.tsx
- components/PredictionResult.tsx
- components/PricingCard.tsx
- lib/hn-analyzer.ts
- lib/ml-predictor.ts
- lib/database.ts
- lib/lemonsqueezy.ts

DEPENDENCIES: next, react, tailwindcss, next-auth, prisma, @prisma/client, lemonsqueezy.js, axios, cheerio, date-fns, recharts, lucide-react

REQUIREMENTS:
- Next.js 15 with App Router (app/ directory)
- TypeScript
- Tailwind CSS v4
- shadcn/ui components (npx shadcn@latest init, then add needed components)
- Dark theme ONLY — background #0d1117, no light mode
- Lemon Squeezy checkout overlay for payments
- Landing page that converts: hero, problem, solution, pricing, FAQ
- The actual tool/feature behind a paywall (cookie-based access after purchase)
- Mobile responsive
- SEO meta tags, Open Graph tags
- /api/health endpoint that returns {"status":"ok"}

ENVIRONMENT VARIABLES (create .env.example):
- NEXT_PUBLIC_LEMON_SQUEEZY_STORE_ID
- NEXT_PUBLIC_LEMON_SQUEEZY_PRODUCT_ID
- LEMON_SQUEEZY_WEBHOOK_SECRET

After creating all files:
1. Run: npm install
2. Run: npm run build
3. Fix any build errors
4. Verify the build succeeds with exit code 0

Do NOT use placeholder text. Write real, helpful content for the landing page
and the tool itself. The tool should actually work and provide value.


PREVIOUS ATTEMPT FAILED WITH:
Codex exited 1: Reading additional input from stdin...
OpenAI Codex v0.121.0 (research preview)
--------
workdir: /tmp/openclaw-builds/hn-front-page-predictor
model: gpt-5.3-codex
provider: openai
approval: never
sandbox: danger-full-access
reasoning effort: none
reasoning summaries: none
session id: 019d94e9-e022-7a60-98aa-703a14b3ce54
--------
user
# Build Task: hn-front-page-predictor

Build a complete, production-ready Next.js 15 App Router application.

PROJECT: hn-front-page-predictor
HEADLINE: Predict if
Please fix the above errors and regenerate.