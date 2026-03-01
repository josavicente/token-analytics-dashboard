import type { AggregateDimension, DashboardSummary, KpiMetric, SessionRecord } from "./types";
import { deriveSummary } from "./normalize";

export function buildKpis(summary: DashboardSummary): KpiMetric[] {
  return [
    {
      label: "Total Tokens",
      value: summary.totals.final_total_tokens,
      footnote: `${summary.session_count} sessions analyzed`,
    },
    {
      label: "Input Tokens",
      value: summary.totals.final_input_tokens,
      footnote: "Largest share of total consumption",
    },
    {
      label: "Output Tokens",
      value: summary.totals.final_output_tokens,
      footnote: `${summary.totals.final_reasoning_output_tokens} reasoning tokens`,
    },
    {
      label: "Context Spike",
      value: summary.totals.max_single_turn_input_tokens,
      footnote: "Largest single-turn input payload",
    },
    {
      label: "Tool Calls",
      value: summary.totals.total_function_calls,
      footnote: `${summary.skipped_existing_sessions} sessions skipped in latest export`,
    },
    {
      label: "Archives",
      value: summary.archived_session_count,
      footnote: `${summary.summary_retention_days} day retention window`,
    },
  ];
}

export function topRows<T extends AggregateDimension>(rows: T[], limit = 6): T[] {
  return [...rows]
    .sort((left, right) => right.final_total_tokens - left.final_total_tokens)
    .slice(0, limit);
}

export function getTopCostSessions(summary: DashboardSummary, limit = 10): SessionRecord[] {
  return deriveSummary(summary).sessionsByCost.slice(0, limit);
}

export function getTopSpikeSessions(summary: DashboardSummary, limit = 10): SessionRecord[] {
  return deriveSummary(summary).sessionsBySpike.slice(0, limit);
}
