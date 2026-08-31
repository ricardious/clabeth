import { describe, expect, it } from 'vitest';
import { needsWordSpans, wordVariation } from './jitter';
import { seededJitter } from '../utils/seeded-random';
import { HANDWRITING_PRESETS, DEFAULT_HANDWRITING } from './presets';
import { getHandwritingFont, HANDWRITING_FONTS } from './fonts';
import { INK_COLORS } from './inks';

describe('jitter', () => {
  it('es determinista para la misma semilla e índice', () => {
    expect(wordVariation('doc-1', 5, 2, 1)).toEqual(wordVariation('doc-1', 5, 2, 1));
  });

  it('cambia con el índice y con la semilla', () => {
    expect(wordVariation('doc-1', 5, 2, 1)).not.toEqual(wordVariation('doc-1', 6, 2, 1));
    expect(wordVariation('doc-1', 5, 2, 1)).not.toEqual(wordVariation('doc-2', 5, 2, 1));
  });

  it('respeta la amplitud máxima', () => {
    for (let i = 0; i < 200; i += 1) {
      const { dy, rot } = wordVariation('x', i, 3, 2);
      expect(Math.abs(dy)).toBeLessThanOrEqual(3.01);
      expect(Math.abs(rot)).toBeLessThanOrEqual(2.01);
    }
  });

  it('con amplitud cero devuelve variación nula', () => {
    const variation = wordVariation('x', 3, 0, 0);
    expect(variation.dy).toBe(0);
    expect(variation.rot).toBe(0);
    expect(variation.scaleX).toBe(1);
  });

  it('mantiene presión, escala y sangrado dentro de límites naturales', () => {
    for (let i = 0; i < 200; i += 1) {
      const variation = wordVariation('papel-real', i, 3, 2);
      expect(variation.scaleX).toBeGreaterThanOrEqual(0.98);
      expect(variation.scaleX).toBeLessThanOrEqual(1.02);
      expect(variation.pressure).toBeGreaterThanOrEqual(0.94);
      expect(variation.pressure).toBeLessThanOrEqual(1);
      expect(Math.abs(variation.bleedX)).toBeLessThanOrEqual(0.16);
      expect(Math.abs(variation.bleedY)).toBeLessThanOrEqual(0.12);
    }
  });

  it('seededJitter devuelve valores en [-1, 1]', () => {
    for (let i = 0; i < 100; i += 1) {
      const v = seededJitter('semilla', i);
      expect(v).toBeGreaterThanOrEqual(-1);
      expect(v).toBeLessThanOrEqual(1);
    }
  });
});

describe('needsWordSpans', () => {
  it('no envuelve palabras cuando todo está en cero', () => {
    expect(needsWordSpans(0, 0, 0)).toBe(false);
  });

  it('envuelve cuando hay cualquier variación', () => {
    expect(needsWordSpans(1, 0, 0)).toBe(true);
    expect(needsWordSpans(0, 1, 0)).toBe(true);
    expect(needsWordSpans(0, 0, -3)).toBe(true);
  });
});

describe('presets y catálogos', () => {
  it('todos los presets son únicos y completos', () => {
    const ids = new Set(HANDWRITING_PRESETS.map((p) => p.id));
    expect(ids.size).toBe(HANDWRITING_PRESETS.length);
    for (const preset of HANDWRITING_PRESETS) {
      expect(preset.config.fontId.length).toBeGreaterThan(0);
      expect(preset.config.inkId.length).toBeGreaterThan(0);
    }
  });

  it('el preset por defecto está completo', () => {
    expect(Object.keys(DEFAULT_HANDWRITING)).toHaveLength(12);
  });

  it('todos los presets usan fórmulas manuscritas por defecto', () => {
    for (const preset of HANDWRITING_PRESETS) {
      expect(preset.config.formulaStyle).toBe('manuscrita');
    }
  });

  it('toda fuente referenciada existe en el catálogo', () => {
    const fontIds = new Set(HANDWRITING_FONTS.map((f) => f.id));
    for (const preset of HANDWRITING_PRESETS) {
      expect(fontIds.has(preset.config.fontId)).toBe(true);
    }
  });

  it('los IDs antiguos con cobertura incompleta migran a fuentes con español', () => {
    expect(getHandwritingFont('hw-1').id).toBe('patrick');
    expect(getHandwritingFont('hw-2').id).toBe('gochi');
    expect(getHandwritingFont('hw-5').id).toBe('gochi');
    expect(getHandwritingFont('hw-6').id).toBe('playwrite-es');
    expect(getHandwritingFont('hw-8').id).toBe('patrick');
    expect(getHandwritingFont('hw-9').id).toBe('reenie');
    expect(getHandwritingFont('caveat').id).toBe('reenie');
    expect(getHandwritingFont('labelle').id).toBe('playwrite-es');
  });

  it('toda tinta referenciada existe en el catálogo', () => {
    const inkIds = new Set(INK_COLORS.map((i) => i.id));
    for (const preset of HANDWRITING_PRESETS) {
      expect(inkIds.has(preset.config.inkId)).toBe(true);
    }
  });
});
