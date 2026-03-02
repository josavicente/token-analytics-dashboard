import type { TrendInsight } from "../../lib/data/types";
import { formatTokenCount } from "../../lib/formatters";

interface TrendInsightsPanelProps {
  trends: TrendInsight[];
}

function getTrendToneClass(trend: TrendInsight) {
  if (trend.type === "daily_increase") {
    return "signal-card signal-danger";
  }

  if (trend.type === "daily_decrease") {
    return "signal-card signal-cool";
  }

  return "signal-card signal-violet";
}

export function TrendInsightsPanel({ trends }: TrendInsightsPanelProps) {
  if (!trends.length) {
    return null;
  }

  const orderedTrends = [...trends].sort((left, right) => right.date.localeCompare(left.date));

  return (
    <section className="detail-card">
      <div className="detail-card-header">
        <div>
          <h2 className="section-title">Trend Signals</h2>
          <p className="section-copy">Cross-day changes highlighted by the export.</p>
        </div>
      </div>
      <div className="insight-list">
        {orderedTrends.slice(0, 10).map((trend) => (
          <article
            key={`${trend.date}-${trend.type}`}
            className={`${getTrendToneClass(trend)} insight-item`}
          >
            <div className="insight-meta">
              <span className={`badge severity-${trend.severity}`}>{trend.severity}</span>
              <span className="badge">{trend.date}</span>
              {typeof trend.delta_tokens === "number" ? (
                <span className="badge">{formatTokenCount(Math.abs(trend.delta_tokens))}</span>
              ) : null}
            </div>
            <div className="signal-type">{trend.type.replace(/_/g, " ")}</div>
            <div className="signal-message">{trend.message}</div>
          </article>
        ))}
      </div>
    </section>
  );
}
