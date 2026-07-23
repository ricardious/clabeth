export interface PaginateInput {
  /** Altura apilada de cada bloque en px (incluye su separación vertical). */
  heights: number[];
  /** El bloque fuerza un salto de página antes de sí. */
  pageBreakBefore: boolean[];
  /** El bloque no debe quedar solo al pie de una página. */
  keepWithNext: boolean[];
  /** Altura útil del contenido de la página en px. */
  contentHeight: number;
}

/**
 * Reparte los bloques en páginas. Un bloque que por sí solo supera la
 * altura útil se queda solo en su página y se desborda (tablas largas,
 * bloques de código extensos): es un límite conocido y declarado.
 */
export function paginateBlocks(input: PaginateInput): number[][] {
  const { heights, pageBreakBefore, keepWithNext, contentHeight } = input;
  const pages: number[][] = [];
  let current: number[] = [];
  let used = 0;

  const flush = (): void => {
    if (current.length > 0) {
      pages.push(current);
      current = [];
      used = 0;
    }
  };

  heights.forEach((height, index) => {
    if (pageBreakBefore[index]) flush();
    if (current.length > 0 && used + height > contentHeight) flush();
    current.push(index);
    used += height;
  });
  flush();

  // keep-with-next: un encabezado no se queda solo al final de la página.
  for (let p = 0; p < pages.length - 1; p += 1) {
    const page = pages[p];
    const last = page[page.length - 1];
    if (keepWithNext[last]) {
      page.pop();
      pages[p + 1].unshift(last);
      if (page.length === 0) {
        pages.splice(p, 1);
        p -= 1;
      }
    }
  }

  return pages;
}
