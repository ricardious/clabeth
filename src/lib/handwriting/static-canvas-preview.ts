import type { HandwritingConfig } from '../types/handwriting';
import type { PaperStyleId } from '../types/paper';
import { renderHandwritingCanvas } from './canvas-renderer';
import { collectPositionedGlyphs } from './dom-glyphs';

interface StaticCanvasPreviewOptions {
  page: HTMLElement;
  source: HTMLElement;
  canvas: HTMLCanvasElement;
  seed: string;
  handwriting: HandwritingConfig;
  paperStyle: PaperStyleId;
}

export interface StaticCanvasPreviewController {
  render: () => Promise<void>;
  disconnect: () => void;
}

function cssNumber(style: CSSStyleDeclaration, property: string, fallback: number): number {
  const value = Number.parseFloat(style.getPropertyValue(property));
  return Number.isFinite(value) ? value : fallback;
}

/**
 * Lleva el acabado Canvas del editor a previews Astro que no necesitan una
 * isla React completa. El HTML manuscrito permanece visible como fallback.
 */
export function mountStaticCanvasPreview({
  page,
  source,
  canvas,
  seed,
  handwriting,
  paperStyle,
}: StaticCanvasPreviewOptions): StaticCanvasPreviewController {
  let disposed = false;
  let revision = 0;
  let timer = 0;
  let frame = 0;

  const render = async (): Promise<void> => {
    const currentRevision = ++revision;
    page.classList.remove('canvas-handwriting-ready');

    try {
      await window.document.fonts.ready;
      if (disposed || currentRevision !== revision) return;

      await new Promise<void>((resolve) => {
        frame = window.requestAnimationFrame(() => resolve());
      });
      if (disposed || currentRevision !== revision) return;

      const pageStyle = window.getComputedStyle(page);
      const width = page.offsetWidth;
      const height = page.offsetHeight;
      await renderHandwritingCanvas(canvas, {
        width,
        height,
        quality: 2,
        seed,
        realismLevel: 2,
        glyphs: collectPositionedGlyphs(source, page),
        handwriting,
        paper: {
          style: paperStyle,
          baseColor: pageStyle.backgroundColor,
          lineColor: pageStyle.getPropertyValue('--paper-line').trim(),
          marginColor: pageStyle.getPropertyValue('--paper-margin-line').trim(),
          lineHeight: cssNumber(pageStyle, '--_line-h', handwriting.fontSize * handwriting.lineHeight),
          lineOffset: cssNumber(pageStyle, '--_line-offset', 30),
          gridSize: cssNumber(pageStyle, '--_grid', 32),
          marginX: cssNumber(pageStyle, '--paper-margin-inline-start', 88) - 18,
          textureUrl: '/textures/handwriting/paper-scan.jpg',
        },
      });

      if (!disposed && currentRevision === revision) page.classList.add('canvas-handwriting-ready');
    } catch {
      // La versión DOM ya tiene fuente, tinta y jitter: es un fallback completo.
      if (!disposed && currentRevision === revision) page.classList.remove('canvas-handwriting-ready');
    }
  };

  const schedule = (): void => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => void render(), 70);
  };

  const observer = new ResizeObserver(schedule);
  observer.observe(page);
  schedule();

  return {
    render,
    disconnect: () => {
      disposed = true;
      revision += 1;
      observer.disconnect();
      window.clearTimeout(timer);
      window.cancelAnimationFrame(frame);
      page.classList.remove('canvas-handwriting-ready');
    },
  };
}
