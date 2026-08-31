import { hashString, mulberry32 } from '../utils/seeded-random';
import type { CanvasRenderMetrics, HandwritingCanvasConfig, PositionedGlyph } from './canvas-types';
import { getCanvasInk } from './ink-profiles';
import { NoiseStrategy } from './noise';

const imageCache = new Map<string, Promise<HTMLImageElement>>();

const PRESETS = {
  1: { baseline: 0.65, slant: 0.42, color: 0.11, micro: 0.32, intensity: 1.35 },
  2: { baseline: 0.65, slant: 0.42, color: 0.11, micro: 0.32, intensity: 1.35 },
  3: { baseline: 0.46, slant: 0.32, color: 0.085, micro: 0.24, intensity: 1.1 },
  4: { baseline: 0.24, slant: 0.18, color: 0.055, micro: 0.13, intensity: 1 },
  5: { baseline: 0.16, slant: 0.12, color: 0.042, micro: 0.09, intensity: 0.92 },
} as const;

function loadImage(canvas: HTMLCanvasElement, url: string): Promise<HTMLImageElement> {
  const cached = imageCache.get(url);
  if (cached) return cached;
  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    const ImageConstructor = canvas.ownerDocument.defaultView?.Image;
    if (!ImageConstructor) {
      reject(new Error('El navegador no permite cargar la textura del papel.'));
      return;
    }
    const image = new ImageConstructor();
    image.decoding = 'async';
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`No se pudo cargar ${url}`));
    image.src = url;
  }).then(async (image) => {
    if (typeof image.decode === 'function') {
      try {
        await image.decode();
      } catch {
        // onload ya confirmó que la imagen se puede dibujar.
      }
    }
    return image;
  });
  imageCache.set(url, promise);
  return promise;
}

function drawCover(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
): void {
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
  const drawWidth = image.naturalWidth * scale;
  const drawHeight = image.naturalHeight * scale;
  context.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
}

function drawPaper(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  config: HandwritingCanvasConfig,
): void {
  const { width, height, paper } = config;
  drawCover(context, image, width, height);

  // Un lavado muy transparente conserva arrugas y fibras, pero diferencia
  // hojas blancas, crema y de libreta.
  context.save();
  context.globalCompositeOperation = paper.style === 'crema' || paper.style === 'libreta' ? 'multiply' : 'soft-light';
  context.globalAlpha = paper.style === 'crema' || paper.style === 'libreta' ? 0.16 : 0.08;
  context.fillStyle = paper.baseColor;
  context.fillRect(0, 0, width, height);
  context.restore();

  context.save();
  context.globalCompositeOperation = 'multiply';
  context.strokeStyle = paper.lineColor;
  context.fillStyle = paper.lineColor;
  context.globalAlpha = 0.72;
  context.lineWidth = 0.72;

  if (paper.style === 'rayada' || paper.style === 'libreta') {
    for (let y = paper.lineOffset + paper.lineHeight; y < height; y += paper.lineHeight) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(width, y);
      context.stroke();
    }
  } else if (paper.style === 'cuadriculada') {
    for (let y = paper.gridSize; y < height; y += paper.gridSize) {
      context.beginPath(); context.moveTo(0, y); context.lineTo(width, y); context.stroke();
    }
    for (let x = paper.gridSize; x < width; x += paper.gridSize) {
      context.beginPath(); context.moveTo(x, 0); context.lineTo(x, height); context.stroke();
    }
  } else if (paper.style === 'punteada') {
    for (let y = 4; y < height; y += paper.gridSize) {
      for (let x = 4; x < width; x += paper.gridSize) {
        context.beginPath(); context.arc(x, y, 0.9, 0, Math.PI * 2); context.fill();
      }
    }
  }
  context.restore();

  if (paper.style === 'libreta') {
    context.save();
    context.globalCompositeOperation = 'multiply';
    context.globalAlpha = 0.72;
    context.strokeStyle = paper.marginColor;
    context.lineWidth = 1.1;
    context.beginPath();
    context.moveTo(paper.marginX, 0);
    context.lineTo(paper.marginX, height);
    context.stroke();
    context.restore();
  }
}

