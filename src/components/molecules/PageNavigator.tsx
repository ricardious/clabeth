import { ChevronLeft, ChevronRight } from 'lucide-react';
import { IconButton } from '../atoms/IconButton';

export interface PageNavigatorProps {
  page: number;
  total: number;
  onChange: (page: number) => void;
}

export function PageNavigator({ page, total, onChange }: PageNavigatorProps) {
  return (
    <div className="inline-flex items-center gap-0.5" role="group" aria-label="Navegación de páginas">
      <IconButton label="Página anterior" size="sm" onClick={() => onChange(page - 1)} disabled={page <= 0}>
        <ChevronLeft size={14} aria-hidden />
      </IconButton>
      <span className="min-w-14 text-center text-xs tabular-nums text-muted" aria-live="polite">
        {Math.min(page + 1, total)} / {total}
      </span>
      <IconButton
        label="Página siguiente"
        size="sm"
        onClick={() => onChange(page + 1)}
        disabled={page >= total - 1}
      >
        <ChevronRight size={14} aria-hidden />
      </IconButton>
    </div>
  );
}
