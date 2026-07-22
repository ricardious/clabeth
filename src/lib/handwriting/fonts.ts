import type { HandwritingFont } from '../../types/handwriting';

export const HANDWRITING_FONTS: HandwritingFont[] = [
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
  return HANDWRITING_FONTS.find((font) => font.id === id) ?? HANDWRITING_FONTS[0];
}
