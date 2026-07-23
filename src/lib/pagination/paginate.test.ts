import { describe, expect, it } from 'vitest';
import { paginateBlocks } from './paginate';

const heights = (values: number[]): number[] => values;

describe('paginateBlocks', () => {
  it('empaqueta bloques que caben en una página', () => {
    const pages = paginateBlocks({
      heights: heights([10, 10, 10]),
      pageBreakBefore: [false, false, false],
      keepWithNext: [false, false, false],
      contentHeight: 50,
    });
    expect(pages).toEqual([[0, 1, 2]]);
  });

  it('corta cuando el contenido supera la altura', () => {
    const pages = paginateBlocks({
      heights: heights([30, 30, 30]),
      pageBreakBefore: [false, false, false],
      keepWithNext: [false, false, false],
      contentHeight: 50,
    });
    expect(pages).toEqual([
      [0],
      [1],
      [2],
    ]);
  });

  it('agrupa hasta llenar y pasa a la siguiente', () => {
    const pages = paginateBlocks({
      heights: heights([20, 20, 20, 20]),
      pageBreakBefore: [false, false, false, false],
      keepWithNext: [false, false, false, false],
      contentHeight: 45,
    });
    expect(pages).toEqual([
      [0, 1],
      [2, 3],
    ]);
  });

  it('respeta los saltos de página explícitos', () => {
    const pages = paginateBlocks({
      heights: heights([10, 10, 10]),
      pageBreakBefore: [false, false, true],
      keepWithNext: [false, false, false],
      contentHeight: 100,
    });
    expect(pages).toEqual([
      [0, 1],
      [2],
    ]);
  });

  it('no crea una página vacía por un salto inicial', () => {
    const pages = paginateBlocks({
      heights: heights([10, 10]),
      pageBreakBefore: [true, false],
      keepWithNext: [false, false],
      contentHeight: 100,
    });
    expect(pages).toEqual([[0, 1]]);
  });

  it('un bloque más alto que la página queda solo y desborda', () => {
    const pages = paginateBlocks({
      heights: heights([200, 10]),
      pageBreakBefore: [false, false],
      keepWithNext: [false, false],
      contentHeight: 50,
    });
    expect(pages).toEqual([[0], [1]]);
  });

  it('mantiene el encabezado con el siguiente bloque (keep-with-next)', () => {
    const pages = paginateBlocks({
      heights: heights([20, 20, 20, 20, 20]),
      pageBreakBefore: [false, false, false, false, false],
      keepWithNext: [false, false, false, true, false], // bloque 3 es encabezado
      contentHeight: 45,
    });
    // Sin la regla: [[0,1],[2,3],[4]]. Con la regla, el encabezado 3 se
    // mueve a la página siguiente junto al bloque 4.
    expect(pages).toEqual([
      [0, 1],
      [2],
      [3, 4],
    ]);
  });

  it('contenido vacío produce cero páginas', () => {
    const pages = paginateBlocks({
      heights: [],
      pageBreakBefore: [],
      keepWithNext: [],
      contentHeight: 100,
    });
    expect(pages).toEqual([]);
  });
});
