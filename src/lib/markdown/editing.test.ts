import { describe, expect, it } from 'vitest';
import { insertBlock, prefixLines, wrapMath, wrapSelection } from './editing';

describe('wrapSelection', () => {
  it('envuelve la selección con marcadores', () => {
    const result = wrapSelection('hola mundo', 0, 4, '**');
    expect(result.text).toBe('**hola** mundo');
    expect(result.selectionStart).toBe(2);
    expect(result.selectionEnd).toBe(6);
  });

  it('desenvuelve si ya está envuelto', () => {
    const result = wrapSelection('**hola** mundo', 2, 6, '**');
    expect(result.text).toBe('hola mundo');
    expect(result.selectionStart).toBe(0);
    expect(result.selectionEnd).toBe(4);
  });

  it('inserta un placeholder si no hay selección', () => {
    const result = wrapSelection('', 0, 0, '*');
    expect(result.text).toBe('*texto*');
  });

  it('soporta marcadores asimétricos', () => {
    const result = wrapSelection('x', 0, 1, '[', '](https://)');
    expect(result.text).toBe('[x](https://)');
  });
});

describe('prefixLines', () => {
  it('añade prefijo a cada línea seleccionada', () => {
    const result = prefixLines('uno\ndos\ntres', 0, 11, '- ');
    expect(result.text).toBe('- uno\n- dos\n- tres');
  });

  it('no toca las líneas vacías', () => {
    const result = prefixLines('a\n\nb', 0, 4, '> ');
    expect(result.text).toBe('> a\n\n> b');
  });

  it('soporta prefijo por índice (listas numeradas)', () => {
    const result = prefixLines('a\nb', 0, 3, (i) => `${i + 1}. `);
    expect(result.text).toBe('1. a\n2. b');
  });

  it('respeta la selección a mitad de línea', () => {
    const result = prefixLines('hola mundo', 6, 9, '- ');
    expect(result.text).toBe('- hola mundo');
  });
});

describe('insertBlock', () => {
  it('rodea el bloque con saltos de línea', () => {
    const result = insertBlock('abc', 3, 3, '---');
    expect(result.text).toBe('abc\n\n---\n');
  });

  it('inserta al inicio sin salto previo', () => {
    const result = insertBlock('abc', 0, 0, '---');
    expect(result.text).toBe('---\n\nabc');
  });

  it('si ya hay salto después, no lo duplica', () => {
    const result = insertBlock('a\n\nb', 1, 1, '---');
    expect(result.text).toBe('a\n\n---\n\nb');
  });
});

describe('wrapMath', () => {
  it('envuelve en inline con cursor dentro', () => {
    const result = wrapMath('', 0, 0, '\\alpha', 'inline');
    expect(result.text).toBe('$\\alpha$');
    expect(result.selectionStart).toBe(result.selectionEnd);
    expect(result.selectionStart).toBeGreaterThan(0);
  });

  it('envuelve en bloque', () => {
    const result = wrapMath('x', 0, 1, 'a=b', 'block');
    expect(result.text).toContain('$$\na=b\n$$');
  });
});
