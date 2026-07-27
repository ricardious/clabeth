import { useEffect, useRef, type ReactNode } from 'react';
import { cn } from '../../lib/utils/cn';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}

/** Diálogo modal sobre el elemento nativo <dialog>. */
export function Dialog({ open, onClose, title, children, className }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label={title}
      onClose={onClose}
      onClick={(event) => {
        // Clic en el backdrop (el propio <dialog>) cierra.
        if (event.target === ref.current) onClose();
      }}
      className={cn(
        'm-auto w-[min(560px,92vw)] rounded-lg border border-outline bg-surface p-0 text-foreground shadow-pop',
        className,
      )}
    >
      {open && children}
    </dialog>
  );
}
