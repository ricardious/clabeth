import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowLeft, Download, FileText, PanelRight, PenLine, Sigma } from 'lucide-react';
import { useDocumentsStore } from '../../lib/store/documents';
import { useUiStore, type InspectorTab } from '../../lib/store/ui';
import { useAutosave } from '../../hooks/use-autosave';
import { useDebouncedValue } from '../../hooks/use-debounced-value';
import { useIsMobile } from '../../hooks/use-media-query';
import { textStats } from '../../lib/markdown/stats';
import { previewRenderKey } from '../../lib/handwriting/render-key';
import type { ExportOptions, ExportProgress } from '../../lib/types/export';
import type { HandwritingConfig } from '../../lib/types/handwriting';
import type { PaperConfig } from '../../lib/types/paper';
import { Button } from '../atoms/Button';
import { IconButton } from '../atoms/IconButton';
import { ThemeToggle } from '../molecules/ThemeToggle';
import { SaveStatus } from '../molecules/SaveStatus';
import { EditorShell } from '../templates/EditorShell';
import { MarkdownEditor, type MarkdownEditorHandle } from '../organisms/MarkdownEditor';
import { PaginatedPreview } from '../organisms/PaginatedPreview';
import { HandwritingPanel } from '../organisms/HandwritingPanel';
import { PaperPanel } from '../organisms/PaperPanel';
import { LatexPalette } from '../organisms/LatexPalette';
import { ExportDialog } from '../organisms/ExportDialog';
import { ExportRunner, type ExportJob } from '../organisms/ExportRunner';
import { StatusBar } from '../organisms/StatusBar';
import { cn } from '../../lib/utils/cn';
import { useAppBootstrap } from '../../hooks/use-app-bootstrap';
import { navigateTo } from '../../lib/navigation';

/**
 * Pausa tras la última tecla antes de repaginar y redibujar. Escribir cambia el
 * contenido decenas de veces por segundo y cada pasada implica volver a partir
 * el Markdown en bloques, medir sus alturas y repintar el Canvas de cada hoja
 * visible. Esperar a la pausa concentra ese trabajo en una sola vez.
 */
const PREVIEW_DEBOUNCE_MS = 500;

const INSPECTOR_TABS: { id: InspectorTab; label: string; icon: ReactNode }[] = [
  { id: 'escritura', label: 'Escritura', icon: <PenLine size={15} aria-hidden /> },
  { id: 'papel', label: 'Papel', icon: <FileText size={15} aria-hidden /> },
  { id: 'latex', label: 'Fórmulas', icon: <Sigma size={15} aria-hidden /> },
];

