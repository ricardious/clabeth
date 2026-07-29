import { useRef, useState, type ReactNode } from 'react';
import { Download, Monitor, Moon, Sun, Trash2, Upload } from 'lucide-react';
import { useDocumentsStore } from '../store/documents';
import { useSettingsStore } from '../store/settings';
import type { ThemeMode } from '../types/theme';
import type { PageSizeId, PaperStyleId } from '../types/paper';
import { exportLibraryJson, importLibraryJson } from '../lib/storage/repository';
import { HANDWRITING_PRESETS } from '../lib/handwriting/presets';
import { PAPER_STYLES, PAGE_SIZES } from '../lib/paper/styles';
import { Button } from '../components/atoms/Button';
import { Select } from '../components/atoms/Select';
import { Separator } from '../components/atoms/Separator';
import { Kbd } from '../components/atoms/Kbd';
import { ConfirmDialog } from '../components/molecules/ConfirmDialog';
import { ErrorNotice } from '../components/molecules/ErrorNotice';
import { cn } from '../lib/utils/cn';

const THEMES: { id: ThemeMode; label: string; description: string; icon: ReactNode }[] = [
  { id: 'light', label: 'Claro', description: 'Papel y tinta de día.', icon: <Sun size={18} aria-hidden /> },
  { id: 'dark', label: 'Oscuro', description: 'Escritorio de noche, hoja clara.', icon: <Moon size={18} aria-hidden /> },
  { id: 'system', label: 'Sistema', description: 'Sigue la configuración del sistema.', icon: <Monitor size={18} aria-hidden /> },
];

const SHORTCUTS: { combo: string; action: string }[] = [
  { combo: 'Ctrl+B', action: 'Negrita' },
  { combo: 'Ctrl+I', action: 'Cursiva' },
  { combo: 'Ctrl+K', action: 'Insertar enlace' },
  { combo: 'Ctrl+F', action: 'Buscar en el documento' },
  { combo: 'Ctrl+S', action: 'Guardar ahora' },
  { combo: 'Ctrl+E', action: 'Alternar panel de personalización' },
  { combo: 'Ctrl+Z', action: 'Deshacer' },
  { combo: 'Ctrl+Y', action: 'Rehacer' },
];

