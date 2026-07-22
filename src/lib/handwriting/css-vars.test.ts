import { describe, expect, it } from 'vitest';
import type { HandwritingConfig } from '../../types/handwriting';
import { handCssVars } from './css-vars';
import { DEFAULT_HANDWRITING } from './presets';

const withStyle = (formulaStyle: HandwritingConfig['formulaStyle'], slant = 0): HandwritingConfig => ({
  ...DEFAULT_HANDWRITING,
  formulaStyle,
  slant,
});

const varOf = (vars: ReturnType<typeof handCssVars>, name: string): string =>
  (vars as unknown as Record<string, string>)[name];

describe('handCssVars · fórmulas', () => {
  it('manuscrita: fuente a mano en --formula-font y sin itálica sintética', () => {
    const vars = handCssVars(withStyle('manuscrita'));
    expect(varOf(vars, '--formula-font')).toContain('Caveat');
    expect(varOf(vars, '--formula-italic')).toBe('normal');
  });

  it('manuscrita: la inclinación de la fórmula sigue a la del texto, limitada', () => {
    expect(varOf(handCssVars(withStyle('manuscrita', -2)), '--formula-slant')).toBe('-2deg');
    // incluso con inclinación extrema, la fórmula no pasa de ±3°
    expect(varOf(handCssVars(withStyle('manuscrita', -8)), '--formula-slant')).toBe('-3deg');
    expect(varOf(handCssVars(withStyle('manuscrita', 8)), '--formula-slant')).toBe('3deg');
  });

  it('sutil: tipografía KaTeX con la inclinación del texto', () => {
    const vars = handCssVars(withStyle('sutil', -2));
    expect(varOf(vars, '--formula-font')).toBe('KaTeX_Main');
    expect(varOf(vars, '--formula-slant')).toBe('-2deg');
    expect(varOf(vars, '--formula-italic')).toBe('italic');
  });

  it('tipografica: KaTeX sin inclinación ni cambios', () => {
    const vars = handCssVars(withStyle('tipografica', 4));
    expect(varOf(vars, '--formula-font')).toBe('KaTeX_Main');
    expect(varOf(vars, '--formula-slant')).toBe('0deg');
    expect(varOf(vars, '--formula-italic')).toBe('italic');
  });

  it('documentos antiguos sin formulaStyle caen a manuscrita', () => {
    const legacy = { ...DEFAULT_HANDWRITING };
    delete (legacy as Partial<HandwritingConfig>).formulaStyle;
    const vars = handCssVars(legacy as HandwritingConfig);
    expect(varOf(vars, '--formula-font')).toContain('Caveat');
  });
});
