export interface CanvasInkProfile {
  baseColor: string;
  opacity: number;
  roughness: number;
  absorption: number;
  bleed: number;
}

const INKS: Record<string, CanvasInkProfile> = {
  grafito: { baseColor: '#2A2620', opacity: 0.92, roughness: 0.18, absorption: 0.12, bleed: 0.08 },
  azul: { baseColor: '#2F4A92', opacity: 0.82, roughness: 0.28, absorption: 0.22, bleed: 0.14 },
  rojo: { baseColor: '#B13535', opacity: 0.84, roughness: 0.27, absorption: 0.2, bleed: 0.12 },
  borgona: { baseColor: '#692933', opacity: 0.86, roughness: 0.25, absorption: 0.2, bleed: 0.12 },
  verde: { baseColor: '#2F6A52', opacity: 0.83, roughness: 0.3, absorption: 0.22, bleed: 0.14 },
  sepia: { baseColor: '#694B31', opacity: 0.86, roughness: 0.24, absorption: 0.19, bleed: 0.11 },
};

export function getCanvasInk(id: string): CanvasInkProfile {
  return INKS[id] ?? INKS.grafito;
}
