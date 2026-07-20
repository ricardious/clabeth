import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// ——— Fuentes (offline, vía Fontsource) ———
import '@fontsource-variable/fraunces';
import '@fontsource/instrument-sans/400.css';
import '@fontsource/instrument-sans/500.css';
import '@fontsource/instrument-sans/600.css';
import '@fontsource/instrument-sans/700.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/caveat/400.css';
import '@fontsource/caveat/500.css';
import '@fontsource/caveat/600.css';
import '@fontsource/caveat/700.css';
import '@fontsource/kalam/300.css';
import '@fontsource/kalam/400.css';
import '@fontsource/kalam/700.css';
import '@fontsource/shadows-into-light/400.css';
import '@fontsource/la-belle-aurore/400.css';
import '@fontsource/architects-daughter/400.css';
import 'katex/dist/katex.min.css';

import './styles/index.css';
import { App } from './App';

const container = document.getElementById('root');
if (!container) {
  throw new Error('No se encontró el elemento #root.');
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
