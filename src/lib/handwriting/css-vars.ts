import type { CSSProperties } from 'react';
import type { HandwritingConfig } from '../../types/handwriting';
import { getHandwritingFont } from './fonts';
import { getInk } from './inks';

const KATEX_MAIN = 'KaTeX_Main';

/** La inclinación de las fórmulas se limita para conservar la legibilidad. */
function formulaSlantDeg(slant: number): number {
  return Math.max(-3, Math.min(3, slant));
}

/**
 * Variables CSS dinámicas de la escritura. Es el único lugar (junto con las
 * muestras de tinta/fuente) donde se asignan estilos inline, tal como
 * permite la especificación: variables relacionadas con escritura y papel.
 */
export function handCssVars(hand: HandwritingConfig, contentTopPx = 0): CSSProperties {
  const lineHeightPx = hand.fontSize * hand.lineHeight;
  const slantClamped = formulaSlantDeg(hand.slant);

  // Apariencia de las fórmulas: manuscrita (letras en la fuente a mano con
  // símbolos precisos de KaTeX), sutil (KaTeX con inclinación) o tipográfica.
  const formulaStyle = hand.formulaStyle ?? 'manuscrita';
  let formulaFont = KATEX_MAIN;
  let formulaItalic = 'italic';
  let formulaSlant = '0deg';
  if (formulaStyle === 'manuscrita') {
    formulaFont = getHandwritingFont(hand.fontId).family;
    formulaItalic = 'normal';
    formulaSlant = `${slantClamped}deg`;
  } else if (formulaStyle === 'sutil') {
    formulaSlant = `${slantClamped}deg`;
  }

  const vars: Record<string, string> = {
    '--font-hand': getHandwritingFont(hand.fontId).family,
    '--hand-size': `${hand.fontSize}px`,
    '--hand-leading': String(hand.lineHeight),
    '--hand-tracking': `${hand.letterSpacing}px`,
    '--hand-word-spacing': `${hand.wordSpacing}px`,
    '--hand-slant': `${hand.slant}deg`,
    '--hand-weight': String(hand.weight),
    '--hand-ink': `var(${getInk(hand.inkId).token})`,
    '--hand-opacity': String(hand.opacity),
    '--formula-font': formulaFont,
    '--formula-slant': formulaSlant,
    '--formula-italic': formulaItalic,
    // Reglura alineada al interlineado real de la escritura.
    '--_line-h': `${lineHeightPx}px`,
    '--_line-offset': `${contentTopPx + lineHeightPx * 0.85}px`,
    '--_grid': `${Math.round(hand.fontSize * 1.45)}px`,
  };
  return vars as CSSProperties;
}
