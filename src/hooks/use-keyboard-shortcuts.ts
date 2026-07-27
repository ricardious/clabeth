import { useEffect } from 'react';

export interface ShortcutMap {
  /** Ej.: 'mod+b', 'mod+shift+s' — «mod» es Ctrl en Win/Linux y Cmd en macOS. */
  [combo: string]: (event: KeyboardEvent) => void;
}

function normalize(event: KeyboardEvent): string {
  const parts: string[] = [];
  if (event.ctrlKey || event.metaKey) parts.push('mod');
  if (event.altKey) parts.push('alt');
  if (event.shiftKey) parts.push('shift');
  const key = event.key.toLowerCase();
  if (!['control', 'meta', 'alt', 'shift'].includes(key)) parts.push(key);
  return parts.join('+');
}

/** Atajos globales de teclado. El mapa debe ser estable (useMemo). */
export function useKeyboardShortcuts(shortcuts: ShortcutMap, enabled = true): void {
  useEffect(() => {
    if (!enabled) return;
    const handler = (event: KeyboardEvent): void => {
      const combo = normalize(event);
      const action = shortcuts[combo];
      if (action) {
        event.preventDefault();
        action(event);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [shortcuts, enabled]);
}
