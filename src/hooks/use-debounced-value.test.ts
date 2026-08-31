import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDebouncedValue } from './use-debounced-value';

describe('useDebouncedValue', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('devuelve el valor inicial sin esperar', () => {
    const { result } = renderHook(() => useDebouncedValue('hola', 500));
    expect(result.current).toBe('hola');
  });

  it('retiene el valor hasta que pasa la pausa', () => {
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 500), {
      initialProps: { value: 'a' },
    });

    rerender({ value: 'ab' });
    expect(result.current).toBe('a');

    act(() => void vi.advanceTimersByTime(499));
    expect(result.current).toBe('a');

    act(() => void vi.advanceTimersByTime(1));
    expect(result.current).toBe('ab');
  });

  it('reinicia la cuenta con cada cambio: escribir seguido solo propaga una vez', () => {
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 500), {
      initialProps: { value: 'a' },
    });

    for (const value of ['ab', 'abc', 'abcd']) {
      rerender({ value });
      act(() => void vi.advanceTimersByTime(400));
      expect(result.current).toBe('a');
    }

    act(() => void vi.advanceTimersByTime(500));
    expect(result.current).toBe('abcd');
  });

  it('propaga al instante cuando cambia resetKey', () => {
    const { result, rerender } = renderHook(
      ({ value, key }) => useDebouncedValue(value, 500, key),
      { initialProps: { value: 'doc-1', key: 'a' } },
    );

    // Otro documento: no tiene sentido seguir mostrando el anterior.
    rerender({ value: 'doc-2', key: 'b' });
    expect(result.current).toBe('doc-2');
  });

  it('no propaga si el valor vuelve al original dentro de la pausa', () => {
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 500), {
      initialProps: { value: 'a' },
    });

    rerender({ value: 'ab' });
    act(() => void vi.advanceTimersByTime(200));
    rerender({ value: 'a' });
    act(() => void vi.advanceTimersByTime(600));

    expect(result.current).toBe('a');
  });
});
