import { useEffect } from 'react';
import { useDocumentsStore } from '../lib/store/documents';
import { useTheme } from './use-theme';

/** Inicializa únicamente el estado cliente que necesita una isla interactiva. */
export function useAppBootstrap(): void {
  useTheme();
  const init = useDocumentsStore((state) => state.init);

  useEffect(() => {
    init();
  }, [init]);
}
