import type { HandwritingConfig, HandwritingPreset } from '../types/handwriting';

export type HandwritingStyleConfig = Omit<HandwritingConfig, 'fontId'>;

export const DEFAULT_HANDWRITING: HandwritingConfig = {
  fontId: 'patrick',
  fontSize: 22,
  lineHeight: 1.9,
  letterSpacing: 0,
  wordSpacing: 2,
  slant: 0,
  weight: 400,
  inkId: 'grafito',
  headingInkId: 'grafito',
  opacity: 0.92,
  jitterY: 1,
  jitterRot: 0.4,
  formulaStyle: 'manuscrita',
};

export const HANDWRITING_PRESETS: HandwritingPreset[] = [
  {
    id: 'clara',
    name: 'Clara',
    description: 'Limpia y legible, como apuntes repasados.',
    config: { ...DEFAULT_HANDWRITING },
  },
  {
    id: 'escolar',
    name: 'Escolar',
    description: 'Trazo redondo de rotulador y tinta azul.',
    config: {
      fontId: 'gochi',
      fontSize: 19,
      lineHeight: 2.05,
      letterSpacing: 0.4,
      wordSpacing: 2,
      slant: 0,
      weight: 400,
      inkId: 'azul',
      headingInkId: 'azul',
      opacity: 0.95,
      jitterY: 1.4,
      jitterRot: 0.7,
      formulaStyle: 'manuscrita',
    },
  },
  {
    id: 'tecnica',
    name: 'Técnica',
    description: 'Letra de plano: uniforme, compacta, precisa.',
    config: {
      fontId: 'hw-3',
      fontSize: 17,
      lineHeight: 1.95,
      letterSpacing: 0.8,
      wordSpacing: 2.5,
      slant: 0,
      weight: 400,
      inkId: 'grafito',
      headingInkId: 'grafito',
      opacity: 0.92,
      jitterY: 0.5,
      jitterRot: 0.2,
      formulaStyle: 'manuscrita',
    },
  },
  {
    id: 'cursiva',
    name: 'Cursiva',
    description: 'Caligrafía enlazada de cuaderno personal.',
    config: {
      fontId: 'nothing-you-could-do',
      fontSize: 21,
      lineHeight: 2.0,
      letterSpacing: 0,
      wordSpacing: 3,
      slant: -2,
      weight: 400,
      inkId: 'azul',
      headingInkId: 'azul',
      opacity: 0.96,
      jitterY: 1,
      jitterRot: 0.5,
      formulaStyle: 'manuscrita',
    },
  },
  {
    id: 'apuntes',
    name: 'Apuntes',
    description: 'Rápida y ligera, con energía de clase.',
    config: {
      fontId: 'playwrite-es',
      fontSize: 20,
      lineHeight: 1.8,
      letterSpacing: 0.5,
      wordSpacing: 2,
      slant: 0,
      weight: 400,
      inkId: 'grafito',
      headingInkId: 'grafito',
      opacity: 0.94,
      jitterY: 0.7,
      jitterRot: 0.35,
      formulaStyle: 'manuscrita',
    },
  },
  {
    id: 'elegante',
    name: 'Elegante',
    description: 'Pluma firme y tinta roja: la firma de la casa.',
    config: {
      fontId: 'give-you-glory',
      fontSize: 24,
      lineHeight: 1.95,
      letterSpacing: 0.3,
      wordSpacing: 3,
      slant: -1.5,
      weight: 700,
      inkId: 'rojo',
      headingInkId: 'rojo',
      opacity: 0.95,
      jitterY: 0.8,
      jitterRot: 0.4,
      formulaStyle: 'manuscrita',
    },
  },
];

export function getPreset(id: string): HandwritingPreset {
  return HANDWRITING_PRESETS.find((preset) => preset.id === id) ?? HANDWRITING_PRESETS[0];
}

/** Devuelve únicamente los ajustes de trazo del preset, sin cambiar la fuente. */
export function getPresetStyle(id: string): HandwritingStyleConfig {
  const { fontId: _fontId, ...style } = getPreset(id).config;
  return style;
}

/**
 * Rellena los campos que los documentos antiguos no tienen, para poder
 * compararlos con un preset sin que la ausencia cuente como diferencia.
 */
function normalizeStyle(style: HandwritingStyleConfig): HandwritingStyleConfig {
  return {
    ...style,
    headingInkId: style.headingInkId ?? style.inkId,
    formulaStyle: style.formulaStyle ?? 'manuscrita',
  };
}

/** Comprueba el estilo visual independientemente de la fuente seleccionada. */
export function matchesPresetStyle(config: HandwritingConfig, preset: HandwritingPreset): boolean {
  const { fontId: _currentFontId, ...currentStyle } = config;
  const keys = Object.keys(normalizeStyle(getPresetStyle(preset.id))).sort();
  const pick = (style: HandwritingStyleConfig): unknown[] => {
    const normalized = normalizeStyle(style) as Record<string, unknown>;
    return keys.map((key) => normalized[key]);
  };
  return JSON.stringify(pick(currentStyle)) === JSON.stringify(pick(getPresetStyle(preset.id)));
}
