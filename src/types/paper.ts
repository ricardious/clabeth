export type PaperStyleId =
  | 'blanca'
  | 'rayada'
  | 'cuadriculada'
  | 'punteada'
  | 'crema'
  | 'libreta'
  | 'academica';

export type PageSizeId = 'a4' | 'carta';

export type PageOrientation = 'vertical' | 'horizontal';

export interface PaperConfig {
  style: PaperStyleId;
  size: PageSizeId;
  orientation: PageOrientation;
  /** Línea de margen roja (solo tiene efecto visual en estilos con margen). */
  marginLine: boolean;
  /** Texto de encabezado; vacío = sin encabezado. */
  header: string;
  /** Texto de pie; vacío = sin pie. */
  footer: string;
  /** Numerar páginas en el pie. */
  pageNumbers: boolean;
}

export interface PaperStyleDef {
  id: PaperStyleId;
  name: string;
  description: string;
  /** La línea de margen roja forma parte del estilo. */
  hasMarginLine: boolean;
}

export interface PageDimensions {
  width: number;
  height: number;
}
