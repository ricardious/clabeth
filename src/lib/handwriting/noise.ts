/** Estrategia exacta del prototipo: 80 % onda continua y 20 % azar sembrado. */
export class NoiseStrategy {
  private noiseOffset: number;

  constructor(private rng: () => number) {
    this.noiseOffset = rng() * 1000;
  }

  generateJitter(range: number): number {
    this.noiseOffset += 0.1;
    return (
      Math.sin(this.noiseOffset) * Math.cos(this.noiseOffset * 0.5) * range * 0.8 +
      (this.rng() - 0.5) * range * 0.4
    );
  }

  /** Rotación en radianes. */
  generateRotation(range: number): number {
    return (
      (Math.cos(this.noiseOffset * 0.8) * 0.6 + (this.rng() - 0.5) * 0.8) *
      range *
      (Math.PI / 180)
    );
  }

  generateColorVariation(hex: string, intensity: number): string {
    const raw = hex.replace('#', '');
    const channels = [0, 2, 4].map((offset) => Number.parseInt(raw.slice(offset, offset + 2), 16));
    const wave = Math.sin(this.noiseOffset * 0.2) * 0.7;
    const random = (this.rng() - 0.5) * 0.5;
    const delta = (wave + random) * (intensity * 0.08) * 255;
    const channel = (value: number): string =>
      Math.round(Math.max(0, Math.min(255, value + delta)))
        .toString(16)
        .padStart(2, '0');
    return `#${channels.map(channel).join('')}`;
  }
}
