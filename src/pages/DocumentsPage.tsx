import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilePlus2, Files, SearchX } from 'lucide-react';
import { useDocumentsStore } from '../store/documents';
import type { ClabethDocument } from '../types/document';
import { PAPER_STYLES } from '../lib/paper/styles';
import { Button } from '../components/atoms/Button';
import { Input } from '../components/atoms/Input';
import { Select } from '../components/atoms/Select';
import { Dialog } from '../components/atoms/Dialog';
import { ConfirmDialog } from '../components/molecules/ConfirmDialog';
import { EmptyState } from '../components/molecules/EmptyState';
import { ErrorNotice } from '../components/molecules/ErrorNotice';
import { SearchField } from '../components/molecules/SearchField';
import { DocumentGrid } from '../components/organisms/DocumentGrid';

type SortKey = 'actualizado' | 'creado' | 'titulo';

const SORT_LABELS: Record<SortKey, string> = {
  actualizado: 'Más recientes',
  creado: 'Más antiguos',
  titulo: 'Título',
};

interface RenameTarget {
  id: string;
  title: string;
}

export function DocumentsPage() {
  const documents = useDocumentsStore((state) => state.documents);
  const createAndAdd = useDocumentsStore((state) => state.createAndAdd);
  const duplicate = useDocumentsStore((state) => state.duplicate);
  const rename = useDocumentsStore((state) => state.rename);
  const remove = useDocumentsStore((state) => state.remove);
  const loadError = useDocumentsStore((state) => state.loadError);
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortKey>('actualizado');
  const [filter, setFilter] = useState<string>('todos');
  const [renameTarget, setRenameTarget] = useState<RenameTarget | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ClabethDocument | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = documents.filter((doc) => {
      const matchesSearch =
        q === '' ||
        doc.title.toLowerCase().includes(q) ||
        doc.content.toLowerCase().includes(q);
      const matchesFilter = filter === 'todos' || doc.paper.style === filter;
      return matchesSearch && matchesFilter;
    });
    const sorted = [...list];
    if (sort === 'titulo') {
      sorted.sort((a, b) => a.title.localeCompare(b.title, 'es'));
    } else if (sort === 'creado') {
      sorted.sort((a, b) => a.createdAt - b.createdAt);
    } else {
      sorted.sort((a, b) => b.updatedAt - a.updatedAt);
    }
    return sorted;
  }, [documents, search, sort, filter]);

  const handleCreate = (): void => {
    const doc = createAndAdd({ title: 'Sin título' });
    navigate(`/app/editor/${doc.id}`);
  };

  const handleDuplicate = (id: string): void => {
    const copy = duplicate(id);
    if (copy) navigate(`/app/editor/${copy.id}`);
  };

  const handleRenameConfirm = (): void => {
    if (renameTarget) rename(renameTarget.id, renameTarget.title);
    setRenameTarget(null);
  };

  return (
    <div className="p-6">
      {loadError && (
        <div className="mb-4">
          <ErrorNotice>{loadError} Tus cambios recientes podrían no guardarse.</ErrorNotice>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchField value={search} onChange={setSearch} placeholder="Buscar por título o contenido…" ariaLabel="Buscar documentos" />
        <div className="flex gap-2">
          <Select value={sort} onChange={(event) => setSort(event.target.value as SortKey)} aria-label="Ordenar documentos">
            {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
              <option key={key} value={key}>
                {SORT_LABELS[key]}
              </option>
            ))}
          </Select>
          <Select value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filtrar por tipo de papel">
            <option value="todos">Todos los papeles</option>
            {PAPER_STYLES.map((style) => (
              <option key={style.id} value={style.id}>
                {style.name}
              </option>
            ))}
          </Select>
        </div>
        <p className="text-xs text-muted tabular-nums" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? 'documento' : 'documentos'}
        </p>
      </div>

      <div className="mt-6">
        {documents.length === 0 ? (
          <EmptyState
            icon={<Files size={32} aria-hidden />}
            title="Todavía no hay documentos"
            description="Crea el primero o parte de una plantilla. Clabeth guarda todo en tu navegador."
            action={
              <Button onClick={handleCreate}>
                <FilePlus2 size={16} aria-hidden /> Crear primer documento
              </Button>
            }
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<SearchX size={32} aria-hidden />}
            title="Sin resultados"
            description={`Nada coincide con «${search}» en este papel. Prueba a limpiar el filtro.`}
          />
        ) : (
          <DocumentGrid
            documents={filtered}
            onOpen={(id) => navigate(`/app/editor/${id}`)}
            onDuplicate={handleDuplicate}
            onRename={(id) => setRenameTarget({ id, title: documents.find((d) => d.id === id)?.title ?? '' })}
            onDelete={(id) => setDeleteTarget(documents.find((d) => d.id === id) ?? null)}
          />
        )}
      </div>

      <Dialog
        open={renameTarget !== null}
        onClose={() => setRenameTarget(null)}
        title="Renombrar documento"
        className="w-[min(420px,92vw)]"
      >
        <div className="p-5">
          <h2 className="font-display text-lg font-semibold text-foreground-strong">Renombrar documento</h2>
          <Input
            value={renameTarget?.title ?? ''}
            autoFocus
            onChange={(event) => setRenameTarget((target) => (target ? { ...target, title: event.target.value } : target))}
            onKeyDown={(event) => {
              if (event.key === 'Enter') handleRenameConfirm();
            }}
            aria-label="Nuevo título"
            className="mt-3"
          />
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setRenameTarget(null)}>
              Cancelar
            </Button>
            <Button onClick={handleRenameConfirm}>Renombrar</Button>
          </div>
        </div>
      </Dialog>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Eliminar documento"
        message={`¿Eliminar «${deleteTarget?.title ?? ''}»? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        danger
        onConfirm={() => {
          if (deleteTarget) remove(deleteTarget.id);
          setDeleteTarget(null);
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
