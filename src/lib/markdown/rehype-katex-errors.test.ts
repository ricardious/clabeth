import { describe, expect, it } from 'vitest';
import { DEFAULT_HANDWRITING } from '../handwriting/presets';
import { renderMarkdown } from './render';

const render = (source: string) => renderMarkdown(source, 'test', DEFAULT_HANDWRITING);

/** Texto del chip, con las entidades HTML deshechas. */
function chipText(html: string): string | null {
  const match = html.match(/<span class="latex-error-chip"[^>]*>([\s\S]*?)<\/span>/);
  if (!match) return null;
  return match[1]!
    .replace(/&#x26;/g, '&')
    .replace(/&#x27;/g, "'")
    .replace(/&#x3C;/g, '<')
    .replace(/&amp;/g, '&');
}

describe('rehypeKatexErrors', () => {
  it('deja intactas las fórmulas válidas', async () => {
    const html = await render('$E = mc^2$');
    expect(html).toContain('katex');
    expect(html).not.toContain('latex-error-chip');
  });

  it('conserva la fuente completa de una fórmula en línea inválida', async () => {
    const html = await render('Antes $\\frac{1}{2$ después.');
    expect(chipText(html)).toBe('\\frac{1}{2');
  });

  it('conserva la fuente completa de una fórmula en bloque larga', async () => {
    // El caso que el CSS recortaba: una fuente larga debe llegar entera al DOM
    // para que el chip pueda mostrarla en varias líneas.
    const latex = '\\begin{aligned} x &= \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a} \\\\ y &= \\zeta{ \\end{aligned}';
    const html = await render(`Antes.\n\n$$\n${latex}\n$$\n\nDespués.`);

    const text = chipText(html);
    expect(text).toBe(latex);
    // Sin recortes: nada de puntos suspensivos en el contenido.
    expect(text).not.toContain('…');
    expect(text!.length).toBeGreaterThan(60);
  });

  it('conserva los saltos de línea y la sangría que escribió la persona', async () => {
    // El chip se pinta con `white-space: pre-wrap`: si la fuente llega con su
    // estructura, la fórmula rota se lee igual que en el editor.
    const html = await render('$$\n\\begin{aligned}\n  x &= 1 \\\\\n  y &= \\zeta{\n\\end{aligned}\n$$');
    const text = chipText(html);

    expect(text).toContain('\n');
    expect(text!.split('\n')).toHaveLength(4);
    expect(text).toContain('  x &= 1');
  });

  it('explica el motivo en el title, sin romper el resto del documento', async () => {
    const html = await render('Antes $\\frac{1}{2$ después.');
    expect(html).toMatch(/title="Fórmula LaTeX inválida — ParseError:/);
    expect(html).toContain('Antes');
    expect(html).toContain('después.');
  });
});
