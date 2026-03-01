import type { TrendInsight } from "../../lib/data/types";
import { formatTokenCount } from "../../lib/formatters";

interface TrendInsightsPanelProps {
  trends: TrendInsight[];
}

export function TrendInsightsPanel({ trends }: TrendInsightsPanelProps) {
  if (!trends.length) {
    return null;
  }

  return (
    <section className="detail-card">
      <div className="detail-card-header">
        <div>
          <h2 className="section-title">Trend Signals</h2>
          <p className="section-copy">Cross-day changes highlighted by the export.</p>
        </div>
      </div>
      <div className="insight-list">
        {trends.slice(0, 10).map((trend) => (
          <div key={`${trend.date}-${trend.type}`} className="insight-item">
            <div className="insight-meta">
              <span className={`badge severity-${trend.severity}`}>{trend.severity}</span>
              <span className="badge">{trend.date}</span>
              {typeof trend.delta_tokens === "number" ? (
                <span className="badge">{formatTokenCount(Math.abs(trend.delta_tokens))}</span>
              ) : null}
            </div>
            <div>{trend.message}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
