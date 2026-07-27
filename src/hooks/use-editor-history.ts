import { useCallback, useRef, useState } from 'react';

const GROUP_MS = 600;
const MAX_ENTRIES = 200;

export interface EditorHistory {
  canUndo: boolean;
  canRedo: boolean;
  /** Registra un nuevo valor; agrupa cambios rápidos consecutivos. */
  record: (value: string) => void;
  undo: () => string | null;
  redo: () => string | null;
  /** Reinicia el historial (al abrir otro documento). */
  reset: (initial: string) => void;
}

interface HistoryEntry {
  value: string;
  time: number;
}

/** Historial deshacer/rehacer independiente del navegador. */
export function useEditorHistory(initial: string): EditorHistory {
  const [past, setPast] = useState<HistoryEntry[]>([{ value: initial, time: Date.now() }]);
  const [future, setFuture] = useState<HistoryEntry[]>([]);
  const present = useRef(initial);

  const record = useCallback((value: string) => {
    if (value === present.current) return;
    const now = Date.now();
    present.current = value;
    setPast((entries) => {
      const last = entries[entries.length - 1];
      // Agrupa tecleo continuo: actualiza la última entrada en vez de apilar.
      if (last && now - last.time < GROUP_MS) {
        return [...entries.slice(0, -1), { value, time: now }];
      }
      return [...entries, { value, time: now }].slice(-MAX_ENTRIES);
    });
    setFuture([]);
  }, []);

  const undo = useCallback((): string | null => {
    let restored: string | null = null;
    setPast((entries) => {
      if (entries.length <= 1) return entries;
      const current = entries[entries.length - 1];
      const previous = entries.slice(0, -1);
      restored = previous[previous.length - 1].value;
      setFuture((f) => [...f, current]);
      return previous;
    });
    if (restored !== null) present.current = restored;
    return restored;
  }, []);

  const redo = useCallback((): string | null => {
    let restored: string | null = null;
    setFuture((entries) => {
      if (entries.length === 0) return entries;
      const next = entries[entries.length - 1];
      restored = next.value;
      setPast((p) => [...p, next]);
      return entries.slice(0, -1);
    });
    if (restored !== null) present.current = restored;
    return restored;
  }, []);

  const reset = useCallback((value: string) => {
    present.current = value;
    setPast([{ value, time: Date.now() }]);
    setFuture([]);
  }, []);

  return { canUndo: past.length > 1, canRedo: future.length > 0, record, undo, redo, reset };
}
