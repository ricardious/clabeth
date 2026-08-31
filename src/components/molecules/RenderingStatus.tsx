import { FileText } from 'lucide-react';
import { cn } from '../../lib/utils/cn';
import { Spinner } from '../atoms/Spinner';

interface RenderingStatusProps {
  title: string;
  description: string;
  detail?: string;
  variant?: 'panel' | 'dialog';
}

/** Estado de espera visible para tareas de maquetación y exportación. */
export function RenderingStatus({
  title,
  description,
  detail,
  variant = 'panel',
}: RenderingStatusProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn(
        'flex flex-col items-center justify-center text-center',
        variant === 'dialog' ? 'min-h-[360px] px-8 py-10' : 'absolute inset-0 z-[1] bg-panel px-6 py-8',
      )}
    >
      <div className="relative mb-5 h-20 w-20" aria-hidden="true">
        <span className="absolute left-2 top-2 h-14 w-11 -rotate-6 rounded-md border border-outline bg-background shadow-panel" />
        <span className="absolute right-2 top-2 h-14 w-11 rotate-6 rounded-md border border-outline bg-background shadow-panel" />
        <span className="absolute left-1/2 top-0 flex h-16 w-12 -translate-x-1/2 items-center justify-center rounded-md border border-outline-strong bg-surface shadow-pop">
          <FileText size={23} className="text-primary" />
        </span>
        <span className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border border-outline bg-surface shadow-panel">
          <Spinner className="h-4 w-4" label="Procesando" />
        </span>
      </div>

      <h2 className="font-display text-xl font-semibold text-foreground-strong">{title}</h2>
      <p className="mt-2 max-w-sm text-sm text-foreground">{description}</p>
      {detail && <p className="mt-1.5 text-xs text-muted">{detail}</p>}
    </div>
  );
}
