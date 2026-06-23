import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

// SVG favicon </ > embarcado como data URI
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
        <title>Jonathan | Software Engineer</title>
        <ScrollViewStyleReset />
        {/* Substitui o favicon.ico padrão pelo ícone </> via script */}
        <script dangerouslySetInnerHTML={{ __html: FAVICON_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
