import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { createDocument } from '../../lib/defaults';
import { splitIntoBlocks } from '../../lib/markdown/blocks';
import { PreviewPage } from './PreviewPage';

const doc = createDocument({ title: 'Prueba' });
const blocks = splitIntoBlocks('# Título\n\nUn párrafo de prueba.');

describe('PreviewPage · fidelidad', () => {
  it('dibuja la capa Canvas en modo manuscrito', () => {
    const { container } = render(
      <PreviewPage document={doc} blocks={blocks} pageIndex={0} totalPages={1} />,
    );
    expect(container.querySelector('canvas.handwriting-canvas')).not.toBeNull();
  });

  it('omite el Canvas en modo borrador y deja la escritura del DOM visible', () => {
    const { container } = render(
      <PreviewPage
        document={doc}
        blocks={blocks}
        pageIndex={0}
        totalPages={1}
        quality="borrador"
      />,
    );

    expect(container.querySelector('canvas.handwriting-canvas')).toBeNull();
    // Sin `canvas-handwriting-ready`, la tinta del DOM conserva su color.
    expect(container.querySelector('.page')).not.toHaveClass('canvas-handwriting-ready');
    expect(container.querySelector('.page-content')?.textContent).toContain('Un párrafo de prueba.');
  });
});
