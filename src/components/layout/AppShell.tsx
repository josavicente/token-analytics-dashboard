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

  return (
    <div className="app-shell">
      <div className="shell-frame">
        <header className="shell-header">
          <div className="shell-title-row">
            <div>
              <p className="eyebrow">Token Diagnostics</p>
              <h1 className="page-title">See the shape of your token spend.</h1>
              <p className="page-subtitle">
                A client-side dashboard over the `token-performance-tuning` export. The app
                reads local JSON artifacts copied into the project and highlights trends,
                spikes, expensive sessions, and optimization clues.
              </p>
            </div>
            <div className="pill">
              {summaryState.data
                ? `Generated ${formatTimestamp(summaryState.data.generated_at)}`
                : "Summary data unavailable"}
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
