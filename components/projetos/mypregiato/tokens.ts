import { Platform } from 'react-native';

// ── Design tokens do projeto myPregiato ──────────────────────────────────────
// Fonte única de cores/fontes/layout. Todos os componentes desta feature
// importam daqui — nada de valores mágicos espalhados no JSX.

export const COLORS = {
  bg: '#0a0b0d',
  surface: '#0e1014',
  surfaceAlt: '#101216',
  nodeBg: '#141820',
  diagramBg: '#0c0e13',
  border: '#1c1f26',
  sep: '#161920',
  line: '#23262d',

  text: '#e8eaed',
  textSec: '#9aa0a8',
  textSec2: '#9ca3af',
  textMuted: '#6b7280',
  textFaint: '#5b616b',
  textUltra: '#4b5159',
  textGhost: '#3a3f47',
  labelText: '#8b9099',
  gridDot: '#1a1e2a',

  cyan: '#38bdf8',
  purple: '#a78bfa',
  green: '#34d399',
  amber: '#f5a623',
  blue: '#5b8def',
  orange: '#ff9f2e',
  docker: '#3aa4ec',

  ghBtnBg: '#e8eaed',
} as const;

export const FONTS = {
  mono: Platform.select({
    web: '"JetBrains Mono","Courier New",monospace',
    ios: 'Courier',
    android: 'monospace',
    default: 'monospace',
  }) as string,
  grotesk: Platform.select({
    web: '"Space Grotesk",system-ui,sans-serif',
    ios: 'System',
    android: 'sans-serif',
    default: 'sans-serif',
  }) as string,
};

export const LAYOUT = {
  pageMaxW: 1040,
  canvasW: 910,
  canvasH: 400,
} as const;

// Keyframe do "blink" dos dots — injetado no <head> no web (useInjectCss).
export const KEYFRAMES = `@keyframes mp-blink{0%,100%{opacity:1}50%{opacity:.25}}`;
