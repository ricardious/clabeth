import { Moon, Sun } from 'lucide-react';
import { useSettingsStore } from '../../lib/store/settings';
import { IconButton } from '../atoms/IconButton';

export function ThemeToggle() {
  const theme = useSettingsStore((state) => state.theme);
  const setTheme = useSettingsStore((state) => state.setTheme);
  const dark = theme === 'dark';

  return (
    <IconButton
      label={dark ? 'Tema oscuro (cambiar a claro)' : 'Tema claro (cambiar a oscuro)'}
      onClick={() => setTheme(dark ? 'light' : 'dark')}
    >
      {dark ? <Moon size={17} aria-hidden /> : <Sun size={17} aria-hidden />}
    </IconButton>
  );
}
