import { useRef, useState, type ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Download, FileText, PanelRight, PenLine, Sigma } from 'lucide-react';
import { useDocumentsStore } from '../store/documents';
import { useUiStore, type InspectorTab } from '../store/ui';
import { useAutosave } from '../hooks/use-autosave';
import { useIsMobile } from '../hooks/use-media-query';
import { textStats } from '../lib/markdown/stats';
import type { ExportOptions } from '../types/export';
import type { HandwritingConfig } from '../types/handwriting';
import type { PaperConfig } from '../types/paper';
import { Button } from '../components/atoms/Button';
import { IconButton } from '../components/atoms/IconButton';
import { ThemeToggle } from '../components/molecules/ThemeToggle';
import { SaveStatus } from '../components/molecules/SaveStatus';
import { EditorShell } from '../components/templates/EditorShell';
import { MarkdownEditor, type MarkdownEditorHandle } from '../components/organisms/MarkdownEditor';
import { PaginatedPreview } from '../components/organisms/PaginatedPreview';
import { HandwritingPanel } from '../components/organisms/HandwritingPanel';
import { PaperPanel } from '../components/organisms/PaperPanel';
import { LatexPalette } from '../components/organisms/LatexPalette';
import { ExportDialog } from '../components/organisms/ExportDialog';
import { ExportRunner, type ExportJob } from '../components/organisms/ExportRunner';
import { StatusBar } from '../components/organisms/StatusBar';
import { cn } from '../lib/utils/cn';

const INSPECTOR_TABS: { id: InspectorTab; label: string; icon: ReactNode }[] = [
  { id: 'escritura', label: 'Escritura', icon: <PenLine size={15} aria-hidden /> },
  { id: 'papel', label: 'Papel', icon: <FileText size={15} aria-hidden /> },
  { id: 'latex', label: 'Fórmulas', icon: <Sigma size={15} aria-hidden /> },
];

export function EditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const editorRef = useRef<MarkdownEditorHandle>(null);

  const documents = useDocumentsStore((state) => state.documents);
  const update = useDocumentsStore((state) => state.update);
  const persistNow = useDocumentsStore((state) => state.persistNow);
  const saveState = useDocumentsStore((state) => state.saveState);
  const loadError = useDocumentsStore((state) => state.loadError);
  useAutosave();

  const inspector = useUiStore((state) => state.inspector);
  const setInspector = useUiStore((state) => state.setInspector);
  const previewMode = useUiStore((state) => state.previewMode);
  const setPreviewMode = useUiStore((state) => state.setPreviewMode);
  const zoom = useUiStore((state) => state.zoom);
  const currentPage = useUiStore((state) => state.currentPage);
  const setCurrentPage = useUiStore((state) => state.setCurrentPage);

  const [pageCount, setPageCount] = useState(0);
  const [exportOpen, setExportOpen] = useState(false);
  const [exportJob, setExportJob] = useState<ExportJob | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  const doc = documents.find((d) => d.id === id);

  if (!doc) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 bg-background p-8 text-center">
        <p className="font-display text-xl font-semibold text-foreground-strong">Documento no encontrado</p>
        <p className="text-sm text-muted">Puede que haya sido eliminado o que la dirección esté mal escrita.</p>
        <Button onClick={() => navigate('/app')}>Volver a mis documentos</Button>
      </div>
    );
  }

  const stats = textStats(doc.content);

  const handleContent = (value: string): void => update(doc.id, { content: value });
  const handleHandwriting = (patch: Partial<HandwritingConfig>): void =>
    update(doc.id, { handwriting: { ...doc.handwriting, ...patch } });
  const handlePaper = (patch: Partial<PaperConfig>): void =>
    update(doc.id, { paper: { ...doc.paper, ...patch } });

  const handleExport = (options: ExportOptions): void => {
    setExportError(null);
    setExportJob({ options, currentPage });
  };

  const handleExportDone = (error: string | null): void => {
    setExportJob(null);
    if (error) {
      setExportError(error);
    } else {
      setExportOpen(false);
    }
  };

  const toggleInspector = (): void => setInspector(inspector ? null : 'escritura');

  const topbar = (
    <header className="flex h-[var(--topbar-h)] shrink-0 items-center gap-2 border-b border-outline bg-surface px-3">
      <IconButton label="Volver a mis documentos" onClick={() => navigate('/app')}>
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
      document={doc}
      interactive
      mode={previewMode}
      zoom={zoom}
      currentPage={currentPage}
      onModeChange={setPreviewMode}
      onPageChange={setCurrentPage}
      onPagesChange={setPageCount}
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
        error={exportError}
        totalPages={pageCount}
        currentPage={currentPage}
        onClose={() => {
          if (!exportJob) setExportOpen(false);
        }}
        onExport={handleExport}
      />
      {exportJob && <ExportRunner document={doc} job={exportJob} onDone={handleExportDone} />}
    </>
  );
}
