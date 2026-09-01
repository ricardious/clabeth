export const FPS = 30;
export const DURATION_IN_FRAMES = 30 * FPS;
export const TRANSITION_FRAMES = 12;

/** Las escenas suman 960 frames; cinco transiciones solapadas dejan 900. */
export const SCENE_FRAMES = {
  hook: 135,
  editor: 165,
  latex: 150,
  customize: 165,
  export: 150,
  outro: 195,
} as const;

export const COLORS = {
  background: '#f7f3ea',
  surface: '#fffdf8',
  panel: '#eee8de',
  paper: '#f7efdf',
  paperWarm: '#f1e4ce',
  ink: '#403a34',
  muted: '#756d65',
  outline: '#d6cdbf',
  primary: '#c81e2e',
  primaryDark: '#9f1724',
  primarySoft: '#f4d6d2',
  blueInk: '#315783',
  greenInk: '#3f654f',
  white: '#fffdf8',
  dark: '#211f1c',
} as const;

export const FONTS = {
  display: 'Fraunces Variable, Georgia, serif',
  ui: 'Instrument Sans, Arial, sans-serif',
  mono: 'IBM Plex Mono, monospace',
  hand: 'Reenie Beanie, cursive',
} as const;
