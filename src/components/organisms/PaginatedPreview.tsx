import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { GalleryVertical, Maximize, Minimize, RectangleHorizontal, Square } from 'lucide-react';
import type { ClabethDocument } from '../../types/document';
import type { PaperConfig } from '../../types/paper';
import type { HandwritingConfig } from '../../types/handwriting';
import type { MdBlock } from '../../lib/markdown/blocks';
import type { PreviewMode } from '../../store/ui';
import { splitIntoBlocks } from '../../lib/markdown/blocks';
import { contentHeight, contentWidth } from '../../lib/paper/styles';
import { handCssVars } from '../../lib/handwriting/css-vars';
import { usePagination } from '../../hooks/use-pagination';
import { IconButton } from '../atoms/IconButton';
import { Spinner } from '../atoms/Spinner';
import { Separator } from '../atoms/Separator';
import { ZoomControls } from '../molecules/ZoomControls';
import { PageNavigator } from '../molecules/PageNavigator';
import { PreviewPage } from './PreviewPage';
import { MarkdownBlock } from './MarkdownBlock';
import { cn } from '../../lib/utils/cn';

export interface PaginatedPreviewProps {
  document: ClabethDocument;
  /** Sobrescribe el papel (exportación). */
  paperOverride?: PaperConfig;
  /** Muestra la barra de controles (editor) o solo las hojas (exportar/mini). */
  interactive?: boolean;
  mode?: PreviewMode;
  zoom?: number;
  currentPage?: number;
  onModeChange?: (mode: PreviewMode) => void;
  onPageChange?: (page: number) => void;
  onPagesChange?: (count: number) => void;
  /** Recibe los elementos DOM de las páginas montadas (exportación). */
  registerPages?: (elements: HTMLElement[]) => void;
}

const MODE_ICONS: Record<PreviewMode, { label: string; icon: ReactNode }> = {
  continua: { label: 'Vista continua', icon: <GalleryVertical size={15} aria-hidden /> },
  una: { label: 'Una página', icon: <Square size={15} aria-hidden /> },
  dos: { label: 'Dos páginas', icon: <RectangleHorizontal size={15} aria-hidden /> },
};

function BlockForMeasure({ block, seed, hand }: { block: MdBlock; seed: string; hand: HandwritingConfig }) {
  if (block.pageBreak) return <div data-pagebreak style={{ height: 0 }} />;
  return <MarkdownBlock block={block} seed={seed} hand={hand} />;
}

export function PaginatedPreview({
  document,
  paperOverride,
  interactive = true,
  mode = 'continua',
  zoom = 1,
  currentPage = 0,
  onModeChange,
  onPageChange,
  onPagesChange,
  registerPages,
}: PaginatedPreviewProps) {
  const paper = paperOverride ?? document.paper;
  const blocks = useMemo(() => splitIntoBlocks(document.content), [document.content]);
  const measureKey = useMemo(
    () => JSON.stringify([document.handwriting, paper, document.content.length]),
    [document.handwriting, paper, document.content.length],
  );

  const measurerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLElement | null)[]>([]);
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
        <div className="flex h-[var(--topbar-h)] shrink-0 items-center justify-end gap-2 border-b border-outline bg-surface px-3">
          <div className="flex items-center gap-0.5" role="group" aria-label="Modo de vista">
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

        {pages === null ? (
          <div className="flex h-full items-center justify-center gap-2 text-sm text-muted">
            <Spinner label="Preparando hojas" /> Preparando hojas…
          </div>
        ) : (
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
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
