import { create } from 'zustand';
import type { ClabethDocument, SaveState } from '../types/document';
import { createDocument } from '../defaults';
import { loadLibrary, saveLibrary } from '../storage/repository';
import { useSettingsStore } from './settings';

interface DocumentsState {
  documents: ClabethDocument[];
  loaded: boolean;
  loadError: string | null;
  saveState: SaveState;
  /** Carga la biblioteca desde localStorage (una vez). */
  init: () => void;
  createAndAdd: (overrides?: Parameters<typeof createDocument>[0]) => ClabethDocument;
  update: (id: string, patch: Partial<Omit<ClabethDocument, 'id' | 'createdAt'>>) => void;
  rename: (id: string, title: string) => void;
  duplicate: (id: string) => ClabethDocument | null;
  remove: (id: string) => void;
  importDocuments: (incoming: ClabethDocument[]) => number;
  /** Persiste inmediatamente y actualiza el estado de guardado. */
  persistNow: () => void;
}

let idleTimer: ReturnType<typeof setTimeout> | undefined;

export const useDocumentsStore = create<DocumentsState>()((set, get) => ({
  documents: [],
  loaded: false,
  loadError: null,
  saveState: 'idle',

  init: () => {
    if (get().loaded) return;
    const result = loadLibrary();
    set({
      documents: result.documents,
      loaded: true,
      loadError: result.ok ? null : result.error,
    });
  },

  createAndAdd: (overrides = {}) => {
    const settings = useSettingsStore.getState();
    const doc = createDocument({
      presetId: settings.defaultPresetId,
      paperStyle: settings.defaultPaperStyle,
      ...overrides,
    });
    set((state) => ({ documents: [doc, ...state.documents] }));
    return doc;
  },

  update: (id, patch) => {
    set((state) => ({
      documents: state.documents.map((doc) =>
        doc.id === id ? { ...doc, ...patch, id: doc.id, createdAt: doc.createdAt, updatedAt: Date.now() } : doc,
      ),
    }));
  },

  rename: (id, title) => {
    const clean = title.trim() || 'Sin título';
    get().update(id, { title: clean });
  },

  duplicate: (id) => {
    const source = get().documents.find((doc) => doc.id === id);
    if (!source) return null;
    const copy: ClabethDocument = {
      ...structuredClone(source),
      id: createDocument().id,
      title: `${source.title} (copia)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    set((state) => ({ documents: [copy, ...state.documents] }));
    return copy;
  },

  remove: (id) => {
    set((state) => ({ documents: state.documents.filter((doc) => doc.id !== id) }));
    get().persistNow();
  },

  importDocuments: (incoming) => {
    const existing = new Set(get().documents.map((doc) => doc.id));
    const fresh = incoming.filter((doc) => !existing.has(doc.id));
    set((state) => ({ documents: [...fresh, ...state.documents] }));
    get().persistNow();
    return fresh.length;
  },

  persistNow: () => {
    if (!get().loaded) return;
    set({ saveState: 'saving' });
    const result = saveLibrary(get().documents);
    if (idleTimer) clearTimeout(idleTimer);
    if (result.ok) {
      set({ saveState: 'saved' });
      idleTimer = setTimeout(() => {
        if (useDocumentsStore.getState().saveState === 'saved') {
          useDocumentsStore.setState({ saveState: 'idle' });
        }
      }, 2500);
    } else {
      set({ saveState: 'error' });
      idleTimer = setTimeout(() => {
        if (useDocumentsStore.getState().saveState === 'error') {
          useDocumentsStore.setState({ saveState: 'idle' });
        }
      }, 5000);
    }
  },
}));
