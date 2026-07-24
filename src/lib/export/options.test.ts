import { describe, expect, it } from 'vitest';
import { resolvePageIndices } from './options';
import type { ExportOptions } from '../../types/export';

const options = (overrides: Partial<ExportOptions>): ExportOptions => ({
  format: 'pdf',
  range: 'todas',
  rangeFrom: 1,
  rangeTo: 1,
  scale: 2,
  includeBackground: true,
  includePageNumbers: true,
  includeHeader: true,
  includeFooter: true,
  ...overrides,
});

describe('resolvePageIndices', () => {
  it('exporta la página actual acotada al rango', () => {
    expect(resolvePageIndices(options({ range: 'actual' }), 5, 2)).toEqual([2]);
    expect(resolvePageIndices(options({ range: 'actual' }), 5, 99)).toEqual([4]);
    expect(resolvePageIndices(options({ range: 'actual' }), 5, -3)).toEqual([0]);
  });

  it('exporta todas las páginas', () => {
    expect(resolvePageIndices(options({ range: 'todas' }), 4, 0)).toEqual([0, 1, 2, 3]);
  });

  it('exporta un rango acotado e inclusivo', () => {
    expect(resolvePageIndices(options({ range: 'rango', rangeFrom: 2, rangeTo: 4 }), 10, 0)).toEqual([1, 2, 3]);
  });

  it('acota el rango a las páginas existentes', () => {
    expect(resolvePageIndices(options({ range: 'rango', rangeFrom: 1, rangeTo: 99 }), 3, 0)).toEqual([0, 1, 2]);
  });

  it('rango invertido se reduce al mínimo', () => {
    expect(resolvePageIndices(options({ range: 'rango', rangeFrom: 5, rangeTo: 2 }), 10, 0)).toEqual([4]);
  });

  it('sin páginas devuelve vacío', () => {
    expect(resolvePageIndices(options({ range: 'todas' }), 0, 0)).toEqual([]);
  });
});
