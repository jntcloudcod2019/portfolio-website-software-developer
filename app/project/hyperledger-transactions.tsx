import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { useWindowDimensions } from 'react-native';

import { SeoHead } from '@/components/seo/SeoHead';
import { absoluteUrl } from '@/constants/seo';

// Página de detalhe do projeto HyperLedger.Transactions. Implementada conforme o
// handoff de design: tokens C/F, CSS inline e DOM real (Expo Web / RN Web).
// Conteúdo 100% estático — as animações são CSS/SVG declarativas.

// ─── Design tokens ────────────────────────────────────────────────────────────

const F = {
  body: "'Space Grotesk',system-ui,sans-serif",
  mono: '"JetBrains Mono", "Courier New", monospace',
} as const;

const C = {
  bg: '#0a0b0d',       bgCard: '#0e1014',
  bgItem: '#101216',   bgNode: '#141820',
  bgCanvas: '#0c0e13',
  border: '#1c1f26',   borderSep: '#161920',
  text1: '#e8eaed',    text2: '#b7bcc4',
  text3: '#9aa0a8',    text4: '#6b7280',
  muted: '#5b616b',    dim: '#4b5159',   dimmer: '#3a3f47',
  cyan: '#38bdf8',     purple: '#a78bfa', green: '#34d399',
  amber: '#f5a623',    orange: '#ff9f2e', blue: '#5b8def',
  pink: '#fb7185',     stripe: '#635bff', stripeText: '#8b85ff',
} as const;

const CSS = `
  @keyframes hl-blink { 0%,100%{opacity:1} 50%{opacity:.25} }
  .hl-node { transition: transform .25s cubic-bezier(.2,.7,.2,1), border-color .2s; }
  .hl-node:hover { transform: translateY(-4px); }
  .hl-card { transition: transform .25s cubic-bezier(.2,.7,.2,1), border-color .22s; }
  .hl-card:hover { transform: translateY(-3px); border-color:#38bdf855; }
  .hl-gh { transition: transform .2s; }
  .hl-gh:hover { transform: scale(1.03); }
  .hl-back:hover { color:#38bdf8; }
  .hl-row { transition: background .18s; }
  .hl-row:hover { background:#101216; }
`;

/** Abaixo desta largura as grades colapsam. */
const MOBILE_BP = 900;
/** Altura do NavHeader fixo do site. */
const NAV_H = 54;

// ─── Ícones (paths puros; o <svg> é montado pelo helper) ──────────────────────

const I = {
  code: <><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></>,
  lock: <><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>,
  shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></>,
  database: <><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></>,
  refresh: <><path d="M23 4v6h-6" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></>,
  topology: <><circle cx="5" cy="12" r="2.5" /><circle cx="19" cy="6" r="2.5" /><circle cx="19" cy="18" r="2.5" /><path d="M7.2 11L16.8 6.9" /><path d="M7.2 13l9.6 4.1" /></>,
  card: <><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></>,
  dollar: <><path d="M12 1v22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></>,
  book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></>,
  bell: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></>,
  zap: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
  trending: <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></>,
  box: <><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></>,
  layers: <><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></>,
  server: <><rect x="2" y="2" width="20" height="8" rx="2" /><rect x="2" y="14" width="20" height="8" rx="2" /><line x1="6" y1="6" x2="6.01" y2="6" /><line x1="6" y1="18" x2="6.01" y2="18" /></>,
} as const;

function icon(paths: React.ReactNode, size: number, color: string, sw = 1.9) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
         strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{paths}</svg>
  );
}

// ─── Dados ────────────────────────────────────────────────────────────────────

const CHIPS = [
  { label: 'C# 14 · .NET 10 LTS',           color: C.purple },
  { label: 'MongoDB 8.0 · replica set',     color: C.green },
  { label: 'Kafka 3.9 · KRaft',             color: C.blue },
  { label: 'Redis 7.4',                     color: C.pink },
  { label: 'Stripe',                        color: C.stripe, strong: true },
  { label: 'OTel · Prometheus · Grafana',   color: C.orange },
  { label: 'Docker Compose',                color: '#3aa4ec' },
];

const METRICS = [
  { n: '1M',    l1: 'transações em',        l2: '5 minutos · teto medido',   color: C.cyan },
  { n: '~3.3k', l1: 'transações por',       l2: 'segundo no pico',           color: C.purple },
  { n: '0',     l1: 'cobranças duplicadas', l2: 'por retry de cliente',      color: C.green },
  { n: '15min', l1: 'janela de reconciliação', l2: 'saldo ↔ livro-razão',    color: C.amber },
];

