import { describe, expect, it } from 'vitest';
import { fontVerticalMetrics } from './canvas-renderer';

/**
 * Métricas como las que devuelve `measureText`. Las `actual*` describen la
 * tinta del carácter medido y por eso cambian de una letra a otra; las `font*`
 * describen la fuente y son iguales para todas.
 */
function metricsFor(inkAscent: number, inkDescent: number): TextMetrics {
  return {
    width: 12,
    actualBoundingBoxAscent: inkAscent,
    actualBoundingBoxDescent: inkDescent,
    fontBoundingBoxAscent: 17.2,
    fontBoundingBoxDescent: 4.6,
  } as TextMetrics;
}

/** Misma fórmula que `drawInk`, con `y` y `height` de la caja de línea. */
const baselineOf = (metrics: TextMetrics, fontSize = 22): number => {
  const { ascent, descent } = fontVerticalMetrics(metrics, fontSize);
  const lineTop = 100;
  const lineHeight = 21.8;
  return lineTop + (lineHeight + ascent - descent) / 2;
};

describe('fontVerticalMetrics', () => {
  it('toma las métricas de la fuente, no la tinta del carácter', () => {
    const { ascent, descent } = fontVerticalMetrics(metricsFor(11.2, 0), 22);
    expect(ascent).toBe(17.2);
    expect(descent).toBe(4.6);
  });

  it('da la misma línea base a una vocal y a su versión acentuada', () => {
    // Medido en las fuentes del proyecto: la tinta de «á» sube ~3,7px más que
    // la de «a», y la de «Á» ~7,7px. Antes eso desplazaba la línea base y las
    // acentuadas se hundían bajo el renglón.
    const a = baselineOf(metricsFor(11.2, 0));
    const aTilde = baselineOf(metricsFor(14.9, 0));
    const aMayusTilde = baselineOf(metricsFor(18.9, 0));

    expect(aTilde).toBe(a);
    expect(aMayusTilde).toBe(a);
  });

  it('da la misma línea base a ascendentes y descendentes', () => {
    const a = baselineOf(metricsFor(11.2, 0));
    const ele = baselineOf(metricsFor(16.2, 0));
    const pe = baselineOf(metricsFor(11.2, 5.4));

    expect(ele).toBe(a);
    expect(pe).toBe(a);
  });

  it('usa reservas constantes si el motor no expone las métricas de fuente', () => {
    const sinFontBox = { width: 12, actualBoundingBoxAscent: 11.2 } as TextMetrics;
    const otra = { width: 12, actualBoundingBoxAscent: 18.9 } as TextMetrics;

    // Lo que importa de la reserva es que no dependa del carácter.
    expect(fontVerticalMetrics(sinFontBox, 22)).toEqual(fontVerticalMetrics(otra, 22));
    expect(fontVerticalMetrics(sinFontBox, 22).ascent).toBeCloseTo(22 * 0.78);
  });

  it('escala las reservas con el tamaño de letra', () => {
    const vacias = {} as TextMetrics;
    expect(fontVerticalMetrics(vacias, 32).ascent).toBeGreaterThan(
      fontVerticalMetrics(vacias, 16).ascent,
    );
  });
});
