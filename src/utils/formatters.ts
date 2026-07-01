export function formatFollowers(count: number | undefined | null): string {
  if (count === undefined || count === null || isNaN(count)) return "N/A";
  if (count >= 1_000_000) return (count / 1_000_000).toFixed(1) + "M";
  if (count >= 1_000)     return (count / 1_000).toFixed(1) + "K";
  return count.toLocaleString();
}

export function formatEngagementRate(rate: number | undefined | null): string {
  if (rate === undefined || rate === null || isNaN(rate)) return "N/A";
  return (rate * 100).toFixed(2) + "%";
}

export function formatPercent(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) return "N/A";
  return (value * 100).toFixed(1) + "%";
}