const RESOLVE = [
  { ic: I.card, color: C.cyan, title: 'Receber e cobrar',
    text: 'A ordem entra por uma API única, passa por rate limiting, checagem de duplicidade e cadeia antifraude antes de virar cobrança no Stripe. Nada chega ao gateway sem ter sido validado e registrado.' },
  { ic: I.dollar, color: C.green, title: 'Manter o saldo correto',
    text: 'Saldo tem uma única fonte de escrita, com controle otimista de concorrência. Duas transações simultâneas na mesma conta não se sobrescrevem — a segunda repete a operação sobre o estado novo.' },
  { ic: I.book, color: C.blue, title: 'Provar o que aconteceu',
    text: 'Cada movimentação vira lançamento imutável no livro-razão. O saldo é projeção; o livro é a verdade. Divergência entre os dois dispara alerta em vez de esperar o cliente reclamar.' },
];

const NODES = [
  { ns: 'TRANSACTIONS.API', name: 'Transaction API',      sub: 'Minimal API · rate limit',  color: C.cyan,   ic: I.code,     left: 16,  top: 28,  width: 208, delay: '0s' },
  { ns: 'IDEMPOTENCY',      name: 'Idempotência',         sub: 'Redis lookup · Mongo fonte', color: C.purple, ic: I.lock,     left: 338, top: 28,  width: 192, delay: '.4s' },
  { ns: 'FRAUD.CHAIN',      name: 'Antifraude',           sub: 'Strategy + Chain',           color: C.amber,  ic: I.shield,   left: 660, top: 28,  width: 194, delay: '.8s' },
  { ns: 'MONGO.OUTBOX',     name: 'Outbox + Tx',          sub: 'transação multi-doc',        color: C.green,  ic: I.database, left: 660, top: 272, width: 194, delay: '1.2s' },
  { ns: 'OUTBOX.RELAY',     name: 'Relay Worker',         sub: 'polling + lease atômico',    color: C.orange, ic: I.refresh,  left: 338, top: 272, width: 192, delay: '1.6s' },
  { ns: 'KAFKA.TOPIC',      name: 'transactions-outbox',  sub: '8 partições · lz4',          color: C.blue,   ic: I.topology, left: 16,  top: 272, width: 208, delay: '2s' },
];

const PATHS = [
  { id: 'hl-p1', d: 'M 210,80 L 326,80',   color: C.cyan,   glow: 'hl-gl-cy', arrow: '326,73 338,80 326,87',  dur: '2s',   begins: ['0s', '.67s', '1.33s'] },
  { id: 'hl-p2', d: 'M 530,80 L 648,80',   color: C.purple, glow: 'hl-gl-pu', arrow: '648,73 660,80 648,87',  dur: '2s',   begins: ['.3s', '.97s', '1.63s'] },
  { id: 'hl-p3', d: 'M 754,132 L 754,262', color: C.amber,  glow: 'hl-gl-am', arrow: '747,262 754,274 761,262', dur: '2.2s', begins: ['0s', '.73s', '1.47s'] },
  { id: 'hl-p4', d: 'M 648,320 L 530,320', color: C.green,  glow: 'hl-gl-gr', arrow: '530,313 518,320 530,327', dur: '2s',   begins: ['.2s', '.87s', '1.53s'] },
  { id: 'hl-p5', d: 'M 326,320 L 210,320', color: C.orange, glow: 'hl-gl-or', arrow: '210,313 198,320 210,327', dur: '2s',   begins: ['.4s', '1.07s', '1.73s'] },
];

const DATA_LABELS = [
  { text: 'POST /transactions',  left: 59,  top: 144, width: 130 },
  { text: 'nova · senão 409',    left: 373, top: 148, width: 130 },
  { text: 'aprovada',            left: 789, top: 181, width: 110 },
  { text: 'unpublished · lease', left: 539, top: 238, width: 130 },
  { text: 'publish em batch',    left: 204, top: 236, width: 130 },
];

const CONSUMERS = [
  { ic: I.dollar, color: C.green, title: 'Balance Service', sub: 'consumer · saldo',
    text: 'Fonte única de escrita de saldo. Optimistic concurrency com retry explícito (5×) em ConcurrencyException; esgotado, vai para DLQ.' },
  { ic: I.book, color: C.blue, title: 'Ledger Service', sub: 'event sourcing',
    text: 'Livro append-only, imutável. Snapshot assíncrono a cada 1000 eventos. É contra ele que a reconciliação confere o saldo materializado.' },
  { ic: I.bell, color: C.pink, title: 'Notification Service', sub: 'SSE · backplane',
    text: 'Server-Sent Events com backplane Redis Pub/Sub — sem ele, notificação publicada em réplica diferente da conexão do cliente nunca chega.' },
];

const ENV_PILLS = [
  { label: 'Dev',    text: 'Test mode + stripe listen' },
  { label: 'Testes', text: 'Mock via WireMock' },
  { label: 'Prod',   text: 'Live via Stripe__SecretKey' },
];

const MONGO_ROWS = [
  { k: 'transactions',     v: 'imutável · índice único parcial em PaymentIntentId' },
  { k: 'outbox',           v: 'mensagens não publicadas + lease' },
  { k: 'idempotency_keys', v: 'fonte de verdade durável (Redis é cache)' },
  { k: 'balances',         v: 'índices criados · aguarda consumer', dim: true },
  { k: 'ledger_events',    v: 'append-only · aguarda consumer',     dim: true },
];

