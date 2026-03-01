import { z } from "zod";

const insightSchema = z
  .object({
    message: z.string(),
    metric: z.number().nullish(),
    scope: z.string().optional(),
    severity: z.string(),
    type: z.string(),
    owner: z.string().nullish(),
  })
  .passthrough();

const trendInsightSchema = z
  .object({
    date: z.string(),
    message: z.string(),
    severity: z.string(),
    type: z.string(),
    delta_ratio: z.number().nullish(),
    delta_tokens: z.number().nullish(),
  })
  .passthrough();

const suggestionSchema = z
  .object({
    category: z.string(),
    message: z.string(),
    priority: z.string(),
    scope: z.string(),
    type: z.string(),
  })
  .passthrough();

const dailyRowSchema = z
  .object({
    date: z.string(),
    session_count: z.number(),
    final_input_tokens: z.number().nullish(),
    final_output_tokens: z.number().nullish(),
    final_reasoning_output_tokens: z.number().nullish(),
    final_total_tokens: z.number().nullish(),
    max_single_turn_input_tokens: z.number().nullish(),
    max_single_turn_total_tokens: z.number().nullish(),
    total_function_calls: z.number().nullish(),
    total_input_tokens: z.number().nullish(),
    total_output_tokens: z.number().nullish(),
    avg_total_tokens: z.number().nullish(),
    dominant_agent: z.string().nullish(),
    top_skill_names: z.array(z.string()).nullish(),
    trend_insights: z.array(trendInsightSchema).nullish(),
  })
  .passthrough();

const sessionSchema = z
  .object({
    session_id: z.string(),
    date: z.string(),
    started_at: z.string(),
    project_name: z.string().nullish(),
    project_path: z.string().nullish(),
    automation_id: z.string().nullish(),
    automation_name: z.string().nullish(),
    agent_source: z.string(),
    source: z.string(),
    originator: z.string(),
    final_cached_input_tokens: z.number().optional(),
    final_input_tokens: z.number(),
    final_output_tokens: z.number(),
    final_reasoning_output_tokens: z.number(),
    final_total_tokens: z.number(),
    max_last_input_tokens: z.number(),
    max_last_total_tokens: z.number(),
    total_function_calls: z.number(),
    user_messages: z.number(),
    assistant_messages: z.number(),
    explicit_skill_mentions: z.array(z.string()),
    insight_score: z.number(),
    insights: z.array(insightSchema),
    suggestions: z.array(suggestionSchema),
  })
  .passthrough();

const aggregateDimensionSchema = z
  .object({
    final_input_tokens: z.number(),
    final_output_tokens: z.number(),
    final_reasoning_output_tokens: z.number(),
    final_total_tokens: z.number(),
    max_single_turn_input_tokens: z.number(),
    max_single_turn_total_tokens: z.number(),
    session_count: z.number(),
    total_function_calls: z.number(),
  })
  .passthrough();

const totalsSchema = z.object({
  final_input_tokens: z.number(),
  final_output_tokens: z.number(),
  final_reasoning_output_tokens: z.number(),
  final_total_tokens: z.number(),
  max_single_turn_input_tokens: z.number(),
  max_single_turn_total_tokens: z.number(),
  total_function_calls: z.number(),
});

export const historyIndexSchema = z.object({
  archive_count: z.number(),
  archives: z.array(
    z.object({
      file: z.string(),
      first_started_at: z.string(),
      last_started_at: z.string(),
      month: z.string(),
      session_count: z.number(),
    }),
  ),
  generated_at: z.string(),
  retention_days: z.number(),
});

export const monthlyArchiveSchema = z.object({
  generated_at: z.string(),
  month: z.string(),
  session_count: z.number(),
  sessions: z.array(sessionSchema),
});

export const dashboardSummarySchema = z.object({
  generated_at: z.string(),
  analysis_mode: z.string().optional(),
  session_count: z.number(),
  summary_session_count: z.number(),
  archived_session_count: z.number(),
  new_sessions_added: z.number(),
  skipped_existing_sessions: z.number(),
  summary_retention_days: z.number(),
  totals: totalsSchema,
  daily: z.array(dailyRowSchema),
  sessions: z.array(sessionSchema),
  projects: z.array(aggregateDimensionSchema),
  skills: z.array(aggregateDimensionSchema),
  automations: z.array(aggregateDimensionSchema),
  agents: z.array(aggregateDimensionSchema),
  insights: z.array(insightSchema),
  suggestions: z.array(suggestionSchema),
  trend_insights: z.array(trendInsightSchema),
  history_index: z
    .array(
      z.object({
        file: z.string(),
        first_started_at: z.string(),
        last_started_at: z.string(),
        month: z.string(),
        session_count: z.number(),
      }),
    )
    .optional(),
  history_index_path: z.string().optional(),
});
