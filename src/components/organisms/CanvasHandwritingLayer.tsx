import { useLayoutEffect, useRef } from 'react';
import type { RefObject } from 'react';
import type { HandwritingConfig } from '../../lib/types/handwriting';
import type { PaperConfig } from '../../lib/types/paper';
import { collectPositionedGlyphs } from '../../lib/handwriting/dom-glyphs';
import { renderHandwritingCanvas } from '../../lib/handwriting/canvas-renderer';

export type CanvasRenderState = 'scheduled' | 'rendering' | 'ready' | 'error';

interface CanvasHandwritingLayerProps {
  pageRef: RefObject<HTMLElement | null>;
  sourceRef: RefObject<HTMLDivElement | null>;
  width: number;
  height: number;
  seed: string;
  renderKey: string;
  handwriting: HandwritingConfig;
  paper: PaperConfig;
  onRenderStateChange?: (state: CanvasRenderState) => void;
}

function cssNumber(style: CSSStyleDeclaration, property: string, fallback: number): number {
  const value = Number.parseFloat(style.getPropertyValue(property));
  return Number.isFinite(value) ? value : fallback;
}

/** Única capa React nueva: sincroniza el DOM medido con el motor Canvas puro. */
export function CanvasHandwritingLayer({
  pageRef,
  sourceRef,
  width,
  height,
  seed,
  renderKey,
  handwriting,
  paper,
  onRenderStateChange,
}: CanvasHandwritingLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // El aviso de estado no describe *qué* dibujar, así que no puede estar entre
  // las dependencias del efecto: una identidad nueva (un callback en línea del
  // padre, por ejemplo al cambiar de pestaña del inspector) provocaba un
  // repintado completo de la hoja sin que el documento hubiera cambiado.
  // La ref se actualiza antes que el efecto de dibujado porque se declara antes.
  const notifyRef = useRef(onRenderStateChange);
  useLayoutEffect(() => {
    notifyRef.current = onRenderStateChange;
  });
  const notify = (state: CanvasRenderState): void => notifyRef.current?.(state);

  useLayoutEffect(() => {
    let disposed = false;
    let frame = 0;
    let timer = 0;
    const canvas = canvasRef.current;
    const page = pageRef.current ?? canvas?.closest<HTMLElement>('.page') ?? null;
    const source = sourceRef.current ?? page?.querySelector<HTMLDivElement>('.canvas-handwriting-source') ?? null;
    if (!page || !source || !canvas) return;
    canvas.dataset.renderState = 'scheduled';
    notify('scheduled');

    const draw = async (): Promise<void> => {
      await window.document.fonts.ready;
      if (disposed) return;
      frame = window.requestAnimationFrame(() => {
        void (async () => {
          try {
            canvas.dataset.renderState = 'rendering';
            notify('rendering');
            const pageStyle = window.getComputedStyle(page);
            const glyphs = collectPositionedGlyphs(source, page, handwriting.inkId);
            const metrics = await renderHandwritingCanvas(canvas, {
              width,
              height,
              quality: 2,
              seed,
              realismLevel: 2,
              glyphs,
              handwriting,
              paper: {
                style: paper.style,
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
            if (!disposed) {
              canvas.dataset.renderState = 'ready';
              canvas.dataset.renderMs = metrics.durationMs.toFixed(1);
              canvas.dataset.glyphCount = String(metrics.glyphCount);
              delete canvas.dataset.renderError;
              page.classList.add('canvas-handwriting-ready');
              notify('ready');
            }
          } catch (error) {
            // El DOM sigue visible como fallback si Canvas o la textura fallan.
            if (!disposed) {
              canvas.dataset.renderState = 'error';
              canvas.dataset.renderError = error instanceof Error ? error.message : 'Error de render desconocido';
              page.classList.remove('canvas-handwriting-ready');
              notify('error');
            }
          }
        })();
      });
    };

    // Un pequeño debounce evita repintar una página completa por cada tecla.
    timer = window.setTimeout(() => void draw(), 70);
    const observer = new ResizeObserver(() => {
      window.clearTimeout(timer);
      window.cancelAnimationFrame(frame);
      timer = window.setTimeout(() => void draw(), 70);
    });
    observer.observe(source);

    return () => {
      disposed = true;
      observer.disconnect();
      window.clearTimeout(timer);
      window.cancelAnimationFrame(frame);
      page.classList.remove('canvas-handwriting-ready');
    };
    // `notify` se lee desde una ref a propósito: avisar del estado no debe
    // disparar un redibujado.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height, handwriting, pageRef, paper, renderKey, seed, sourceRef, width]);

  return <canvas ref={canvasRef} className="handwriting-canvas" aria-hidden="true" />;
}
