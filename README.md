# GreenBase

NYC Local Law 97 (LL97) compliance command center for building owners. Enter a building name or NYC address to see whether it meets the 2024 and 2030 emissions limits, what fines it faces, and which retrofits and incentives could close the gap.

Live app: https://nyc-green-base.base44.app

## Features

- **Building search** by name or address, with demo buildings, plus manual entry for buildings not in the database
- **Compliance dashboard** with emissions vs. limit, annual fines (2024, 2030, 2035) and a GreenBase score
- **Pay the fine or fix it?** 16-year cost comparison with break-even
- **Retrofit planner** with toggleable upgrades, cost ranges, emissions cuts and payback
- **Incentive finder** for federal, state, city and utility programs
- **AI advisor** that writes a compliance strategy for a given building
- **Compliance agent** that investigates a building step by step with tools (compliance check, retrofit simulation, incentive lookup, peer benchmark) and recommends a plan; all figures come from the app's own calculations (`src/lib/complianceAgent.js`)
- **Compare buildings** and **NYC rankings** pages

## Tech stack

React 18, Vite, Tailwind CSS, shadcn/ui (Radix), Recharts, Framer Motion, React Router and TanStack Query. The backend (auth, data and the LLM integration) runs on [Base44](https://base44.com) through `@base44/sdk`.

## Run locally

```bash
npm install
```

Create a `.env.local` file in the project root:

```
VITE_BASE44_APP_ID=your_app_id
VITE_BASE44_APP_BASE_URL=your_backend_url
```

```bash
npm run dev
```

The app talks to a Base44 backend, so you need a Base44 app ID and base URL for the AI features and auth to work.

## Project structure

| Path | Purpose |
|---|---|
| `src/pages/` | Route pages (Home, Dashboard, Compare, Retrofits, Incentives, Rankings, auth) |
| `src/components/dashboard/` | Compliance banner, metric cards, fine charts, score, AI advisor |
| `src/components/retrofits/` | Retrofit cards, summary bar, AI recommendation |
| `src/components/incentives/` | Incentive cards |
| `src/components/search/` | Building search and manual entry form |
| `src/lib/` | LL97 limit and fine calculations, building context, app params |
| `base44/` | Base44 entity and app config |
