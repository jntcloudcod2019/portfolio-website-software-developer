// ── SVG do myPregiato ─────────────────────────────────────────────────────────
// Ícones (Lucide-style) e o SVG do diagrama animado (paths + partículas
// animateMotion). Strings puras para renderizar via <SvgXml> (nativo) ou
// innerHTML (web, onde o browser executa o SMIL <animateMotion>).

export function iconSvg(paths: string, color: string, size = 22): string {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
}

export const ICON = {
  monitor:
    '<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>',
  shieldCheck: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>',
  code: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
  layers:
    '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
  box: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>',
  database:
    '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>',
  cloud: '<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>',
} as const;

export const GH_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="#0a0b0d"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.7 1.25 3.35.96.1-.75.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.26 5.66.41.36.78 1.05.78 2.13 0 1.54-.01 2.78-.01 3.16 0 .3.2.67.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"/></svg>`;

// Diagrama: fundo + grid + 5 conexões (paths) + setas + 15 partículas.
export const DIAGRAM_SVG = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 910 400" width="910" height="400">
  <defs>
    <filter id="mp-gl-cy" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="mp-gl-pu" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="mp-gl-gr" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="mp-gl-am" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="mp-gl-bl" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <pattern id="mp-grid" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#1a1e2a" opacity="0.65"/></pattern>
  </defs>
  <rect width="910" height="400" fill="#0c0e13"/>
  <rect width="910" height="400" fill="url(#mp-grid)"/>
  <path id="mp-p1" d="M 210,80 L 326,80" stroke="#38bdf8" stroke-width="1.8" stroke-dasharray="5 3" fill="none" opacity="0.55"/>
  <path id="mp-p2" d="M 530,80 L 648,80" stroke="#a78bfa" stroke-width="1.8" stroke-dasharray="5 3" fill="none" opacity="0.55"/>
  <path id="mp-p3" d="M 754,132 L 754,262" stroke="#34d399" stroke-width="1.8" stroke-dasharray="5 3" fill="none" opacity="0.55"/>
  <path id="mp-p4" d="M 648,320 L 530,320" stroke="#f5a623" stroke-width="1.8" stroke-dasharray="5 3" fill="none" opacity="0.55"/>
  <path id="mp-p5" d="M 326,320 L 210,320" stroke="#5b8def" stroke-width="1.8" stroke-dasharray="5 3" fill="none" opacity="0.55"/>
  <polygon points="326,73 338,80 326,87" fill="#38bdf8" opacity="0.85"/>
  <polygon points="648,73 660,80 648,87" fill="#a78bfa" opacity="0.85"/>
  <polygon points="747,262 754,274 761,262" fill="#34d399" opacity="0.85"/>
  <polygon points="530,313 518,320 530,327" fill="#f5a623" opacity="0.85"/>
  <polygon points="210,313 198,320 210,327" fill="#5b8def" opacity="0.85"/>
  <circle r="5" fill="#38bdf8" filter="url(#mp-gl-cy)"><animateMotion dur="2s" repeatCount="indefinite" begin="0s"><mpath href="#mp-p1" xlink:href="#mp-p1"/></animateMotion></circle>
  <circle r="3.5" fill="#38bdf880"><animateMotion dur="2s" repeatCount="indefinite" begin="0.67s"><mpath href="#mp-p1" xlink:href="#mp-p1"/></animateMotion></circle>
  <circle r="5" fill="#38bdf8" filter="url(#mp-gl-cy)"><animateMotion dur="2s" repeatCount="indefinite" begin="1.33s"><mpath href="#mp-p1" xlink:href="#mp-p1"/></animateMotion></circle>
  <circle r="5" fill="#a78bfa" filter="url(#mp-gl-pu)"><animateMotion dur="2s" repeatCount="indefinite" begin="0.3s"><mpath href="#mp-p2" xlink:href="#mp-p2"/></animateMotion></circle>
  <circle r="3.5" fill="#a78bfa80"><animateMotion dur="2s" repeatCount="indefinite" begin="0.97s"><mpath href="#mp-p2" xlink:href="#mp-p2"/></animateMotion></circle>
  <circle r="5" fill="#a78bfa" filter="url(#mp-gl-pu)"><animateMotion dur="2s" repeatCount="indefinite" begin="1.63s"><mpath href="#mp-p2" xlink:href="#mp-p2"/></animateMotion></circle>
  <circle r="5" fill="#34d399" filter="url(#mp-gl-gr)"><animateMotion dur="2.2s" repeatCount="indefinite" begin="0s"><mpath href="#mp-p3" xlink:href="#mp-p3"/></animateMotion></circle>
  <circle r="3.5" fill="#34d39980"><animateMotion dur="2.2s" repeatCount="indefinite" begin="0.73s"><mpath href="#mp-p3" xlink:href="#mp-p3"/></animateMotion></circle>
  <circle r="5" fill="#34d399" filter="url(#mp-gl-gr)"><animateMotion dur="2.2s" repeatCount="indefinite" begin="1.47s"><mpath href="#mp-p3" xlink:href="#mp-p3"/></animateMotion></circle>
  <circle r="5" fill="#f5a623" filter="url(#mp-gl-am)"><animateMotion dur="2s" repeatCount="indefinite" begin="0.2s"><mpath href="#mp-p4" xlink:href="#mp-p4"/></animateMotion></circle>
  <circle r="3.5" fill="#f5a62380"><animateMotion dur="2s" repeatCount="indefinite" begin="0.87s"><mpath href="#mp-p4" xlink:href="#mp-p4"/></animateMotion></circle>
  <circle r="5" fill="#f5a623" filter="url(#mp-gl-am)"><animateMotion dur="2s" repeatCount="indefinite" begin="1.53s"><mpath href="#mp-p4" xlink:href="#mp-p4"/></animateMotion></circle>
  <circle r="5" fill="#5b8def" filter="url(#mp-gl-bl)"><animateMotion dur="2s" repeatCount="indefinite" begin="0.4s"><mpath href="#mp-p5" xlink:href="#mp-p5"/></animateMotion></circle>
  <circle r="3.5" fill="#5b8def80"><animateMotion dur="2s" repeatCount="indefinite" begin="1.07s"><mpath href="#mp-p5" xlink:href="#mp-p5"/></animateMotion></circle>
  <circle r="5" fill="#5b8def" filter="url(#mp-gl-bl)"><animateMotion dur="2s" repeatCount="indefinite" begin="1.73s"><mpath href="#mp-p5" xlink:href="#mp-p5"/></animateMotion></circle>
</svg>`;
