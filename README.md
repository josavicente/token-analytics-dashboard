# token-analytics-dashboard

Client-side React + TypeScript dashboard for visualizing the JSON exports produced by the `token-performance-tuning` workflow.

## Local development

1. Keep the latest exported JSON artifacts in `src/assets/data/`.
2. Run `npm install`.
3. Run `npm run dev`.

The app expects at least:

- `src/assets/data/token-dashboard-data.json`
- `src/assets/data/token-history-index.json`
- `src/assets/data/token-history/<month>.json`

## Commands

- `npm run dev` - Start the local Vite dev server.
- `npm run build` - Type-check and create a production build.
- `npm run test` - Run the Vitest suite.

## Notes

- Archive month files are loaded on demand only when the user opens a month.
- The app includes a minimal typed analytics layer for SPA pageviews and key UI interactions, emitted as browser `CustomEvent`s named `token-dashboard-analytics`.
