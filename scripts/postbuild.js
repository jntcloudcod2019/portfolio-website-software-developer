#!/usr/bin/env node
const fs   = require('fs');
const path = require('path');

const distDir   = path.join(__dirname, '../dist');
const htmlPath  = path.join(distDir, 'index.html');
const sitemapPath = path.join(distDir, 'sitemap.xml');
const robotsPath  = path.join(distDir, 'robots.txt');

// Lê o SITE_URL de constants/seo.ts para não duplicar o domínio em dois lugares.
const seoPath = path.join(__dirname, '../constants/seo.ts');
const SITE_URL = (() => {
  // Âncora `^` para não casar com a menção em comentário no topo do arquivo.
  const m = fs.readFileSync(seoPath, 'utf-8').match(/^export const SITE_URL\s*=\s*'([^']+)'/m);
  if (!m) throw new Error('postbuild: SITE_URL não encontrado em constants/seo.ts');
  if (!/^https?:\/\//.test(m[1])) {
    throw new Error(`postbuild: SITE_URL inválido ("${m[1]}") — esperado http(s)://…`);
  }
  return m[1];
})();

// ─── Favicon ──────────────────────────────────────────────────────────────────
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

let html = fs.readFileSync(htmlPath, 'utf-8');
html = html.replace(/<link rel="icon"[^>]*\/?>/g, faviconTag);
html = html.replace(
  /<title>[^<]*<\/title>/,
  '<title>Jonathan | Software Engineer</title>'
);
fs.writeFileSync(htmlPath, html, 'utf-8');
console.log('✓ postbuild: favicon </> e título atualizados');

// ─── Sitemap ──────────────────────────────────────────────────────────────────
const projectsPath = path.join(__dirname, '../content/projects.ts');
let projectIds = [''];

try {
  const src = fs.readFileSync(projectsPath, 'utf-8');
  const idMatches = src.matchAll(/id:\s*'([^']+)'/g);
  projectIds = [...idMatches].map((m) => m[1]);
} catch {
  console.warn('  ⚠  Não foi possível ler content/projects.ts');
}

// Rotas de estudo declaradas em app/estudo/*.tsx (o sitemap antigo as ignorava).
const estudoDir = path.join(__dirname, '../app/estudo');
let estudoRoutes = [];
try {
  estudoRoutes = fs
    .readdirSync(estudoDir)
    .filter((f) => f.endsWith('.tsx') && !f.startsWith('_') && !f.startsWith('+'))
    .map((f) => `/estudo/${f.replace(/\.tsx$/, '')}`);
} catch {
  console.warn('  ⚠  Não foi possível ler app/estudo/');
}

const today = new Date().toISOString().split('T')[0];

const urls = [
  { loc: '/',         priority: '1.0', changefreq: 'monthly' },
  { loc: '/projects', priority: '0.8', changefreq: 'monthly' },
  ...projectIds.map((id) => ({ loc: `/project/${id}`, priority: '0.6', changefreq: 'yearly' })),
  ...estudoRoutes.map((loc) => ({ loc, priority: '0.7', changefreq: 'yearly' })),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url>\n    <loc>${SITE_URL}${u.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`
  )
  .join('\n')}
</urlset>
`;

fs.writeFileSync(sitemapPath, sitemap, 'utf-8');
console.log(`  ✓ sitemap.xml gerado (${urls.length} URLs)`);

// ─── robots.txt ───────────────────────────────────────────────────────────────
const robots = `User-agent: *
Allow: /
Sitemap: ${SITE_URL}/sitemap.xml
`;
fs.writeFileSync(robotsPath, robots, 'utf-8');
console.log('  ✓ robots.txt copiado');

console.log('✓ postbuild concluído');
