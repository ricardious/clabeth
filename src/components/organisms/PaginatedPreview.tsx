import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { GalleryVertical, Maximize, Minimize, RectangleHorizontal, Square } from 'lucide-react';
import type { ClabethDocument } from '../../lib/types/document';
import type { PaperConfig } from '../../lib/types/paper';
import type { HandwritingConfig } from '../../lib/types/handwriting';
import type { MdBlock } from '../../lib/markdown/blocks';
import type { PreviewMode, PreviewQuality } from '../../lib/store/ui';
import { splitIntoBlocks } from '../../lib/markdown/blocks';
import { contentHeight, contentWidth } from '../../lib/paper/styles';
import { handCssVars } from '../../lib/handwriting/css-vars';
import { usePagination } from '../../hooks/use-pagination';
import { IconButton } from '../atoms/IconButton';
import { Select, type SelectItem } from '../atoms/Select';
import { Separator } from '../atoms/Separator';
import { RenderingStatus } from '../molecules/RenderingStatus';
import { ZoomControls } from '../molecules/ZoomControls';
import { PageNavigator } from '../molecules/PageNavigator';
import { PreviewPage } from './PreviewPage';
import type { CanvasRenderState } from './CanvasHandwritingLayer';
import { MarkdownBlock } from './MarkdownBlock';
import { cn } from '../../lib/utils/cn';

export interface PaginatedPreviewProps {
  document: ClabethDocument;
  /** Sobrescribe el papel (exportación). */
  paperOverride?: PaperConfig;
  /** Muestra la barra de controles (editor) o solo las hojas (exportar/mini). */
  interactive?: boolean;
  mode?: PreviewMode;
  /** Fidelidad del dibujado. La exportación siempre usa `manuscrita`. */
  quality?: PreviewQuality;
  zoom?: number;
  currentPage?: number;
  onModeChange?: (mode: PreviewMode) => void;
  onQualityChange?: (quality: PreviewQuality) => void;
  onPageChange?: (page: number) => void;
  onPagesChange?: (count: number) => void;
  renderingPreviewKey?: string | null;
  onPreviewRenderReady?: (renderKey: string) => void;
  /** Recibe los elementos DOM de las páginas montadas (exportación). */
  registerPages?: (elements: HTMLElement[]) => void;
}

const MODE_ICONS: Record<PreviewMode, { label: string; icon: ReactNode }> = {
  continua: { label: 'Vista continua', icon: <GalleryVertical size={15} aria-hidden /> },
  una: { label: 'Una página', icon: <Square size={15} aria-hidden /> },
  dos: { label: 'Dos páginas', icon: <RectangleHorizontal size={15} aria-hidden /> },
};

const QUALITY_OPTIONS: SelectItem<PreviewQuality>[] = [
  {
    value: 'manuscrita',
    label: 'Manuscrita',
    hint: 'Tinta, papel y variación humana dibujados.',
  },
  {
    value: 'borrador',
    label: 'Sin renderizar',
    hint: 'Solo el texto con la fuente. Responde al instante.',
  },
];

function BlockForMeasure({ block, seed, hand }: { block: MdBlock; seed: string; hand: HandwritingConfig }) {
  if (block.pageBreak) return <div data-pagebreak style={{ height: 0 }} />;
  return <MarkdownBlock block={block} seed={seed} hand={hand} />;
}

