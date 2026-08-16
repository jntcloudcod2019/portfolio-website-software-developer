import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { useWindowDimensions } from 'react-native';

import { SeoHead } from '@/components/seo/SeoHead';
import { absoluteUrl } from '@/constants/seo';

// Página de detalhe do projeto Zap Blaster. Tokens/CSS inline e DOM real
// (Expo Web / RN Web). Conteúdo estático — animações são CSS/SVG declarativas.

// ─── Design tokens ────────────────────────────────────────────────────────────

const F = {
  body: "'Space Grotesk',system-ui,sans-serif",
  mono: '"JetBrains Mono", "Courier New", monospace',
} as const;

const C = {
  bg: '#0a0b0d',    bgCard: '#0e1014',
  bgItem: '#101216', bgNode: '#141820',
  bgCanvas: '#0c0e13',
  border: '#1c1f26', borderSep: '#161920',
  text1: '#e8eaed',  text2: '#9aa0a8',
  text3: '#8b9099',  text4: '#6b7280',
  muted: '#5b616b',  dim: '#4b5159', dimmer: '#3a3f47',
  whatsapp: '#25d366', node: '#68a063', rabbit: '#ff9f2e',
  violet: '#a78bfa',   cyan: '#38bdf8', amber: '#f5a623',
  red: '#ef6b6b',      docker: '#3aa4ec',
} as const;

const CSS = `
  @keyframes zb-blink { 0%,100%{opacity:1} 50%{opacity:.25} }
  .zb-node { box-sizing:border-box; transition:transform .25s cubic-bezier(.2,.7,.2,1), border-color .2s; }
  .zb-node:hover { transform:translateY(-4px); }
  .zb-card { transition:transform .25s cubic-bezier(.2,.7,.2,1), border-color .22s; }
  .zb-card:hover { transform:translateY(-3px); border-color:#25d36655; }
  .zb-gh { transition:opacity .18s, transform .15s; }
  .zb-gh:hover { transform:scale(1.03); opacity:.92; }
  .zb-back:hover { color:#25d366; }
`;

/** Abaixo desta largura o diagrama vira lista vertical e as grades colapsam. */
const MOBILE_BP = 900;
/** Altura do NavHeader fixo do site. */
const NAV_H = 54;

// ─── Ícones ───────────────────────────────────────────────────────────────────

const RABBIT_PATH = 'M22.02 10.36h-6.35a.71.71 0 0 1-.71-.71V3.3a.71.71 0 0 0-.71-.71h-2.2a.71.71 0 0 0-.71.71v6.35a.71.71 0 0 1-.71.71H8.36a.71.71 0 0 1-.71-.71V3.3a.71.71 0 0 0-.71-.71h-2.2a.71.71 0 0 0-.71.71v17.4a.71.71 0 0 0 .71.71h17.28a.71.71 0 0 0 .71-.71v-9.63a.71.71 0 0 0-.71-.71zm-2.62 6.5a1.2 1.2 0 0 1-1.2 1.2h-1.66a1.2 1.2 0 0 1-1.2-1.2V15.2a1.2 1.2 0 0 1 1.2-1.2h1.66a1.2 1.2 0 0 1 1.2 1.2z';
const WA_PATH = 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z';

/** Ícones de traço (stroke). Os de preenchimento são tratados à parte. */
const I = {
  code:    <><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></>,
  doc:     <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></>,
  monitor: <><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></>,
  send:    <><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></>,
  clock:   <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>,
  layers:  <><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></>,
  term:    <><polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" /></>,
} as const;

function stroke(paths: React.ReactNode, size: number, color: string, sw = 1.8) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
         strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{paths}</svg>
  );
}

function filled(path: string, size: number, color: string) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d={path} /></svg>;
}

// ─── Dados ────────────────────────────────────────────────────────────────────

