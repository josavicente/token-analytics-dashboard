# Task List: Token Analytics Dashboard

## Relevant Files

- `package.json` - Defines the React, TypeScript, Vite, Visx, routing, validation, and testing dependencies plus project scripts.
- `.gitignore` - Prevents local build artifacts and dependencies from polluting the repository.
- `tsconfig.json` - Sets the TypeScript compiler rules for the application and shared types.
- `vite.config.ts` - Configures the Vite build, dev server, and asset handling for local JSON files.
- `index.html` - Hosts the application root element for the client-only dashboard.
- `src/vite-env.d.ts` - Provides Vite's client-side type declarations.
- `src/main.tsx` - Application entry point that mounts React and app-wide providers.
- `src/App.tsx` - Top-level app shell and route wiring for the dashboard views.
- `src/styles/global.css` - Global design tokens, layout primitives, and responsive baseline styles.
- `src/router.tsx` - Central route definitions for Overview, Sessions, Dimensions, and Archives.
- `src/lib/data/types.ts` - Canonical TypeScript types for the token analytics export schema.
- `src/lib/data/schema.ts` - Runtime schema validation for the summary, archive index, and monthly archive JSON files.
- `src/lib/data/loaders.ts` - File loading utilities for summary and on-demand archive JSON reads.
- `src/lib/data/normalize.ts` - Converts raw JSON payloads into chart-ready models and consolidated project aggregates.
- `src/lib/data/selectors.ts` - Reusable derivations for KPIs, rankings, and filtered views.
- `src/lib/formatters.ts` - Shared formatting helpers for tokens, dates, percentages, and chart labels.
- `src/components/layout/AppShell.tsx` - Shared application shell, navigation, and top-level layout.
- `src/components/charts/` - Shared chart wrappers and reusable Visx chart components.
- `src/components/states/` - Loading, empty, validation error, and partial-data state components.
- `src/components/filters/` - Filter controls for insight severity, suggestion category, and archive month selection.
- `src/features/overview/OverviewPage.tsx` - Overview dashboard page with KPI cards and time-series charts.
- `src/features/sessions/SessionsPage.tsx` - Session rankings and browseable session list page.
- `src/features/sessions/SessionDetailPanel.tsx` - Detailed inspection panel for a selected session.
- `src/features/dimensions/DimensionsPage.tsx` - Aggregated project, skill, automation, and agent views.
- `src/features/archives/ArchivesPage.tsx` - On-demand monthly archive browsing and archive-specific charts.
- `src/features/insights/InsightsPanel.tsx` - Filterable rendering of global and session-level insights and suggestions.
- `src/assets/data/` - Local folder where the MVP JSON artifacts will be copied for the dashboard to consume.
- `src/test/` or colocated `*.test.ts(x)` files - Unit and component tests for loaders, normalizers, selectors, and core UI flows.

### Notes

- Unit tests should live alongside the code they test where practical, with shared utility tests grouped under `src/test/` only when colocation is noisy.
- Prefer Vitest for this Vite-based project; once configured, use `npm run test` for the full suite and `npm run test -- <path>` for focused runs.
- Validate the implementation against real copies of `token-dashboard-data.json`, `token-history-index.json`, and at least one monthly archive file to catch schema edge cases early.
- Keep archive loading lazy in both implementation and testing so the MVP matches the agreed behavior.
- The repo is currently empty, so the first implementation pass will establish the project conventions that later tasks should follow consistently.

## Tasks

- [x] 1.0 Bootstrap the frontend application foundation
  - [x] 1.1 Initialize the project as a Vite-based React + TypeScript application.
  - [x] 1.2 Add core dependencies for routing, schema validation, charting with Visx, and testing.
  - [x] 1.3 Create the base source structure for app shell, data layer, features, components, and assets.
  - [x] 1.4 Set up the root application entry point, route container, and global providers for a client-only app.
  - [x] 1.5 Establish the initial visual system, including global styles, layout primitives, and responsive breakpoints.

- [x] 2.0 Build the data ingestion, validation, and normalization layer
  - [x] 2.1 Define TypeScript types that model the current summary, archive index, and monthly archive JSON payloads.
  - [x] 2.2 Implement runtime schema validation for all supported JSON artifacts before UI consumption.
  - [x] 2.3 Implement client-side loaders for the summary dataset and archive index from the local project data folder.
  - [x] 2.4 Implement on-demand loaders for monthly archive files referenced by the archive index.
  - [x] 2.5 Build normalization utilities for nullable `daily` metrics, chart-safe defaults, and archive-aware partial-data handling.
  - [x] 2.6 Build aggregation utilities that preserve raw `project_path` groupings while also consolidating by `project_name`.
  - [x] 2.7 Create shared selectors for KPI cards, top rankings, session thresholds, and trend-linked chart datasets.

- [x] 3.0 Implement the core dashboard views and chart components
  - [x] 3.1 Build the shared app shell with navigation for Overview, Sessions, Dimensions, and Archives.
  - [x] 3.2 Implement the Overview page with top-level KPI cards and daily token usage charts.
  - [x] 3.3 Implement the context-spike visualization using the best available daily spike metric.
  - [x] 3.4 Implement the Dimensions page with comparative visualizations for projects, skills, automations, and agent sources.
  - [x] 3.5 Implement the Sessions page with ranked lists for highest-cost sessions and largest context spikes.
  - [x] 3.6 Create reusable Visx chart components and shared tooltip/legend behavior across pages.
  - [x] 3.7 Ensure all primary dashboard views work well on desktop and mobile layouts.

- [x] 4.0 Implement inspection, filtering, and archive drill-down workflows
  - [x] 4.1 Add a session detail panel or view that shows metadata, token totals, skill mentions, insights, and suggestions for the selected session.
  - [x] 4.2 Add filter controls for `insights` by severity and scope.
  - [x] 4.3 Add filter controls for `suggestions` by category and priority.
  - [x] 4.4 Present `trend_insights` alongside the related daily chart dates so trend events are explorable.
  - [x] 4.5 Build the Archives page with archive month selection driven by the archive index.
  - [x] 4.6 Load monthly archive JSON files only when the user selects a month and render archive-specific summaries without preloading all history.
  - [x] 4.7 Clearly label archived or partial datasets anywhere metrics are missing or not directly comparable with the active summary.

- [x] 5.0 Harden the MVP for usability and delivery
  - [x] 5.1 Add loading, empty, and validation error states for summary data, archive index data, and monthly archive data.
  - [x] 5.2 Add guardrails so malformed or incomplete JSON cannot crash the UI.
  - [x] 5.3 Add tests for schema validation, normalization edge cases, selector outputs, and archive lazy-loading behavior.
  - [x] 5.4 Verify the dashboard end-to-end against the current real export artifacts and fix mismatches found during manual validation.
  - [x] 5.5 Review the architecture to ensure new dimensions or future hosted JSON endpoints can be added without major refactors.
