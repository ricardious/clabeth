import { describe, expect, it } from 'vitest';
import type { HandwritingConfig } from '../types/handwriting';
import { handCssVars } from './css-vars';
import { getHeadingInkId } from './inks';
import { DEFAULT_HANDWRITING, getPreset, matchesPresetStyle } from './presets';

const config = (patch: Partial<HandwritingConfig> = {}): HandwritingConfig => ({
  ...DEFAULT_HANDWRITING,
  ...patch,
});

describe('tinta de los títulos', () => {
  it('sin elección propia usa la del texto', () => {
    // Es el caso de los documentos anteriores al campo: su aspecto no cambia.
    const { headingInkId: _omitted, ...legacy } = config({ inkId: 'azul' });
    expect(getHeadingInkId(legacy as HandwritingConfig)).toBe('azul');
  });

  it('con elección propia la respeta', () => {
    expect(getHeadingInkId(config({ inkId: 'grafito', headingInkId: 'rojo' }))).toBe('rojo');
  });

  it('publica color e identificador para el CSS y para el motor', () => {
    const vars = handCssVars(config({ inkId: 'grafito', headingInkId: 'rojo' }));

    expect(vars['--hand-ink']).toBe('var(--ink-grafito)');
    expect(vars['--hand-heading-ink']).toBe('var(--ink-rojo)');
    // El motor Canvas necesita el id, no solo el color: el perfil de cada tinta
    // define además su sangrado y su absorción.
    expect(vars['--hand-ink-id']).toBe('grafito');
    expect(vars['--hand-heading-ink-id']).toBe('rojo');
  });

  it('un documento antiguo publica la misma tinta en ambos', () => {
    const { headingInkId: _omitted, ...legacy } = config({ inkId: 'verde' });
    const vars = handCssVars(legacy as HandwritingConfig);

    expect(vars['--hand-heading-ink']).toBe(vars['--hand-ink']);
    expect(vars['--hand-heading-ink-id']).toBe('verde');
  });

  it('un documento antiguo sigue reconociendo su preset', () => {
    // `matchesPresetStyle` compara el estilo completo: sin normalizar, la
    // ausencia del campo contaría como diferencia y el panel no marcaría nada.
    const elegante = getPreset('elegante');
    const { headingInkId: _omitted, ...legacy } = { ...elegante.config };

    expect(matchesPresetStyle(legacy as HandwritingConfig, elegante)).toBe(true);
  });

  it('cambiar solo la tinta de los títulos deja de coincidir con el preset', () => {
    const elegante = getPreset('elegante');
    const changed = { ...elegante.config, headingInkId: 'verde' };

    expect(matchesPresetStyle(changed, elegante)).toBe(false);
  });
});
