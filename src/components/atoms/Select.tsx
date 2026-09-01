import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils/cn';

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
  /** Línea secundaria dentro de la opción. */
  hint?: string;
  disabled?: boolean;
}

export interface SelectOptionGroup<T extends string = string> {
  label: string;
  options: SelectOption<T>[];
}

export type SelectItem<T extends string = string> = SelectOption<T> | SelectOptionGroup<T>;

export interface SelectProps<T extends string = string> {
  value: T;
  onChange: (value: T) => void;
  options: SelectItem<T>[];
  /** Etiqueta accesible cuando no hay un <label> asociado. */
  label?: string;
  id?: string;
  placeholder?: string;
  size?: 'sm' | 'md';
  disabled?: boolean;
  className?: string;
  /** Ancho mínimo del panel; por defecto, el del disparador. */
  menuMinWidth?: number;
}

const isGroup = <T extends string>(item: SelectItem<T>): item is SelectOptionGroup<T> =>
  'options' in item;

function flatten<T extends string>(options: SelectItem<T>[]): SelectOption<T>[] {
  return options.flatMap((item) => (isGroup(item) ? item.options : [item]));
}

/** El popover vive en la capa superior: no lo recortan los paneles con scroll. */
const SUPPORTS_POPOVER =
  typeof HTMLElement !== 'undefined' && typeof HTMLElement.prototype.showPopover === 'function';

interface MenuPosition {
  left: number;
  top: number;
  width: number;
  maxHeight: number;
}

const MENU_MARGIN = 6;
const VIEWPORT_PADDING = 8;

/**
 * Select propio del sistema de diseño: mismos tokens, tipografía y foco que el
 * resto de controles. Sustituye al `<select>` nativo, cuyo desplegable pinta el
 * sistema operativo y rompe la continuidad visual (sobre todo en tema oscuro).
 *
 * El foco permanece en el disparador y la opción activa se anuncia con
 * `aria-activedescendant`, el patrón recomendado para combobox con listbox.
 */
