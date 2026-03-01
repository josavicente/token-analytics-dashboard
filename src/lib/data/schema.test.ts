import { describe, expect, it } from "vitest";

import historyIndexData from "../../assets/data/token-history-index.json";
import summaryData from "../../assets/data/token-dashboard-data.json";
import archiveData from "../../assets/data/token-history/2025-12.json";
import {
  dashboardSummarySchema,
  historyIndexSchema,
  monthlyArchiveSchema,
} from "./schema";

describe("data schemas", () => {
  it("parses the current dashboard summary export", () => {
    expect(() => dashboardSummarySchema.parse(summaryData)).not.toThrow();
  });

  it("parses the current archive index export", () => {
    expect(() => historyIndexSchema.parse(historyIndexData)).not.toThrow();
  });

  it("parses the current monthly archive export", () => {
    expect(() => monthlyArchiveSchema.parse(archiveData)).not.toThrow();
  });
});
