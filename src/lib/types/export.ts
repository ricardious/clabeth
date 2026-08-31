/** Tipos de dominio usados por la exportación. */
export type ExportFormat = 'pdf' | 'png';

export type ExportRange = 'actual' | 'todas' | 'rango';

export interface ExportOptions {
  format: ExportFormat;
  range: ExportRange;
  /** 1-indexadas, inclusivas. Solo si range === 'rango'. */
  rangeFrom: number;
  rangeTo: number;
  /** Multiplicador de resolución. */
  scale: 1 | 2 | 3;
  /** Incluir fondo del papel; si es false, la página sale blanca. */
  includeBackground: boolean;
  includePageNumbers: boolean;
  includeHeader: boolean;
  includeFooter: boolean;
}

export interface ExportProgress {
  phase: 'preparing' | 'rendering' | 'finishing';
  current: number;
  total: number;
}