const BADGES = [
  { label: 'Node.js 18+',        color: C.node },
  { label: 'whatsapp-web.js',    color: C.whatsapp },
  { label: 'RabbitMQ · amqplib', color: C.rabbit },
  { label: 'Puppeteer',          color: C.violet },
  { label: 'Docker',             color: C.docker },
];

type Node = {
  n: string; ns: string; name: string; sub: string; color: string;
  left: number; top: number; width: number; delay: string;
  ic: React.ReactNode;
};

const NODES: Node[] = [
  { n: '01', ns: 'ZAP.QUEUE',     name: 'RabbitMQ',  sub: 'sqs-send-Credentials',           color: C.rabbit,   left: 16,  top: 28,  width: 194, delay: '0s',
    ic: filled(RABBIT_PATH, 22, C.rabbit) },
  { n: '02', ns: 'ZAP.CONSUMER',  name: 'zap.js',    sub: 'ack/nack · amqplib',             color: C.node,     left: 338, top: 28,  width: 192, delay: '.4s',
    ic: stroke(I.code, 22, C.node) },
  { n: '03', ns: 'ZAP.TEMPLATE',  name: 'Template',  sub: '{{UserName}} · {{timestamp}}',   color: C.violet,   left: 660, top: 28,  width: 194, delay: '.8s',
    ic: stroke(I.doc, 22, C.violet) },
  { n: '04', ns: 'ZAP.PUPPETEER', name: 'Chromium',  sub: 'headless · LocalAuth',           color: C.cyan,     left: 660, top: 272, width: 194, delay: '1.2s',
    ic: stroke(I.monitor, 22, C.cyan) },
  { n: '05', ns: 'ZAP.SENDONE',   name: 'sendOne()', sub: '3 retries · 2s',                 color: C.whatsapp, left: 338, top: 272, width: 192, delay: '1.6s',
    ic: stroke(I.send, 22, C.whatsapp) },
  { n: '06', ns: 'ZAP.WHATSAPP',  name: 'WhatsApp',  sub: 'Mensagem entregue',              color: C.whatsapp, left: 16,  top: 272, width: 194, delay: '2s',
    ic: filled(WA_PATH, 22, C.whatsapp) },
];

const PATHS = [
  { id: 'zp1', d: 'M 210,80 L 326,80',   color: C.rabbit,   glow: 'zg-or', arrow: '326,73 338,80 326,87',   dur: '2s',   begins: ['0s', '.67s', '1.33s'] },
  { id: 'zp2', d: 'M 530,80 L 648,80',   color: C.node,     glow: 'zg-nd', arrow: '648,73 660,80 648,87',   dur: '2s',   begins: ['.3s', '.97s', '1.63s'] },
  { id: 'zp3', d: 'M 754,132 L 754,262', color: C.violet,   glow: 'zg-vi', arrow: '747,262 754,274 761,262', dur: '2.2s', begins: ['.1s', '.83s', '1.56s'] },
  { id: 'zp4', d: 'M 648,320 L 530,320', color: C.cyan,     glow: 'zg-cy', arrow: '530,313 518,320 530,327', dur: '2s',   begins: ['.5s', '1.17s', '1.83s'] },
  { id: 'zp5', d: 'M 326,320 L 210,320', color: C.whatsapp, glow: 'zg-gr', arrow: '210,313 198,320 210,327', dur: '2s',   begins: ['.2s', '.87s', '1.53s'] },
];

const EDGE_LABELS = [
  { text: 'payload JSON',    left: 274, top: 12,  center: true },
  { text: 'phone · message', left: 595, top: 12,  center: true },
  { text: 'texto final',     left: 768, top: 186, center: false },
  { text: 'getChatById',     left: 595, top: 250, center: true },
  { text: 'ack ✓ · nack ✗',  left: 274, top: 250, center: true },
];

