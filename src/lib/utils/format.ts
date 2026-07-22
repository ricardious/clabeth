export function formatNumber(value: number): string {
  return new Intl.NumberFormat('es').format(value);
}

export function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat('es', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(timestamp));
}

export function formatRelativeTime(timestamp: number, now: number = Date.now()): string {
  const diffSeconds = Math.round((timestamp - now) / 1000);
  const abs = Math.abs(diffSeconds);
  const rtf = new Intl.RelativeTimeFormat('es', { numeric: 'auto' });
  if (abs < 60) return rtf.format(diffSeconds, 'second');
  if (abs < 3600) return rtf.format(Math.round(diffSeconds / 60), 'minute');
  if (abs < 86400) return rtf.format(Math.round(diffSeconds / 3600), 'hour');
  if (abs < 86400 * 30) return rtf.format(Math.round(diffSeconds / 86400), 'day');
  return formatDate(timestamp);
}
