import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

import { SITE_URL, SITE_NAME, SITE_DESC, OG_IMAGE, OG_IMAGE_W, OG_IMAGE_H, OG_IMAGE_ALT } from '@/constants/seo';
import { portfolio } from '@/content/portfolio';

// ─── Constantes ───────────────────────────────────────────────────────────────

const AUTHOR_NAME = 'Jonathan F. Silva';
const AUTHOR_JOB_TITLE = 'Software Engineer';

// ─── JSON-LD Structured Data ──────────────────────────────────────────────────
// `sameAs` sai de content/portfolio.ts para não divergir dos links de contato.

const PERSON_ID = `${SITE_URL}/#person`;

const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': PERSON_ID,
      name: AUTHOR_NAME,
      jobTitle: AUTHOR_JOB_TITLE,
      url: SITE_URL,
      image: OG_IMAGE,
      email: `mailto:${portfolio.contact.email}`,
      knowsAbout: [
        'C#', '.NET', 'ASP.NET Core', 'Node.js', 'TypeScript', 'React',
        'AWS', 'Azure', 'Kubernetes', 'Docker', 'RabbitMQ', 'PostgreSQL',
        'Microservices', 'Domain-Driven Design', 'Event-Driven Architecture',
        'Site Reliability Engineering', 'Payment APIs', 'Market Risk',
      ],
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'São Paulo',
        addressRegion: 'SP',
        addressCountry: 'BR',
      },
      sameAs: [
        portfolio.contact.github,
        portfolio.contact.linkedin,
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESC,
      inLanguage: ['pt-BR', 'en'],
      author: { '@id': PERSON_ID },
      publisher: { '@id': PERSON_ID },
    },
    {
      '@type': 'ProfilePage',
      '@id': `${SITE_URL}/#profilepage`,
      url: SITE_URL,
      name: SITE_NAME,
      about: { '@id': PERSON_ID },
      isPartOf: { '@id': `${SITE_URL}/#website` },
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

        {/* ── Fontes ──────────────────────────────────────────────────────
            Declaradas aqui (e não só via @import no global.css): o @import é
            a forma mais lenta de carregar fonte — o browser precisa baixar e
            analisar o CSS antes de descobrir a dependência. Com <link> logo
            após o preconnect, o download começa imediatamente. */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Syne:wght@800&family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
        />

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
        <meta name="author" content={AUTHOR_NAME} />
        <link rel="apple-touch-icon" href={FAVICON_URI} />
        {/* Sem <link rel="canonical"> aqui: este shell é servido para TODAS as rotas
            (vercel.json reescreve tudo para /index.html). Um canonical fixo diria ao
            Google que /projects, /estudo/... são duplicatas da home. Cada rota
            declara o seu próprio via <Head>. */}

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
        <meta property="og:image:alt" content={OG_IMAGE_ALT} />

        {/* ── Twitter Card ────────────────────────────────────────────── */}
        {/* `summary` e não `summary_large_image`: a foto é retrato (800×1265) e
            num card largo sairia cortada nas bordas. */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={SITE_NAME} />
        <meta name="twitter:description" content={SITE_DESC} />
        <meta name="twitter:image" content={OG_IMAGE} />
        <meta name="twitter:image:alt" content={OG_IMAGE_ALT} />

        <ScrollViewStyleReset />

        {/* Substitui o favicon.ico padrão pelo ícone </> via script */}
        <script dangerouslySetInnerHTML={{ __html: FAVICON_SCRIPT }} />

        {/* Structured Data / JSON-LD.
            O `type` é obrigatório: sem ele o navegador tenta executar o JSON como
            JavaScript e os crawlers não reconhecem o bloco como dados estruturados. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON_LD_STR }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
