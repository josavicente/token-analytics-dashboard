import { useMemo, useState } from "react";

import { FilterSelect } from "../../components/filters/FilterSelect";
import { trackEvent } from "../../lib/analytics/track";
import type { Insight, SessionRecord, Suggestion } from "../../lib/data/types";
import { formatFullNumber, formatTimestamp, formatTokenCount } from "../../lib/formatters";

interface InsightsPanelProps {
  title: string;
  insights?: Insight[];
  suggestions?: Suggestion[];
  sourceSessions?: SessionRecord[];
}

interface SelectedSignalDetail {
  kind: "signal" | "suggestion";
  toneClass: string;
  title: string;
  message: string;
  chips: string[];
  sourceSession?: SessionRecord;
  relatedSuggestions: Suggestion[];
}

interface SignalBundle {
  insight: Insight;
  sourceSession?: SessionRecord;
  relatedSuggestions: Suggestion[];
}

function buildPromptTip(
  message: string,
  relatedSuggestions: Suggestion[],
  sourceSession?: SessionRecord,
) {
  const likelySkills = sourceSession?.explicit_skill_mentions.length
    ? sourceSession.explicit_skill_mentions.join(", ")
    : "No explicit skill mention recorded";
  const originHint = sourceSession?.automation_name
    ? `Automation run: ${sourceSession.automation_name}`
    : sourceSession?.agent_source === "direct"
      ? "Direct interactive request"
      : sourceSession?.agent_source === "skill"
        ? "Skill-driven request"
        : sourceSession?.agent_source
          ? `Agent source: ${sourceSession.agent_source}`
          : "No agent source recorded";
  const requestKind = sourceSession?.total_function_calls
    ? sourceSession.total_function_calls > 40
      ? "Likely investigative / tool-heavy request"
      : "Likely bounded execution request"
    : "Request type unclear";
  const suggestionText = relatedSuggestions
    .slice(0, 2)
    .map((suggestion) => `- ${suggestion.message}`)
    .join("\n");

  if (suggestionText) {
    return `Review this signal and apply the related optimization actions:\n\nSignal:\n- ${message}\n\nLikely source of waste:\n- ${originHint}\n- Relevant skill(s): ${likelySkills}\n- ${requestKind}\n\nSuggested actions:\n${suggestionText}`;
  }

  return `Review this signal and propose the smallest concrete change that would reduce token spend:\n\nSignal:\n- ${message}\n\nLikely source of waste:\n- ${originHint}\n- Relevant skill(s): ${likelySkills}\n- ${requestKind}`;
}

function getInsightToneClass(insight: Insight) {
  if (insight.severity === "high") {
    return "signal-card signal-danger";
  }

  if (insight.severity === "medium") {
    return "signal-card signal-warm";
  }

  return "signal-card signal-cool";
}

function getInsightVisual(insight: Insight) {
  if (insight.type.includes("spike")) {
    return { icon: "⚠", label: "Spike watch", iconClass: "signal-icon-warning" };
  }

  if (insight.type.includes("tool")) {
    return { icon: "✦", label: "Tool pressure", iconClass: "signal-icon-tool" };
  }

  if (insight.severity === "high") {
    return { icon: "🔥", label: "High risk", iconClass: "signal-icon-danger" };
  }

  if (insight.severity === "medium") {
    return { icon: "⚠", label: "Watch", iconClass: "signal-icon-warning" };
  }

  return { icon: "✦", label: "Low risk", iconClass: "signal-icon-cool" };
}

