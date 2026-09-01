import { describe, expect, it } from 'vitest';
import { HANDWRITING_FONTS, getHandwritingFont } from './fonts';

/**
 * Archivos realmente presentes en public/, resueltos por Vite.
 * (No se usa `node:fs`: el proyecto no depende de `@types/node` y `astro check`
 * comprueba también los tests.)
 */
const present = new Set(
  Object.keys(import.meta.glob('../../../public/fonts/handwriting/*.ttf')).map(
    (path) => path.split('/').pop()!,
  ),
);

/** Familias locales que el catálogo ofrece: `HW-3` se sirve como Handwriting-3.ttf. */
const localFamilies = HANDWRITING_FONTS.map((font) => font.family.match(/^'HW-([^']+)'/)?.[1]).filter(
  (suffix): suffix is string => suffix !== undefined,
);

describe('fuentes manuscritas locales', () => {
  it('existe el archivo de cada familia local ofrecida', () => {
    // Si el catálogo ofrece una familia sin su .ttf, el navegador cae al
    // `cursive` del sistema sin avisar de nada.
    expect(localFamilies.length).toBeGreaterThan(0);
    for (const suffix of localFamilies) {
      expect(present, `falta Handwriting-${suffix}.ttf`).toContain(`Handwriting-${suffix}.ttf`);
    }
  });

  it('no se publican los archivos de las fuentes retiradas', () => {
    // HW-4 y HW-7 traían los acentuados injertados de otra fuente: el cuerpo de
    // «á» estaba dibujado 2,1× y 3,4× más grueso que su propia «a».
    expect(present).not.toContain('Handwriting-4.ttf');
    expect(present).not.toContain('Handwriting-7.ttf');
  });

  it('los documentos guardados con las retiradas siguen abriendo', () => {
    expect(getHandwritingFont('hw-4').id).toBe('nothing-you-could-do');
    expect(getHandwritingFont('hw-7').id).toBe('give-you-glory');
    // Y ninguna migración apunta a una familia local inexistente.
    for (const id of ['hw-1', 'hw-2', 'hw-4', 'hw-5', 'hw-6', 'hw-7', 'hw-8', 'hw-9']) {
      const suffix = getHandwritingFont(id).family.match(/^'HW-([^']+)'/)?.[1];
      if (suffix) expect(present).toContain(`Handwriting-${suffix}.ttf`);
    }
  });
});