const KAFKA_ROWS = [
  { k: 'transactions-outbox', v: 'origem única · 8 partições',        color: C.blue },
  { k: 'balance-updates-dlq', v: 'saldo represado · alerta P0',       color: C.pink },
  { k: 'ledger-updates-dlq',  v: 'evento não aplicado ao livro',      color: C.pink },
  { k: 'producer',            v: 'batch 32KB · linger 10ms · lz4',    color: C.amber },
];

const REDIS_ITEMS = [
  { t: 'Lookup de idempotência',   s: 'TTL 48h · cache, não verdade' },
  { t: 'Cache de saldo',           s: 'decorator sobre o repositório' },
  { t: 'Backplane Pub/Sub do SSE', s: 'fan-out entre réplicas' },
];

const HEX = [
  { title: 'Core',           sub: 'domínio · zero dependência', color: C.blue,  ic: I.box,
    items: ['Transaction · Balance', 'LedgerEvent · Outbox', 'Money · Ports/'] },
  { title: 'Application',    sub: 'casos de uso',               color: C.amber, ic: I.layers,
    items: ['ProcessTransaction', 'FraudValidationChain', 'TransactionValidator'] },
  { title: 'Infrastructure', sub: 'adapters',                   color: C.green, ic: I.server,
    items: ['MongoDb/ · Redis/', 'Kafka/ · OutboxRelay/', 'Stripe/ · Resilience/'] },
  { title: 'API',            sub: 'Minimal API · OpenAPI 3.1',  color: C.cyan,  ic: I.code,
    items: ['Endpoints/', 'IdempotencyMiddleware', 'CorrelationId · RateLimit'] },
];

const DECISIONS = [
  { kicker: 'Trade-off aceito', color: C.pink,   title: 'REST interno, não gRPC',
    text: 'Em centenas de TPS, o ganho de serialização binária não paga versionamento de .proto entre serviços deployados independentemente. A porta no domínio é a mesma — trocou só o adapter.' },
  { kicker: 'Consistência',     color: C.green,  title: 'Polling com lease, não Change Streams',
    text: 'O lease atômico via FindOneAndUpdate garante que cada mensagem seja reivindicada por um único worker, sem depender do comportamento de resumo de um cursor.' },
  { kicker: 'LGPD · Art. 18',   color: C.purple, title: 'Envelope encryption, não hash',
    text: 'DEK por cliente cifrada por chave mestra. Hash de nome+CPF é reversível por força bruta; descartar a DEK individual cumpre o esquecimento sem quebrar a imutabilidade da transação.' },
  { kicker: 'Calibração',       color: C.amber,  title: '1M em 5min virou teste de estresse',
    text: 'O volume real é centenas de TPS. O teste de aceite nesse patamar é gate de CI; o de 1M mede folga acima do pico e não bloqueia pipeline.' },
  { kicker: 'Fonte de verdade', color: C.blue,   title: 'Saldo só escreve pelo consumer',
    text: 'A API lê saldo por REST interno, mas nunca escreve. Uma única fonte de escrita elimina a ambiguidade de dupla escrita do desenho anterior.' },
  { kicker: 'Risco declarado',  color: C.orange, title: 'Segredo em texto na VM',
    text: 'Sem Key Vault e Managed Identity, o segredo existe em texto. Mitigado com chmod 600, SSH por chave e rotação documentada — e registrado como risco aceito, não escondido.' },
];

const GITHUB_URL = 'https://github.com/MySystemProjetcs/HyperLedger-II';
const PAGE_DESC =
  'Motor de processamento de transações financeiras em .NET 10 — arquitetura hexagonal, idempotência durável, Outbox Pattern sobre MongoDB, Kafka com consumers por partição e Stripe como gateway.';

// ─── Página ───────────────────────────────────────────────────────────────────

