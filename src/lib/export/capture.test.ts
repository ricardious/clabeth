import { describe, expect, it } from 'vitest';
import { createPdf } from './capture';

const WHITE_PAGE_PNG =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAACXBIWXMAAAABAAAAAQBPJcTWAAAADklEQVR4nGP4DwYMEAoAU7oL9ZisIGcAAAAASUVORK5CYII=';

describe('createPdf', () => {
  it('crea una página válida por cada imagen', async () => {
    const pdf = await createPdf(
      [WHITE_PAGE_PNG, WHITE_PAGE_PNG],
      { width: 794, height: 1123 },
      'vertical',
    );

    expect(pdf.getNumberOfPages()).toBe(2);
    expect(pdf.output('arraybuffer').byteLength).toBeGreaterThan(1_000);
  });
});