export function Select<T extends string = string>({
  value,
  onChange,
  options,
  label,
  id,
  placeholder = 'Seleccionar…',
  size = 'md',
  disabled = false,
  className,
  menuMinWidth,
}: SelectProps<T>) {
  const reactId = useId();
  const triggerId = id ?? `select-${reactId}`;
  const listboxId = `${triggerId}-listbox`;

  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);
  const typeahead = useRef<{ query: string; at: number }>({ query: '', at: 0 });

  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<MenuPosition | null>(null);

  const flat = useMemo(() => flatten(options), [options]);
  const selected = flat.find((option) => option.value === value) ?? null;
  const selectableIndexes = useMemo(
    () => flat.map((option, index) => (option.disabled ? -1 : index)).filter((index) => index >= 0),
    [flat],
  );
  const selectedIndex = flat.findIndex((option) => option.value === value);
  const [activeIndex, setActiveIndex] = useState(selectedIndex);

  const optionId = (index: number): string => `${listboxId}-option-${index}`;

  const measure = useCallback((): void => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const below = window.innerHeight - rect.bottom - MENU_MARGIN - VIEWPORT_PADDING;
    const above = rect.top - MENU_MARGIN - VIEWPORT_PADDING;
    // Se abre hacia abajo salvo que arriba quepa claramente mejor.
    const openUp = below < 180 && above > below;
    const maxHeight = Math.max(120, Math.min(320, openUp ? above : below));
    const width = Math.max(rect.width, menuMinWidth ?? 0);
    const left = Math.min(
      Math.max(VIEWPORT_PADDING, rect.left),
      Math.max(VIEWPORT_PADDING, window.innerWidth - width - VIEWPORT_PADDING),
    );
    setPosition({
      left,
      top: openUp ? rect.top - MENU_MARGIN - maxHeight : rect.bottom + MENU_MARGIN,
      width,
      maxHeight,
    });
  }, [menuMinWidth]);

  const openMenu = useCallback(
    (startAt?: number): void => {
      if (disabled) return;
      measure();
      setActiveIndex(
        startAt ?? (selectedIndex >= 0 ? selectedIndex : (selectableIndexes[0] ?? -1)),
      );
      setOpen(true);
    },
    [disabled, measure, selectableIndexes, selectedIndex],
  );

  const closeMenu = useCallback((refocus = true): void => {
    setOpen(false);
    if (refocus) triggerRef.current?.focus();
  }, []);

  const commit = useCallback(
    (index: number): void => {
      const option = flat[index];
      if (!option || option.disabled) return;
      if (option.value !== value) onChange(option.value);
      closeMenu();
    },
    [closeMenu, flat, onChange, value],
  );

  // Capa superior + posición: se recalcula al abrir y ante scroll o resize.
  useLayoutEffect(() => {
    const element = listboxRef.current;
    if (!element || !SUPPORTS_POPOVER) return;
    if (open && !element.matches(':popover-open')) element.showPopover();
    if (!open && element.matches(':popover-open')) element.hidePopover();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const reposition = (): void => measure();
    window.addEventListener('scroll', reposition, true);
    window.addEventListener('resize', reposition);
    return () => {
      window.removeEventListener('scroll', reposition, true);
      window.removeEventListener('resize', reposition);
    };
  }, [measure, open]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent): void => {
      const target = event.target as Node | null;
      if (!target) return;
      if (triggerRef.current?.contains(target) || listboxRef.current?.contains(target)) return;
      closeMenu(false);
    };
    window.document.addEventListener('pointerdown', onPointerDown, true);
    return () => window.document.removeEventListener('pointerdown', onPointerDown, true);
  }, [closeMenu, open]);

  // La opción activa siempre visible dentro del panel.
  useEffect(() => {
    if (!open || activeIndex < 0) return;
    listboxRef.current
      ?.querySelector(`#${CSS.escape(optionId(activeIndex))}`)
      ?.scrollIntoView({ block: 'nearest' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, open]);

  const moveActive = (direction: 1 | -1): void => {
    if (selectableIndexes.length === 0) return;
    const current = selectableIndexes.indexOf(activeIndex);
    const next =
      current === -1
        ? (direction === 1 ? 0 : selectableIndexes.length - 1)
        : Math.min(selectableIndexes.length - 1, Math.max(0, current + direction));
    setActiveIndex(selectableIndexes[next]!);
  };

  const searchByLabel = (char: string): void => {
    const now = Date.now();
    const state = typeahead.current;
    state.query = now - state.at > 700 ? char : state.query + char;
    state.at = now;
    const query = state.query.toLowerCase();
    const found = selectableIndexes.find((index) =>
      flat[index]!.label.toLowerCase().startsWith(query),
    );
    if (found === undefined) return;
    if (open) setActiveIndex(found);
    else commit(found);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>): void => {
    if (disabled) return;

    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
        event.preventDefault();
        openMenu();
        return;
      }
      if (event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        searchByLabel(event.key);
      }
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        moveActive(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        moveActive(-1);
        break;
      case 'Home':
        event.preventDefault();
        setActiveIndex(selectableIndexes[0] ?? -1);
        break;
      case 'End':
        event.preventDefault();
        setActiveIndex(selectableIndexes[selectableIndexes.length - 1] ?? -1);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        commit(activeIndex);
        break;
      case 'Escape':
        event.preventDefault();
        closeMenu();
        break;
      case 'Tab':
        closeMenu(false);
        break;
      default:
        if (event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) {
          event.preventDefault();
          searchByLabel(event.key);
        }
    }
  };

  let cursor = -1;

  return (
    <>
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-activedescendant={open && activeIndex >= 0 ? optionId(activeIndex) : undefined}
        aria-label={label}
        disabled={disabled}
        onKeyDown={handleKeyDown}
        onClick={() => (open ? closeMenu() : openMenu())}
        className={cn(
          'flex w-full items-center gap-2 rounded-md border border-outline bg-surface text-left',
          'text-foreground transition-colors duration-[var(--dur-fast)]',
          'hover:border-outline-strong disabled:pointer-events-none disabled:opacity-45',
          'focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-1',
          open && 'border-outline-strong',
          size === 'sm'
            ? 'h-[var(--control-h-sm)] px-2 text-[13px]'
            : 'h-[var(--control-h-md)] px-2.5 text-sm',
          className,
        )}
      >
        <span className={cn('min-w-0 flex-1 truncate', !selected && 'text-muted')}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          size={size === 'sm' ? 14 : 16}
          aria-hidden
          className={cn(
            'shrink-0 text-muted transition-transform duration-[var(--dur-fast)]',
            open && 'rotate-180',
          )}
        />
      </button>

      {open && (
        <div
          ref={listboxRef}
          id={listboxId}
          role="listbox"
          aria-label={label}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          {...(SUPPORTS_POPOVER ? ({ popover: 'manual' } as any) : {})}
          className="clabeth-listbox is-open"
          style={{
            left: position?.left ?? 0,
            top: position?.top ?? 0,
            width: position?.width ?? 'auto',
            maxHeight: position?.maxHeight ?? 320,
          }}
        >
          {options.map((item, itemIndex) => {
            if (!isGroup(item)) {
              cursor += 1;
              return renderOption(item, cursor);
            }
            return (
              <div key={`group-${itemIndex}`} role="group" aria-label={item.label}>
                <div className="px-2.5 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wide text-muted">
                  {item.label}
                </div>
                {item.options.map((option) => {
                  cursor += 1;
                  return renderOption(option, cursor);
                })}
              </div>
            );
          })}
        </div>
      )}
    </>
  );

  function renderOption(option: SelectOption<T>, index: number) {
    const isSelected = option.value === value;
    return (
      <div
        key={option.value}
        id={optionId(index)}
        role="option"
        aria-selected={isSelected}
        aria-disabled={option.disabled || undefined}
        onPointerEnter={() => !option.disabled && setActiveIndex(index)}
        onClick={() => commit(index)}
        className={cn(
          'flex cursor-pointer items-start gap-2 rounded-sm px-2.5 py-1.5 text-sm',
          option.disabled && 'cursor-not-allowed opacity-45',
          index === activeIndex && !option.disabled && 'bg-hover',
          isSelected ? 'text-primary' : 'text-foreground',
        )}
      >
        <span className="min-w-0 flex-1">
          <span className="block truncate">{option.label}</span>
          {option.hint && <span className="mt-0.5 block text-xs text-muted">{option.hint}</span>}
        </span>
        {isSelected && <Check size={15} aria-hidden className="mt-0.5 shrink-0 text-primary" />}
      </div>
    );
  }
}