const ARQUITETURA = [
  {
    color: C.whatsapp, title: 'Núcleo', sub: 'zap.js · 533 linhas', ic: I.clock,
    items: [
      { t: 'Client + LocalAuth',  d: 'Sessão em session/<INSTANCE_ID>' },
      { t: 'Eventos do ciclo',    d: 'qr · ready · auth_failure · disconnected' },
      { t: 'Graceful shutdown',   d: 'SIGINT / SIGTERM destroem o client' },
    ],
  },
  {
    color: C.rabbit, title: 'Mensageria', sub: 'startQueueConsumer', ic: I.layers,
    items: [
      { t: 'assertQueue durável',      d: 'amqplib · ack/nack por mensagem' },
      { t: 'Payloads flexíveis',       d: 'phone/Phone · message/Message' },
      { t: 'Fila interna em memória',  d: 'Buffer pré-validação · reconexão 5s/10s' },
    ],
  },
  {
    color: C.violet, title: 'Runtime', sub: 'Puppeteer · Docker', ic: I.monitor,
    items: [
      { t: 'Chromium headless',    d: 'Args anti-detecção · Web 2.2402.5' },
      { t: 'Detecção de ambiente', d: '/.dockerenv → /app/session' },
      { t: 'Hot reload em dev',    d: 'nodemon.json · delay 1s' },
    ],
  },
];

const SCRIPTS = [
  {
    file: 'status.js', color: C.cyan, title: 'Diagnóstico de conexão',
    desc: 'Instancia um segundo Client em modo teste com timeout de 30s. Conectou → exibe número, nome e plataforma, sai com código 0; falha de auth ou QR pendente → código 1.',
    tags: ['health check', 'CI/CD', 'exit codes'],
  },
  {
    file: 'clear-session.js', color: C.amber, title: 'Limpeza de sessão',
    desc: 'Faz backup dos arquivos em backup/<timestamp>/ antes de remover a sessão corrompida, forçando novo escaneamento de QR na próxima execução.',
    tags: ['backup', 'Docker-aware'],
  },
  {
    file: 'clear-cache.js', color: C.red, title: 'Limpeza agressiva',
    desc: 'Remove três diretórios — session/<id>, .wwebjs_cache e auth/ — mostrando inventário de arquivos e bytes antes de apagar.',
    tags: ['inventário', '3 diretórios'],
  },
  {
    file: 'start.sh', color: C.whatsapp, title: 'Inicialização assistida',
    desc: 'Verifica Node.js/npm, instala dependências, cria .env com credenciais CloudAMQP se faltar, testa a fila e abre menu: 1 = dev (nodemon), 2 = produção.',
    tags: ['menu interativo', '.env auto', 'npm test'],
  },
];

const GITHUB_URL = 'https://github.com/jntcloudcod2019/zap-blaster-projeto';
const PAGE_DESC =
  'Bot de WhatsApp que consome mensagens de uma fila RabbitMQ e as envia via whatsapp-web.js — Puppeteer/Chromium headless, sessão persistida, templates dinâmicos e retry inteligente.';

// ─── Página ───────────────────────────────────────────────────────────────────

