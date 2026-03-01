import { useMemo, useState } from "react";

import { FilterSelect } from "../../components/filters/FilterSelect";
import { trackEvent } from "../../lib/analytics/track";
import type { Insight, Suggestion } from "../../lib/data/types";
import { formatTokenCount } from "../../lib/formatters";

interface InsightsPanelProps {
  title: string;
  insights?: Insight[];
  suggestions?: Suggestion[];
}

export function InsightsPanel({ title, insights = [], suggestions = [] }: InsightsPanelProps) {
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  const [selectedScope, setSelectedScope] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");

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

  const filteredInsights = useMemo(
    () =>
      insights.filter((insight) => {
        if (selectedSeverity !== "all" && insight.severity !== selectedSeverity) {
          return false;
        }

        if (selectedScope !== "all" && insight.scope !== selectedScope) {
          return false;
        }

        return true;
      }),
    [insights, selectedScope, selectedSeverity],
  );

  const filteredSuggestions = useMemo(
    () =>
      suggestions.filter((suggestion) => {
        if (selectedCategory !== "all" && suggestion.category !== selectedCategory) {
          return false;
        }

        if (selectedPriority !== "all" && suggestion.priority !== selectedPriority) {
          return false;
        }

        return true;
      }),
    [selectedCategory, selectedPriority, suggestions],
  );

  if (!insights.length && !suggestions.length) {
    return null;
  }

  return (
    <section className="detail-card">
      <div className="detail-card-header">
        <div>
          <h2 className="section-title">{title}</h2>
          <p className="section-copy">Machine-generated findings directly from the export.</p>
        </div>
      </div>
      <div className="archive-controls">
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
      <div className="insight-list">
        {filteredInsights.map((insight) => (
          <div key={`${insight.type}-${insight.message}`} className="insight-item">
            <div className="insight-meta">
              <span className={`badge severity-${insight.severity}`}>{insight.severity}</span>
              {insight.scope ? <span className="badge">{insight.scope}</span> : null}
              {typeof insight.metric === "number" ? (
                <span className="badge">{formatTokenCount(insight.metric)}</span>
              ) : null}
            </div>
            <div>{insight.message}</div>
          </div>
        ))}
        {filteredSuggestions.map((suggestion) => (
          <div key={`${suggestion.type}-${suggestion.message}`} className="insight-item">
            <div className="insight-meta">
              <span className="badge">{suggestion.priority}</span>
              <span className="badge">{suggestion.category}</span>
            </div>
            <div>{suggestion.message}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
