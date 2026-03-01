import { useMemo, useState } from "react";

import { StateCard } from "../../components/states/StateCard";
import { trackEvent } from "../../lib/analytics/track";
import { useDashboardData } from "../../lib/data/context";
import { getTopCostSessions, getTopSpikeSessions } from "../../lib/data/selectors";
import { formatFullNumber, formatTokenCount } from "../../lib/formatters";
import { SessionDetailPanel } from "./SessionDetailPanel";

export function SessionsPage() {
  const { summaryState } = useDashboardData();

  if (summaryState.error || !summaryState.data) {
    return (
      <StateCard
        title="Summary Data Error"
        message="The sessions view could not load the summary JSON."
        detail={summaryState.error?.message}
      />
    );
  }

  const summary = summaryState.data;
  const topCost = useMemo(() => getTopCostSessions(summary, 12), []);
  const topSpike = useMemo(() => getTopSpikeSessions(summary, 12), []);
  const [selectedSessionId, setSelectedSessionId] = useState<string>(topCost[0]?.session_id ?? "");

  const selectedSession =
    topCost.find((session) => session.session_id === selectedSessionId) ??
    summary.sessions.find((session) => session.session_id === selectedSessionId) ??
    topCost[0];

  if (!topCost.length) {
    return (
      <StateCard
        title="No Sessions"
        message="The current summary export does not contain session rows to render."
      />
    );
  }

  return (
    <div className="content-grid">
      <section className="two-column">
        <section className="table-card">
          <div className="table-card-header">
            <div>
              <h2 className="section-title">Highest-Cost Sessions</h2>
              <p className="section-copy">
                Focus here first. The heaviest sessions account for most of the observed spend.
              </p>
            </div>
          </div>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Session</th>
                  <th>Project</th>
                  <th>Total</th>
                  <th>Spike</th>
                </tr>
              </thead>
              <tbody>
                {topCost.map((session) => (
                  <tr key={session.session_id}>
                    <td>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSessionId(session.session_id);
                          trackEvent("session_selected", { sessionId: session.session_id });
                        }}
                        className="nav-link"
                      >
                        {session.session_id.slice(-8)}
                      </button>
                    </td>
                    <td>{session.project_name ?? "Unknown"}</td>
                    <td className="table-emphasis">{formatTokenCount(session.final_total_tokens)}</td>
                    <td>{formatTokenCount(session.max_last_input_tokens)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {selectedSession ? <SessionDetailPanel session={selectedSession} /> : null}
      </section>

      <section className="table-card">
        <div className="table-card-header">
          <div>
            <h2 className="section-title">Largest Context Spikes</h2>
            <p className="section-copy">
              Sessions sorted by single-turn input size, regardless of overall total volume.
            </p>
          </div>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Session</th>
                <th>Project</th>
                <th>Largest Input</th>
                <th>Tool Calls</th>
              </tr>
            </thead>
            <tbody>
              {topSpike.map((session) => (
                <tr key={session.session_id}>
                  <td className="table-emphasis">{session.session_id.slice(-8)}</td>
                  <td>{session.project_name ?? "Unknown"}</td>
                  <td>{formatTokenCount(session.max_last_input_tokens)}</td>
                  <td>{formatFullNumber(session.total_function_calls)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
