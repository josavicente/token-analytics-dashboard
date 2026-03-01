export type Severity = "high" | "medium" | "low" | string;

export interface Insight {
  message: string;
  metric?: number | null;
  scope?: string;
  severity: Severity;
  type: string;
  owner?: string | null;
}

export interface TrendInsight {
  date: string;
  message: string;
  severity: Severity;
  type: string;
  delta_ratio?: number | null;
  delta_tokens?: number | null;
}

export interface Suggestion {
  category: string;
  message: string;
  priority: string;
  scope: string;
  type: string;
}

export interface DailyRow {
  date: string;
  final_input_tokens?: number | null;
  final_output_tokens?: number | null;
  final_reasoning_output_tokens?: number | null;
  final_total_tokens?: number | null;
  max_single_turn_input_tokens?: number | null;
  max_single_turn_total_tokens?: number | null;
  session_count: number;
  total_function_calls?: number | null;
  total_input_tokens?: number | null;
  total_output_tokens?: number | null;
  avg_total_tokens?: number | null;
  dominant_agent?: string | null;
  top_skill_names?: string[] | null;
  trend_insights?: TrendInsight[] | null;
}

export interface SessionRecord {
  session_id: string;
  date: string;
  started_at: string;
  project_name?: string | null;
  project_path?: string | null;
  automation_id?: string | null;
  automation_name?: string | null;
  agent_source: string;
  source: string;
  originator: string;
  final_cached_input_tokens?: number;
  final_input_tokens: number;
  final_output_tokens: number;
  final_reasoning_output_tokens: number;
  final_total_tokens: number;
  max_last_input_tokens: number;
  max_last_total_tokens: number;
  total_function_calls: number;
  user_messages: number;
  assistant_messages: number;
  explicit_skill_mentions: string[];
  insight_score: number;
  insights: Insight[];
  suggestions: Suggestion[];
}

export interface AggregateDimension {
  final_input_tokens: number;
  final_output_tokens: number;
  final_reasoning_output_tokens: number;
  final_total_tokens: number;
  max_single_turn_input_tokens: number;
  max_single_turn_total_tokens: number;
  session_count: number;
  total_function_calls: number;
  project_name?: string;
  project_path?: string;
  skill_name?: string;
  automation_id?: string | null;
  automation_name?: string | null;
  agent_source?: string;
  source?: string;
  originator?: string;
  model_provider?: string;
}

export interface Totals {
  final_input_tokens: number;
  final_output_tokens: number;
  final_reasoning_output_tokens: number;
  final_total_tokens: number;
  max_single_turn_input_tokens: number;
  max_single_turn_total_tokens: number;
  total_function_calls: number;
}

export interface HistoryArchive {
  file: string;
  first_started_at: string;
  last_started_at: string;
  month: string;
  session_count: number;
}

export interface HistoryIndex {
  archive_count: number;
  archives: HistoryArchive[];
  generated_at: string;
  retention_days: number;
}

export interface MonthlyArchive {
  generated_at: string;
  month: string;
  session_count: number;
  sessions: SessionRecord[];
}

export interface DashboardSummary {
  generated_at: string;
  analysis_mode?: string;
  session_count: number;
  summary_session_count: number;
  archived_session_count: number;
  new_sessions_added: number;
  skipped_existing_sessions: number;
  summary_retention_days: number;
  totals: Totals;
  daily: DailyRow[];
  sessions: SessionRecord[];
  projects: AggregateDimension[];
  skills: AggregateDimension[];
  automations: AggregateDimension[];
  agents: AggregateDimension[];
  insights: Insight[];
  suggestions: Suggestion[];
  trend_insights: TrendInsight[];
  history_index?: HistoryArchive[];
  history_index_path?: string;
}

export interface NormalizedDailyPoint {
  date: string;
  finalTotalTokens: number;
  inputTokens: number;
  outputTokens: number;
  spikeTokens: number;
  sessionCount: number;
  totalFunctionCalls: number;
  isPartial: boolean;
}

export interface KpiMetric {
  label: string;
  value: number;
  footnote?: string;
}
