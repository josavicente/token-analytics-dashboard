import summaryData from "../../assets/data/token-dashboard-data.json";
import historyIndexData from "../../assets/data/token-history-index.json";

import {
  dashboardSummarySchema,
  historyIndexSchema,
  monthlyArchiveSchema,
} from "./schema";
import type { DashboardSummary, HistoryIndex, MonthlyArchive } from "./types";

export interface DataState<T> {
  data: T | null;
  error: Error | null;
}

const archiveModules = import.meta.glob("../../assets/data/token-history/*.json");

export function loadDashboardSummary(): DashboardSummary {
  return dashboardSummarySchema.parse(summaryData);
}

export function loadHistoryIndex(): HistoryIndex {
  return historyIndexSchema.parse(historyIndexData);
}

export function getArchiveMonths(): string[] {
  return loadHistoryIndex()
    .archives.map((archive) => archive.month)
    .sort((left, right) => right.localeCompare(left));
}

export async function loadArchiveMonth(month: string): Promise<MonthlyArchive> {
  const key = `../../assets/data/token-history/${month}.json`;
  const loader = archiveModules[key];

  if (!loader) {
    throw new Error(`Archive file for month ${month} is not available in src/assets/data/token-history.`);
  }

  const imported = (await loader()) as { default: unknown };
  return monthlyArchiveSchema.parse(imported.default);
}
