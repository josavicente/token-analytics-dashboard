export type AnalyticsEventName =
  | "page_view"
  | "nav_click"
  | "overview_scope_changed"
  | "overview_tab_changed"
  | "session_selected"
  | "archive_month_selected"
  | "insight_filter_changed"
  | "suggestion_filter_changed";

export interface AnalyticsEventMap {
  page_view: {
    path: string;
    navigationType: string;
  };
  nav_click: {
    target: string;
  };
  overview_scope_changed: {
    scope: "last-week" | "last-2-weeks" | "last-month" | "all-data";
  };
  overview_tab_changed: {
    tab: "overview" | "signals" | "trends";
  };
  session_selected: {
    sessionId: string;
  };
  archive_month_selected: {
    month: string;
  };
  insight_filter_changed: {
    filter: "severity" | "scope";
    value: string;
  };
  suggestion_filter_changed: {
    filter: "category" | "priority";
    value: string;
  };
}
