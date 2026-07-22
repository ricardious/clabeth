import { seededJitter } from '../utils/seeded-random';

export interface WordVariation {
  /** Desplazamiento vertical en px, dentro de ±jitterY. */
  dy: number;
  /** Rotación en grados, dentro de ±jitterRot. */
  rot: number;
}

/**
 * Variación determinista por palabra: la misma semilla e índice siempre
 * producen la misma variación, así la exportación coincide con la vista.
 */
export function wordVariation(
  seed: string,
  index: number,
  jitterY: number,
  jitterRot: number,
): WordVariation {
  return {
    dy: round2(seededJitter(seed, index * 2) * jitterY) || 0,
    rot: round2(seededJitter(seed, index * 2 + 1) * jitterRot) || 0,
  };
}

/** ¿La configuración necesita envolver palabras en spans .jw? */
export function needsWordSpans(jitterY: number, jitterRot: number, slant: number): boolean {
  return jitterY > 0 || jitterRot > 0 || slant !== 0;
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
