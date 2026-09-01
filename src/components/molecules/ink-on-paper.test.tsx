import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { HANDWRITING_PRESETS } from '../../lib/handwriting/presets';
import { INK_COLORS } from '../../lib/handwriting/inks';
import { InkColorSwatch } from './InkColorSwatch';
import { PresetCard } from './PresetCard';

/**
 * Las tintas están definidas para la hoja: sobre las superficies oscuras de la
 * interfaz ninguna alcanza el mínimo de 3:1 (el grafito se queda en 1,07:1 y la
 * roja, la más clara, en 2,24:1). Por eso toda muestra de tinta tiene que ir
 * dentro de una superficie de papel, que es clara en ambos temas.
 */
const inkElements = (container: HTMLElement): HTMLElement[] =>
  [...container.querySelectorAll<HTMLElement>('[style]')].filter((element) =>
    element.getAttribute('style')!.includes('--ink-'),
  );

describe('las muestras de tinta van sobre papel', () => {
  it('la vista previa de cada estilo se pinta dentro de una hoja', () => {
    for (const preset of HANDWRITING_PRESETS) {
      const { container, unmount } = render(
        <PresetCard preset={preset} fontId={preset.config.fontId} selected={false} onSelect={vi.fn()} />,
      );

      const inked = inkElements(container);
      expect(inked.length, `${preset.name} no pinta ninguna tinta`).toBeGreaterThan(0);
      for (const element of inked) {
        expect(element.closest('.paper-bg'), `${preset.name} pinta tinta fuera del papel`).not.toBeNull();
      }
      unmount();
    }
  });

  it('cada muestra de color se pinta dentro de una hoja', () => {
    for (const ink of INK_COLORS) {
      const { container, unmount } = render(
        <InkColorSwatch ink={ink} selected={false} onSelect={vi.fn()} />,
      );

      const inked = inkElements(container);
      expect(inked.length, `${ink.name} no pinta ninguna tinta`).toBeGreaterThan(0);
      for (const element of inked) {
        expect(element.closest('.paper-bg'), `${ink.name} pinta tinta fuera del papel`).not.toBeNull();
      }
      unmount();
    }
  });

  it('la muestra seleccionada sigue sobre papel', () => {
    const { container } = render(
      <InkColorSwatch ink={INK_COLORS[0]!} selected onSelect={vi.fn()} />,
    );
    for (const element of inkElements(container)) {
      expect(element.closest('.paper-bg')).not.toBeNull();
    }
  });
});