export default function HyperLedgerTransactionsPage() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  // `width > 0` importa: na renderização estática (web.output:'static') o
  // useWindowDimensions ainda não mediu nada e devolve 0, o que cairia no ramo
  // mobile e faria o desktop saltar de layout na hidratação. Com a guarda, o
  // HTML pré-renderizado já sai no layout desktop.
  const isMobile = width > 0 && width < MOBILE_BP;

  useEffect(() => {
    const el = document.createElement('style');
    el.textContent = CSS;
    document.head.appendChild(el);
    return () => { document.head.removeChild(el); };
  }, []);

  const PAD = isMobile ? '48px 22px' : '72px 64px';

  const section = (last = false): React.CSSProperties => ({
    padding: last ? (isMobile ? '48px 22px 72px' : '72px 64px 96px') : PAD,
    borderBottom: last ? undefined : `1px solid ${C.borderSep}`,
  });
  const inner: React.CSSProperties = { maxWidth: 1040, margin: '0 auto' };

  const card = (accent?: string): React.CSSProperties => ({
    background: C.bgCard,
    border: `1px solid ${C.border}`,
    ...(accent ? { borderTop: `2px solid ${accent}80` } : {}),
    borderRadius: 16,
    padding: 24,
  });

  const tile = (color: string, size = 38): React.CSSProperties => ({
    width: size, height: size, borderRadius: 10,
    background: `${color}14`, border: `1px solid ${color}33`,
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  });

  const grid = (cols: number, gap = 16): React.CSSProperties => ({
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : `repeat(${cols}, minmax(0,1fr))`,
    gap,
  });

  const SectionHead = ({ title, note, noteColor }: { title: string; note?: string; noteColor?: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 14 : 24, marginBottom: 26, flexWrap: 'wrap' }}>
      <span style={{
        fontFamily: F.mono, fontSize: 13, letterSpacing: '.3em', color: '#9ca3af',
        textTransform: 'uppercase', flexShrink: 0,
      }}>{title}</span>
      <span style={{ flex: 1, height: 1, minWidth: 24, background: 'linear-gradient(90deg,#23262d,transparent)' }} />
      {note ? (
        <span style={{ fontFamily: F.mono, fontSize: 11, color: noteColor ?? C.muted, flexShrink: 0 }}>{note}</span>
      ) : null}
    </div>
  );

  const CodeBlock = ({ lines }: { lines: string[] }) => (
    <div style={{
      background: C.bgCanvas, border: `1px solid ${C.border}`, borderRadius: 9,
      padding: '12px 14px', marginTop: 14, overflowX: 'auto',
    }}>
      {lines.map((l) => (
        <div key={l} style={{ fontFamily: F.mono, fontSize: 11.5, lineHeight: 1.75, color: C.text3, whiteSpace: 'pre' }}>{l}</div>
      ))}
    </div>
  );

  return (
    <>
      <SeoHead
        title="HyperLedger.Transactions"
        description={PAGE_DESC}
        path="/project/hyperledger-transactions"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareSourceCode',
          name: 'HyperLedger.Transactions',
          description: PAGE_DESC,
          url: absoluteUrl('/project/hyperledger-transactions'),
          codeRepository: GITHUB_URL,
          programmingLanguage: ['C#', '.NET 10', 'MongoDB', 'Apache Kafka', 'Redis', 'Docker'],
          author: { '@type': 'Person', name: 'Jonathan F. Silva' },
        }}
      />

      {/* O shell do RN Web trava os wrappers em 100vh com overflow:hidden no body —
          as demais rotas rolam via <ScrollView>. Aqui o próprio container rola.
          O paddingTop compensa o NavHeader fixo. */}
      <div style={{
        fontFamily: F.body, background: C.bg, color: C.text1,
        height: '100%', overflowY: 'auto', overflowX: 'hidden', paddingTop: NAV_H,
        WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'],
      }}>

        {/* ══ HERO ══ */}
        <div style={{
          position: 'relative', overflow: 'hidden',
          padding: isMobile ? '40px 22px 52px' : '64px 64px 72px',
          background: 'radial-gradient(130% 90% at 50% -10%, #0d1320 0%, #0a0b0d 56%)',
          borderBottom: `1px solid ${C.borderSep}`,
        }}>
          <div style={{
            position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)',
            width: 640, height: 380, maxWidth: '170%',
            background: 'radial-gradient(circle,#38bdf80b,transparent 70%)', pointerEvents: 'none',
          }} />
          <div style={{ ...inner, position: 'relative' }}>
            <a
              href="/projects"
              className="hl-back"
              onClick={(e) => { e.preventDefault(); router.back(); }}
              style={{
                display: 'inline-block', fontFamily: F.mono, fontSize: 12, color: C.muted,
                textDecoration: 'none', letterSpacing: '.06em', marginBottom: 28,
                transition: 'color .18s', cursor: 'pointer',
              }}
            >← Projetos</a>

            <div style={{
              fontFamily: F.mono, fontSize: 12, letterSpacing: '.28em',
              color: C.cyan, textTransform: 'uppercase', marginBottom: 14,
            }}>// projeto · núcleo transacional financeiro</div>

            <h1 style={{
              margin: '0 0 20px', fontSize: isMobile ? 32 : 50, fontWeight: 700,
              letterSpacing: '-.03em', lineHeight: 1.04,
            }}>
              HyperLedger<span style={{ color: C.cyan }}>.</span>Transactions
            </h1>

            <p style={{
              margin: '0 0 20px', fontSize: 15.5, lineHeight: 1.7, color: C.text3, maxWidth: '66ch',
            }}>
              Motor de processamento de transações financeiras de alta performance — o back-office que
              recebe a ordem de pagamento, cobra pelo Stripe, atualiza o saldo da conta e grava o
              lançamento no livro-razão imutável. É a camada que um banco digital, carteira ou marketplace
              coloca entre o cliente e o dinheiro: cada centavo movimentado precisa ser único, rastreável
              e reconciliável.
            </p>

            <p style={{
              margin: '0 0 26px', fontSize: 15.5, lineHeight: 1.7, color: C.text3, maxWidth: '66ch',
            }}>
              Construído em .NET 10 com arquitetura hexagonal, persegue vazão sem abrir mão de
              consistência: idempotência durável, Outbox Pattern sobre transação multi-documento do
              MongoDB, publicação em lote no Kafka e consumers paralelos por partição — com DLQ,
              reconciliação e crypto-shredding no desenho. O teto medido é de{' '}
              <strong style={{ color: C.text1, fontWeight: 600 }}>1 milhão de transações em 5 minutos</strong>,
              cerca de 3.300 por segundo, mantido como teste de estresse para medir folga enquanto o SLA
              de produção opera na casa das centenas de TPS.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
              {CHIPS.map((c) => (
                <span key={c.label} style={{
                  fontFamily: F.mono, fontSize: 11, color: c.strong ? C.stripeText : c.color,
                  background: `${c.color}${c.strong ? '1c' : '14'}`,
                  border: `1px solid ${c.color}${c.strong ? '3d' : '2e'}`,
                  padding: '5px 11px', borderRadius: 6,
                }}>{c.label}</span>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 22, flexWrap: 'wrap' }}>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener"
                className="hl-gh"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 9,
                  background: '#e8eaed', color: '#0a0b0d', borderRadius: 11,
                  padding: '12px 22px', fontSize: 14, fontWeight: 600, textDecoration: 'none',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#0a0b0d">
                  <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3z" />
                </svg>
                GitHub
              </a>

              <div style={{
                display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
                fontFamily: F.mono, fontSize: 11, color: C.muted,
              }}>
                <span><span style={{ color: C.cyan, fontWeight: 600 }}>centenas</span> de TPS calibrados</span>
                <span style={{ color: '#2b2f37' }}>·</span>
                <span>hexagonal · ports &amp; adapters</span>
                <span style={{ color: '#2b2f37' }}>·</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                  <span style={{
                    width: 7, height: 7, borderRadius: '50%', background: C.amber,
                    animation: 'hl-blink 2s infinite',
                  }} />
                  em construção · v3
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ══ O QUE O SISTEMA RESOLVE ══ */}
        <div style={section()}>
          <div style={inner}>
            <SectionHead title="O que o sistema resolve" />

            <div style={{ ...grid(4, 14), marginBottom: 20 }}>
              {METRICS.map((m) => (
                <div key={m.n} style={{
                  background: C.bgCard, border: `1px solid ${C.border}`,
                  borderTop: `2px solid ${m.color}80`, borderRadius: 14, padding: 20,
                }}>
                  <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-.03em', color: m.color, marginBottom: 8 }}>{m.n}</div>
                  <div style={{ fontFamily: F.mono, fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: C.text4, lineHeight: 1.6 }}>
                    {m.l1}<br />{m.l2}
                  </div>
                </div>
              ))}
            </div>

            <div style={grid(3)}>
              {RESOLVE.map((r) => (
                <div key={r.title} className="hl-card" style={{ ...card(), borderRadius: 14, padding: 22 }}>
                  <div style={{ ...tile(r.color), marginBottom: 14 }}>{icon(r.ic, 19, r.color)}</div>
                  <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>{r.title}</div>
                  <p style={{ margin: 0, fontSize: 13, lineHeight: 1.65, color: C.text3 }}>{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══ FLUXO DE PROCESSAMENTO ══ */}
        <div style={section()}>
          <div style={inner}>
            <SectionHead title="Fluxo de processamento" note="6 etapas · at-least-once" />

            <div style={{ overflowX: 'auto' }}>
              {/* 430 e não 400: com as larguras de nó do handoff os subtítulos quebram
                  em duas linhas e os nós de baixo terminam em y=384, colidindo com a
                  step bar. As coordenadas dos nós e a geometria dos paths (viewBox
                  0 0 910 400, ancorado no topo) ficam intactas. */}
              <div style={{
                position: 'relative', width: 910, height: 430, background: C.bgCanvas,
                border: `1px solid ${C.border}`, borderRadius: 18, overflow: 'hidden', margin: '0 auto',
              }}>
                <div style={{
                  position: 'absolute', inset: 0,
                  backgroundImage: 'radial-gradient(circle,#1a1e2a 1px,transparent 1px)',
                  backgroundSize: '28px 28px', opacity: 0.65,
                }} />

                <svg width="910" height="400" viewBox="0 0 910 400" fill="none"
                     style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                  <defs>
                    {[['hl-gl-cy'], ['hl-gl-pu'], ['hl-gl-am'], ['hl-gl-gr'], ['hl-gl-or']].map(([id]) => (
                      <filter key={id} id={id} x="-80%" y="-80%" width="260%" height="260%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="b" />
                        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                      </filter>
                    ))}
                  </defs>

                  {PATHS.map((p) => (
                    <g key={p.id}>
                      <path id={p.id} d={p.d} stroke={p.color} strokeWidth="1.8" strokeDasharray="5 3" opacity=".55" fill="none" />
                      <polygon points={p.arrow} fill={p.color} opacity=".85" />
                      {p.begins.map((b, i) => (
                        <circle key={b} r={i === 1 ? 3.5 : 5}
                                fill={i === 1 ? `${p.color}80` : p.color}
                                filter={i === 1 ? undefined : `url(#${p.glow})`}>
                          <animateMotion dur={p.dur} begin={b} repeatCount="indefinite">
                            <mpath href={`#${p.id}`} />
                          </animateMotion>
                        </circle>
                      ))}
                    </g>
                  ))}
                </svg>

                {NODES.map((n) => (
                  <div key={n.ns} className="hl-node" style={{
                    position: 'absolute', zIndex: 2, left: n.left, top: n.top, width: n.width,
                    background: C.bgNode, border: `1px solid ${n.color}44`,
                    borderLeft: `3px solid ${n.color}`, borderRadius: 12, padding: '13px 15px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                      <span style={{
                        fontFamily: F.mono, fontSize: 9, letterSpacing: '.1em', textTransform: 'uppercase',
                        color: n.color, opacity: 0.8,
                      }}>{n.ns}</span>
                      <span style={{
                        width: 7, height: 7, borderRadius: '50%', background: n.color,
                        animation: `hl-blink 2s ${n.delay} infinite`,
                      }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                      <span style={{ ...tile(n.color, 44), borderRadius: 10, background: `${n.color}18` }}>
                        {icon(n.ic, 20, n.color)}
                      </span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 14.5, fontWeight: 600 }}>{n.name}</div>
                        <div style={{ fontFamily: F.mono, fontSize: 10, color: C.text4, marginTop: 2 }}>{n.sub}</div>
                      </div>
                    </div>
                  </div>
                ))}

                {DATA_LABELS.map((d) => (
                  <div key={d.text} style={{
                    position: 'absolute', zIndex: 3, left: d.left, top: d.top, width: d.width,
                    fontFamily: F.mono, fontSize: 9.5, color: '#8b9099', background: C.bgCanvas,
                    padding: '2px 6px', borderRadius: 4, textAlign: 'center', whiteSpace: 'nowrap',
                  }}>{d.text}</div>
                ))}

                <div style={{
                  position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)',
                  fontFamily: F.mono, fontSize: 9.5, color: C.dim, whiteSpace: 'nowrap',
                }}>
                  {NODES.map((n, i) => (
                    <React.Fragment key={n.ns}>
                      <span style={{ color: n.color }}>{String(i + 1).padStart(2, '0')}</span>
                      {i < NODES.length - 1 ? '→' : null}
                    </React.Fragment>
                  ))}
                  <span style={{ color: C.dimmer }}> · at-least-once garantido pelo Outbox, não pelo publish direto</span>
                </div>
              </div>
            </div>

            <div style={{ ...grid(3, 14), marginTop: 22 }}>
              {CONSUMERS.map((c) => (
                <div key={c.title} className="hl-card" style={{ ...card(c.color), borderRadius: 14, padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 12 }}>
                    <span style={tile(c.color)}>{icon(c.ic, 18, c.color)}</span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 14.5, fontWeight: 600 }}>{c.title}</div>
                      <div style={{ fontFamily: F.mono, fontSize: 10, color: c.color, opacity: 0.85, marginTop: 2 }}>{c.sub}</div>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.65, color: C.text3 }}>{c.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══ GATEWAY DE PAGAMENTO ══ */}
        <div style={section()}>
          <div style={inner}>
            <SectionHead title="Gateway de pagamento" note="Stripe" noteColor={C.stripe} />

            <div style={{ ...grid(2, 18), marginBottom: 18 }}>
              <div className="hl-card" style={{ ...card(), borderTop: `2px solid ${C.stripe}aa` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <span style={{ ...tile(C.stripe), background: `${C.stripe}1c`, border: `1px solid ${C.stripe}3d` }}>
                    {icon(I.dollar, 18, C.stripeText)}
                  </span>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>Cobrança idempotente</div>
                    <div style={{ fontFamily: F.mono, fontSize: 10.5, color: C.stripeText, marginTop: 2 }}>StripeGateway</div>
                  </div>
                </div>
                <p style={{ margin: 0, fontSize: 13, lineHeight: 1.65, color: C.text3 }}>
                  A <em style={{ fontStyle: 'normal', color: C.text1 }}>idempotency key é determinística</em> —
                  derivada do id da transação, nunca um GUID novo por tentativa. Retry após timeout reaproveita
                  a mesma chave, e o Stripe devolve a cobrança original em vez de criar outra.
                </p>
                <CodeBlock lines={[
                  'var options = new RequestOptions',
                  '{ IdempotencyKey = $"tx-{request.TransactionId}" };',
                ]} />
              </div>

              <div className="hl-card" style={{ ...card(C.green) }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <span style={tile(C.green)}>{icon(I.shield, 18, C.green)}</span>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>Webhook verificado</div>
                    <div style={{ fontFamily: F.mono, fontSize: 10.5, color: C.green, marginTop: 2 }}>POST /webhooks/stripe</div>
                  </div>
                </div>
                <p style={{ margin: 0, fontSize: 13, lineHeight: 1.65, color: C.text3 }}>
                  Toda notificação passa por <code style={{ fontFamily: F.mono, color: C.text2 }}>EventUtility.ConstructEvent</code>{' '}
                  com o webhook secret e <em style={{ fontStyle: 'normal', color: C.text1 }}>tolerância de 300s</em> no
                  timestamp — assinatura inválida ou payload replayed recebem 400, não entram no domínio.
                </p>
                <CodeBlock lines={['ConstructEvent(json, signature, secret, tolerance: 300);']} />
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {ENV_PILLS.map((p) => (
                <div key={p.label} style={{
                  flex: 1, minWidth: 200, background: C.bgItem, border: `1px solid ${C.border}`,
                  borderRadius: 10, padding: '13px 15px',
                }}>
                  <div style={{
                    fontFamily: F.mono, fontSize: 10, textTransform: 'uppercase',
                    color: C.muted, marginBottom: 6, letterSpacing: '.1em',
                  }}>{p.label}</div>
                  <div style={{ fontSize: 12.5, color: C.text2 }}>{p.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══ PERSISTÊNCIA & MENSAGERIA ══ */}
        <div style={section()}>
          <div style={inner}>
            <SectionHead title="Persistência & mensageria" note="containers, não serviço gerenciado" />

            <div style={{ ...grid(2, 18), marginBottom: 18 }}>
              {/* MongoDB */}
              <div style={{ ...card(C.green), padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: 22 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <span style={tile(C.green, 40)}>{icon(I.database, 19, C.green)}</span>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600 }}>MongoDB</div>
                      <div style={{ fontFamily: F.mono, fontSize: 11, color: C.green, marginTop: 2 }}>mongo:8.0 · replSet rs0 · :27017</div>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: 13, lineHeight: 1.65, color: C.text3 }}>
                    Driver nativo <code style={{ fontFamily: F.mono, color: C.text2 }}>MongoDB.Driver</code>, sem EF Core:
                    o mapeamento documento↔entidade é explícito e o domínio fica livre de atributo de persistência.
                    O replica set não é opcional — sem ele o Mongo recusa transação multi-documento, que é o
                    mecanismo do Outbox.
                  </p>
                </div>
                <div>
                  {MONGO_ROWS.map((r) => (
                    <div key={r.k} className="hl-row" style={{
                      display: 'flex', gap: 12, padding: '11px 22px', borderTop: `1px solid ${C.border}`, flexWrap: 'wrap',
                    }}>
                      <span style={{ fontFamily: F.mono, fontSize: 12, minWidth: 130, color: r.dim ? C.text4 : C.green }}>{r.k}</span>
                      <span style={{ flex: 1, minWidth: 160, fontSize: 12.5, color: r.dim ? C.text4 : C.text3 }}>{r.v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Kafka */}
              <div style={{ ...card(C.blue), padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: 22 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <span style={tile(C.blue, 40)}>{icon(I.topology, 19, C.blue)}</span>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600 }}>Kafka</div>
                      <div style={{ fontFamily: F.mono, fontSize: 11, color: C.blue, marginTop: 2 }}>apache/kafka:3.9.0 · KRaft · :29092</div>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: 13, lineHeight: 1.65, color: C.text3 }}>
                    Modo KRaft, sem Zookeeper. <code style={{ fontFamily: F.mono, color: C.text2 }}>auto.create.topics</code>{' '}
                    desabilitado de propósito — tópico criado por acidente nasce com partição padrão, e partição
                    não se reduz depois. Um container <code style={{ fontFamily: F.mono, color: C.text2 }}>kafka-init</code>{' '}
                    cria os tópicos e sai.
                  </p>
                </div>
                <div>
                  {KAFKA_ROWS.map((r) => (
                    <div key={r.k} className="hl-row" style={{
                      display: 'flex', gap: 12, padding: '11px 22px', borderTop: `1px solid ${C.border}`, flexWrap: 'wrap',
                    }}>
                      <span style={{ fontFamily: F.mono, fontSize: 12, minWidth: 150, color: r.color }}>{r.k}</span>
                      <span style={{ flex: 1, minWidth: 160, fontSize: 12.5, color: C.text3 }}>{r.v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={grid(2, 18)}>
              {/* Redis */}
              <div style={card(C.pink)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <span style={tile(C.pink, 40)}>{icon(I.zap, 19, C.pink)}</span>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>Redis</div>
                    <div style={{ fontFamily: F.mono, fontSize: 11, color: C.pink, marginTop: 2 }}>redis:7.4-alpine · appendonly · :6379</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                  {REDIS_ITEMS.map((r) => (
                    <div key={r.t} style={{
                      display: 'flex', alignItems: 'flex-start', gap: 11,
                      background: C.bgItem, borderRadius: 9, padding: '11px 13px',
                    }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.pink, marginTop: 6, flexShrink: 0 }} />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 13, color: C.text2 }}>{r.t}</div>
                        <div style={{ fontFamily: F.mono, fontSize: 10.5, color: C.text4, marginTop: 3 }}>{r.s}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* DLQ */}
              <div style={card(C.orange)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <span style={tile(C.orange, 40)}>{icon(I.trending, 19, C.orange)}</span>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>Observabilidade da DLQ</div>
                    <div style={{ fontFamily: F.mono, fontSize: 11, color: C.orange, marginTop: 2 }}>OTel → Prometheus → Grafana</div>
                  </div>
                </div>
                <p style={{ margin: '0 0 14px', fontSize: 13, lineHeight: 1.65, color: C.text3 }}>
                  DLQ aqui é tópico de aplicação — nenhum monitoramento tem métrica pronta para ela.
                  A visibilidade precisa ser emitida pelo código:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                  {[
                    { m: 'dlq_messages_total',        tag: 'contagem',     accent: false },
                    { m: 'dlq_amount_at_risk_cents',  tag: 'exposição R$', accent: true },
                  ].map((x) => (
                    <div key={x.m} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                      background: C.bgItem, borderRadius: 8, padding: '10px 12px', flexWrap: 'wrap',
                      border: `1px solid ${x.accent ? `${C.orange}33` : C.border}`,
                    }}>
                      <code style={{ fontFamily: F.mono, fontSize: 11.5, color: x.accent ? C.orange : C.text3 }}>{x.m}</code>
                      <span style={{ fontFamily: F.mono, fontSize: 10.5, color: x.accent ? C.orange : C.text4 }}>{x.tag}</span>
                    </div>
                  ))}
                </div>
                <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.6, color: C.text4, fontStyle: 'italic' }}>
                  Cinco mensagens na DLQ podem significar R$ 50 ou R$ 500.000 — a contagem sozinha não
                  distingue os dois casos.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ══ ARQUITETURA HEXAGONAL ══ */}
        <div style={section()}>
          <div style={inner}>
            <SectionHead title="Arquitetura hexagonal" note="ports & adapters · 4 projetos" />

            <div style={{ ...grid(4), marginBottom: 20 }}>
              {HEX.map((h) => (
                <div key={h.title} className="hl-card" style={{ ...card(h.color), padding: 22 }}>
                  <div style={{ ...tile(h.color), marginBottom: 14 }}>{icon(h.ic, 18, h.color)}</div>
                  <div style={{ fontSize: 14.5, fontWeight: 600 }}>{h.title}</div>
                  <div style={{ fontFamily: F.mono, fontSize: 10.5, color: h.color, marginTop: 3, marginBottom: 14 }}>{h.sub}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {h.items.map((it) => (
                      <div key={it} style={{
                        fontFamily: F.mono, fontSize: 10.5, color: C.text3,
                        background: C.bgItem, border: `1px solid ${C.border}`,
                        borderRadius: 7, padding: '7px 9px',
                      }}>{it}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              background: C.bgCard, borderLeft: `3px solid ${C.cyan}`,
              borderRadius: 12, padding: '20px 22px',
            }}>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: C.text2 }}>
                <strong style={{ color: C.text1, fontWeight: 600 }}>O retorno concreto da hexagonal:</strong>{' '}
                quando o projeto saiu inteiro do Azure (Cosmos DB → <code style={{ fontFamily: F.mono }}>mongo:8.0</code>,
                Event Hubs → <code style={{ fontFamily: F.mono }}>apache/kafka</code>, Managed Redis →{' '}
                <code style={{ fontFamily: F.mono }}>redis:7.4</code>), o código de aplicação praticamente não
                mudou — só a configuração SASL do cliente Kafka, que era específica do Event Hubs. Core,
                repositórios, decorator de cache e Relay Worker seguiram intactos, e os testes de integração
                já rodavam contra containers. O domínio nunca soube quem hospedava a infraestrutura.
              </p>
            </div>
          </div>
        </div>

        {/* ══ DECISÕES DE ENGENHARIA ══ */}
        <div style={section(true)}>
          <div style={inner}>
            <SectionHead title="Decisões de engenharia" />
            <div style={grid(3)}>
              {DECISIONS.map((d) => (
                <div key={d.title} className="hl-card" style={{ ...card(), borderRadius: 14, padding: 20 }}>
                  <div style={{
                    fontFamily: F.mono, fontSize: 9.5, letterSpacing: '.14em',
                    textTransform: 'uppercase', color: d.color, marginBottom: 10,
                  }}>{d.kicker}</div>
                  <div style={{ fontSize: 14.5, fontWeight: 600, marginBottom: 8 }}>{d.title}</div>
                  <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.6, color: C.text3 }}>{d.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
