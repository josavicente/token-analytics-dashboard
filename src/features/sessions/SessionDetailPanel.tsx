import type { SessionRecord } from "../../lib/data/types";
import { formatFullNumber, formatTimestamp, formatTokenCount } from "../../lib/formatters";
import { InsightsPanel } from "../insights/InsightsPanel";

interface SessionDetailPanelProps {
  session: SessionRecord;
}

export function SessionDetailPanel({ session }: SessionDetailPanelProps) {
  return (
    <div className="detail-layout">
      <section className="detail-card">
        <div className="detail-card-header">
          <div>
            <h2 className="section-title">Selected Session</h2>
            <p className="section-copy">{session.session_id}</p>
          </div>
        </div>
        <div className="badge-list">
          <span className="badge">{session.project_name ?? "Unknown project"}</span>
          <span className="badge">{session.agent_source}</span>
          {session.automation_name ? <span className="badge">{session.automation_name}</span> : null}
          <span className="badge">{formatTimestamp(session.started_at)}</span>
        </div>
        <table>
          <tbody>
            <tr>
              <th scope="row">Total tokens</th>
              <td className="table-emphasis">{formatFullNumber(session.final_total_tokens)}</td>
            </tr>
            <tr>
              <th scope="row">Input tokens</th>
              <td>{formatFullNumber(session.final_input_tokens)}</td>
            </tr>
            <tr>
              <th scope="row">Largest input spike</th>
              <td>{formatFullNumber(session.max_last_input_tokens)}</td>
            </tr>
            <tr>
              <th scope="row">Tool calls</th>
              <td>{formatFullNumber(session.total_function_calls)}</td>
            </tr>
            <tr>
              <th scope="row">Insight score</th>
              <td>{formatTokenCount(session.insight_score)}</td>
            </tr>
          </tbody>
        </table>
        {session.explicit_skill_mentions.length ? (
          <>
            <h3 className="section-title">Mentioned Skills</h3>
            <div className="badge-list">
              {session.explicit_skill_mentions.map((skill) => (
                <span key={skill} className="badge">
                  {skill}
                </span>
              ))}
            </div>
          </>
        ) : null}
      </section>
      <InsightsPanel
        title="Session Insights"
        insights={session.insights}
        suggestions={session.suggestions}
      />
    </div>
  );
}
