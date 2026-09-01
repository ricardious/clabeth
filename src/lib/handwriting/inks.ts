import type { HandwritingConfig, InkColor } from '../types/handwriting';

export const INK_COLORS: InkColor[] = [
  { id: 'grafito', name: 'Grafito', token: '--ink-grafito' },
  { id: 'azul', name: 'Azul noche', token: '--ink-azul' },
  { id: 'rojo', name: 'Rojo tinta', token: '--ink-rojo' },
  { id: 'borgona', name: 'Borgoña', token: '--ink-borgona' },
  { id: 'verde', name: 'Verde bosque', token: '--ink-verde' },
  { id: 'sepia', name: 'Sepia', token: '--ink-sepia' },
];

export function getInk(id: string): InkColor {
  return INK_COLORS.find((ink) => ink.id === id) ?? INK_COLORS[0];
}

/**
 * Tinta de los títulos. Sin elección propia —documentos anteriores al campo—
 * se usa la del texto, así que su aspecto se conserva intacto.
 */
export function getHeadingInkId(config: Pick<HandwritingConfig, 'inkId' | 'headingInkId'>): string {
  return config.headingInkId ?? config.inkId;
}
