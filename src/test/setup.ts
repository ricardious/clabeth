import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll } from 'vitest';

afterEach(() => {
  cleanup();
  localStorage.clear();
});

beforeAll(() => {
  // jsdom no implementa matchMedia; el hook de tema lo consulta.
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string): MediaQueryList =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => undefined,
        removeListener: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => false,
      }) as MediaQueryList,
  });

  // jsdom no implementa scrollIntoView ni ResizeObserver.
  Element.prototype.scrollIntoView = () => undefined;

  class ResizeObserverStub {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  }
  Object.defineProperty(window, 'ResizeObserver', { writable: true, value: ResizeObserverStub });
  Object.defineProperty(globalThis, 'ResizeObserver', { writable: true, value: ResizeObserverStub });

  // jsdom no implementa showModal de <dialog>.
  const dialogProto = window.HTMLDialogElement.prototype as HTMLDialogElement;
  if (typeof dialogProto.showModal !== 'function') {
    dialogProto.showModal = function showModal() {
      this.setAttribute('open', '');
    };
    dialogProto.close = function close() {
      this.removeAttribute('open');
    };
  }
});