export default function ZapBlasterPage() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < MOBILE_BP;

  useEffect(() => {
    const el = document.createElement('style');
    el.textContent = CSS;
    document.head.appendChild(el);
    return () => { document.head.removeChild(el); };
  }, []);

  const section = (last = false): React.CSSProperties => ({
    padding: isMobile ? (last ? '48px 22px 72px' : '48px 22px') : (last ? '72px 64px 96px' : '72px 64px'),
    borderBottom: last ? undefined : `1px solid ${C.borderSep}`,
  });
  const inner: React.CSSProperties = { maxWidth: 1040, margin: '0 auto' };

  const tile = (color: string, size: number, radius: number): React.CSSProperties => ({
    width: size, height: size, borderRadius: radius,
    background: `${color}14`, border: `1px solid ${color}33`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, alignSelf: 'flex-start',
  });

  const SectionHead = ({ title, note }: { title: string; note?: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 14 : 24, marginBottom: 40, flexWrap: 'wrap' }}>
      <div style={{
        fontFamily: F.mono, fontSize: 13, letterSpacing: '.3em', color: '#9ca3af',
        textTransform: 'uppercase', fontWeight: 500, flexShrink: 0,
      }}>{title}</div>
      <div style={{ flex: 1, height: 1, minWidth: 24, background: 'linear-gradient(90deg,#23262d,transparent)' }} />
      {note ? <span style={{ fontFamily: F.mono, fontSize: 11, color: C.muted, flexShrink: 0 }}>{note}</span> : null}
    </div>
  );

  /** Card de nó do fluxo — reaproveitado no canvas (absoluto) e na lista mobile. */
  const NodeCard = ({ node, absolute }: { node: Node; absolute: boolean }) => (
    <div className="zb-node" style={{
      ...(absolute
        ? { position: 'absolute', left: node.left, top: node.top, width: node.width, zIndex: 2 }
        : { width: '100%' }),
      background: C.bgNode,
      border: `1px solid ${node.color}44`,
      borderLeft: `3px solid ${node.color}`,
      borderRadius: 12, padding: '13px 15px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{
          fontFamily: F.mono, fontSize: 9, letterSpacing: '.1em', color: node.color,
          textTransform: 'uppercase', opacity: 0.8,
        }}>{node.ns}</span>
        <span style={{
          width: 7, height: 7, borderRadius: '50%', background: node.color,
          animation: `zb-blink 2s ${node.delay} infinite`,
        }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ ...tile(node.color, 44, 10), background: `${node.color}18`, alignSelf: 'center' }}>
          {node.ic}
        </span>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 14.5, fontWeight: 600, color: C.text1, lineHeight: 1.2 }}>{node.name}</div>
          <div style={{ fontFamily: F.mono, fontSize: 10, color: C.text4, marginTop: 3 }}>{node.sub}</div>
        </div>
      </div>
    </div>
  );

  const ArrowDown = () => (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
      <svg width="14" height="18" viewBox="0 0 14 18" fill="none" stroke="#2b2f37"
           strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 1v13" /><path d="M2 10l5 5 5-5" />
      </svg>
    </div>
  );

  return (
    <>
      <SeoHead
        title="Zap Blaster"
        description={PAGE_DESC}
        path="/project/zap-blaster"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareSourceCode',
          name: 'Zap Blaster',
          description: PAGE_DESC,
          url: absoluteUrl('/project/zap-blaster'),
          codeRepository: GITHUB_URL,
          programmingLanguage: ['Node.js', 'JavaScript', 'RabbitMQ', 'Puppeteer', 'Docker'],
          author: { '@type': 'Person', name: 'Jonathan F. Silva' },
        }}
      />

      {/* O shell do RN Web trava os wrappers em 100vh com overflow:hidden no body —
          aqui o próprio container rola. O paddingTop compensa o NavHeader fixo. */}
      <div style={{
        fontFamily: F.body, background: C.bg, color: C.text1,
        height: '100%', overflowY: 'auto', overflowX: 'hidden', paddingTop: NAV_H,
        WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'],
      }}>

        {/* ══ HERO ══ */}
        <div style={{
          position: 'relative', overflow: 'hidden',
          padding: isMobile ? '40px 22px 52px' : '64px 64px 72px',
          background: 'radial-gradient(130% 90% at 50% -10%,#0d1a14 0%,#0a0b0d 56%)',
          borderBottom: `1px solid ${C.borderSep}`,
        }}>
          <div style={{
            position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)',
            width: 640, height: 380, maxWidth: '170%',
            background: 'radial-gradient(circle,#25d3660d,transparent 70%)', pointerEvents: 'none',
          }} />
          <div style={{ ...inner, position: 'relative' }}>
            <a
              href="/projects"
              className="zb-back"
              onClick={(e) => { e.preventDefault(); router.canGoBack() ? router.back() : router.push('/projects'); }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                fontFamily: F.mono, fontSize: 12, color: C.muted, textDecoration: 'none',
                marginBottom: 28, letterSpacing: '.06em', transition: 'color .18s', cursor: 'pointer',
              }}
            >← Projetos</a>

            <div style={{
              fontFamily: F.mono, fontSize: 12, letterSpacing: '.28em',
              color: C.whatsapp, textTransform: 'uppercase', marginBottom: 12,
            }}>// projeto · automação de mensageria</div>

            <h1 style={{
              margin: '0 0 16px', fontSize: isMobile ? 34 : 52, fontWeight: 700,
              letterSpacing: '-.03em', lineHeight: 1.02,
            }}>Zap Blaster</h1>

            <p style={{
              margin: '0 0 26px', fontSize: 15.5, lineHeight: 1.7, color: C.text2, maxWidth: '62ch',
            }}>
              Bot de WhatsApp que consome mensagens de uma fila RabbitMQ e as envia automaticamente
              via whatsapp-web.js — WhatsApp Web automatizado com Puppeteer/Chromium headless, sessão
              persistida, templates dinâmicos e retry inteligente.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
              {BADGES.map((b) => (
                <span key={b.label} style={{
                  fontFamily: F.mono, fontSize: 11, color: b.color,
                  background: `${b.color}14`, border: `1px solid ${b.color}2e`,
                  padding: '5px 11px', borderRadius: 6,
                }}>{b.label}</span>
              ))}
            </div>

            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener"
              className="zb-gh"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                background: '#e8eaed', color: '#0a0b0d', borderRadius: 11,
                padding: '12px 22px', fontSize: 14, fontWeight: 600, textDecoration: 'none',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.13 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.93.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Ver no GitHub
            </a>
          </div>
        </div>

        {/* ══ FLUXO PRINCIPAL ══ */}
        <div style={section()}>
          <div style={inner}>
            <SectionHead title="Fluxo Principal" note="6 etapas · execução em loop" />

            {isMobile ? (
              /* Mobile: o canvas de 910px vira uma lista vertical simples. */
              <div>
                {NODES.map((n, i) => (
                  <React.Fragment key={n.ns}>
                    <NodeCard node={n} absolute={false} />
                    {i < NODES.length - 1 ? <ArrowDown /> : null}
                  </React.Fragment>
                ))}
                <div style={{
                  marginTop: 18, textAlign: 'center', fontFamily: F.mono,
                  fontSize: 9.5, color: C.dimmer, lineHeight: 1.6,
                }}>consumo contínuo com reconexão automática</div>
              </div>
            ) : (
              <div style={{ overflowX: 'auto', overflowY: 'hidden', paddingBottom: 8 }}>
                <div style={{
                  position: 'relative', width: 910, height: 400, background: C.bgCanvas,
                  border: `1px solid ${C.border}`, borderRadius: 18, overflow: 'hidden',
                }}>
                  <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    backgroundImage: 'radial-gradient(circle,#1a1e2a 1px,transparent 1px)',
                    backgroundSize: '28px 28px', opacity: 0.65,
                  }} />

                  <svg viewBox="0 0 910 400" style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: 400,
                    pointerEvents: 'none', overflow: 'visible',
                  }}>
                    <defs>
                      {PATHS.map((p) => (
                        <filter key={p.glow} id={p.glow} x="-80%" y="-80%" width="260%" height="260%">
                          <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="b" />
                          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                      ))}
                    </defs>

                    {PATHS.map((p) => (
                      <g key={p.id}>
                        <path id={p.id} d={p.d} stroke={p.color} strokeWidth="1.8"
                              strokeDasharray="5 3" fill="none" opacity="0.55" />
                        <polygon points={p.arrow} fill={p.color} opacity="0.85" />
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

                  {NODES.map((n) => <NodeCard key={n.ns} node={n} absolute />)}

                  {/* Labels de aresta como <div> (z-index 3) — como <text> SVG ficariam
                      atrás dos nós. */}
                  {EDGE_LABELS.map((l) => (
                    <div key={l.text} style={{
                      position: 'absolute', left: l.left, top: l.top, zIndex: 3,
                      transform: l.center ? 'translateX(-50%)' : undefined,
                      fontFamily: F.mono, fontSize: 9.5, color: C.text3,
                      background: C.bgCanvas, padding: '2px 6px', borderRadius: 4,
                      whiteSpace: 'nowrap',
                    }}>{l.text}</div>
                  ))}

                  <div style={{
                    position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)',
                    display: 'flex', alignItems: 'center', gap: 10,
                    fontFamily: F.mono, fontSize: 9.5, color: C.dim, whiteSpace: 'nowrap',
                  }}>
                    {NODES.map((n, i) => (
                      <React.Fragment key={n.ns}>
                        <span style={{ color: n.color }}>{n.n}</span>
                        {i < NODES.length - 1 ? <span style={{ color: C.dim }}>→</span> : null}
                      </React.Fragment>
                    ))}
                    <span style={{ color: C.dimmer, marginLeft: 8 }}>· consumo contínuo com reconexão automática</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ══ ARQUITETURA ══ */}
        <div style={section()}>
          <div style={inner}>
            <SectionHead title="Arquitetura" />
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, minmax(0,1fr))',
              gap: 18,
            }}>
              {ARQUITETURA.map((a) => (
                <div key={a.title} className="zb-card" style={{
                  background: C.bgCard, border: `1px solid ${C.border}`,
                  borderTop: `2px solid ${a.color}80`, borderRadius: 16, padding: 24,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                    <span style={{ ...tile(a.color, 40, 11), alignSelf: 'center' }}>
                      {stroke(a.ic, 19, a.color, 2)}
                    </span>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600 }}>{a.title}</div>
                      <div style={{ fontFamily: F.mono, fontSize: 11, color: a.color }}>{a.sub}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {a.items.map((it) => (
                      <div key={it.t} style={{
                        display: 'flex', gap: 10, padding: '10px 12px',
                        background: C.bgItem, borderRadius: 9, border: `1px solid ${C.border}`,
                      }}>
                        <span style={{
                          width: 6, height: 6, borderRadius: '50%', background: a.color,
                          marginTop: 7, flexShrink: 0,
                        }} />
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 13, color: C.text1, fontWeight: 500 }}>{it.t}</div>
                          <div style={{ fontFamily: F.mono, fontSize: 10.5, color: C.text4, lineHeight: 1.5 }}>{it.d}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══ SCRIPTS UTILITÁRIOS ══ */}
        <div style={section(true)}>
          <div style={inner}>
            <SectionHead title="Scripts Utilitários" note="manutenção & operação" />
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0,1fr))',
              gap: 14,
            }}>
              {SCRIPTS.map((s) => (
                <div key={s.file} className="zb-card" style={{
                  display: 'flex', gap: 15, background: C.bgCard,
                  border: `1px solid ${C.border}`, borderRadius: 14, padding: '18px 20px',
                }}>
                  <span style={tile(s.color, 40, 11)}>{stroke(I.term, 19, s.color, 1.9)}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 9, marginBottom: 4, flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: F.mono, fontSize: 13.5, fontWeight: 600, color: s.color }}>{s.file}</span>
                      <span style={{ fontSize: 12.5, color: C.text3 }}>{s.title}</span>
                    </div>
                    <p style={{ margin: '0 0 10px', fontSize: 12.5, lineHeight: 1.55, color: C.text2 }}>{s.desc}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {s.tags.map((t) => (
                        <span key={t} style={{
                          fontFamily: F.mono, fontSize: 9.5, color: C.text4,
                          background: C.bgNode, border: `1px solid ${C.border}`,
                          padding: '3px 8px', borderRadius: 5,
                        }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
