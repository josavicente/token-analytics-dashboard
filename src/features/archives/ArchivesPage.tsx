import { useEffect, useMemo, useState } from "react";

import { StateCard } from "../../components/states/StateCard";
import { trackEvent } from "../../lib/analytics/track";
import { useDashboardData } from "../../lib/data/context";
import { loadArchiveMonth } from "../../lib/data/loaders";
import type { MonthlyArchive } from "../../lib/data/types";
import { formatFullNumber, formatTimestamp, formatTokenCount } from "../../lib/formatters";

export function ArchivesPage() {
  const { historyIndexState } = useDashboardData();

  if (historyIndexState.error || !historyIndexState.data) {
    return (
      <StateCard
        title="Archive Index Error"
        message="The archive manifest could not be loaded."
        detail={historyIndexState.error?.message}
      />
    );
  }

  const historyIndex = historyIndexState.data;
  const availableMonths = useMemo(
    () => historyIndex.archives.map((archive) => archive.month).sort((left, right) => right.localeCompare(left)),
    [historyIndex.archives],
  );
  const [selectedMonth, setSelectedMonth] = useState<string>(availableMonths[0] ?? "");
  const [archive, setArchive] = useState<MonthlyArchive | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (!selectedMonth) {
      return;
    }

    let cancelled = false;

    setStatus("loading");
    setErrorMessage("");

    loadArchiveMonth(selectedMonth)
      .then((result) => {
        if (cancelled) {
          return;
        }

        setArchive(result);
        setStatus("ready");
      })
      .catch((error: Error) => {
        if (cancelled) {
          return;
        }

        setStatus("error");
        setErrorMessage(error.message);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedMonth]);

  if (!availableMonths.length) {
    return (
      <StateCard
        title="No Archives"
        message="No monthly archive files are available in the local project data folder."
      />
    );
  }

  return (
    <div className="content-grid">
      <section className="panel">
        <div className="archive-controls">
          <div>
            <h2 className="section-title">Archived History</h2>
            <p className="section-copy">
              Load one archived month at a time. Nothing is prefetched until you select it.
            </p>
          </div>
          <select
            className="select"
            value={selectedMonth}
            onChange={(event) => {
              const month = event.target.value;
              setSelectedMonth(month);
              trackEvent("archive_month_selected", { month });
            }}
          >
            {availableMonths.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
          <span className="pill">
            {historyIndex.archive_count} archives, {historyIndex.retention_days} day retention
          </span>
        </div>
      </section>

      {status === "loading" ? (
        <StateCard title="Loading Archive" message={`Fetching ${selectedMonth} from local assets.`} />
      ) : null}

      {status === "error" ? (
        <StateCard title="Archive Error" message={errorMessage} />
      ) : null}

      {status === "ready" && archive ? (
        <>
          <section className="table-card">
            <div className="table-card-header">
              <div>
                <h2 className="section-title">{archive.month}</h2>
                <p className="section-copy">
                  {archive.session_count} sessions archived. Generated {formatTimestamp(archive.generated_at)}.
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
                    <th>Started</th>
                  </tr>
                </thead>
                <tbody>
                  {archive.sessions
                    .slice()
                    .sort((left, right) => right.started_at.localeCompare(left.started_at))
                    .map((session) => (
                      <tr key={session.session_id}>
                        <td className="table-emphasis">{session.session_id.slice(-8)}</td>
                        <td>{session.project_name ?? "Unknown"}</td>
                        <td>{formatTokenCount(session.final_total_tokens)}</td>
                        <td>{formatTimestamp(session.started_at)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="detail-card">
            <div className="detail-card-header">
              <div>
                <h2 className="section-title">Archive Summary</h2>
                <p className="section-copy">Lightweight snapshot of the selected month.</p>
              </div>
            </div>
            <table>
              <tbody>
                <tr>
                  <th scope="row">Sessions</th>
                  <td>{formatFullNumber(archive.session_count)}</td>
                </tr>
                <tr>
                  <th scope="row">Largest session</th>
                  <td>
                    {formatTokenCount(
                      Math.max(...archive.sessions.map((session) => session.final_total_tokens), 0),
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </section>
        </>
      ) : null}
    </div>
  );
}
