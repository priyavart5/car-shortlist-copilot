# car-shortlist-copilot

Car shortlist MVP for a CarDekho-style take-home.

## What this project includes

- Next.js App Router setup with TypeScript
- local `cars.json` dataset with 50+ India-relevant cars
- shared car and preference types
- rule-based recommendation engine
- `POST /api/recommend` API route
- simple UI for collecting preferences and showing a shortlist
- recent shortlists stored in browser `localStorage`

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Optional AI explanations

If you want richer recommendation explanations, add either of these env vars:

```bash
OPENAI_API_KEY=your_key_here
# or
OPEN_AI_API=your_key_here
```

Without an API key, the app still works normally and uses deterministic explanations only.

## Project structure

```txt
src/
  app/
    api/recommend/route.ts
    globals.css
    layout.tsx
    page.tsx
  components/
    RecommendationForm.tsx
    RecentShortlists.tsx
    ResultsPanel.tsx
  data/
    cars.json
  lib/
    constants.ts
    recommendation/
      index.ts
      score.ts
  types/
    car.ts
```
