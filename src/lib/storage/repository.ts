import type { ClabethDocument } from '../../types/document';

const STORAGE_KEY = 'clabeth.library.v1';
const CURRENT_VERSION = 1;

interface LibraryFile {
  version: number;
  documents: ClabethDocument[];
}

export type LoadResult =
  | { ok: true; documents: ClabethDocument[] }
  | { ok: false; documents: []; error: string };

export type SaveResult = { ok: true } | { ok: false; error: string };

function isDocument(value: unknown): value is ClabethDocument {
  if (typeof value !== 'object' || value === null) return false;
  const doc = value as Record<string, unknown>;
  return (
    typeof doc.id === 'string' &&
    typeof doc.title === 'string' &&
    typeof doc.content === 'string' &&
    typeof doc.createdAt === 'number' &&
    typeof doc.updatedAt === 'number' &&
    typeof doc.handwriting === 'object' &&
    typeof doc.paper === 'object'
  );
}

/** Lee la biblioteca completa; nunca lanza, devuelve resultado. */
export function loadLibrary(storage: Storage = localStorage): LoadResult {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (raw === null) return { ok: true, documents: [] };
    const parsed = JSON.parse(raw) as Partial<LibraryFile>;
    if (parsed.version !== CURRENT_VERSION || !Array.isArray(parsed.documents)) {
      return { ok: true, documents: [] };
    }
    return { ok: true, documents: parsed.documents.filter(isDocument) };
  } catch {
    return { ok: false, documents: [], error: 'No se pudo leer la biblioteca guardada.' };
  }
}

/** Escribe la biblioteca completa; captura errores de cuota. */
export function saveLibrary(documents: ClabethDocument[], storage: Storage = localStorage): SaveResult {
  try {
    const payload: LibraryFile = { version: CURRENT_VERSION, documents };
    storage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return { ok: true };
  } catch {
    return {
      ok: false,
      error: 'No se pudo guardar. Es posible que el almacenamiento local esté lleno.',
    };
  }
}

export function exportLibraryJson(documents: ClabethDocument[]): string {
  const payload: LibraryFile = { version: CURRENT_VERSION, documents };
  return JSON.stringify(payload, null, 2);
}

/** Importa una copia JSON; lanza Error con mensaje legible si es inválida. */
export function importLibraryJson(json: string): ClabethDocument[] {
  let parsed: Partial<LibraryFile>;
  try {
    parsed = JSON.parse(json) as Partial<LibraryFile>;
  } catch {
    throw new Error('El archivo no es un JSON válido.');
  }
  if (parsed.version !== CURRENT_VERSION || !Array.isArray(parsed.documents)) {
    throw new Error('El archivo no es una copia de Clabeth compatible.');
  }
  const documents = parsed.documents.filter(isDocument);
  if (documents.length === 0) {
    throw new Error('La copia no contiene documentos válidos.');
  }
  return documents;
}