export function PaginatedPreview({
  document,
  paperOverride,
  interactive = true,
  mode = 'continua',
  quality = 'manuscrita',
  zoom = 1,
  currentPage = 0,
  onModeChange,
  onQualityChange,
  onPageChange,
  onPagesChange,
  renderingPreviewKey = null,
  onPreviewRenderReady,
  registerPages,
}: PaginatedPreviewProps) {
  // En borrador no hay Canvas que avise de que terminó, así que tampoco hay
  // espera que mostrar: el DOM ya está pintado.
  const pendingRenderKey = quality === 'manuscrita' ? renderingPreviewKey : null;
  const paper = paperOverride ?? document.paper;
  const blocks = useMemo(() => splitIntoBlocks(document.content), [document.content]);
  const measureKey = useMemo(
    () => JSON.stringify([document.handwriting, paper, document.content.length]),
    [document.handwriting, paper, document.content.length],
  );

  const measurerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLElement | null)[]>([]);
  const readyPreviewPages = useRef<Set<number>>(new Set());
  const [fullscreen, setFullscreen] = useState(false);

  const rawPages = usePagination(measurerRef, blocks, contentHeight(paper), measureKey);
  // Un documento vacío también tiene una hoja. Los índices se recortan por
  // seguridad. useMemo es imprescindible: una referencia nueva por render
  // dispararía registerPages en bucle (setState → render → registerPages).
  const pages = useMemo(() => {
    if (rawPages === null) return null;
    if (rawPages.length === 0) return [[]];
    return rawPages.map((page) => page.filter((index) => index < blocks.length));
  }, [rawPages, blocks]);
  const totalPages = pages?.length ?? 0;

  useEffect(() => {
    if (pages && currentPage >= pages.length && pages.length > 0) {
      onPageChange?.(pages.length - 1);
    }
  }, [pages, currentPage, onPageChange]);

  useEffect(() => {
    if (totalPages > 0) onPagesChange?.(totalPages);
  }, [totalPages, onPagesChange]);

  useEffect(() => {
    const onChange = (): void => setFullscreen(window.document.fullscreenElement !== null);
    window.document.addEventListener('fullscreenchange', onChange);
    return () => window.document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const visibleIndices = useMemo(() => {
    if (!pages) return [];
    if (mode === 'continua') return pages.map((_, i) => i);
    if (mode === 'una') return [Math.min(currentPage, pages.length - 1)];
    // dos páginas: pares (0-1, 2-3, ...)
    const first = Math.min(currentPage - (currentPage % 2), pages.length - 1);
    return first + 1 < pages.length ? [first, first + 1] : [first];
  }, [pages, mode, currentPage]);

  useLayoutEffect(() => {
    if (pendingRenderKey) readyPreviewPages.current.clear();
  }, [pendingRenderKey]);

  const handlePageRenderState = useCallback(
    (pageIndex: number, renderKey: string, state: CanvasRenderState): void => {
      if (!pendingRenderKey || renderKey !== pendingRenderKey) return;
      if (state !== 'ready' && state !== 'error') return;

      readyPreviewPages.current.add(pageIndex);
      if (visibleIndices.length > 0 && visibleIndices.every((index) => readyPreviewPages.current.has(index))) {
        onPreviewRenderReady?.(renderKey);
      }
    },
    [onPreviewRenderReady, pendingRenderKey, visibleIndices],
  );

  useLayoutEffect(() => {
    if (!registerPages || !pages) return;
    const elements = visibleIndices
      .map((pageIndex) => pageRefs.current[pageIndex])
      .filter((el): el is HTMLElement => el !== null);
    registerPages(elements);
  }, [registerPages, pages, visibleIndices]);

  const toggleFullscreen = (): void => {
    if (window.document.fullscreenElement) {
      void window.document.exitFullscreen();
    } else {
      void containerRef.current?.requestFullscreen();
    }
  };

  const vars = handCssVars(document.handwriting);

  return (
    <div
      ref={containerRef}
      className={cn('relative flex h-full flex-col bg-panel', fullscreen && 'bg-background')}
    >
      {interactive && (
        <div className="flex h-[var(--topbar-h)] shrink-0 items-center justify-end gap-2 overflow-x-auto border-b border-outline bg-surface px-3">
          <div className="flex shrink-0 items-center gap-0.5" role="group" aria-label="Modo de vista">
            {(Object.keys(MODE_ICONS) as PreviewMode[]).map((m) => (
              <IconButton
                key={m}
                label={MODE_ICONS[m].label}
                size="sm"
                active={mode === m}
                onClick={() => onModeChange?.(m)}
              >
                {MODE_ICONS[m].icon}
              </IconButton>
            ))}
          </div>
          <Separator vertical className="mx-1 h-5" />
          {mode !== 'continua' && totalPages > 0 && (
            <PageNavigator page={currentPage} total={totalPages} onChange={(p) => onPageChange?.(p)} />
          )}
          <ZoomControls />
          {/* El panel es más ancho que el disparador para que quepan las
              descripciones de cada modo. */}
          <Select
            value={quality}
            onChange={(next) => onQualityChange?.(next)}
            options={QUALITY_OPTIONS}
            label="Fidelidad de la vista previa"
            size="sm"
            className="w-[124px] shrink-0"
            menuMinWidth={252}
          />
          <Separator vertical className="mx-1 h-5" />
          <IconButton
            label={fullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
            size="sm"
            onClick={toggleFullscreen}
          >
            {fullscreen ? <Minimize size={15} aria-hidden /> : <Maximize size={15} aria-hidden />}
          </IconButton>
        </div>
      )}

      <div className="relative flex-1 overflow-auto" data-testid="preview-scroll">
        {/* Medidor oculto: mismo ancho y tipografía que la caja de contenido */}
        <div aria-hidden className="invisible absolute left-0 top-0">
          <div
            ref={measurerRef}
            className="hand-scope relative"
            style={{ ...vars, width: contentWidth(paper) }}
          >
            {blocks.map((block) => (
              <BlockForMeasure key={block.key} block={block} seed={document.id} hand={document.handwriting} />
            ))}
          </div>
        </div>

        {pages === null ? null : (
          <div
            className={cn(
              'flex gap-6 p-6',
              mode === 'dos' ? 'flex-row justify-center' : 'flex-col items-center',
            )}
          >
            {visibleIndices.map((pageIndex) => (
              <PreviewPage
                key={pageIndex}
                ref={(el) => {
                  pageRefs.current[pageIndex] = el;
                }}
                document={document}
                paper={paperOverride}
                blocks={pages[pageIndex].map((i) => blocks[i])}
                pageIndex={pageIndex}
                totalPages={totalPages}
                zoom={zoom}
                quality={quality}
                onRenderStateChange={handlePageRenderState}
              />
            ))}
          </div>
        )}

        {pendingRenderKey ? (
          <RenderingStatus
            title="Aplicando cambios"
            description="Redibujando la tinta, la escritura y el papel de las hojas visibles."
            detail="La vista anterior permanecerá oculta hasta que el resultado esté listo."
          />
        ) : pages === null ? (
          <RenderingStatus
            title="Preparando tus hojas"
            description="Distribuyendo el contenido y calculando los saltos de página."
            detail="La vista previa aparecerá automáticamente."
          />
        ) : null}
      </div>
    </div>
  );
}
