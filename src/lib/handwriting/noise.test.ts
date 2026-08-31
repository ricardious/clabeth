import { describe, expect, it } from 'vitest';
import { hashString, mulberry32 } from '../utils/seeded-random';
import { NoiseStrategy } from './noise';

function sequence(seed: string): Array<{ jitter: number; rotation: number; color: string }> {
  const noise = new NoiseStrategy(mulberry32(hashString(seed)));
  return Array.from({ length: 40 }, () => ({
    jitter: noise.generateJitter(0.65),
    rotation: noise.generateRotation(0.42),
    color: noise.generateColorVariation('#2A2620', 0.11),
  }));
}

describe('NoiseStrategy de Canvas', () => {
  it('produce exactamente la misma escritura con la misma semilla', () => {
    expect(sequence('documento-1')).toEqual(sequence('documento-1'));
  });

  it('produce otra escritura al cambiar la semilla', () => {
    expect(sequence('documento-1')).not.toEqual(sequence('documento-2'));
  });

  it('mantiene jitter y rotación dentro de los rangos físicos', () => {
    for (const variation of sequence('limites')) {
      expect(Math.abs(variation.jitter)).toBeLessThanOrEqual(0.65);
      expect(Math.abs(variation.rotation)).toBeLessThanOrEqual((0.42 * Math.PI) / 180);
      expect(variation.color).toMatch(/^#[0-9a-f]{6}$/);
    }
  });
});
