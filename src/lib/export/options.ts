import type { ExportOptions } from '../types/export';

/** Resuelve qué páginas (índices 0-based) entran en la exportación. */
export function resolvePageIndices(
  options: ExportOptions,
  totalPages: number,
  currentPage: number,
): number[] {
  if (totalPages === 0) return [];

  if (options.range === 'actual') {
    return [Math.min(Math.max(currentPage, 0), totalPages - 1)];
  }

  if (options.range === 'rango') {
    const from = Math.min(Math.max(options.rangeFrom, 1), totalPages);
    const to = Math.min(Math.max(options.rangeTo, from), totalPages);
    const indices: number[] = [];
    for (let p = from; p <= to; p += 1) indices.push(p - 1);
    return indices;
  }

  return Array.from({ length: totalPages }, (_, i) => i);
}
