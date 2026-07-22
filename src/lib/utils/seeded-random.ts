/** Hash FNV-1a de 32 bits para cadenas. */
export function hashString(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/** Generador mulberry32: determinista a partir de una semilla numérica. */
export function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Valor determinista en [-1, 1] para una semilla y un índice dados. */
export function seededJitter(seed: string, index: number): number {
  const rand = mulberry32(hashString(`${seed}#${index}`));
  return rand() * 2 - 1;
}