export function EditorWorkspace() {
  useAppBootstrap();
  const [id, setId] = useState<string>();

  useEffect(() => {
    setId(new URLSearchParams(window.location.search).get('id') ?? undefined);
  }, []);
  const isMobile = useIsMobile();
  const editorRef = useRef<MarkdownEditorHandle>(null);

  const documents = useDocumentsStore((state) => state.documents);
  const loaded = useDocumentsStore((state) => state.loaded);
  const update = useDocumentsStore((state) => state.update);
  const persistNow = useDocumentsStore((state) => state.persistNow);
  const saveState = useDocumentsStore((state) => state.saveState);
  const loadError = useDocumentsStore((state) => state.loadError);
  useAutosave();

  const inspector = useUiStore((state) => state.inspector);
  const setInspector = useUiStore((state) => state.setInspector);
  const previewMode = useUiStore((state) => state.previewMode);
  const setPreviewMode = useUiStore((state) => state.setPreviewMode);
  const previewQuality = useUiStore((state) => state.previewQuality);
  const setPreviewQuality = useUiStore((state) => state.setPreviewQuality);
  const zoom = useUiStore((state) => state.zoom);
  const currentPage = useUiStore((state) => state.currentPage);
  const setCurrentPage = useUiStore((state) => state.setCurrentPage);

  const [pageCount, setPageCount] = useState(0);
  const [exportOpen, setExportOpen] = useState(false);
  const [exportJob, setExportJob] = useState<ExportJob | null>(null);
  const [exportProgress, setExportProgress] = useState<ExportProgress | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);
  const [renderingPreviewKey, setRenderingPreviewKey] = useState<string | null>(null);
  const previewUpdateFrame = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (previewUpdateFrame.current !== null) window.cancelAnimationFrame(previewUpdateFrame.current);
    },
    [],
  );

  // Estable a propósito: los callbacks que llegan a la vista previa acaban en
  // las dependencias del dibujado, y uno creado en cada render la repintaría
  // entera cada vez que este componente se vuelve a renderizar.
  const handlePreviewRenderReady = useCallback((renderKey: string): void => {
    setRenderingPreviewKey((current) => (current === renderKey ? null : current));
  }, []);

  const doc = documents.find((d) => d.id === id);
  // La vista previa va un paso por detrás del editor: el texto se propaga en la
  // pausa, no en cada tecla. Al abrir otro documento se muestra al instante.
  const previewContent = useDebouncedValue(doc?.content ?? '', PREVIEW_DEBOUNCE_MS, doc?.id);

  if (!loaded || !id) {
    return <div className="flex h-full items-center justify-center bg-background text-sm text-muted">Cargando documento…</div>;
  }

  if (!doc) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 bg-background p-8 text-center">
        <p className="font-display text-xl font-semibold text-foreground-strong">Documento no encontrado</p>
        <p className="text-sm text-muted">Puede que haya sido eliminado o que la dirección esté mal escrita.</p>
        <Button onClick={() => navigateTo('/app')}>Volver a mis documentos</Button>
      </div>
    );
  }

  const stats = textStats(doc.content);
  // Misma configuración, contenido con retardo. `handwriting` y `paper` se
  // comparten por referencia, así que los ajustes del panel siguen aplicándose
  // de inmediato.
  const previewDoc = doc.content === previewContent ? doc : { ...doc, content: previewContent };

  const handleContent = (value: string): void => update(doc.id, { content: value });

  const applyVisualChange = (
    handwriting: HandwritingConfig,
    paper: PaperConfig,
    apply: () => void,
    defer: boolean,
  ): void => {
    if (previewUpdateFrame.current !== null) {
      window.cancelAnimationFrame(previewUpdateFrame.current);
      previewUpdateFrame.current = null;
    }

    // Sin Canvas no hay redibujado que esperar: el cambio se ve en el acto.
    if (previewQuality === 'borrador') {
      apply();
      return;
    }

    setRenderingPreviewKey(previewRenderKey(handwriting, paper));

    if (!defer) {
      apply();
      return;
    }

    // Los cambios discretos esperan dos cuadros: primero se pinta el estado de
    // carga y después comienza la medición y el redibujado intensivo.
    previewUpdateFrame.current = window.requestAnimationFrame(() => {
      previewUpdateFrame.current = window.requestAnimationFrame(() => {
        previewUpdateFrame.current = null;
        apply();
      });
    });
  };

  const handleHandwriting = (patch: Partial<HandwritingConfig>): void => {
    const handwriting = { ...doc.handwriting, ...patch };
    // Cambios de un solo clic que obligan a repintar la hoja entera: se
    // aplazan un par de cuadros para que primero se pinte el aviso de espera.
    const discrete =
      patch.fontId !== undefined ||
      patch.inkId !== undefined ||
      patch.headingInkId !== undefined ||
      patch.formulaStyle !== undefined;
    applyVisualChange(
      handwriting,
      doc.paper,
      () => update(doc.id, { handwriting }),
      discrete,
    );
  };
  const handlePaper = (patch: Partial<PaperConfig>): void => {
    const paper = { ...doc.paper, ...patch };
    const discrete = patch.header === undefined && patch.footer === undefined;
    applyVisualChange(
      doc.handwriting,
      paper,
      () => update(doc.id, { paper }),
      discrete,
    );
  };

  const handleExport = (options: ExportOptions): void => {
    setExportError(null);
    setExportProgress({ phase: 'preparing', current: 0, total: 0 });
    setExportJob({ options, currentPage });
  };

  const handleExportDone = (error: string | null): void => {
    setExportJob(null);
    setExportProgress(null);
    if (error) {
      setExportError(error);
    } else {
      setExportOpen(false);
    }
  };

  const toggleInspector = (): void => setInspector(inspector ? null : 'escritura');

  const topbar = (
    <header className="flex h-[var(--topbar-h)] shrink-0 items-center gap-2 border-b border-outline bg-surface px-3">
      <IconButton label="Volver a mis documentos" onClick={() => navigateTo('/app')}>
        <ArrowLeft size={17} aria-hidden />
      </IconButton>
      <input
        value={doc.title}
        onChange={(event) => update(doc.id, { title: event.target.value })}
        aria-label="Título del documento"
        className="w-48 rounded-md border border-transparent bg-transparent px-2 py-1 font-display text-[16px] font-semibold text-foreground-strong outline-none hover:border-outline focus-visible:border-outline-strong md:w-72"
      />
      <SaveStatus state={saveState} error={loadError} />
      <div className="ml-auto flex items-center gap-1.5">
        <IconButton label="Alternar panel de personalización" size="sm" active={inspector !== null} onClick={toggleInspector}>
          <PanelRight size={16} aria-hidden />
        </IconButton>
        <Button size="sm" variant="secondary" onClick={() => setExportOpen(true)}>
          <Download size={15} aria-hidden /> Exportar
        </Button>
        <ThemeToggle />
      </div>
    </header>
  );

  const editor = (
    <MarkdownEditor
      key={doc.id}
      ref={editorRef}
      value={doc.content}
      onChange={handleContent}
      onSaveNow={persistNow}
      onToggleView={toggleInspector}
    />
  );

  const preview = (
    <PaginatedPreview
      document={previewDoc}
      interactive
      mode={previewMode}
      quality={previewQuality}
      zoom={zoom}
      currentPage={currentPage}
      onModeChange={setPreviewMode}
      onQualityChange={setPreviewQuality}
      onPageChange={setCurrentPage}
      onPagesChange={setPageCount}
      renderingPreviewKey={renderingPreviewKey}
      onPreviewRenderReady={handlePreviewRenderReady}
    />
  );

  const inspectorContent = (
    <div className="flex h-full flex-col bg-panel">
      <div className="flex gap-0.5 border-b border-outline p-1.5" role="tablist" aria-label="Herramientas de personalización">
        {INSPECTOR_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={inspector === tab.id}
            onClick={() => setInspector(tab.id)}
            className={cn(
              'flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-[13px] font-medium transition-colors duration-[var(--dur-fast)]',
              inspector === tab.id ? 'bg-primary-soft text-primary' : 'text-muted hover:bg-surface hover:text-foreground',
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {inspector === 'escritura' && (
          <HandwritingPanel config={doc.handwriting} onChange={handleHandwriting} />
        )}
        {inspector === 'papel' && <PaperPanel config={doc.paper} onChange={handlePaper} />}
        {inspector === 'latex' && (
          <LatexPalette
            onInsert={(snippet) => {
              editorRef.current?.insertLatex(snippet.latex, snippet.mode);
              if (isMobile) setInspector(null);
            }}
          />
        )}
      </div>
    </div>
  );

  const statusbar = (
    <StatusBar
      words={stats.words}
      characters={stats.characters}
      pages={pageCount}
      saveState={saveState}
      saveError={loadError}
    />
  );

  return (
    <>
      <EditorShell
        topbar={topbar}
        editor={editor}
        preview={preview}
        inspector={inspectorContent}
        statusbar={statusbar}
      />
      <ExportDialog
        open={exportOpen}
        busy={exportJob !== null}
        progress={exportProgress}
        error={exportError}
        totalPages={pageCount}
        currentPage={currentPage}
        onClose={() => {
          if (!exportJob) setExportOpen(false);
        }}
        onExport={handleExport}
      />
      {exportJob && (
        <ExportRunner
          document={doc}
          job={exportJob}
          onProgress={setExportProgress}
          onDone={handleExportDone}
        />
      )}
    </>
  );
}
