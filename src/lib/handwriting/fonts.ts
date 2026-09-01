import type { HandwritingFont } from '../types/handwriting';

export const HANDWRITING_FONTS: HandwritingFont[] = [
  { id: 'hw-3', name: 'Manuscrita 3 · Royston', family: "'HW-3', cursive", weights: [400] },
  {
    id: 'playwrite-es',
    name: 'Playwrite España',
    family: "'Playwrite ES Variable', cursive",
    weights: [100, 200, 300, 400],
  },
  { id: 'reenie', name: 'Reenie Beanie', family: "'Reenie Beanie', cursive", weights: [400] },
  {
    id: 'nothing-you-could-do',
    name: 'Nothing You Could Do',
    family: "'Nothing You Could Do', cursive",
    weights: [400],
  },
  {
    id: 'just-me-again-down-here',
    name: 'Just Me Again Down Here',
    family: "'Just Me Again Down Here', cursive",
    weights: [400],
  },
  {
    id: 'give-you-glory',
    name: 'Give You Glory',
    family: "'Give You Glory', cursive",
    weights: [400],
  },
  { id: 'patrick', name: 'Patrick Hand', family: "'Patrick Hand', cursive", weights: [400] },
  { id: 'gochi', name: 'Gochi Hand', family: "'Gochi Hand', cursive", weights: [400] },
  {
    id: 'shadows',
    name: 'Shadows Into Light',
    family: "'Shadows Into Light', cursive",
    weights: [400],
  },
  {
    id: 'architects',
    name: 'Architects Daughter',
    family: "'Architects Daughter', cursive",
    weights: [400],
  },
];

export function getHandwritingFont(id: string): HandwritingFont {
  // Conservamos IDs retirados para que documentos guardados migren a una
  // fuente con español completo sin perder su configuración.
  //
  // hw-4 y hw-7 traían los glifos acentuados injertados de otra fuente: el
  // cuerpo de «á» estaba dibujado 2,1× y 3,4× más grueso que su propia «a»
  // (en las bien construidas la acentuada reutiliza el contorno exacto de la
  // base, 1,00×). Se retiraron por eso, no por falta de glifos.
  if (id === 'hw-1') return HANDWRITING_FONTS.find((font) => font.id === 'patrick')!;
  if (id === 'hw-2') return HANDWRITING_FONTS.find((font) => font.id === 'gochi')!;
  if (id === 'hw-5') return HANDWRITING_FONTS.find((font) => font.id === 'gochi')!;
  if (id === 'hw-6') return HANDWRITING_FONTS.find((font) => font.id === 'playwrite-es')!;
  if (id === 'hw-4') return HANDWRITING_FONTS.find((font) => font.id === 'nothing-you-could-do')!;
  if (id === 'hw-7') return HANDWRITING_FONTS.find((font) => font.id === 'give-you-glory')!;
  if (id === 'hw-8') return HANDWRITING_FONTS.find((font) => font.id === 'patrick')!;
  if (id === 'hw-9' || id === 'caveat') {
    return HANDWRITING_FONTS.find((font) => font.id === 'reenie')!;
  }
  if (id === 'kalam') return HANDWRITING_FONTS.find((font) => font.id === 'patrick')!;
  if (id === 'labelle') return HANDWRITING_FONTS.find((font) => font.id === 'playwrite-es')!;
  return HANDWRITING_FONTS.find((font) => font.id === id) ?? HANDWRITING_FONTS[0];
}
