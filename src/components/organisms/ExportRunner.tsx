import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ClabethDocument } from '../../types/document';
import type { ExportOptions } from '../../types/export';
import { resolvePageIndices } from '../../lib/export/options';
import { buildPdf, captureNodeAsPng, downloadPngFiles } from '../../lib/export/capture';
import { pageDimensions } from '../../lib/paper/styles';
import { slugify } from '../../lib/utils/id';
import { PaginatedPreview } from './PaginatedPreview';

export interface ExportJob {
  options: ExportOptions;
  currentPage: number;
}

export interface ExportRunnerProps {
  document: ClabethDocument;
  job: ExportJob;
  onDone: (error: string | null) => void;
}

/**
 * Monta una vista paginada fuera de pantalla con el papel ajustado a las
 * opciones de exportación, captura las páginas pedidas y descarga el
 * archivo resultante. La exportación usa exactamente los mismos nodos de
 * página que la vista previa: lo que ves es lo que sale.
 *
 * Las páginas se capturan desde clones colocados en el DOM (fuera de la
 * vista y fuera del árbol de React): así las fuentes y estilos heredados
 * se resuelven igual que en la vista previa, y una re-medición de React
 * no puede cancelar ni corromper la captura a mitad de camino.
 */
export function ExportRunner({ document, job, onDone }: ExportRunnerProps) {
  const [snapshotElements, setSnapshotElements] = useState<HTMLElement[] | null>(null);
  const started = useRef(false);

  const exportPaper = useMemo(
    () => ({
      ...document.paper,
      header: job.options.includeHeader ? document.paper.header : '',
      footer: job.options.includeFooter ? document.paper.footer : '',
      pageNumbers: job.options.includePageNumbers && document.paper.pageNumbers,
    }),
    [document.paper, job.options],
  );

  // Registra las páginas una sola vez: los re-renders de la vista no deben
  // reiniciar ni cancelar la exportación en curso.
  const registerPages = useCallback((elements: HTMLElement[]) => {
    setSnapshotElements((previous) => previous ?? (elements.length > 0 ? elements : null));
  }, []);

  useEffect(() => {
    if (!snapshotElements || snapshotElements.length === 0 || started.current) return;
    started.current = true;

    void (async () => {
      try {
        await window.document.fonts.ready;
        const indices = resolvePageIndices(job.options, snapshotElements.length, job.currentPage);
        const images: string[] = [];
        for (const index of indices) {
          // Clon de la página dentro del documento, lejos de la vista y de React.
          const clone = snapshotElements[index].cloneNode(true) as HTMLElement;
          clone.style.position = 'fixed';
          clone.style.left = '-10000px';
          clone.style.top = '0';
          clone.style.zIndex = '-1';
          window.document.body!.appendChild(clone);
          try {
            images.push(
              await captureNodeAsPng(clone, job.options.scale, !job.options.includeBackground),
            );
          } finally {
            clone.remove();
          }
        }

        const base = `clabeth-${slugify(document.title)}`;
        if (job.options.format === 'png') {
          await downloadPngFiles(images, base);
        } else {
          await buildPdf(
            images,
            pageDimensions(exportPaper.size, exportPaper.orientation),
            exportPaper.orientation,
            `${base}.pdf`,
          );
        }
        onDone(null);
      } catch (error) {
        console.error('[ExportRunner] error:', error);
        onDone('No se pudo generar la exportación. Inténtalo de nuevo.');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snapshotElements]);

  return (
    <div aria-hidden className="pointer-events-none fixed left-[-10000px] top-0">
      <div className="w-max">
        <PaginatedPreview
          document={document}
          paperOverride={exportPaper}
          interactive={false}
          mode="continua"
          zoom={1}
          registerPages={registerPages}
        />
      </div>
    </div>
  );
}
