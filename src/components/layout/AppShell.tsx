import { NavLink, Outlet } from "react-router-dom";

import { useDashboardData } from "../../lib/data/context";
import { trackEvent } from "../../lib/analytics/track";
import { usePageViewTracking } from "../../lib/analytics/usePageViewTracking";
import { formatTimestamp } from "../../lib/formatters";

const links = [
  { to: "/", label: "Overview", end: true },
  { to: "/sessions", label: "Sessions" },
  { to: "/dimensions", label: "Dimensions" },
  { to: "/archives", label: "Archives" },
];

export function AppShell() {
  const { summaryState } = useDashboardData();
  usePageViewTracking();

  const summary = summaryState.data;

  return (
    <div className="app-shell">
      <div className="shell-frame">
        <header className="shell-header">
          <div className="shell-topline">
            <div className="brand-lockup">
              <span className="brand-badge">TA</span>
              <div>
                <p className="eyebrow">Token Diagnostics</p>
                <p className="brand-caption">Operational lens for token-heavy workflows</p>
              </div>
            </div>
            <div className="header-pills">
              <div className="pill">
                {summary ? `Generated ${formatTimestamp(summary.generated_at)}` : "Summary data unavailable"}
              </div>
              {summary ? <div className="pill pill-strong">{summary.session_count} sessions</div> : null}
            </div>
          </div>

          <div className="shell-title-row">
            <div className="headline-block">
              <h1 className="page-title">Read the contour of your token usage.</h1>
              <p className="page-subtitle">
                A softer, clearer control surface for the `token-performance-tuning` export.
                Track spend, spikes, session outliers, and archived behavior without digging
                through raw JSON.
              </p>
            </div>
            <div className="header-stats-card">
              <span className="mini-stat-label">Current window</span>
              <strong className="mini-stat-value">
                {summary ? summary.summary_session_count.toLocaleString() : "0"}
              </strong>
              <span className="mini-stat-copy">active summary sessions in view</span>
            </div>
          </div>
          <nav className="shell-nav" aria-label="Primary">
            {links.map((link) => (
              <NavLink
                key={link.to}
                className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
                to={link.to}
                end={link.end}
                onClick={() =>
                  trackEvent("nav_click", {
                    target: link.to,
                  })
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
