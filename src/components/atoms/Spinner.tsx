import { cn } from '../../lib/utils/cn';

export function Spinner({ className, label = 'Cargando' }: { className?: string; label?: string }) {
  return (
    <span role="status" aria-label={label} className="inline-flex">
      <span
        className={cn(
          'h-4 w-4 animate-spin rounded-full border-2 border-outline-strong border-t-primary',
          className,
        )}
      />
    </span>
  );
}
