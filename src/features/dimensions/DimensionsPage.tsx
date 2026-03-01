import { BarChartCard } from "../../components/charts/BarChartCard";
import { StateCard } from "../../components/states/StateCard";
import { useDashboardData } from "../../lib/data/context";
import { deriveSummary } from "../../lib/data/normalize";
import { topRows } from "../../lib/data/selectors";

export function DimensionsPage() {
  const { summaryState } = useDashboardData();

  if (summaryState.error || !summaryState.data) {
    return (
      <StateCard
        title="Summary Data Error"
        message="The dimensions view could not load the summary JSON."
        detail={summaryState.error?.message}
      />
    );
  }

  const summary = summaryState.data;
  const derived = deriveSummary(summary);

  return (
    <div className="dimension-grid">
      <BarChartCard
        title="Projects"
        description="Consolidated project totals grouped by project name."
        rows={derived.projectsByName.slice(0, 6).map((project) => ({
          label: project.project_name ?? "Unknown",
          value: project.final_total_tokens,
        }))}
        color="#2563eb"
      />
      <BarChartCard
        title="Skills"
        description="Top explicitly mentioned skills inside the analyzed sessions."
        rows={topRows(summary.skills).map((skill) => ({
          label: skill.skill_name ?? "Unknown",
          value: skill.final_total_tokens,
        }))}
        color="#db2777"
      />
      <BarChartCard
        title="Automations"
        description="Automation-attributed spend versus direct work."
        rows={topRows(summary.automations).map((automation) => ({
          label: automation.automation_name ?? "Direct sessions",
          value: automation.final_total_tokens,
        }))}
        color="#0f766e"
      />
      <BarChartCard
        title="Agent Sources"
        description="Grouped by agent source in the exported aggregates."
        rows={topRows(summary.agents).map((agent) => ({
          label: `${agent.agent_source ?? "unknown"}:${agent.originator ?? "unknown"}`,
          value: agent.final_total_tokens,
        }))}
        color="#9333ea"
      />
    </div>
  );
}
