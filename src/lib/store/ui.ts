import { create } from 'zustand';

export type PreviewMode = 'continua' | 'una' | 'dos';

/**
 * Fidelidad de la vista previa.
 * - `manuscrita`: se dibuja el Canvas con tinta, papel y variación humana.
 * - `borrador`: se muestra solo el DOM con las fuentes manuscritas y se omite
 *   el Canvas, que es el paso caro (cientos de ms por hoja en cada cambio).
 *   La exportación siempre usa `manuscrita`, sea cual sea esta preferencia.
 */
export type PreviewQuality = 'manuscrita' | 'borrador';
export type InspectorTab = 'escritura' | 'papel' | 'latex' | null;
export type MobileTab = 'escribir' | 'vista' | 'personalizar';

export const ZOOM_MIN = 0.5;
export const ZOOM_MAX = 2;
export const ZOOM_STEP = 0.1;

/** Estado efímero de la interfaz del editor. */
interface UiState {
  sidebarOpen: boolean;
  inspector: InspectorTab;
  previewMode: PreviewMode;
  previewQuality: PreviewQuality;
  zoom: number;
  /** Página visible (0-based) en los modos «una» y «dos». */
  currentPage: number;
  mobileTab: MobileTab;
  toggleSidebar: () => void;
  setInspector: (tab: InspectorTab) => void;
  setPreviewMode: (mode: PreviewMode) => void;
  setPreviewQuality: (quality: PreviewQuality) => void;
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  setCurrentPage: (page: number) => void;
  setMobileTab: (tab: MobileTab) => void;
}

const clampZoom = (zoom: number): number =>
  Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Math.round(zoom * 100) / 100));

export const useUiStore = create<UiState>()((set) => ({
  sidebarOpen: true,
  inspector: 'escritura',
  previewMode: 'continua',
  previewQuality: 'manuscrita',
  zoom: 1,
  currentPage: 0,
  mobileTab: 'escribir',
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setInspector: (inspector) => set({ inspector }),
  setPreviewMode: (previewMode) => set({ previewMode }),
  setPreviewQuality: (previewQuality) => set({ previewQuality }),
  setZoom: (zoom) => set({ zoom: clampZoom(zoom) }),
  zoomIn: () => set((state) => ({ zoom: clampZoom(state.zoom + ZOOM_STEP) })),
  zoomOut: () => set((state) => ({ zoom: clampZoom(state.zoom - ZOOM_STEP) })),
  setCurrentPage: (currentPage) => set({ currentPage }),
  setMobileTab: (mobileTab) => set({ mobileTab }),
}));
