import { describe, expect, it } from 'vitest';
import { createDocument } from '../defaults';
import { duplicateDocument, queryDocuments, renameDocument } from './library';

const older = { ...createDocument({ title: 'Álgebra', content: 'matrices' }), createdAt: 10, updatedAt: 20 };
const newer = { ...createDocument({ title: 'Cálculo', content: 'derivadas' }), createdAt: 30, updatedAt: 40 };

describe('biblioteca de documentos', () => {
  it('busca por título y contenido', () => {
    expect(queryDocuments([older, newer], { search: 'matrices', sort: 'actualizado', paperStyle: 'todos' })).toEqual([older]);
    expect(queryDocuments([older, newer], { search: 'cálculo', sort: 'actualizado', paperStyle: 'todos' })).toEqual([newer]);
  });

  it('ordena sin mutar la entrada', () => {
    const documents = [newer, older];
    expect(queryDocuments(documents, { search: '', sort: 'creado', paperStyle: 'todos' })).toEqual([older, newer]);
    expect(documents).toEqual([newer, older]);
  });

  it('filtra por papel', () => {
    const rayado = { ...newer, paper: { ...newer.paper, style: 'rayada' as const } };
    expect(queryDocuments([older, rayado], { search: '', sort: 'actualizado', paperStyle: 'rayada' })).toEqual([rayado]);
  });

  it('duplica con identidad y fechas nuevas', () => {
    const copy = duplicateDocument(older, 100);
    expect(copy.id).not.toBe(older.id);
    expect(copy.title).toBe('Álgebra (copia)');
    expect(copy.createdAt).toBe(100);
  });

  it('renombra y normaliza títulos vacíos', () => {
    expect(renameDocument(older, '  Nuevo  ', 100).title).toBe('Nuevo');
    expect(renameDocument(older, '   ', 100).title).toBe('Sin título');
  });
});
