import type { AnalyticsEventMap, AnalyticsEventName } from "./types";

declare global {
  interface WindowEventMap {
    "token-dashboard-analytics": CustomEvent<{
      name: AnalyticsEventName;
      payload: AnalyticsEventMap[AnalyticsEventName];
      timestamp: string;
    }>;
  }
}

export function trackEvent<TName extends AnalyticsEventName>(
  name: TName,
  payload: AnalyticsEventMap[TName],
) {
  const detail = {
    name,
    payload,
    timestamp: new Date().toISOString(),
  };

  window.dispatchEvent(
    new CustomEvent("token-dashboard-analytics", {
      detail: detail as {
        name: AnalyticsEventName;
        payload: AnalyticsEventMap[AnalyticsEventName];
        timestamp: string;
      },
    }),
  );

  if (import.meta.env.DEV) {
    console.debug("[analytics]", detail);
  }
}
