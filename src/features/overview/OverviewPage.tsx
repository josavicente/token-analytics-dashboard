import { useState } from "react";

import { BarChartCard } from "../../components/charts/BarChartCard";
import { KpiCard } from "../../components/charts/KpiCard";
import { StateCard } from "../../components/states/StateCard";
import { trackEvent } from "../../lib/analytics/track";
import { useDashboardData } from "../../lib/data/context";
import { LineChartCard } from "../../components/charts/LineChartCard";
import { InsightsPanel } from "../insights/InsightsPanel";
import { consolidateProjects, deriveSummary } from "../../lib/data/normalize";
import { buildKpis } from "../../lib/data/selectors";
import { TrendInsightsPanel } from "./TrendInsightsPanel";

type OverviewScope = "last-week" | "last-2-weeks" | "last-month" | "all-data";
type OverviewTab = "overview" | "signals" | "trends";

const scopeOptions: Array<{ id: OverviewScope; label: string }> = [
  { id: "last-week", label: "Last week" },
  { id: "last-2-weeks", label: "Last 2 weeks" },
  { id: "last-month", label: "Last month" },
  { id: "all-data", label: "All data" },
];

export function OverviewPage() {
  const { summaryState } = useDashboardData();
  const [scope, setScope] = useState<OverviewScope>("last-week");
  const [activeTab, setActiveTab] = useState<OverviewTab>("overview");

  if (summaryState.error || !summaryState.data) {
    return (
      <StateCard
        title="Summary Data Error"
        message="The dashboard could not parse the summary JSON."
        detail={summaryState.error?.message}
      />
    );
  }

  const summary = summaryState.data;
  const derived = deriveSummary(summary);
  const latestDaily = [...derived.daily].sort((left, right) => right.date.localeCompare(left.date));

  function buildWindowData(days: number, title: string, subtitle: string) {
    const daily = latestDaily.slice(0, days);
    const dateSet = new Set(daily.map((row) => row.date));
    const sessions = summary.sessions.filter((session) => dateSet.has(session.date));
    const insights = sessions.flatMap((session) => session.insights);
    const suggestions = sessions.flatMap((session) => session.suggestions);
    const trends = summary.trend_insights.filter((trend) => dateSet.has(trend.date));
    const projects = consolidateProjects(
      sessions.map((session) => ({
        final_input_tokens: session.final_input_tokens,
        final_output_tokens: session.final_output_tokens,
        final_reasoning_output_tokens: session.final_reasoning_output_tokens,
        final_total_tokens: session.final_total_tokens,
        max_single_turn_input_tokens: session.max_last_input_tokens,
        max_single_turn_total_tokens: session.max_last_total_tokens,
        session_count: 1,
        total_function_calls: session.total_function_calls,
        project_name: session.project_name ?? "Unknown",
        project_path: session.project_path ?? undefined,
      })),
    );

    return {
      title,
      subtitle,
      kpis: [
        {
          label: "Total Tokens",
          value: daily.reduce((total, row) => total + row.finalTotalTokens, 0),
          footnote: `${sessions.length} sessions in this rolling window`,
        },
        {
          label: "Input Tokens",
          value: daily.reduce((total, row) => total + row.inputTokens, 0),
          footnote: `Rolling ${days}-day input volume`,
        },
        {
          label: "Output Tokens",
          value: daily.reduce((total, row) => total + row.outputTokens, 0),
          footnote: `Rolling ${days}-day output volume`,
        },
        {
          label: "Context Spike",
          value: Math.max(...daily.map((row) => row.spikeTokens), 0),
          footnote: `Largest single-turn input in the last ${days} days`,
        },
        {
          label: "Tool Calls",
          value: daily.reduce((total, row) => total + row.totalFunctionCalls, 0),
          footnote: `Observed tool activity during the last ${days} days`,
        },
        {
          label: "Days In View",
          value: daily.length,
          footnote: `Latest rolling ${days}-day window`,
        },
      ],
      daily,
      insights,
      suggestions,
      trends,
      sessions,
      projects,
      signalMessage: `Use this view to focus on the latest ${days} days only. It keeps the most recent movement readable without older history diluting the signal.`,
      partialMessage: `This mode uses the latest ${days} daily rows only. It is best for recent shifts, not for long-range comparisons.`,
    };
  }

  const overviewData =
    scope === "last-week"
      ? buildWindowData(7, "Last week", "Focused on the latest rolling seven-day window.")
      : scope === "last-2-weeks"
        ? buildWindowData(14, "Last 2 weeks", "Focused on the latest rolling fourteen-day window.")
        : scope === "last-month"
          ? buildWindowData(30, "Last month", "Focused on the latest rolling thirty-day window.")
          : {
              title: "All data",
              subtitle: "Full dataset, including the current summary window and retained trends.",
              kpis: buildKpis(summary),
              daily: latestDaily,
              insights: summary.insights,
              suggestions: summary.suggestions,
              trends: summary.trend_insights,
              sessions: summary.sessions,
              projects: derived.projectsByName,
              signalMessage:
                "This view keeps the full summary context in play, so signals represent the broader dataset instead of just recent movement.",
              partialMessage:
                "Archived days stay visible even when some daily metrics were collapsed during retention compaction.",
            };

  return (
    <div className="content-grid">
      <section className="overview-mode-bar">
        <div>
          <h2 className="section-title">Overview scope</h2>
          <p className="section-copy">{overviewData.subtitle}</p>
        </div>
        <div className="pill-selector" role="tablist" aria-label="Overview scope">
          {scopeOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`scope-pill${scope === option.id ? " active" : ""}`}
              onClick={() => {
                setScope(option.id);
                trackEvent("overview_scope_changed", { scope: option.id });
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>

      <section className="overview-mode-bar">
        <div>
          <h2 className="section-title">Main window</h2>
          <p className="section-copy">Switch between the core overview and the signal-focused board.</p>
        </div>
        <div className="pill-selector" role="tablist" aria-label="Overview main tabs">
          <button
            type="button"
            className={`scope-pill${activeTab === "overview" ? " active" : ""}`}
            onClick={() => {
              setActiveTab("overview");
              trackEvent("overview_tab_changed", { tab: "overview" });
            }}
          >
            Overview
          </button>
          <button
            type="button"
            className={`scope-pill${activeTab === "signals" ? " active" : ""}`}
            onClick={() => {
              setActiveTab("signals");
              trackEvent("overview_tab_changed", { tab: "signals" });
            }}
          >
            Signals
          </button>
          <button
            type="button"
            className={`scope-pill${activeTab === "trends" ? " active" : ""}`}
            onClick={() => {
              setActiveTab("trends");
              trackEvent("overview_tab_changed", { tab: "trends" });
            }}
          >
            Trends
          </button>
        </div>
      </section>

      {activeTab === "overview" ? (
        <section className="content-grid">
          <section className="kpi-grid">
            {overviewData.kpis.map((metric) => (
              <KpiCard key={metric.label} metric={metric} />
            ))}
          </section>

          <section className="overview-panel-grid">
            <LineChartCard
              title="Daily Token Volume"
              description={`${overviewData.title} token totals, plotted in chronological order.`}
              points={overviewData.daily.map((row) => ({
                date: row.date,
                value: row.finalTotalTokens,
              }))}
              color="#0284c7"
              note={
                scope !== "all-data"
                  ? `This view isolates the newest ${overviewData.daily.length} daily data points.`
                  : "Rows coming from archived periods may appear as partial if the export did not preserve full metric columns."
              }
            />
            <LineChartCard
              title="Context Spikes"
              description={`Largest observed single-turn input per day in ${overviewData.title.toLowerCase()}.`}
              points={overviewData.daily.map((row) => ({
                date: row.date,
                value: row.spikeTokens,
              }))}
              color="#ea580c"
            />
            <BarChartCard
              title="Most Expensive Projects"
              description={`Top projects for ${overviewData.title.toLowerCase()}, consolidated by project name.`}
              rows={overviewData.projects.slice(0, 6).map((project) => ({
                label: project.project_name ?? "Unknown",
                value: project.final_total_tokens,
              }))}
              color="#0f766e"
            />
          </section>
        </section>
      ) : activeTab === "signals" ? (
        <section className="tab-grid">
          <InsightsPanel
            title="Global Signals"
            insights={overviewData.insights}
            suggestions={overviewData.suggestions}
            sourceSessions={overviewData.sessions}
          />
        </section>
      ) : (
        <section className="tab-grid">
          <TrendInsightsPanel trends={overviewData.trends} />
        </section>
      )}
    </div>
  );
}
