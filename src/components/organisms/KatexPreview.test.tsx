import { render, waitFor } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { KatexPreview } from './LatexPalette';

/**
 * jsdom no maqueta, así que las medidas se simulan. La caja exterior es la
 * tarjeta (tamaño fijo) y la interior el contenido de KaTeX, que se distingue
 * por ser el único `inline-block`.
 */
const DEFAULT_LAYOUT = { box: { width: 120, height: 40 }, content: { width: 240, height: 80 } };
let LAYOUT = structuredClone(DEFAULT_LAYOUT);
const PROPS = ['offsetWidth', 'offsetHeight', 'clientWidth', 'clientHeight'] as const;
const original = new Map<string, PropertyDescriptor | undefined>();

beforeAll(() => {
  for (const prop of PROPS) {
    original.set(prop, Object.getOwnPropertyDescriptor(HTMLElement.prototype, prop));
    Object.defineProperty(HTMLElement.prototype, prop, {
      configurable: true,
      get(this: HTMLElement) {
        const size = this.className.includes('inline-block') ? LAYOUT.content : LAYOUT.box;
        return prop.endsWith('Width') ? size.width : size.height;
      },
    });
  }
});

afterEach(() => {
  LAYOUT = structuredClone(DEFAULT_LAYOUT);
});

afterAll(() => {
  for (const prop of PROPS) {
    const descriptor = original.get(prop);
    if (descriptor) Object.defineProperty(HTMLElement.prototype, prop, descriptor);
    else delete (HTMLElement.prototype as unknown as Record<string, unknown>)[prop];
  }
});

const content = (container: HTMLElement): HTMLElement =>
  container.querySelector<HTMLElement>('.inline-block')!;

describe('KatexPreview · ajuste a la tarjeta', () => {
  it('reduce una fórmula que no cabe en lugar de recortarla', async () => {
    // 240×80 dentro de 120×40 → el factor limitante es 0.5 en ambos ejes.
    const { container } = render(<KatexPreview latex="\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}" />);
    await waitFor(() => expect(content(container).style.transform).toBe('scale(0.5)'));
  });

  it('escala por el eje más ajustado', async () => {
    LAYOUT.content = { width: 480, height: 50 }; // demasiado ancha, cabe de alto
    const { container } = render(<KatexPreview latex="x" />);
    await waitFor(() => expect(content(container).style.transform).toBe('scale(0.25)'));
  });

  it('no agranda una fórmula que ya cabe', async () => {
    LAYOUT.content = { width: 30, height: 16 };
    const { container } = render(<KatexPreview latex="\\alpha" />);
    await waitFor(() => expect(content(container).innerHTML).toContain('katex'));
    expect(content(container).style.transform).toBe('');
  });

  it('no recorta: la caja deja de esconder lo que sobra por tamaño', async () => {
    const { container } = render(<KatexPreview latex="\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}" />);
    await waitFor(() => expect(content(container).style.transform).toBe('scale(0.5)'));

    // El contenido sigue completo en el DOM; solo se dibuja más pequeño.
    const html = content(container).innerHTML;
    expect(html).toContain('katex');
    expect(html.length).toBeGreaterThan(200);
  });
});
