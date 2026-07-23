import { describe, expect, it } from 'vitest';
import { splitIntoBlocks, PAGEBREAK_TOKEN } from './blocks';

describe('splitIntoBlocks', () => {
  it('devuelve vacío para contenido vacío', () => {
    expect(splitIntoBlocks('')).toEqual([]);
    expect(splitIntoBlocks('   \n  ')).toEqual([]);
  });

  it('divide por bloques de primer nivel', () => {
    const blocks = splitIntoBlocks('# Título\n\nUn párrafo.\n\n- a\n- b');
    expect(blocks.length).toBe(3);
    expect(blocks[0].markdown).toBe('# Título');
    expect(blocks[0].keepWithNext).toBe(true);
    expect(blocks[2].markdown).toBe('- a\n- b');
  });

  it('marca los saltos de página explícitos', () => {
    const blocks = splitIntoBlocks('párrafo uno\n\n\\newpage\n\npárrafo dos');
    expect(blocks.map((b) => b.pageBreak)).toEqual([false, true, false]);
  });

  it('el salto de página no conserva contenido', () => {
    const blocks = splitIntoBlocks(`a\n\n${PAGEBREAK_TOKEN}\n\nb`);
    expect(blocks[1].markdown).toBe('');
  });

  it('las listas numeradas son un solo bloque', () => {
    const blocks = splitIntoBlocks('1. uno\n2. dos\n3. tres');
    expect(blocks.length).toBe(1);
  });

  it('conserva las fórmulas LaTeX dentro del bloque', () => {
    const blocks = splitIntoBlocks('La energía es $E = mc^2$.\n\n$$f(x) = x^2$$');
    expect(blocks[0].markdown).toContain('$E = mc^2$');
    expect(blocks[1].markdown).toContain('$$');
  });

  it('los encabezados llevan keepWithNext', () => {
    const blocks = splitIntoBlocks('## Sección');
    expect(blocks[0].keepWithNext).toBe(true);
  });
});