function drawWeightedGlyph(
  context: CanvasRenderingContext2D,
  glyph: PositionedGlyph,
  boldness: number,
): void {
  const normalized = (Math.max(0, Math.min(1, boldness)) - 0.5) * 2;
  if (normalized > 0.001) {
    const offset = Math.min(1.6, glyph.fontSize * 0.006 * (0.2 + 2 * normalized));
    const diagonal = offset / Math.SQRT2;
    const alpha = context.globalAlpha;
    context.globalAlpha = alpha * (1 + 0.12 * normalized);
    for (const [x, y] of [[0, 0], [offset, 0], [-offset, 0], [0, offset], [0, -offset], [diagonal, diagonal], [-diagonal, diagonal], [diagonal, -diagonal], [-diagonal, -diagonal]]) {
      context.fillText(glyph.char, x, y);
    }
    context.globalAlpha = alpha;
  } else if (normalized < -0.001) {
    const alpha = context.globalAlpha;
    context.globalAlpha = alpha * (1 - 0.45 * Math.abs(normalized) ** 1.2);
    context.fillText(glyph.char, 0, 0);
    context.globalAlpha = alpha;
  } else {
    context.fillText(glyph.char, 0, 0);
  }
}

function drawInk(context: CanvasRenderingContext2D, config: HandwritingCanvasConfig, rng: () => number): void {
  const preset = PRESETS[config.realismLevel];
  const ink = getCanvasInk(config.handwriting.inkId);
  const noise = new NoiseStrategy(rng);
  const userJitter = Math.max(0.35, Math.min(1.4, config.handwriting.jitterY || 0.35));
  const baselineRange = preset.baseline * preset.intensity * userJitter;
  const slantRange = preset.slant * preset.intensity * Math.max(0.5, config.handwriting.jitterRot || 0.5);
  const microRange = preset.micro * preset.intensity;
  const boldness = Math.max(0, Math.min(1, config.handwriting.weight / 800));

  context.save();
  context.textAlign = 'left';
  context.textBaseline = 'alphabetic';
  context.globalCompositeOperation = 'multiply';
  context.globalAlpha = ink.opacity * config.handwriting.opacity * (1 - ink.roughness * 0.1 - ink.absorption * 0.05);
  context.shadowColor = `rgba(0, 0, 0, ${Math.min(0.15, ink.bleed * 0.2)})`;
  context.shadowBlur = Math.max(0.55, ink.absorption * 2, ink.bleed * 1.5);
  context.shadowOffsetX = 0.5;
  context.shadowOffsetY = 0.5;

  for (const glyph of config.glyphs) {
    context.font = glyph.font;
    const metrics = context.measureText(glyph.char);
    const ascent = metrics.actualBoundingBoxAscent || glyph.fontSize * 0.78;
    const descent = metrics.actualBoundingBoxDescent || glyph.fontSize * 0.2;
    const baseline = glyph.y + (glyph.height + ascent - descent) / 2;
    const baselineJitter = noise.generateJitter(baselineRange);
    const slantJitter = noise.generateRotation(slantRange);
    const color = noise.generateColorVariation(ink.baseColor, preset.color * preset.intensity);
    const microTilt = noise.generateRotation(microRange);
    const amplitudeX = glyph.fontSize * Math.max(baselineRange, 0.2) * 0.42;
    const amplitudeY = glyph.fontSize * Math.max(baselineRange, 0.2) * 0.36;
    const tilt = microTilt * glyph.fontSize * 0.55;
    const dx = baselineJitter * amplitudeX + tilt * 0.4;
    const dy = baselineJitter * amplitudeY + tilt * 0.25;
    const naturalWidth = metrics.width || glyph.width;
    const centeredX = glyph.x + (glyph.width - naturalWidth) / 2;

    context.save();
    context.translate(centeredX + dx, baseline + dy);
    context.rotate(slantJitter + microTilt);
    context.transform(1, 0, Math.tan((config.handwriting.slant * Math.PI) / 180), 1, 0, 0);
    context.fillStyle = color;
    drawWeightedGlyph(context, glyph, boldness);
    context.restore();
  }
  context.restore();
}

