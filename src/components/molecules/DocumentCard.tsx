import { Copy, Pencil, Trash2 } from 'lucide-react';
import type { ReactNode } from 'react';
import type { ClabethDocument } from '../../types/document';
import { getPreset } from '../../lib/handwriting/presets';
import { getPaperStyle } from '../../lib/paper/styles';
import { textStats, estimatePages } from '../../lib/markdown/stats';
import { contentHeight, contentWidth } from '../../lib/paper/styles';
import { formatRelativeTime } from '../../lib/utils/format';
import { Badge } from '../atoms/Badge';
import { IconButton } from '../atoms/IconButton';

export interface DocumentCardProps {
  document: ClabethDocument;
  /** Miniatura renderizada (la compone el organismo DocumentGrid). */
  thumbnail: ReactNode;
  onOpen: (id: string) => void;
  onDuplicate: (id: string) => void;
  onRename: (id: string) => void;
  onDelete: (id: string) => void;
}

export function DocumentCard({ document, thumbnail, onOpen, onDuplicate, onRename, onDelete }: DocumentCardProps) {
  const stats = textStats(document.content);
  const pages = estimatePages(
    stats.words,
    document.handwriting.fontSize,
    document.handwriting.lineHeight,
    contentWidth(document.paper),
    contentHeight(document.paper),
  );
  const presetName = getPresetName(document.handwriting);
  const paperName = getPaperStyle(document.paper.style).name;

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-outline bg-surface shadow-panel transition-shadow duration-[var(--dur-med)] hover:shadow-pop">
      <button
        type="button"
        onClick={() => onOpen(document.id)}
        aria-label={`Abrir «${document.title}»`}
        className="relative block h-44 overflow-hidden bg-panel text-left"
      >
        <div className="pointer-events-none absolute inset-0 flex items-start justify-center pt-3">
          {thumbnail}
        </div>
        <span className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[var(--panel)] to-transparent" aria-hidden />
      </button>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <button
          type="button"
          onClick={() => onOpen(document.id)}
          className="text-left font-display text-[15px] font-semibold leading-snug text-foreground-strong hover:text-primary"
        >
          {document.title}
        </button>
        <p className="text-xs text-muted">
          {formatRelativeTime(document.updatedAt)} · {stats.words} palabras · {pages} pág.
        </p>
        <div className="flex flex-wrap gap-1">
          <Badge tone="brand">{presetName}</Badge>
          <Badge>{paperName}</Badge>
        </div>
        <div className="mt-auto flex items-center justify-end gap-0.5 pt-1 opacity-0 transition-opacity duration-[var(--dur-fast)] group-focus-within:opacity-100 group-hover:opacity-100">
          <IconButton label="Renombrar" size="sm" onClick={() => onRename(document.id)}>
            <Pencil size={14} aria-hidden />
          </IconButton>
          <IconButton label="Duplicar" size="sm" onClick={() => onDuplicate(document.id)}>
            <Copy size={14} aria-hidden />
          </IconButton>
          <IconButton label="Eliminar" size="sm" danger onClick={() => onDelete(document.id)}>
            <Trash2 size={14} aria-hidden />
          </IconButton>
        </div>
      </div>
    </article>
  );
}

function getPresetName(handwriting: ClabethDocument['handwriting']): string {
  const byConfig = getPreset(
    ['clara', 'escolar', 'tecnica', 'cursiva', 'apuntes', 'elegante'].find(
      (id) => getPreset(id).config.fontId === handwriting.fontId && getPreset(id).config.inkId === handwriting.inkId,
    ) ?? 'clara',
  );
  return byConfig.name;
}
