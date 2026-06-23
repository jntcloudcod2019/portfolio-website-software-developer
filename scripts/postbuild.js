#!/usr/bin/env node
/**
 * Pós-build: substitui o favicon padrão pelo ícone </> e garante o título correto.
 * Roda após `npx expo export --platform web`.
 */
const fs   = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '../dist/index.html');

if (!fs.existsSync(htmlPath)) {
  console.error('postbuild: dist/index.html não encontrado.');
  process.exit(1);
}

let html = fs.readFileSync(htmlPath, 'utf-8');

// ── SVG favicon como data URI ──────────────────────────────────────────────
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">',
  '<rect width="32" height="32" rx="6" fill="#08090b"/>',
  '<text x="16" y="21" text-anchor="middle"',
  ' font-family="Courier New,Courier,monospace"',
  ' font-weight="700" font-size="12" fill="#38bdf8">',
  '&lt;/&gt;</text>',
  '</svg>',
].join('');

const faviconUri = 'data:image/svg+xml,' + encodeURIComponent(svg);
const faviconTag = `<link rel="icon" type="image/svg+xml" href="${faviconUri}" />`;

// Substitui qualquer <link rel="icon" ...> existente
html = html.replace(/<link rel="icon"[^>]*\/?>/g, faviconTag);

// ── Título ────────────────────────────────────────────────────────────────
html = html.replace(
  /<title>[^<]*<\/title>/,
  '<title>Jonathan | Software Engineer</title>'
);

fs.writeFileSync(htmlPath, html, 'utf-8');
console.log('✓ postbuild: favicon </> e título atualizados em dist/index.html');
