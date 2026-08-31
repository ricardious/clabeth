import type { HandwritingFont } from '../types/handwriting';

export const HANDWRITING_FONTS: HandwritingFont[] = [
  { id: 'hw-3', name: 'Manuscrita 3 · Royston', family: "'HW-3', cursive", weights: [400] },
  { id: 'hw-4', name: 'Manuscrita 4 · Pam', family: "'HW-4', cursive", weights: [400] },
  { id: 'hw-5', name: 'Manuscrita 5 · HandFont', family: "'HW-5', cursive", weights: [400] },
  { id: 'hw-7', name: 'Manuscrita 7 · Herbert', family: "'HW-7', cursive", weights: [400] },
  { id: 'hw-8', name: 'Manuscrita 8 · Hughes', family: "'HW-8', cursive", weights: [400] },
  { id: 'hw-9', name: 'Manuscrita 9 · HandFont', family: "'HW-9', cursive", weights: [400] },
  {
    id: 'playwrite-es',
    name: 'Playwrite España',
    family: "'Playwrite ES Variable', cursive",
    weights: [100, 200, 300, 400],
  },
  { id: 'patrick', name: 'Patrick Hand', family: "'Patrick Hand', cursive", weights: [400] },
  { id: 'gochi', name: 'Gochi Hand', family: "'Gochi Hand', cursive", weights: [400] },
  { id: 'caveat', name: 'Caveat', family: "'Caveat', cursive", weights: [400, 500, 600, 700] },
  { id: 'kalam', name: 'Kalam', family: "'Kalam', cursive", weights: [300, 400, 700] },
  {
    id: 'shadows',
    name: 'Shadows Into Light',
    family: "'Shadows Into Light', cursive",
    weights: [400],
  },
  {
    id: 'labelle',
    name: 'La Belle Aurore',
    family: "'La Belle Aurore', cursive",
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
  if (id === 'hw-1') return HANDWRITING_FONTS.find((font) => font.id === 'patrick')!;
  if (id === 'hw-2') return HANDWRITING_FONTS.find((font) => font.id === 'gochi')!;
  if (id === 'hw-6') return HANDWRITING_FONTS.find((font) => font.id === 'playwrite-es')!;
  return HANDWRITING_FONTS.find((font) => font.id === id) ?? HANDWRITING_FONTS[0];
}