export function InsightsPanel({
  title,
  insights = [],
  suggestions = [],
  sourceSessions = [],
}: InsightsPanelProps) {
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  const [selectedScope, setSelectedScope] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [selectedSignal, setSelectedSignal] = useState<SelectedSignalDetail | null>(null);

  const severityOptions = useMemo(
    () => [...new Set(insights.map((insight) => insight.severity).filter(Boolean))],
    [insights],
  );
  const scopeOptions = useMemo(
    () => [...new Set(insights.map((insight) => insight.scope).filter(Boolean) as string[])],
    [insights],
  );
  const categoryOptions = useMemo(
    () => [...new Set(suggestions.map((suggestion) => suggestion.category).filter(Boolean))],
    [suggestions],
  );
  const priorityOptions = useMemo(
    () => [...new Set(suggestions.map((suggestion) => suggestion.priority).filter(Boolean))],
    [suggestions],
  );

  if (!insights.length && !suggestions.length) {
    return null;
  }

  function findInsightSession(insight: Insight) {
    return sourceSessions.find((session) =>
      session.insights.some(
        (sessionInsight) =>
          sessionInsight.type === insight.type && sessionInsight.message === insight.message,
      ),
    );
  }

  const signalBundles = useMemo<SignalBundle[]>(() => {
    return insights.map((insight) => {
      const sourceSession = findInsightSession(insight);
      const rawSuggestions = sourceSession
        ? sourceSession.suggestions
        : suggestions.filter((suggestion) => suggestion.scope === (insight.scope ?? suggestion.scope));

      const dedupedSuggestions = rawSuggestions.filter(
        (suggestion, index, collection) =>
          collection.findIndex(
            (candidate) =>
              candidate.type === suggestion.type && candidate.message === suggestion.message,
          ) === index,
      );

      return {
        insight,
        sourceSession,
        relatedSuggestions: dedupedSuggestions,
      };
    });
  }, [insights, suggestions, sourceSessions]);

  const filteredBundles = useMemo(
    () =>
      signalBundles.filter((bundle) => {
        if (
          selectedSeverity !== "all" &&
          bundle.insight.severity !== selectedSeverity
        ) {
          return false;
        }

        if (selectedScope !== "all" && bundle.insight.scope !== selectedScope) {
          return false;
        }

        if (
          selectedCategory !== "all" &&
          !bundle.relatedSuggestions.some(
            (suggestion) => suggestion.category === selectedCategory,
          )
        ) {
          return false;
        }

        if (
          selectedPriority !== "all" &&
          !bundle.relatedSuggestions.some(
            (suggestion) => suggestion.priority === selectedPriority,
          )
        ) {
          return false;
        }

        return true;
      }),
    [selectedCategory, selectedPriority, selectedScope, selectedSeverity, signalBundles],
  );

  const hasActiveFilters =
    selectedSeverity !== "all" ||
    selectedScope !== "all" ||
    selectedCategory !== "all" ||
    selectedPriority !== "all";

  return (
    <>
      <section className="detail-card">
        <div className="detail-card-header">
          <div>
            <h2 className="section-title">{title}</h2>
            <p className="section-copy">Machine-generated findings directly from the export.</p>
          </div>
        </div>
        <div className="archive-controls signal-filters">
          {insights.length ? (
            <>
              <FilterSelect
                label="Severity"
                value={selectedSeverity}
                options={severityOptions}
                onChange={(value) => {
                  setSelectedSeverity(value);
                  trackEvent("insight_filter_changed", { filter: "severity", value });
                }}
              />
              <FilterSelect
                label="Scope"
                value={selectedScope}
                options={scopeOptions}
                onChange={(value) => {
                  setSelectedScope(value);
                  trackEvent("insight_filter_changed", { filter: "scope", value });
                }}
              />
            </>
          ) : null}
          {suggestions.length ? (
            <>
              <FilterSelect
                label="Category"
                value={selectedCategory}
                options={categoryOptions}
                onChange={(value) => {
                  setSelectedCategory(value);
                  trackEvent("suggestion_filter_changed", { filter: "category", value });
                }}
              />
              <FilterSelect
                label="Priority"
                value={selectedPriority}
                options={priorityOptions}
                onChange={(value) => {
                  setSelectedPriority(value);
                  trackEvent("suggestion_filter_changed", { filter: "priority", value });
                }}
              />
            </>
          ) : null}
        </div>
        {signalBundles.length ? (
          <div className="signal-group">
            <div className="signal-group-header">
              <h3 className="signal-group-title">Signals + suggestions</h3>
              <span className="signal-group-count">{filteredBundles.length}</span>
            </div>
            {filteredBundles.length ? (
              <div
                key={`${selectedSeverity}-${selectedScope}-${selectedCategory}-${selectedPriority}`}
                className="insight-list insight-list-two-up"
              >
                {filteredBundles.map((bundle) => {
                  const { insight, relatedSuggestions, sourceSession } = bundle;
                  const toneClass = getInsightToneClass(insight);
                  const visual = getInsightVisual(insight);
                  const promptTip = buildPromptTip(insight.message, relatedSuggestions, sourceSession);

                  return (
                    <article
                      key={`${insight.type}-${insight.message}`}
                      className={`${toneClass} insight-item`}
                    >
                      <div className="signal-card-shell">
                        <div className="signal-card-icon-panel">
                          <span className={`signal-icon-badge ${visual.iconClass}`} aria-hidden="true">
                            {visual.icon}
                          </span>
                          <div className="signal-icon-copy">
                            <span className="signal-icon-label">{visual.label}</span>
                            <strong className="signal-icon-value">
                              {typeof insight.metric === "number"
                                ? formatTokenCount(insight.metric)
                                : insight.severity}
                            </strong>
                          </div>
                        </div>

                        <div className="signal-card-stats">
                          <div className="signal-stat-row">
                            <span className="signal-stat-label">Likely source</span>
                            <span className="signal-stat-pill">
                              {sourceSession?.automation_name
                                ? sourceSession.automation_name
                                : sourceSession?.agent_source ?? "aggregate"}
                            </span>
                          </div>
                          <div className="signal-stat-row">
                            <span className="signal-stat-label">Relevant skill</span>
                            <span className="signal-stat-pill">
                              {sourceSession?.explicit_skill_mentions[0] ?? "none"}
                            </span>
                          </div>
                        </div>

                      <div className="insight-meta">
                        <span className={`badge severity-${insight.severity}`}>{insight.severity}</span>
                        {insight.scope ? <span className="badge">{insight.scope}</span> : null}
                        {typeof insight.metric === "number" ? (
                          <span className="badge">{formatTokenCount(insight.metric)}</span>
                        ) : null}
                      </div>
                      <div className="signal-type">Signal</div>
                      <div className="signal-message">{insight.message}</div>
                      {relatedSuggestions.length ? (
                        <div className="signal-related-block">
                          <div className="signal-related-label">Related suggestions</div>
                          <div className="signal-related-list">
                            {relatedSuggestions.slice(0, 2).map((suggestion) => (
                              <div
                                key={`${suggestion.type}-${suggestion.message}`}
                                className="signal-related-item"
                              >
                                <span className="badge">{suggestion.priority}</span>
                                <span>{suggestion.message}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null}
                        <div className="signal-card-actions">
                          <button
                            type="button"
                            className="signal-action-button"
                            onClick={() =>
                              setSelectedSignal({
                                kind: "signal",
                                toneClass,
                                title: "Signal",
                                message: insight.message,
                                chips: [
                                  insight.severity,
                                  ...(insight.scope ? [insight.scope] : []),
                                  ...(typeof insight.metric === "number"
                                    ? [formatTokenCount(insight.metric)]
                                    : []),
                                ],
                                sourceSession,
                                relatedSuggestions,
                              })
                            }
                          >
                            Open context
                          </button>
                        </div>
                        <details className="prompt-tip">
                          <summary>Prompt tip</summary>
                          <pre className="prompt-tip-content">{promptTip}</pre>
                        </details>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="signal-empty-state">
                {hasActiveFilters
                  ? "No signal bundles match the current filters."
                  : "No signal bundles are available in this view."}
              </div>
            )}
          </div>
        ) : null}
      </section>

      {selectedSignal ? (
        <div className="signal-modal-backdrop" onClick={() => setSelectedSignal(null)}>
          <div
            className={`signal-modal ${selectedSignal.toneClass}`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="signal-modal-header">
              <div>
                <div className="signal-type">{selectedSignal.title}</div>
                <h3 className="section-title">Relevant signal context</h3>
              </div>
              <button
                type="button"
                className="signal-modal-close"
                onClick={() => setSelectedSignal(null)}
                aria-label="Close signal details"
              >
                Close
              </button>
            </div>

            <div className="badge-list">
              {selectedSignal.chips.map((chip) => (
                <span key={chip} className="badge">
                  {chip}
                </span>
              ))}
            </div>

            <p className="signal-modal-message">{selectedSignal.message}</p>

            {selectedSignal.relatedSuggestions.length ? (
              <div className="signal-session-panel">
                <span className="signal-detail-label">Related suggestions</span>
                <div className="signal-related-list">
                  {selectedSignal.relatedSuggestions.map((suggestion) => (
                    <div
                      key={`${suggestion.type}-${suggestion.message}`}
                      className="signal-related-item"
                    >
                      <span className="badge">{suggestion.priority}</span>
                      <span className="badge">{suggestion.category}</span>
                      <span>{suggestion.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {selectedSignal.sourceSession ? (
              <div className="signal-session-panel">
                <div className="signal-session-grid">
                  <div>
                    <span className="signal-detail-label">Project</span>
                    <div className="signal-detail-value">
                      {selectedSignal.sourceSession.project_name ?? "Unknown"}
                    </div>
                  </div>
                  <div>
                    <span className="signal-detail-label">Started</span>
                    <div className="signal-detail-value">
                      {formatTimestamp(selectedSignal.sourceSession.started_at)}
                    </div>
                  </div>
                  <div>
                    <span className="signal-detail-label">Session</span>
                    <div className="signal-detail-value mono">
                      {selectedSignal.sourceSession.session_id}
                    </div>
                  </div>
                  <div>
                    <span className="signal-detail-label">Total tokens</span>
                    <div className="signal-detail-value">
                      {formatFullNumber(selectedSignal.sourceSession.final_total_tokens)}
                    </div>
                  </div>
                  <div>
                    <span className="signal-detail-label">Largest input spike</span>
                    <div className="signal-detail-value">
                      {formatFullNumber(selectedSignal.sourceSession.max_last_input_tokens)}
                    </div>
                  </div>
                  <div>
                    <span className="signal-detail-label">Tool calls</span>
                    <div className="signal-detail-value">
                      {formatFullNumber(selectedSignal.sourceSession.total_function_calls)}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="signal-session-panel">
                <span className="signal-detail-label">Source session</span>
                <div className="signal-detail-value">
                  This item comes from an aggregate or could not be mapped to a single session.
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
