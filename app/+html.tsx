import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

// ─── Constantes ───────────────────────────────────────────────────────────────

const SITE_URL   = 'https://jonathanfsilva.dev';
const SITE_NAME  = 'Jonathan F. Silva | Software Engineer';
const SITE_DESC  = 'Portfólio de Jonathan F. Silva — Engenheiro de Software Full Stack especializado em sistemas financeiros, .NET, Node.js, Cloud e alta disponibilidade.';
const OG_IMAGE   = 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=1200&h=630&fit=crop&fm=jpg';
const OG_IMAGE_W = '1200';
const OG_IMAGE_H = '630';
const AUTHOR_NAME = 'Jonathan F. Silva';
const AUTHOR_JOB_TITLE = 'Software Engineer';
const AUTHOR_GITHUB = 'https://github.com/jonathanf';

// ─── JSON-LD Structured Data ──────────────────────────────────────────────────

const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      name: AUTHOR_NAME,
      jobTitle: AUTHOR_JOB_TITLE,
      url: SITE_URL,
      sameAs: [
        AUTHOR_GITHUB,
        'https://linkedin.com/in/jonathanfsilva',
      ],
    },
    {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESC,
      author: { '@id': `${SITE_URL}/#person` },
    },
  ],
};

const JSON_LD_STR = JSON.stringify(JSON_LD);

// SVG favicon </> embarcado como data URI
const SVG = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">',
  '<rect width="32" height="32" rx="6" fill="#08090b"/>',
  '<text x="16" y="21" text-anchor="middle"',
  ' font-family="Courier New,Courier,monospace"',
  ' font-weight="700" font-size="12" fill="#38bdf8"',
  '>&lt;/&gt;</text>',
  '</svg>',
].join('');

const FAVICON_URI = `data:image/svg+xml,${encodeURIComponent(SVG)}`;

// Script inline que substitui o favicon.ico injetado pelo bundler pelo nosso SVG
const FAVICON_SCRIPT = `(function(){
  function setFavicon(){
    var links = document.querySelectorAll('link[rel*="icon"]');
    links.forEach(function(el){ el.parentNode && el.parentNode.removeChild(el); });
    var link = document.createElement('link');
    link.rel  = 'icon';
    link.type = 'image/svg+xml';
    link.href = '${FAVICON_URI}';
    document.head.appendChild(link);
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', setFavicon);
  } else {
    setFavicon();
  }
})();`;

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />

        {/* ── Preconnect / Resource Hints ────────────────────────────── */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />

        {/* ── Preload Hero Image (LCP) ───────────────────────────────── */}
        <link
          rel="preload"
          href="/jonathan-800.webp"
          as="image"
          fetchPriority="high"
          media="(min-width: 769px)"
        />
        <link
          rel="preload"
          href="/jonathan-600.webp"
          as="image"
          fetchPriority="high"
          media="(max-width: 768px) and (min-width: 401px)"
        />
        <link
          rel="preload"
          href="/jonathan-400.webp"
          as="image"
          fetchPriority="high"
          media="(max-width: 400px)"
        />

        {/* ── Primary ─────────────────────────────────────────────────── */}
        <title>{SITE_NAME}</title>
        <meta name="description" content={SITE_DESC} />
        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#08090b" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="canonical" href={SITE_URL} />
        <link rel="apple-touch-icon" href={FAVICON_URI} />

        {/* ── Open Graph ──────────────────────────────────────────────── */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:title" content={SITE_NAME} />
        <meta property="og:description" content={SITE_DESC} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:width" content={OG_IMAGE_W} />
        <meta property="og:image:height" content={OG_IMAGE_H} />
        <meta property="og:image:alt" content="Jonathan F. Silva — Engenheiro de Software Full Stack" />

        {/* ── Twitter Card ────────────────────────────────────────────── */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={SITE_NAME} />
        <meta name="twitter:description" content={SITE_DESC} />
        <meta name="twitter:image" content={OG_IMAGE} />
        <meta name="twitter:image:alt" content="Jonathan F. Silva — Engenheiro de Software Full Stack" />

        <ScrollViewStyleReset />

        {/* Substitui o favicon.ico padrão pelo ícone </> via script */}
        <script dangerouslySetInnerHTML={{ __html: FAVICON_SCRIPT }} />

        {/* Structured Data / JSON-LD */}
        <script dangerouslySetInnerHTML={{ __html: JSON_LD_STR }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
