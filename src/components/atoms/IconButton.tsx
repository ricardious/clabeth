import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils/cn';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Obligatorio por accesibilidad: describe la acción. */
  label: string;
  active?: boolean;
  danger?: boolean;
  size?: 'sm' | 'md';
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, active = false, danger = false, size = 'md', className, type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      title={label}
      aria-pressed={active || undefined}
      className={cn(
        'inline-flex items-center justify-center rounded-md shrink-0',
        'transition-colors duration-[var(--dur-fast)]',
        'disabled:opacity-45 disabled:pointer-events-none',
        size === 'sm' ? 'h-[var(--control-h-sm)] w-[var(--control-h-sm)]' : 'h-[var(--control-h-md)] w-[var(--control-h-md)]',
        danger
          ? 'text-error hover:bg-primary-soft'
          : active
            ? 'bg-primary-soft text-primary'
            : 'text-muted hover:bg-hover hover:text-foreground',
        className,
      )}
      {...props}
    />
  );
});
