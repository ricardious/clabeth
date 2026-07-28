import { forwardRef, useMemo } from 'react';
import type { ClabethDocument } from '../../types/document';
import type { MdBlock } from '../../lib/markdown/blocks';
import type { PaperConfig } from '../../types/paper';
import { contentWidth, pageDimensions, usesMarginLine, PAPER_MARGIN } from '../../lib/paper/styles';
import { handCssVars } from '../../lib/handwriting/css-vars';
import { cn } from '../../lib/utils/cn';
import { MarkdownBlock } from './MarkdownBlock';

export interface PreviewPageProps {
  document: ClabethDocument;
  /** Permite sobrescribir el papel (exportación con opciones propias). */
  paper?: PaperConfig;
  blocks: MdBlock[];
  pageIndex: number;
  totalPages: number;
  zoom?: number;
}

/** Una hoja con su chrome: encabezado, pie, numeración y margen rojo. */
export const PreviewPage = forwardRef<HTMLElement, PreviewPageProps>(function PreviewPage(
  { document, paper: paperOverride, blocks, pageIndex, totalPages, zoom = 1 },
  ref,
) {
  const paper = paperOverride ?? document.paper;
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

  return (
    <div
      className="shrink-0"
      style={{ width: dims.width * zoom, height: dims.height * zoom }}
    >
      <article
        ref={ref}
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
        <div className="page-content hand-scope" data-content-width={contentWidth(paper)}>
          {blocks.map((block) => (
            <MarkdownBlock key={block.key} block={block} seed={document.id} hand={document.handwriting} />
          ))}
        </div>
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
