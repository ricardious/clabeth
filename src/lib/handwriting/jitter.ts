import { hashString, seededJitter } from '../utils/seeded-random';

export interface WordVariation {
  /** Desplazamiento vertical en px, dentro de ±jitterY. */
  dy: number;
  /** Rotación en grados, dentro de ±jitterRot. */
  rot: number;
  /** Compresión/expansión horizontal sutil de la palabra. */
  scaleX: number;
  /** Presión relativa del trazo, usada como opacidad local. */
  pressure: number;
  /** Pequeño sangrado horizontal de la tinta en px. */
  bleedX: number;
  /** Pequeño sangrado vertical de la tinta en px. */
  bleedY: number;
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
  // Una mano real sigue un movimiento continuo: 80 % onda y 20 % ruido.
  // La fase depende del documento para que cada escrito empiece distinto.
  const phase = (hashString(seed) % 6283) / 1000;
  const offset = phase + index * 0.38;
  const baselineWave = Math.sin(offset) * Math.cos(offset * 0.53);
  const rotationWave = Math.sin(offset * 0.71 + 1.9) * Math.cos(offset * 0.31);
  const widthWave = Math.sin(offset * 0.47 + 0.8);
  const baseline = baselineWave * 0.8 + seededJitter(seed, index * 6) * 0.2;
  const rotation = rotationWave * 0.8 + seededJitter(seed, index * 6 + 1) * 0.2;
  const width = widthWave * 0.75 + seededJitter(seed, index * 6 + 2) * 0.25;

  return {
    dy: round2(baseline * jitterY) || 0,
    rot: round2(rotation * jitterRot) || 0,
    scaleX: round3(1 + width * Math.min(jitterY + jitterRot, 4) * 0.004),
    pressure: round3(0.94 + (seededJitter(seed, index * 6 + 3) + 1) * 0.03),
    bleedX: round2(seededJitter(seed, index * 6 + 4) * 0.16),
    bleedY: round2(seededJitter(seed, index * 6 + 5) * 0.12),
  };
}

/** ¿La configuración necesita envolver palabras en spans .jw? */
export function needsWordSpans(jitterY: number, jitterRot: number, slant: number): boolean {
  return jitterY > 0 || jitterRot > 0 || slant !== 0;
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function round3(value: number): number {
  return Math.round(value * 1000) / 1000;
}
