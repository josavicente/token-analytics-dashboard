import type { KpiMetric } from "../../lib/data/types";
import { formatTokenCount } from "../../lib/formatters";

interface KpiCardProps {
  metric: KpiMetric;
}

export function KpiCard({ metric }: KpiCardProps) {
  return (
    <article className="kpi-card">
      <span className="kpi-label">{metric.label}</span>
      <span className="kpi-value">{formatTokenCount(metric.value)}</span>
      {metric.footnote ? <span className="kpi-footnote">{metric.footnote}</span> : null}
    </article>
  );
}