export function SettingsPage() {
  const settings = useSettingsStore();
  const documents = useDocumentsStore((state) => state.documents);
  const importDocuments = useDocumentsStore((state) => state.importDocuments);
  const removeAll = useDocumentsStore((state) => state.remove);
  const [importError, setImportError] = useState<string | null>(null);
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const importRef = useRef<HTMLInputElement>(null);

  const handleExportLibrary = (): void => {
    const json = exportLibraryJson(documents);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'clabeth-biblioteca.json';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (file: File): void => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === 'string' ? reader.result : '';
      try {
        const incoming = importLibraryJson(text);
        const added = importDocuments(incoming);
        setImportError(null);
        setImportMessage(`Importados ${added} documento${added === 1 ? '' : 's'}.`);
      } catch (error) {
        setImportMessage(null);
        setImportError(error instanceof Error ? error.message : 'No se pudo importar la copia.');
      }
    };
    reader.readAsText(file);
  };

  const handleClearAll = (): void => {
    documents.forEach((doc) => removeAll(doc.id));
    setConfirmClear(false);
  };

  return (
    <div className="mx-auto max-w-2xl p-6">
      <header className="mb-6">
        <h2 className="font-display text-xl font-semibold text-foreground-strong">Ajustes</h2>
        <p className="mt-1 text-sm text-muted">Preferencias locales: se guardan en este navegador.</p>
      </header>

      <section aria-labelledby="h-tema" className="space-y-3">
        <h3 id="h-tema" className="text-sm font-semibold text-foreground">Apariencia</h3>
        <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Tema de la interfaz">
          {THEMES.map((theme) => (
            <button
              key={theme.id}
              type="button"
              role="radio"
              aria-checked={settings.theme === theme.id}
              onClick={() => settings.setTheme(theme.id)}
              className={cn(
                'flex flex-col items-start gap-1.5 rounded-md border p-3 text-left transition-colors duration-[var(--dur-fast)]',
                settings.theme === theme.id
                  ? 'border-focus-ring bg-primary-soft/40'
                  : 'border-outline bg-surface hover:border-outline-strong',
              )}
            >
              <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                {theme.icon}
                {theme.label}
              </span>
              <span className="text-xs text-muted">{theme.description}</span>
            </button>
          ))}
        </div>
      </section>

      <Separator className="my-6" />

      <section aria-labelledby="h-nuevos" className="space-y-3">
        <h3 id="h-nuevos" className="text-sm font-semibold text-foreground">Documentos nuevos</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <label className="block">
            <span className="mb-1 block text-[13px] text-foreground">Estilo de escritura</span>
            <Select
              value={settings.defaultPresetId}
              onChange={(event) => settings.setDefaultPresetId(event.target.value)}
            >
              {HANDWRITING_PRESETS.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.name}
                </option>
              ))}
            </Select>
          </label>
          <label className="block">
            <span className="mb-1 block text-[13px] text-foreground">Papel por defecto</span>
            <Select
              value={settings.defaultPaperStyle}
              onChange={(event) => settings.setDefaultPaperStyle(event.target.value as PaperStyleId)}
            >
              {PAPER_STYLES.map((style) => (
                <option key={style.id} value={style.id}>
                  {style.name}
                </option>
              ))}
            </Select>
          </label>
          <label className="block">
            <span className="mb-1 block text-[13px] text-foreground">Tamaño por defecto</span>
            <Select
              value={settings.defaultPageSize}
              onChange={(event) => settings.setDefaultPageSize(event.target.value as PageSizeId)}
            >
              {Object.entries(PAGE_SIZES).map(([id, def]) => (
                <option key={id} value={id}>
                  {def.name}
                </option>
              ))}
            </Select>
          </label>
        </div>
      </section>

      <Separator className="my-6" />

      <section aria-labelledby="h-biblioteca" className="space-y-3">
        <h3 id="h-biblioteca" className="text-sm font-semibold text-foreground">Biblioteca</h3>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={handleExportLibrary}>
            <Download size={15} aria-hidden /> Exportar copia (JSON)
          </Button>
          <Button variant="secondary" onClick={() => importRef.current?.click()}>
            <Upload size={15} aria-hidden /> Importar copia
          </Button>
          <Button variant="danger" onClick={() => setConfirmClear(true)}>
            <Trash2 size={15} aria-hidden /> Borrar todos los documentos
          </Button>
        </div>
        <input
          ref={importRef}
          type="file"
          accept=".json"
          className="hidden"
          aria-hidden
          tabIndex={-1}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) handleImportFile(file);
            event.target.value = '';
          }}
        />
        {importError && <ErrorNotice>{importError}</ErrorNotice>}
        {importMessage && (
          <p role="status" className="text-sm text-success">
            {importMessage}
          </p>
        )}
      </section>

      <Separator className="my-6" />

      <section aria-labelledby="h-atajos">
        <h3 id="h-atajos" className="mb-3 text-sm font-semibold text-foreground">Atajos de teclado</h3>
        <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {SHORTCUTS.map((shortcut) => (
            <li key={shortcut.combo} className="flex items-center justify-between text-sm text-foreground">
              <span>{shortcut.action}</span>
              <span className="flex gap-1">
                {shortcut.combo.split('+').map((part) => (
                  <Kbd key={part}>{part}</Kbd>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <ConfirmDialog
        open={confirmClear}
        title="Borrar todos los documentos"
        message="Se eliminarán todos los documentos de este navegador. Esta acción no se puede deshacer."
        confirmLabel="Borrar todo"
        cancelLabel="Cancelar"
        danger
        onConfirm={handleClearAll}
        onCancel={() => setConfirmClear(false)}
      />
    </div>
  );
}
