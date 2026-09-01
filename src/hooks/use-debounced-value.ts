import { useEffect, useRef, useState } from 'react';

/**
 * Retrasa la propagación de un valor hasta que deja de cambiar durante
 * `delayMs`. Se usa para que la vista previa no repagine ni redibuje con cada
 * tecla: el trabajo caro (medir bloques y pintar el Canvas de cada hoja) ocurre
 * una vez, en la pausa.
 *
 * `resetKey` fuerza una actualización inmediata cuando cambia: al abrir un
 * documento distinto no tiene sentido esperar mostrando el contenido anterior.
 */
export function useDebouncedValue<T>(value: T, delayMs: number, resetKey?: unknown): T {
  const [debounced, setDebounced] = useState(value);
  const lastResetKey = useRef(resetKey);

  if (lastResetKey.current !== resetKey) {
    lastResetKey.current = resetKey;
    // Actualizar durante el render es válido y evita pintar un fotograma con
    // el valor del documento anterior.
    if (!Object.is(debounced, value)) setDebounced(value);
  }

  useEffect(() => {
    if (Object.is(debounced, value)) return;
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs, debounced]);

  return debounced;
}
