/**
 * Operaciones de edición sobre el texto del editor.
 * Funciones puras: reciben texto + selección y devuelven el nuevo estado.
 */

export interface EditResult {
  text: string;
  selectionStart: number;
  selectionEnd: number;
}

/** Envuelve la selección con marcadores (negrita, cursiva, código...). */
export function wrapSelection(
  text: string,
  start: number,
  end: number,
  before: string,
  after: string = before,
): EditResult {
  const selected = text.slice(start, end);
  const alreadyWrapped =
    start >= before.length &&
    text.slice(start - before.length, start) === before &&
    text.slice(end, end + after.length) === after;

  if (alreadyWrapped && selected.length > 0) {
    // Desenvolver: quitar los marcadores existentes.
    const newText = text.slice(0, start - before.length) + selected + text.slice(end + after.length);
    const newStart = start - before.length;
    return { text: newText, selectionStart: newStart, selectionEnd: newStart + selected.length };
  }

  const inner = selected || 'texto';
  const newText = text.slice(0, start) + before + inner + after + text.slice(end);
  const newStart = start + before.length;
  return { text: newText, selectionStart: newStart, selectionEnd: newStart + inner.length };
}

/** Aplica un prefijo a cada línea de la selección (listas, citas, encabezados). */
export function prefixLines(
  text: string,
  start: number,
  end: number,
  prefix: string | ((lineIndex: number) => string),
): EditResult {
  const lineStart = text.lastIndexOf('\n', start - 1) + 1;
  const lineEndIdx = text.indexOf('\n', end);
  const lineEnd = lineEndIdx === -1 ? text.length : lineEndIdx;
  const chunk = text.slice(lineStart, lineEnd);
  const lines = chunk.split('\n');
  const prefixed = lines
    .map((line, i) => (line.trim() === '' ? line : `${typeof prefix === 'function' ? prefix(i) : prefix}${line}`))
    .join('\n');
  const newText = text.slice(0, lineStart) + prefixed + text.slice(lineEnd);
  return {
    text: newText,
    selectionStart: lineStart,
    selectionEnd: lineStart + prefixed.length,
  };
}

/** Inserta un bloque asegurando saltos de línea alrededor. */
export function insertBlock(
  text: string,
  start: number,
  end: number,
  block: string,
  cursorOffset?: number,
): EditResult {
  const before = text.slice(0, start);
  const after = text.slice(end);
  const leading = before !== '' && !before.endsWith('\n') ? '\n\n' : '';
  // El bloque siempre termina en salto; si ya hay salto después, no se duplica.
  const trailing = after === '' ? '\n' : after.startsWith('\n') ? '' : '\n\n';
  const insertion = `${leading}${block}${trailing}`;
  const newText = before + insertion + after;
  const cursorBase = start + leading.length + block.length + (trailing === '\n' ? 1 : 0);
  const cursor = cursorOffset !== undefined ? start + leading.length + cursorOffset : cursorBase;
  return { text: newText, selectionStart: cursor, selectionEnd: cursor };
}

/** Envuelve la selección en matemáticas: inline $…$ o bloque $$…$$. */
export function wrapMath(
  text: string,
  start: number,
  end: number,
  latex: string,
  mode: 'inline' | 'block',
): EditResult {
  if (mode === 'inline') {
    const snippet = `$${latex}$`;
    const newText = text.slice(0, start) + snippet + text.slice(end);
    // Coloca el cursor en el primer placeholder típico de LaTeX.
    const rel = latex.search(/[a-zA-Z](?=[}^_]|$)/);
    const cursor = start + 1 + (rel >= 0 ? rel + 1 : latex.length);
    return { text: newText, selectionStart: cursor, selectionEnd: cursor };
  }
  const block = `$$\n${latex}\n$$`;
  return insertBlock(text, start, end, block, 1);
}
