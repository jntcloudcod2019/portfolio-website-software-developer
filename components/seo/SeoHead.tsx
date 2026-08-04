import Head from 'expo-router/head';
import React from 'react';
import { Platform } from 'react-native';

import {
  SITE_NAME,
  TITLE_SUFFIX,
  OG_IMAGE,
  OG_IMAGE_W,
  OG_IMAGE_H,
  OG_IMAGE_ALT,
  absoluteUrl,
} from '@/constants/seo';

interface SeoHeadProps {
  /** Título da aba/SERP. O sufixo com o nome do site é acrescentado automaticamente. */
  title: string;
  description: string;
  /** Caminho da rota, ex.: '/projects'. Vira canonical e og:url. */
  path: string;
  /** 'article' nas páginas de estudo; 'website' no resto. */
  type?: 'website' | 'article';
  /** Idioma do conteúdo da página — o site alterna PT/EN na mesma URL. */
  locale?: 'pt_BR' | 'en_US';
  /** Data de publicação (ISO) — só usada quando type='article'. */
  publishedTime?: string;
  /** Marca a rota como noindex (páginas utilitárias/duplicadas). */
  noindex?: boolean;
  /** JSON-LD específico da página, adicional ao @graph global do +html.tsx. */
  jsonLd?: object;
}

/**
 * Bloco de <head> por rota.
 *
 * Existe porque `vercel.json` reescreve todas as rotas para /index.html: o shell
 * estático (`app/+html.tsx`) é idêntico em toda a aplicação, então título,
 * descrição e — principalmente — o canonical precisam ser declarados no cliente
 * por cada página. Sem isso, toda URL herdaria os metadados da home.
 */
export function SeoHead({
  title,
  description,
  path,
  type = 'website',
  locale = 'pt_BR',
  publishedTime,
  noindex = false,
  jsonLd,
}: SeoHeadProps) {
  const url = absoluteUrl(path);
  const fullTitle = title === SITE_NAME ? title : `${title} | ${TITLE_SUFFIX}`;

  return (
    <>
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noindex ? 'noindex, follow' : 'index, follow'} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content={locale} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={OG_IMAGE} />
      <meta property="og:image:width" content={OG_IMAGE_W} />
      <meta property="og:image:height" content={OG_IMAGE_H} />
      <meta property="og:image:alt" content={OG_IMAGE_ALT} />
      {publishedTime ? <meta property="article:published_time" content={publishedTime} /> : null}

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={OG_IMAGE} />
      <meta name="twitter:image:alt" content={OG_IMAGE_ALT} />

    </Head>

    {/* O JSON-LD fica FORA do <Head>: o expo-router/head só propaga title/meta/link
        e descarta <script>, então dentro dele o bloco nunca chegava ao HTML.
        Structured data em <body> é válido e reconhecido pelos crawlers. */}
    {jsonLd && Platform.OS === 'web' ? (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    ) : null}
    </>
  );
}
