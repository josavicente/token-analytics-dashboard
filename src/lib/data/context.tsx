import { createContext, useContext } from "react";

import {
  loadDashboardSummary,
  loadHistoryIndex,
  type DataState,
} from "./loaders";
import type { DashboardSummary, HistoryIndex } from "./types";

interface DashboardDataContextValue {
  summaryState: DataState<DashboardSummary>;
  historyIndexState: DataState<HistoryIndex>;
}

const DashboardDataContext = createContext<DashboardDataContextValue | null>(null);

function safeLoad<T>(loader: () => T): DataState<T> {
  try {
    return { data: loader(), error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error("Unknown data loading error."),
    };
  }
}

interface DashboardDataProviderProps {
  children: React.ReactNode;
}

export function DashboardDataProvider({ children }: DashboardDataProviderProps) {
  const value: DashboardDataContextValue = {
    summaryState: safeLoad(loadDashboardSummary),
    historyIndexState: safeLoad(loadHistoryIndex),
  };

  return <DashboardDataContext.Provider value={value}>{children}</DashboardDataContext.Provider>;
}

export function useDashboardData() {
  const context = useContext(DashboardDataContext);

  if (!context) {
    throw new Error("useDashboardData must be used within DashboardDataProvider.");
  }

  return context;
}
