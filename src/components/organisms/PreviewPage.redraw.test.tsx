import { render, waitFor } from '@testing-library/react';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { createDocument } from '../../lib/defaults';
import { splitIntoBlocks } from '../../lib/markdown/blocks';
import { renderHandwritingCanvas } from '../../lib/handwriting/canvas-renderer';
import { PreviewPage } from './PreviewPage';

vi.mock('../../lib/handwriting/canvas-renderer', () => ({
  renderHandwritingCanvas: vi.fn(async () => ({ durationMs: 1, glyphCount: 0 })),
}));
vi.mock('../../lib/handwriting/dom-glyphs', () => ({
  collectPositionedGlyphs: vi.fn(() => []),
}));

const drawn = vi.mocked(renderHandwritingCanvas);
const doc = createDocument({ title: 'Prueba' });
const blocks = splitIntoBlocks('# Título\n\nUn párrafo de prueba.');

beforeAll(() => {
  // jsdom no implementa document.fonts; la capa la espera antes de dibujar.
  Object.defineProperty(window.document, 'fonts', {
    configurable: true,
    value: { ready: Promise.resolve() },
  });
});

beforeEach(() => drawn.mockClear());

describe('PreviewPage · redibujado', () => {
  it('pinta sin espera la primera vez, y agrupa los cambios posteriores', async () => {
    const schedule = vi.spyOn(window, 'setTimeout');
    const delays = (): number[] =>
      schedule.mock.calls.map((call) => call[1]).filter((d): d is number => d === 0 || d === 70);

    const { rerender } = render(
      <PreviewPage document={doc} blocks={blocks} pageIndex={0} totalPages={1} />,
    );
    await waitFor(() => expect(drawn).toHaveBeenCalledTimes(1));

    // Al montar una hoja no hay nada que agrupar: se pinta ya. Ocurre al volver
    // a la vista continua y al pasar de página, que es cuando se notaba.
    expect(delays()[0]).toBe(0);

    schedule.mockClear();
    const restyled = { ...doc, handwriting: { ...doc.handwriting, inkId: 'azul' } };
    rerender(<PreviewPage document={restyled} blocks={blocks} pageIndex={0} totalPages={1} />);
    await waitFor(() => expect(drawn).toHaveBeenCalledTimes(2));

    // Ya pintada: un cambio de configuración sí espera, para que arrastrar un
    // deslizador no dispare una pintada por cada paso.
    expect(delays()[0]).toBe(70);
    schedule.mockRestore();
  });

  it('no vuelve a dibujar cuando solo cambia la identidad del callback', async () => {
    const { rerender } = render(
      <PreviewPage
        document={doc}
        blocks={blocks}
        pageIndex={0}
        totalPages={1}
        onRenderStateChange={() => undefined}
      />,
    );

    await waitFor(() => expect(drawn).toHaveBeenCalledTimes(1));

    // Es lo que ocurre al cambiar de pestaña del inspector: el documento no ha
    // cambiado, solo se ha vuelto a renderizar el árbol de React.
    rerender(
      <PreviewPage
        document={doc}
        blocks={blocks}
        pageIndex={0}
        totalPages={1}
        onRenderStateChange={() => undefined}
      />,
    );

    await new Promise((resolve) => setTimeout(resolve, 150));
    expect(drawn).toHaveBeenCalledTimes(1);
  });

  it('vuelve a dibujar cuando cambia la configuración manuscrita', async () => {
    const { rerender } = render(
      <PreviewPage document={doc} blocks={blocks} pageIndex={0} totalPages={1} />,
    );
    await waitFor(() => expect(drawn).toHaveBeenCalledTimes(1));

    const restyled = { ...doc, handwriting: { ...doc.handwriting, inkId: 'azul' } };
    rerender(<PreviewPage document={restyled} blocks={blocks} pageIndex={0} totalPages={1} />);

    await waitFor(() => expect(drawn).toHaveBeenCalledTimes(2));
  });
});
