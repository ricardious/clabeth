import { describe, expect, it } from 'vitest';
import {
  exportLibraryJson,
  importLibraryJson,
  loadLibrary,
  saveLibrary,
} from './repository';
import type { ClabethDocument } from '../../types/document';
import { createDocument } from '../defaults';

const makeDoc = (overrides: Partial<ClabethDocument> = {}): ClabethDocument => ({
  ...createDocument({ title: 'Prueba' }),
  ...overrides,
});

describe('repository', () => {
  it('devuelve una biblioteca vacía si no hay nada guardado', () => {
    const result = loadLibrary();
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.documents).toEqual([]);
  });

  it('guarda y recupera documentos', () => {
    const doc = makeDoc();
    expect(saveLibrary([doc]).ok).toBe(true);
    const result = loadLibrary();
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.documents).toHaveLength(1);
      expect(result.documents[0].id).toBe(doc.id);
      expect(result.documents[0].title).toBe('Prueba');
    }
  });

  it('filtra entradas inválidas en el JSON', () => {
    localStorage.setItem('clabeth.library.v1', JSON.stringify({ version: 1, documents: [{ basura: true }] }));
    const result = loadLibrary();
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.documents).toEqual([]);
  });

  it('no lanza con JSON corrupto', () => {
    localStorage.setItem('clabeth.library.v1', '{{{no es json');
    const result = loadLibrary();
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.length).toBeGreaterThan(0);
  });

  it('exporta e importa una copia JSON', () => {
    const docs = [makeDoc(), makeDoc({ title: 'Segundo' })];
    const json = exportLibraryJson(docs);
    const imported = importLibraryJson(json);
    expect(imported).toHaveLength(2);
    expect(imported[0].content).toBe(docs[0].content);
  });

  it('rechaza una copia con versión incompatible', () => {
    expect(() => importLibraryJson('{"version": 99, "documents": []}')).toThrow();
  });

  it('rechaza texto que no es JSON', () => {
    expect(() => importLibraryJson('hola')).toThrow(/JSON/);
  });
});
