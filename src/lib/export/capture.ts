import { domToPng } from 'modern-screenshot';
import type { PageDimensions, PageOrientation } from '../types/paper';

/** Captura un nodo de página como PNG en data URL. */
export async function capturePageAsPng(
  element: HTMLElement,
  scale: number,
  flat: boolean,
): Promise<string> {
  if (flat) element.classList.add('export-flat');
  try {
    const dataUrl = await domToPng(element, {
      scale,
      backgroundColor: flat ? '#ffffff' : undefined,
    });
    return dataUrl;
  } finally {
    if (flat) element.classList.remove('export-flat');
  }
}

/** Igual que capturePageAsPng, pensada para clones estáticos del DOM. */
export function captureNodeAsPng(element: HTMLElement, scale: number, flat: boolean): Promise<string> {
  return capturePageAsPng(element, scale, flat);
}

export function downloadDataUrl(dataUrl: string, filename: string): void {
  const anchor = document.createElement('a');
  anchor.href = dataUrl;
  anchor.download = filename;
  anchor.click();
}

/** Descarga cada imagen como archivo PNG independiente. */
export async function downloadPngFiles(images: string[], baseName: string): Promise<void> {
  for (let i = 0; i < images.length; i += 1) {
    downloadDataUrl(images[i], `${baseName}-pagina-${i + 1}.png`);
    // Pausa para que el navegador no agrupe ni descarte descargas múltiples.
    if (i < images.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 350));
    }
  }
}

export async function buildPdf(
  images: string[],
  dims: PageDimensions,
  orientation: PageOrientation,
  filename: string,
): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const pdf = new jsPDF({
    orientation: orientation === 'vertical' ? 'portrait' : 'landscape',
    unit: 'px',
    format: [dims.width, dims.height],
    hotfixes: ['px_scaling'],
  });
  images.forEach((image, index) => {
    if (index > 0) {
      pdf.addPage([dims.width, dims.height], orientation === 'vertical' ? 'portrait' : 'landscape');
    }
    pdf.addImage(image, 'PNG', 0, 0, dims.width, dims.height);
  });
  pdf.save(filename);
}
