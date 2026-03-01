import { describe, expect, it } from "vitest";

import { consolidateProjects, normalizeDailyRows } from "./normalize";

describe("normalizeDailyRows", () => {
  it("fills missing numeric daily metrics with safe defaults and marks rows as partial", () => {
    const rows = normalizeDailyRows([
      {
        date: "2026-03-01",
        session_count: 2,
        final_total_tokens: null,
        final_input_tokens: null,
        final_output_tokens: null,
        max_single_turn_input_tokens: null,
        total_function_calls: null,
      },
    ]);

    expect(rows).toEqual([
      {
        date: "2026-03-01",
        finalTotalTokens: 0,
        inputTokens: 0,
        outputTokens: 0,
        spikeTokens: 0,
        sessionCount: 2,
        totalFunctionCalls: 0,
        isPartial: true,
      },
    ]);
  });
});

describe("consolidateProjects", () => {
  it("merges rows with the same project name across paths", () => {
    const rows = consolidateProjects([
      {
        project_name: "demo",
        project_path: "/tmp/a",
        final_input_tokens: 100,
        final_output_tokens: 10,
        final_reasoning_output_tokens: 5,
        final_total_tokens: 110,
        max_single_turn_input_tokens: 90,
        max_single_turn_total_tokens: 95,
        session_count: 1,
        total_function_calls: 2,
      },
      {
        project_name: "demo",
        project_path: "/tmp/b",
        final_input_tokens: 200,
        final_output_tokens: 20,
        final_reasoning_output_tokens: 10,
        final_total_tokens: 220,
        max_single_turn_input_tokens: 120,
        max_single_turn_total_tokens: 130,
        session_count: 2,
        total_function_calls: 4,
      },
    ]);

    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      project_name: "demo",
      final_input_tokens: 300,
      final_output_tokens: 30,
      final_reasoning_output_tokens: 15,
      final_total_tokens: 330,
      max_single_turn_input_tokens: 120,
      max_single_turn_total_tokens: 130,
      session_count: 3,
      total_function_calls: 6,
    });
  });
});
