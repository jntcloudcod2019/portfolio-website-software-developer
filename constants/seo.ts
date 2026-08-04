// Fonte única das constantes de SEO. Consumido por app/+html.tsx (shell estático),
// pelos <Head> de cada rota e por scripts/postbuild.js (sitemap + robots.txt).
//
// ATENÇÃO: scripts/postbuild.js extrai o valor de SITE_URL deste arquivo por regex
// ancorado no início da linha — mantenha a declaração abaixo em uma linha só.

export const SITE_URL = 'https://jonathan-enginner-software.vercel.app';

export const SITE_NAME = 'Jonathan F. Silva | Software Engineer';

export const SITE_DESC =
  'Portfólio de Jonathan F. Silva — Engenheiro de Software Full Stack com 5 anos em sistemas financeiros: APIs de pagamento, precificação de ativos e risco de mercado em C#/.NET, Node.js e AWS.';

export const SITE_DESC_EN =
  'Portfolio of Jonathan F. Silva — Full Stack Software Engineer with 5 years in financial systems: payment APIs, asset pricing and market risk across C#/.NET, Node.js and AWS.';

/** Foto do portfólio (retrato 800×1265). Ver nota sobre o formato no README de SEO. */
export const OG_IMAGE = `${SITE_URL}/jonathan-800.webp`;
export const OG_IMAGE_W = '800';
export const OG_IMAGE_H = '1265';
export const OG_IMAGE_ALT = 'Jonathan F. Silva — Engenheiro de Software Full Stack';

/** Monta uma URL absoluta a partir de um caminho de rota. */
export function absoluteUrl(path: string): string {
  if (!path || path === '/') return SITE_URL;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
