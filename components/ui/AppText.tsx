import React from 'react';
import { Text as RNText, TextProps } from 'react-native';
import { useTranslation } from 'react-i18next';

// ─────────────────────────────────────────────────────────────────────────────
// AppText — "middleware" global de tradução.
//
// Substitui o <Text> do react-native em todo o app. Ele:
//  1. Assina o i18n (useTranslation) → re-renderiza sozinho ao trocar de idioma;
//  2. Traduz automaticamente o texto (em PT) que recebe como filho, buscando no
//     namespace `auto` (dicionário `locales/en/auto.json`, chave = texto em PT).
//
// Assim, qualquer página atual ou futura que use este Text traduz sozinha, sem
// precisar de `t()` por componente nem inventar chaves. Texto sem entrada no
// dicionário simplesmente permanece em PT (defaultValue = próprio texto).
// ─────────────────────────────────────────────────────────────────────────────

type TFn = (key: string, opts: { defaultValue: string }) => string;

function translateNode(node: React.ReactNode, t: TFn): React.ReactNode {
  if (typeof node === 'string') {
    const trimmed = node.trim();
    if (!trimmed) return node;
    const translated = t(trimmed, { defaultValue: trimmed });
    if (translated === trimmed) return node; // sem tradução → preserva original
    // Reaplica espaços/quebras que existiam nas bordas do texto original.
    const start = node.indexOf(trimmed);
    const lead = node.slice(0, start);
    const tail = node.slice(start + trimmed.length);
    return lead + translated + tail;
  }
  if (Array.isArray(node)) {
    return node.map((child, i) => (
      <React.Fragment key={i}>{translateNode(child, t)}</React.Fragment>
    ));
  }
  // Números, elementos React (ex.: <Text> aninhado, que se traduz sozinho) etc.
  return node;
}

export function Text({ children, ...rest }: TextProps) {
  const { t, i18n } = useTranslation('auto');
  const content =
    i18n.language === 'pt' ? children : translateNode(children, t as unknown as TFn);
  return <RNText {...rest}>{content}</RNText>;
}

export default Text;
