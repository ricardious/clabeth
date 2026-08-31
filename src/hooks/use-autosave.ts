import { useEffect, useRef } from 'react';
import { useDocumentsStore } from '../lib/store/documents';

export const AUTOSAVE_DELAY = 900;

/**
 * Autoguardado: observa la lista de documentos y persiste con debounce.
 * Devuelve el estado de guardado para mostrarlo en la interfaz.
 */
export function useAutosave(): void {
  const documents = useDocumentsStore((state) => state.documents);
  const loaded = useDocumentsStore((state) => state.loaded);
  const persistNow = useDocumentsStore((state) => state.persistNow);
  const firstRun = useRef(true);

  useEffect(() => {
    if (!loaded) return;
    // No persistir en la carga inicial.
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    const timer = setTimeout(persistNow, AUTOSAVE_DELAY);
    return () => clearTimeout(timer);
  }, [documents, loaded, persistNow]);
}
