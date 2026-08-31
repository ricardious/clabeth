import type { PageDimensions, PageOrientation, PageSizeId, PaperConfig, PaperStyleDef } from '../types/paper';

export const PAPER_STYLES: PaperStyleDef[] = [
  { id: 'blanca', name: 'Blanca', description: 'Hoja limpia sin reglura.', hasMarginLine: false },
  { id: 'rayada', name: 'Rayada', description: 'Renglones que siguen tu interlineado.', hasMarginLine: false },
  { id: 'cuadriculada', name: 'Cuadriculada', description: 'Retícula para gráficas y tablas.', hasMarginLine: false },
  { id: 'punteada', name: 'Punteada', description: 'Guía discreta de puntos.', hasMarginLine: false },
  { id: 'crema', name: 'Crema', description: 'Papel envejecido, sin líneas.', hasMarginLine: false },
  { id: 'libreta', name: 'Libreta', description: 'Renglones cálidos con margen rojo.', hasMarginLine: true },
  { id: 'academica', name: 'Académica', description: 'Blanca con margen y filete de revista.', hasMarginLine: true },
];

export const PAGE_SIZES: Record<PageSizeId, { name: string; vertical: PageDimensions }> = {
  a4: { name: 'A4', vertical: { width: 794, height: 1123 } },
  carta: { name: 'Carta', vertical: { width: 816, height: 1056 } },
};

export const PAPER_MARGIN = {
  block: 64,
  inline: 64,
  inlineStart: 88,
  chrome: 28,
} as const;

export const DEFAULT_PAPER: PaperConfig = {
  style: 'libreta',
  size: 'a4',
  orientation: 'vertical',
  marginLine: true,
  header: '',
  footer: '',
  pageNumbers: true,
};

export function getPaperStyle(id: string): PaperStyleDef {
  return PAPER_STYLES.find((style) => style.id === id) ?? PAPER_STYLES[0];
}

export function pageDimensions(size: PageSizeId, orientation: PageOrientation): PageDimensions {
  const base = PAGE_SIZES[size].vertical;
  return orientation === 'vertical' ? base : { width: base.height, height: base.width };
}

export function usesMarginLine(config: PaperConfig): boolean {
  return config.marginLine && getPaperStyle(config.style).hasMarginLine;
}

/** Altura útil para el contenido dentro de la página. */
export function contentHeight(config: PaperConfig): number {
  const { height } = pageDimensions(config.size, config.orientation);
  let used = PAPER_MARGIN.block * 2;
  if (config.header) used += PAPER_MARGIN.chrome;
  if (config.footer || config.pageNumbers) used += PAPER_MARGIN.chrome;
  return height - used;
}

export function contentWidth(config: PaperConfig): number {
  const { width } = pageDimensions(config.size, config.orientation);
  const start = usesMarginLine(config) ? PAPER_MARGIN.inlineStart : PAPER_MARGIN.inline;
  return width - start - PAPER_MARGIN.inline;
}
