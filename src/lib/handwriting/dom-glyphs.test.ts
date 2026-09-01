import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { collectPositionedGlyphs } from './dom-glyphs';

beforeAll(() => {
  // jsdom no maqueta: sin una caja con tamaño, cada carácter se descarta.
  Range.prototype.getBoundingClientRect = () =>
    ({ left: 0, top: 0, width: 8, height: 12, right: 8, bottom: 12, x: 0, y: 0, toJSON: () => ({}) }) as DOMRect;
});

afterEach(() => {
  window.document.body.replaceChildren();
});

/** Una hoja con un título y un párrafo, como los produce el pipeline. */
function page(headingInkId?: string): { source: HTMLElement; page: HTMLElement } {
  const sheet = window.document.createElement('div');
  const source = window.document.createElement('div');

  const heading = window.document.createElement('h1');
  const headingWord = window.document.createElement('span');
  headingWord.className = 'jw';
  headingWord.textContent = 'Ti';
  // El CSS real hereda `--hand-ink-id`; jsdom no propaga variables, así que se
  // asigna donde la regla de los títulos la dejaría.
  if (headingInkId) headingWord.style.setProperty('--hand-ink-id', headingInkId);
  heading.append(headingWord);

  const paragraph = window.document.createElement('p');
  const word = window.document.createElement('span');
  word.className = 'jw';
  word.textContent = 'ab';
  paragraph.append(word);

  source.append(heading, paragraph);
  sheet.append(source);
  window.document.body.append(sheet);
  return { source, page: sheet };
}

describe('collectPositionedGlyphs · tinta por glifo', () => {
  it('usa la tinta de reserva cuando el DOM no declara ninguna', () => {
    const { source, page: sheet } = page();
    const glyphs = collectPositionedGlyphs(source, sheet, 'azul');

    expect(glyphs).toHaveLength(4);
    expect(glyphs.every((glyph) => glyph.inkId === 'azul')).toBe(true);
  });

  it('respeta la tinta que el CSS declara en el título', () => {
    const { source, page: sheet } = page('rojo');
    const glyphs = collectPositionedGlyphs(source, sheet, 'grafito');

    // Los dos primeros glifos son del título; el resto, del párrafo.
    expect(glyphs.map((glyph) => glyph.inkId)).toEqual(['rojo', 'rojo', 'grafito', 'grafito']);
  });

  it('cada glifo lleva su tinta, para que el motor pueda cambiar de perfil', () => {
    const { source, page: sheet } = page('verde');
    for (const glyph of collectPositionedGlyphs(source, sheet, 'sepia')) {
      expect(glyph.inkId, glyph.char).toBeTruthy();
    }
  });
});