function makeGrain(
  owner: Document,
  width: number,
  height: number,
  rng: () => number,
): HTMLCanvasElement {
  const grain = owner.createElement('canvas');
  grain.width = Math.max(1, Math.ceil(width / 1.5));
  grain.height = Math.max(1, Math.ceil(height / 1.5));
  const context = grain.getContext('2d');
  if (!context) return grain;
  const pixels = context.createImageData(grain.width, grain.height);
  for (let index = 0; index < pixels.data.length; index += 4) {
    const variation = Math.floor(rng() * 85);
    pixels.data[index] = 100 + variation;
    pixels.data[index + 1] = 95 + variation;
    pixels.data[index + 2] = 85 + variation;
    pixels.data[index + 3] = 80 + rng() * 90;
  }
  context.putImageData(pixels, 0, 0);
  return grain;
}

function paint(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  mode: GlobalCompositeOperation,
  alpha: number,
  color: string,
): void {
  context.save();
  context.globalCompositeOperation = mode;
  context.globalAlpha = alpha;
  context.fillStyle = color;
  context.fillRect(0, 0, width, height);
  context.restore();
}

function postprocess(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  config: HandwritingCanvasConfig,
  rng: () => number,
): void {
  const { width, height } = config;
  const grain = makeGrain(canvas.ownerDocument, width, height, rng);
  context.save();
  context.globalCompositeOperation = 'overlay';
  context.globalAlpha = 0.28;
  context.drawImage(grain, 0, 0, grain.width, grain.height, 0, 0, width, height);
  context.restore();

  // Bandas casi imperceptibles: iluminación desigual de un escáner.
  context.save();
  context.globalCompositeOperation = 'multiply';
  context.globalAlpha = 0.013;
  context.fillStyle = '#000000';
  const bandWidth = Math.max(12, Math.floor(width / 18));
  for (let x = 0; x < width; x += bandWidth * 2) context.fillRect(x, 0, bandWidth, height);
  context.restore();

  paint(context, width, height, 'soft-light', 0.14, 'rgba(214, 196, 166, 1)');
  paint(context, width, height, 'multiply', 0.08, 'rgba(58, 50, 42, 1)');
  paint(context, width, height, 'screen', 0.05, 'rgba(252, 246, 232, 1)');
  paint(context, width, height, 'multiply', 0.075, 'rgba(86, 78, 70, 1)');
  paint(context, width, height, 'overlay', 0.04, 'rgba(218, 204, 184, 1)');
  paint(context, width, height, 'screen', 0.045, 'rgba(254, 250, 240, 1)');
}

/** Render directo al Canvas del DOM; misma semilla = mismos píxeles. */
export async function renderHandwritingCanvas(
  canvas: HTMLCanvasElement,
  config: HandwritingCanvasConfig,
): Promise<CanvasRenderMetrics> {
  const started = performance.now();
  const rng = mulberry32(hashString(config.seed));
  const paperImage = await loadImage(canvas, config.paper.textureUrl);
  canvas.width = Math.round(config.width * config.quality);
  canvas.height = Math.round(config.height * config.quality);
  canvas.style.width = `${config.width}px`;
  canvas.style.height = `${config.height}px`;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas 2D no está disponible.');
  context.setTransform(config.quality, 0, 0, config.quality, 0, 0);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.clearRect(0, 0, config.width, config.height);
  drawPaper(context, paperImage, config);
  drawInk(context, config, rng);
  postprocess(canvas, context, config, rng);
  return { durationMs: performance.now() - started, glyphCount: config.glyphs.length };
}
