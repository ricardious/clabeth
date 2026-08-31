import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ClabethDocument } from '../../lib/types/document';
import type { ExportOptions, ExportProgress } from '../../lib/types/export';
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
  onProgress: (progress: ExportProgress) => void;
  onDone: (error: string | null) => void;
}

/**
 * Monta una vista paginada fuera de pantalla con el papel ajustado a las
 * opciones de exportación, captura las páginas pedidas y descarga el
 * archivo resultante. La exportación usa exactamente los mismos nodos de
 * página que la vista previa: lo que ves es lo que sale.
 *
 * La vista de exportación ya está montada fuera de pantalla. Se captura el
 * nodo vivo porque cloneNode no copia el bitmap interno de un canvas.
 */
export function ExportRunner({ document, job, onProgress, onDone }: ExportRunnerProps) {
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
        onProgress({ phase: 'preparing', current: 0, total: 0 });
        await window.document.fonts.ready;
        const indices = resolvePageIndices(job.options, snapshotElements.length, job.currentPage);
        const images: string[] = [];
        for (const [position, index] of indices.entries()) {
          onProgress({ phase: 'rendering', current: position + 1, total: indices.length });
          const page = snapshotElements[index];
          const canvas = page.querySelector<HTMLCanvasElement>('.handwriting-canvas');
          // registerPages ocurre antes del render asíncrono del papel. Esperar
          // evita exportar el canvas vacío de 300×150 que crea el navegador.
          if (canvas) {
            const deadline = performance.now() + 5000;
            while (canvas.dataset.renderState !== 'ready' && canvas.dataset.renderState !== 'error') {
              if (performance.now() >= deadline) break;
              await new Promise((resolve) => window.setTimeout(resolve, 30));
            }
          }
          images.push(
            await captureNodeAsPng(page, job.options.scale, !job.options.includeBackground),
          );
        }

        onProgress({ phase: 'finishing', current: indices.length, total: indices.length });
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
