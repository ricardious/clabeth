import { useMemo, useState } from 'react';

export interface EditorSearch {
  query: string;
  setQuery: (query: string) => void;
  /** Índices de inicio de cada coincidencia en el texto. */
  matches: number[];
  /** Índice dentro de matches de la coincidencia activa (0-based). */
  activeIndex: number;
  next: () => number | null;
  previous: () => number | null;
  close: () => void;
}

export function useEditorSearch(text: string): EditorSearch {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const matches = useMemo(() => {
    if (query === '') return [];
    const haystack = text.toLowerCase();
    const needle = query.toLowerCase();
    const found: number[] = [];
    let from = 0;
    while (from <= haystack.length) {
      const idx = haystack.indexOf(needle, from);
      if (idx === -1) break;
      found.push(idx);
      from = idx + Math.max(needle.length, 1);
    }
    return found;
  }, [text, query]);

  const clamped = matches.length === 0 ? 0 : Math.min(activeIndex, matches.length - 1);

  const move = (delta: number): number | null => {
    if (matches.length === 0) return null;
    const nextIndex = (clamped + delta + matches.length) % matches.length;
    setActiveIndex(nextIndex);
    return matches[nextIndex];
  };

  return {
    query,
    setQuery: (q: string) => {
      setQuery(q);
      setActiveIndex(0);
    },
    matches,
    activeIndex: clamped,
    next: () => move(1),
    previous: () => move(-1),
    close: () => {
      setQuery('');
      setActiveIndex(0);
    },
  };
}
