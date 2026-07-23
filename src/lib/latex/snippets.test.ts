import { describe, expect, it } from 'vitest';
import katex from 'katex';
import { LATEX_SNIPPETS } from './snippets';

describe('catálogo de snippets LaTeX', () => {
  it('todas las fórmulas son sintácticamente válidas', () => {
    for (const snippet of LATEX_SNIPPETS) {
      expect(() =>
        katex.renderToString(snippet.latex, { throwOnError: true, strict: false }),
      ).not.toThrow();
    }
  });

  it('no hay ids duplicados', () => {
    const ids = new Set(LATEX_SNIPPETS.map((s) => s.id));
    expect(ids.size).toBe(LATEX_SNIPPETS.length);
  });

  it('todas tienen etiqueta, latex y modo válidos', () => {
    for (const snippet of LATEX_SNIPPETS) {
      expect(snippet.label.length).toBeGreaterThan(0);
      expect(snippet.latex.length).toBeGreaterThan(0);
      expect(['inline', 'block']).toContain(snippet.mode);
    }
  });

  it('cubre las categorías requeridas', () => {
    const categories = new Set(LATEX_SNIPPETS.map((s) => s.category));
    for (const required of ['Estructuras', 'Cálculo', 'Matrices y vectores', 'Sistemas', 'Trigonometría', 'Griegas']) {
      expect(categories.has(required)).toBe(true);
    }
  });
});
