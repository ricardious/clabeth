import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ThemeMode } from '../types/theme';
import type { PageSizeId, PaperStyleId } from '../types/paper';

interface SettingsState {
  theme: ThemeMode;
  defaultPresetId: string;
  defaultPaperStyle: PaperStyleId;
  defaultPageSize: PageSizeId;
  setTheme: (theme: ThemeMode) => void;
  setDefaultPresetId: (id: string) => void;
  setDefaultPaperStyle: (style: PaperStyleId) => void;
  setDefaultPageSize: (size: PageSizeId) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'system',
      defaultPresetId: 'clara',
      defaultPaperStyle: 'libreta',
      defaultPageSize: 'a4',
      setTheme: (theme) => set({ theme }),
      setDefaultPresetId: (defaultPresetId) => set({ defaultPresetId }),
      setDefaultPaperStyle: (defaultPaperStyle) => set({ defaultPaperStyle }),
      setDefaultPageSize: (defaultPageSize) => set({ defaultPageSize }),
    }),
    { name: 'clabeth.settings.v1' },
  ),
);
