export function formatDays(value: number): string {
  return `${Math.round(value)} day${Math.round(value) === 1 ? '' : 's'}`;
}

export function formatMonths(value: number): string {
  return `${value.toFixed(1)} mo`;
}
