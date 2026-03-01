export type AnalyticsEventName =
  | "page_view"
  | "nav_click"
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
