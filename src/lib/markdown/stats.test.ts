import { describe, expect, it } from 'vitest';
import { plainText, textStats, estimatePages } from './stats';

describe('textStats', () => {
  it('cuenta palabras de texto plano', () => {
    expect(textStats('hola mundo cruel').words).toBe(3);
  });

  it('ignora la sintaxis Markdown al contar', () => {
    const md = '# Título\n\nEste es **un** párrafo con *énfasis* y [un enlace](https://x.com).';
    expect(textStats(md).words).toBe(10);
  });

  it('trata las fórmulas como una palabra', () => {
    const md = 'La energía es $E = mc^2$ y ya.';
    expect(textStats(md).words).toBe(6);
  });

  it('cuenta caracteres totales y sin espacios', () => {
    const stats = textStats('a b c');
    expect(stats.characters).toBe(5);
    expect(stats.charactersNoSpaces).toBe(3);
  });

  it('maneja palabras con acentos y guiones', () => {
    expect(textStats('canción árbol ayer-eh').words).toBe(3);
  });

  it('no cuenta los marcadores de tareas', () => {
    expect(textStats('- [ ] pendiente\n- [x] hecho').words).toBe(2);
  });

  it('devuelve cero para texto vacío', () => {
    expect(textStats('').words).toBe(0);
  });
});

describe('plainText', () => {
  it('extrae el texto visible de un enlace', () => {
    expect(plainText('[texto visible](https://x.com)')).toBe('texto visible');
  });
});

describe('estimatePages', () => {
  it('devuelve al menos una página', () => {
    expect(estimatePages(0, 22, 1.9, 600, 900)).toBe(1);
  });

  it('escala con la cantidad de palabras', () => {
    const one = estimatePages(50, 32, 2.2, 600, 900);
    const many = estimatePages(900, 32, 2.2, 600, 900);
    expect(many).toBeGreaterThan(one);
  });

  it('reduce la capacidad con letra más grande', () => {
    const small = estimatePages(200, 16, 1.8, 600, 900);
    const large = estimatePages(200, 30, 2.2, 600, 900);
    expect(large).toBeGreaterThanOrEqual(small);
  });
});
