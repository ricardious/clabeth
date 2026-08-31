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
