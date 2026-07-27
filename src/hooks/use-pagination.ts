import { useLayoutEffect, useRef, useState, type RefObject } from 'react';
import type { MdBlock } from '../lib/markdown/blocks';
import { paginateBlocks } from '../lib/pagination/paginate';

/**
 * Mide los bloques renderizados en el contenedor oculto y los reparte en
 * páginas. Se vuelve a medir cuando cambia el contenido, la tipografía
 * manuscrita o la configuración del papel, y también cuando las fuentes
 * terminan de cargar (vía ResizeObserver).
 */
export function usePagination(
  measurerRef: RefObject<HTMLElement | null>,
  blocks: MdBlock[],
  contentHeightPx: number,
  measureKey: string,
): number[][] | null {
  const [pages, setPages] = useState<number[][] | null>(null);
  const prevKey = useRef(measureKey);

  // Al cambiar la clave de medición, descartamos de inmediato la paginación
  // anterior: nunca se renderiza una página vieja contra bloques nuevos.
  if (prevKey.current !== measureKey) {
    prevKey.current = measureKey;
    setPages(null);
  }

  useLayoutEffect(() => {
    const container = measurerRef.current;
    if (!container) return;

    const measure = (): void => {
      const children = Array.from(container.children) as HTMLElement[];
      const heights = children.map((child, index) => {
        if (blocks[index]?.pageBreak) return 0;
        const next = children[index + 1];
        if (next) return next.offsetTop - child.offsetTop;
        const marginBottom = Number.parseFloat(getComputedStyle(child).marginBottom) || 0;
        return child.offsetHeight + marginBottom;
      });
      setPages(
        paginateBlocks({
          heights,
          pageBreakBefore: blocks.map((b) => b.pageBreak),
          keepWithNext: blocks.map((b) => b.keepWithNext),
          contentHeight: contentHeightPx,
        }),
      );
    };

    measure();

    const observer = new ResizeObserver(() => {
      window.requestAnimationFrame(measure);
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [measurerRef, blocks, contentHeightPx, measureKey]);

  return pages;
}
