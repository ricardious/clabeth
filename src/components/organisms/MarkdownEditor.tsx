import {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { X } from 'lucide-react';
import { useEditorHistory } from '../../hooks/use-editor-history';
import { useEditorSearch } from '../../hooks/use-editor-search';
import { useKeyboardShortcuts } from '../../hooks/use-keyboard-shortcuts';
import {
  insertBlock,
  prefixLines,
  wrapMath,
  wrapSelection,
  type EditResult,
} from '../../lib/markdown/editing';
import { IconButton } from '../atoms/IconButton';
import { EditorToolbar, type EditorAction } from './EditorToolbar';

export interface MarkdownEditorHandle {
  /** Inserta LaTeX en la posición del cursor (panel de fórmulas). */
  insertLatex: (latex: string, mode: 'inline' | 'block') => void;
  focus: () => void;
}

export interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  onSaveNow?: () => void;
  onToggleView?: () => void;
}

export const MarkdownEditor = forwardRef<MarkdownEditorHandle, MarkdownEditorProps>(
  function MarkdownEditor({ value, onChange, onSaveNow, onToggleView }, ref) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const pendingSelection = useRef<{ start: number; end: number } | null>(null);
    const history = useEditorHistory(value);
    const search = useEditorSearch(value);
    const [searchOpen, setSearchOpen] = useState(false);

    const getSelection = (): { start: number; end: number } => {
      const ta = textareaRef.current;
      return ta
        ? { start: ta.selectionStart, end: ta.selectionEnd }
        : { start: value.length, end: value.length };
    };

    const applyEdit = (result: EditResult, recordHistory = true): void => {
      pendingSelection.current = { start: result.selectionStart, end: result.selectionEnd };
      if (recordHistory) history.record(result.text);
      onChange(result.text);
    };

    useLayoutEffect(() => {
      if (pendingSelection.current && textareaRef.current) {
        textareaRef.current.setSelectionRange(pendingSelection.current.start, pendingSelection.current.end);
        textareaRef.current.focus();
        pendingSelection.current = null;
      }
    }, [value]);

    const handleAction = (action: EditorAction): void => {
      const { start, end } = getSelection();
      switch (action.type) {
        case 'wrap':
          applyEdit(wrapSelection(value, start, end, action.before, action.after));
          break;
        case 'prefix':
          applyEdit(prefixLines(value, start, end, action.prefix));
          break;
        case 'block':
          applyEdit(insertBlock(value, start, end, action.snippet));
          break;
        case 'math':
          if (action.mode === 'inline') {
            const selected = value.slice(start, end);
            const snippet = selected === '' ? '$f(x)$' : `$${selected}$`;
            applyEdit({
              text: value.slice(0, start) + snippet + value.slice(end),
              selectionStart: start + 1,
              selectionEnd: start + snippet.length - 1,
            });
          } else {
            applyEdit(insertBlock(value, start, end, '$$\nf(x)\n$$', 1));
          }
          break;
        case 'undo': {
          const restored = history.undo();
          if (restored !== null) onChange(restored);
          break;
        }
        case 'redo': {
          const restored = history.redo();
          if (restored !== null) onChange(restored);
          break;
        }
      }
    };

    const insertLatex = (latex: string, mode: 'inline' | 'block'): void => {
      const { start, end } = getSelection();
      applyEdit(wrapMath(value, start, end, latex, mode));
    };

    useImperativeHandle(ref, () => ({
      insertLatex,
      focus: () => textareaRef.current?.focus(),
    }));

    const revealMatch = (index: number | null): void => {
      const ta = textareaRef.current;
      if (index === null || !ta) return;
      ta.focus();
      ta.setSelectionRange(index, index + search.query.length);
      const line = value.slice(0, index).split('\n').length - 1;
      const lineHeight = Number.parseFloat(getComputedStyle(ta).lineHeight) || 26;
      ta.scrollTop = Math.max(0, line * lineHeight - ta.clientHeight / 3);
    };

    const handleImport = (file: File): void => {
      const reader = new FileReader();
      reader.onload = () => {
        const text = typeof reader.result === 'string' ? reader.result : '';
        applyEdit({ text, selectionStart: 0, selectionEnd: 0 });
      };
      reader.readAsText(file);
    };

    const shortcuts = useMemo(
      () => ({
        'mod+b': () => handleAction({ type: 'wrap', before: '**' }),
        'mod+i': () => handleAction({ type: 'wrap', before: '*' }),
        'mod+k': () => handleAction({ type: 'wrap', before: '[', after: '](https://)' }),
        'mod+z': () => handleAction({ type: 'undo' }),
        'mod+y': () => handleAction({ type: 'redo' }),
        'mod+shift+z': () => handleAction({ type: 'redo' }),
        'mod+f': () => setSearchOpen(true),
        'mod+s': () => onSaveNow?.(),
        'mod+e': () => onToggleView?.(),
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [value, onSaveNow, onToggleView],
    );
    useKeyboardShortcuts(shortcuts);

    return (
      <div className="flex h-full flex-col bg-surface">
        <EditorToolbar
          canUndo={history.canUndo}
          canRedo={history.canRedo}
          searchOpen={searchOpen}
          onAction={handleAction}
          onToggleSearch={() => setSearchOpen((open) => !open)}
          onImportFile={handleImport}
        />

        {searchOpen && (
          <div className="flex items-center gap-2 border-b border-outline bg-panel px-3 py-1.5">
            <input
              type="search"
              role="searchbox"
              aria-label="Buscar en el documento"
              placeholder="Buscar en el documento…"
              value={search.query}
              onChange={(event) => search.setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') revealMatch(event.shiftKey ? search.previous() : search.next());
                if (event.key === 'Escape') {
                  setSearchOpen(false);
                  search.close();
                }
              }}
              className="h-[var(--control-h-sm)] w-64 rounded-md border border-outline bg-surface px-2.5 text-sm focus-visible:outline-2 focus-visible:outline-focus-ring [&::-webkit-search-cancel-button]:hidden"
            />
            <span className="text-xs tabular-nums text-muted" aria-live="polite">
              {search.query === ''
                ? ''
                : search.matches.length === 0
                  ? 'Sin resultados'
                  : `${search.activeIndex + 1} de ${search.matches.length}`}
            </span>
            <button
              type="button"
              className="text-xs text-primary hover:underline"
              onClick={() => revealMatch(search.previous())}
              disabled={search.matches.length === 0}
            >
              Anterior
            </button>
            <button
              type="button"
              className="text-xs text-primary hover:underline"
              onClick={() => revealMatch(search.next())}
              disabled={search.matches.length === 0}
            >
              Siguiente
            </button>
            <IconButton
              label="Cerrar búsqueda"
              size="sm"
              className="ml-auto"
              onClick={() => {
                setSearchOpen(false);
                search.close();
              }}
            >
              <X size={14} aria-hidden />
            </IconButton>
          </div>
        )}

        <textarea
          ref={textareaRef}
          value={value}
          aria-label="Editor Markdown"
          placeholder="Escribe tu documento en Markdown… Usa $E=mc^2$ para fórmulas en línea."
          spellCheck
          onChange={(event) => {
            history.record(event.target.value);
            onChange(event.target.value);
          }}
          className="editor-textarea min-h-0 flex-1 resize-none bg-surface px-4 py-3 font-mono text-[13.5px] text-foreground placeholder:text-muted focus-visible:outline-none"
        />
      </div>
    );
  },
);
