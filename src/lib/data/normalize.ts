import type {
  AggregateDimension,
  DailyRow,
  DashboardSummary,
  NormalizedDailyPoint,
  SessionRecord,
} from "./types";

function resolveNumber(value: number | null | undefined): number {
  return value ?? 0;
}

export function normalizeDailyRows(rows: DailyRow[]): NormalizedDailyPoint[] {
  return rows.map((row) => {
    const finalTotalTokens = resolveNumber(row.final_total_tokens ?? row.avg_total_tokens);
    const inputTokens = resolveNumber(row.final_input_tokens ?? row.total_input_tokens);
    const outputTokens = resolveNumber(row.final_output_tokens ?? row.total_output_tokens);
    const spikeTokens = resolveNumber(row.max_single_turn_input_tokens);
    const totalFunctionCalls = resolveNumber(row.total_function_calls);
    const isPartial = row.final_total_tokens == null || row.final_input_tokens == null || row.final_output_tokens == null;

    return {
      date: row.date,
      finalTotalTokens,
      inputTokens,
      outputTokens,
      spikeTokens,
      sessionCount: row.session_count,
      totalFunctionCalls,
      isPartial,
    };
  });
}

export function consolidateProjects(projects: AggregateDimension[]): AggregateDimension[] {
  const grouped = new Map<string, AggregateDimension>();

  for (const project of projects) {
    const key = project.project_name ?? "Unknown project";
    const current = grouped.get(key);

    if (!current) {
      grouped.set(key, { ...project, project_name: key });
      continue;
    }

    grouped.set(key, {
      ...current,
      final_input_tokens: current.final_input_tokens + project.final_input_tokens,
      final_output_tokens: current.final_output_tokens + project.final_output_tokens,
      final_reasoning_output_tokens:
        current.final_reasoning_output_tokens + project.final_reasoning_output_tokens,
      final_total_tokens: current.final_total_tokens + project.final_total_tokens,
      max_single_turn_input_tokens: Math.max(
        current.max_single_turn_input_tokens,
        project.max_single_turn_input_tokens,
      ),
      max_single_turn_total_tokens: Math.max(
        current.max_single_turn_total_tokens,
        project.max_single_turn_total_tokens,
      ),
      session_count: current.session_count + project.session_count,
      total_function_calls: current.total_function_calls + project.total_function_calls,
      project_path: current.project_path ?? project.project_path,
    });
  }

  return [...grouped.values()].sort((left, right) => right.final_total_tokens - left.final_total_tokens);
}

export function sortSessionsByCost(sessions: SessionRecord[]): SessionRecord[] {
  return [...sessions].sort((left, right) => right.final_total_tokens - left.final_total_tokens);
}

export function sortSessionsBySpike(sessions: SessionRecord[]): SessionRecord[] {
  return [...sessions].sort((left, right) => right.max_last_input_tokens - left.max_last_input_tokens);
}

export function deriveSummary(summary: DashboardSummary) {
  return {
    daily: normalizeDailyRows(summary.daily),
    projectsByName: consolidateProjects(summary.projects),
    sessionsByCost: sortSessionsByCost(summary.sessions),
    sessionsBySpike: sortSessionsBySpike(summary.sessions),
  };
}
