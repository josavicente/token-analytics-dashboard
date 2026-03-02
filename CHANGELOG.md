# Changelog

## 2026-03-02

- Refine the dashboard visual system with stronger contrast, softer chart lines, and updated layout spacing across the main views.
- Change the Overview screen to use scoped windows (`Last week`, `Last 2 weeks`, `Last month`, `All data`) plus separate `Overview`, `Signals`, and `Trends` tabs.
- Redesign signal cards to bundle insights with related suggestions, prompt tips, context modals, and icon-led alert headers instead of the previous gauge-style header.
- Improve signal filtering clarity and make filter results align with the rendered signal cards.
- Add typed analytics events for overview scope changes and main overview tab changes.
- Add dashboard screenshots to the README for the Overview, Sessions, Dimensions, and Archives views.

## 2026-03-01

- Add the initial React + TypeScript token analytics dashboard with overview, sessions, dimensions, and archives views.
- Add local JSON ingestion, schema validation, normalization, and archive lazy loading for `token-performance-tuning` exports.
- Fix runtime parsing against the current export shape so the dashboard renders instead of failing on load.
- Add a minimal typed analytics layer for SPA pageviews, navigation clicks, filter changes, session selection, and archive month selection.
- Add baseline tests for schema parsing and normalization behavior.
- Improve the README with user-friendly setup guidance, data format explanations, architecture notes, and troubleshooting.
