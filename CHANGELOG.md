# Changelog

## 2026-03-01

- Add the initial React + TypeScript token analytics dashboard with overview, sessions, dimensions, and archives views.
- Add local JSON ingestion, schema validation, normalization, and archive lazy loading for `token-performance-tuning` exports.
- Fix runtime parsing against the current export shape so the dashboard renders instead of failing on load.
- Add a minimal typed analytics layer for SPA pageviews, navigation clicks, filter changes, session selection, and archive month selection.
- Add baseline tests for schema parsing and normalization behavior.
