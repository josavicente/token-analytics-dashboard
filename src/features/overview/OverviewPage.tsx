import { BarChartCard } from "../../components/charts/BarChartCard";
import { KpiCard } from "../../components/charts/KpiCard";
import { StateCard } from "../../components/states/StateCard";
import { useDashboardData } from "../../lib/data/context";
import { LineChartCard } from "../../components/charts/LineChartCard";
import { InsightsPanel } from "../insights/InsightsPanel";
import { deriveSummary } from "../../lib/data/normalize";
import { buildKpis } from "../../lib/data/selectors";
import { TrendInsightsPanel } from "./TrendInsightsPanel";

export function OverviewPage() {
  const { summaryState } = useDashboardData();

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
  const kpis = buildKpis(summary);

  return (
    <div className="content-grid">
      <section className="kpi-grid">
        {kpis.map((metric) => (
          <KpiCard key={metric.label} metric={metric} />
        ))}
      </section>

      <section className="two-column">
        <LineChartCard
          title="Daily Token Volume"
          description="Daily totals from the active summary export. Archived days remain visible even when detailed metrics are missing."
          points={derived.daily.map((row) => ({
            date: row.date,
            value: row.finalTotalTokens,
          }))}
          color="#0284c7"
          note="Rows coming from archived periods may appear as partial if the export did not preserve full metric columns."
        />
        <InsightsPanel
          title="Global Signals"
          insights={summary.insights}
          suggestions={summary.suggestions}
        />
      </section>

      <section className="two-column">
        <LineChartCard
          title="Context Spikes"
          description="Largest observed single-turn input per day. This is the strongest indicator of oversized context imports."
          points={derived.daily.map((row) => ({
            date: row.date,
            value: row.spikeTokens,
          }))}
          color="#ea580c"
        />
        <BarChartCard
          title="Most Expensive Projects"
          description="Consolidated by project name, even when the export contains separate worktree paths."
          rows={derived.projectsByName.slice(0, 6).map((project) => ({
            label: project.project_name ?? "Unknown",
            value: project.final_total_tokens,
          }))}
          color="#0f766e"
        />
      </section>

      <section className="two-column">
        <TrendInsightsPanel trends={summary.trend_insights} />
        <StateCard
          title="Partial Data Policy"
          message="Archived days stay visible even when some daily metrics were collapsed during retention compaction."
          detail="The normalization layer fills missing numeric values with zero and marks those rows as partial so charts remain stable instead of crashing."
        />
      </section>
    </div>
  );
}
