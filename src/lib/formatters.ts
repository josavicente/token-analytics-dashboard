import { format, parseISO } from "date-fns";

export function formatTokenCount(value: number): string {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}B`;
  }

  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }

  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }

  return value.toLocaleString();
}

export function formatFullNumber(value: number): string {
  return value.toLocaleString();
}

export function formatDateLabel(value: string): string {
  return format(parseISO(`${value}T00:00:00Z`), "MMM d");
}

export function formatTimestamp(value: string): string {
  return format(parseISO(value), "MMM d, yyyy HH:mm");
}
