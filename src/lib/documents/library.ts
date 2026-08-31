import type { ClabethDocument } from '../types/document';
import { createId } from '../utils/id';

export type DocumentSortKey = 'actualizado' | 'creado' | 'titulo';

export interface DocumentQuery {
  search: string;
  sort: DocumentSortKey;
  paperStyle: string;
}

export function queryDocuments(documents: ClabethDocument[], query: DocumentQuery): ClabethDocument[] {
  const search = query.search.trim().toLocaleLowerCase('es');
  const filtered = documents.filter((document) => {
    const matchesSearch = search === ''
      || document.title.toLocaleLowerCase('es').includes(search)
      || document.content.toLocaleLowerCase('es').includes(search);
    return matchesSearch && (query.paperStyle === 'todos' || document.paper.style === query.paperStyle);
  });

  return [...filtered].sort((a, b) => {
    if (query.sort === 'titulo') return a.title.localeCompare(b.title, 'es');
    if (query.sort === 'creado') return a.createdAt - b.createdAt;
    return b.updatedAt - a.updatedAt;
  });
}

export function duplicateDocument(source: ClabethDocument, now = Date.now()): ClabethDocument {
  return {
    ...structuredClone(source),
    id: createId(),
    title: `${source.title} (copia)`,
    createdAt: now,
    updatedAt: now,
  };
}

export function renameDocument(document: ClabethDocument, title: string, now = Date.now()): ClabethDocument {
  return {
    ...document,
    title: title.trim() || 'Sin título',
    updatedAt: now,
  };
}
