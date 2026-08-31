import { forwardRef, useCallback, useMemo, useRef } from 'react';
import type { ClabethDocument } from '../../lib/types/document';
import type { MdBlock } from '../../lib/markdown/blocks';
import type { PaperConfig } from '../../lib/types/paper';
import { contentWidth, pageDimensions, usesMarginLine, PAPER_MARGIN } from '../../lib/paper/styles';
import { handCssVars } from '../../lib/handwriting/css-vars';
import { previewRenderKey } from '../../lib/handwriting/render-key';
import { cn } from '../../lib/utils/cn';
import { MarkdownBlock } from './MarkdownBlock';
import { CanvasHandwritingLayer, type CanvasRenderState } from './CanvasHandwritingLayer';

export interface PreviewPageProps {
  document: ClabethDocument;
  /** Permite sobrescribir el papel (exportación con opciones propias). */
  paper?: PaperConfig;
  blocks: MdBlock[];
  pageIndex: number;
  totalPages: number;
  zoom?: number;
  onRenderStateChange?: (pageIndex: number, renderKey: string, state: CanvasRenderState) => void;
}

/** Una hoja con su chrome: encabezado, pie, numeración y margen rojo. */
export const PreviewPage = forwardRef<HTMLElement, PreviewPageProps>(function PreviewPage(
  { document, paper: paperOverride, blocks, pageIndex, totalPages, zoom = 1, onRenderStateChange },
  ref,
) {
  const paper = paperOverride ?? document.paper;
  const articleRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const dims = pageDimensions(paper.size, paper.orientation);
  const hasHeader = paper.header.trim() !== '';
  const hasFooter = paper.footer.trim() !== '' || paper.pageNumbers;
  const marginLine = usesMarginLine(paper);

  const contentTop =
    PAPER_MARGIN.block + (hasHeader ? PAPER_MARGIN.chrome : 0);

  const style = useMemo(
    () => ({
      ...handCssVars(document.handwriting, contentTop),
      '--_page-w': `${dims.width}px`,
      '--_page-h': `${dims.height}px`,
      transform: zoom === 1 ? undefined : `scale(${zoom})`,
      transformOrigin: 'top left',
    }),
    [document.handwriting, contentTop, dims.width, dims.height, zoom],
  );

  const setArticleRef = useCallback(
    (element: HTMLElement | null) => {
      articleRef.current = element;
      if (typeof ref === 'function') ref(element);
      else if (ref) ref.current = element;
    },
    [ref],
  );

  const canvasRenderKey = useMemo(
    () => JSON.stringify([document.id, document.handwriting, paper, blocks.map((block) => block.key)]),
    [blocks, document.handwriting, document.id, paper],
  );
  const settingsRenderKey = useMemo(
    () => previewRenderKey(document.handwriting, paper),
    [document.handwriting, paper],
  );

  const handleCanvasRenderState = useCallback(
    (state: CanvasRenderState) =>
      onRenderStateChange?.(pageIndex, settingsRenderKey, state),
    [onRenderStateChange, pageIndex, settingsRenderKey],
  );

  return (
    <div
      className="shrink-0"
      style={{ width: dims.width * zoom, height: dims.height * zoom }}
    >
      <article
        ref={setArticleRef}
        data-page={pageIndex + 1}
        className={cn(
          'page',
          `paper-${paper.style}`,
          hasHeader && 'has-header',
          hasFooter && 'has-footer',
          marginLine && 'has-margin-line',
        )}
        style={style}
      >
        {hasHeader && <div className="page-header">{paper.header}</div>}
        {marginLine && <div className="page-margin-line" aria-hidden />}
        <div ref={contentRef} className="page-content hand-scope canvas-handwriting-source" data-content-width={contentWidth(paper)}>
          {blocks.map((block) => (
            <MarkdownBlock key={block.key} block={block} seed={document.id} hand={document.handwriting} />
          ))}
        </div>
        <CanvasHandwritingLayer
          pageRef={articleRef}
          sourceRef={contentRef}
          width={dims.width}
          height={dims.height}
          seed={`${document.id}:page-${pageIndex}`}
          renderKey={canvasRenderKey}
          handwriting={document.handwriting}
          paper={paper}
          onRenderStateChange={handleCanvasRenderState}
        />
        {hasFooter && (
          <div className="page-footer">
            <span>{paper.footer}</span>
            {paper.pageNumbers && (
              <span className="page-number">
                {pageIndex + 1} / {totalPages}
              </span>
            )}
          </div>
        )}
      </article>
    </div>
  );
});
