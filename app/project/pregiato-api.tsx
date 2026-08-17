import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { useWindowDimensions } from 'react-native';

import { SeoHead } from '@/components/seo/SeoHead';
import { absoluteUrl } from '@/constants/seo';

// Página de detalhe do projeto Pregiato API. Tokens/CSS inline e DOM real
// (Expo Web / RN Web). Conteúdo estático — animações são CSS/SVG declarativas.

// ─── Design tokens ────────────────────────────────────────────────────────────

const F = {
  body: "'Space Grotesk',system-ui,sans-serif",
  mono: '"JetBrains Mono", "Courier New", monospace',
} as const;

const C = {
  bg: '#0a0b0d',     bgCard: '#0e1014',
  bgItem: '#101216', bgNode: '#141820',
  bgCanvas: '#0c0e13',
  border: '#1c1f26', borderSep: '#161920',
  text1: '#e8eaed',  text2: '#9aa0a8',
  text3: '#8b9099',  text4: '#6b7280',
  muted: '#5b616b',  dim: '#4b5159', dimmer: '#3a3f47',
  violet: '#a78bfa', blue: '#5b8def', rabbit: '#ff9f2e',
  cyan: '#38bdf8',   green: '#34d399', amber: '#f5a623',
  docker: '#3aa4ec',
} as const;

const CSS = `
  @keyframes pa-blink { 0%,100%{opacity:1} 50%{opacity:.25} }
  .pa-node { box-sizing:border-box; transition:transform .25s cubic-bezier(.2,.7,.2,1), border-color .2s; }
  .pa-node:hover { transform:translateY(-4px); }
  .pa-card { transition:transform .25s cubic-bezier(.2,.7,.2,1), border-color .22s; }
  .pa-card:hover { transform:translateY(-3px); border-color:#a78bfa55; }
  .pa-gh { transition:opacity .18s, transform .15s; }
  .pa-gh:hover { transform:scale(1.03); opacity:.92; }
  .pa-back:hover { color:#a78bfa; }
`;

/** Abaixo desta largura o diagrama vira lista vertical e as grades colapsam. */
const MOBILE_BP = 900;
/** Altura do NavHeader fixo do site. */
const NAV_H = 54;

// ─── Ícones ───────────────────────────────────────────────────────────────────

const I = {
  globe:   <><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></>,
  lock:    <><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>,
  layers:  <><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></>,
  db:      <><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></>,
  doc:     <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></>,
  chat:    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
  code:    <><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></>,
} as const;

function stroke(paths: React.ReactNode, size: number, color: string, sw = 1.8) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
         strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{paths}</svg>
  );
}

// ─── Dados ────────────────────────────────────────────────────────────────────

const BADGES = [
  { label: 'ASP.NET Core 8',     color: C.violet },
  { label: 'PostgreSQL · EF Core', color: C.blue },
  { label: 'RabbitMQ',           color: C.rabbit },
  { label: 'PuppeteerSharp',     color: C.cyan },
  { label: 'JWT Bearer',         color: C.green },
  { label: 'Docker Compose',     color: C.docker },
];

type FlowNode = {
  n: string; ns: string; name: string; sub: string; color: string;
  left: number; top: number; width: number; delay: string; ic: React.ReactNode;
};

const NODES: FlowNode[] = [
  { n: '01', ns: 'API.CONTROLLERS',  name: 'REST Endpoint', sub: 'POST /api/Model',        color: C.cyan,   left: 16,  top: 28,  width: 194, delay: '0s',    ic: I.globe },
  { n: '02', ns: 'API.MIDDLEWARE',   name: 'JWT + Claims',  sub: 'Auth · erros globais',   color: C.green,  left: 338, top: 28,  width: 192, delay: '.4s',   ic: I.lock },
  { n: '03', ns: 'API.SERVICES',     name: 'Services',      sub: 'Regra de negócio · DTOs', color: C.violet, left: 660, top: 28,  width: 194, delay: '.8s',   ic: I.layers },
  { n: '04', ns: 'API.REPOSITORY',   name: 'PostgreSQL',    sub: 'EF Core · JSONB',        color: C.blue,   left: 660, top: 272, width: 194, delay: '1.2s',  ic: I.db },
  { n: '05', ns: 'API.HELPERS',      name: 'PDF Contrato',  sub: 'PuppeteerSharp',         color: C.amber,  left: 338, top: 272, width: 192, delay: '1.6s',  ic: I.doc },
  { n: '06', ns: 'API.NOTIFICATION', name: 'RabbitMQ',      sub: 'WhatsApp · e-mail',      color: C.rabbit, left: 16,  top: 272, width: 194, delay: '2s',    ic: I.chat },
];

const PATHS = [
  { id: 'pg1', d: 'M 210,80 L 326,80',   color: C.cyan,   glow: 'pg-cy', arrow: '326,73 338,80 326,87',    dur: '2s',   begins: ['0s', '.67s', '1.33s'] },
  { id: 'pg2', d: 'M 530,80 L 648,80',   color: C.green,  glow: 'pg-gr', arrow: '648,73 660,80 648,87',    dur: '2s',   begins: ['.3s', '.97s', '1.63s'] },
  { id: 'pg3', d: 'M 754,132 L 754,262', color: C.violet, glow: 'pg-vi', arrow: '747,262 754,274 761,262', dur: '2.2s', begins: ['.1s', '.83s', '1.56s'] },
  { id: 'pg4', d: 'M 648,320 L 530,320', color: C.blue,   glow: 'pg-bl', arrow: '530,313 518,320 530,327', dur: '2s',   begins: ['.5s', '1.17s', '1.83s'] },
  { id: 'pg5', d: 'M 326,320 L 210,320', color: C.rabbit, glow: 'pg-or', arrow: '210,313 198,320 210,327', dur: '2s',   begins: ['.2s', '.87s', '1.53s'] },
];

const EDGE_LABELS = [
  { text: 'HTTP request',    left: 274, top: 12,  center: true },
  { text: 'Bearer validado', left: 595, top: 12,  center: true },
  { text: 'Repository',      left: 768, top: 186, center: false },
  { text: 'HTML → PDF',      left: 595, top: 250, center: true },
  { text: 'publish · fila',  left: 274, top: 250, center: true },
];

const ARQUITETURA = [
  {
    color: C.cyan, title: 'Apresentação', sub: 'Controllers · Middlewares', ic: I.code,
    items: [
      { t: 'Endpoints REST',        d: 'User · Model · Job · Notification' },
      { t: 'Middleware customizado', d: 'Erros globais · auth · validação' },
      { t: 'Swagger / Swashbuckle',  d: 'Documentação em /swagger' },
    ],
  },
  {
    color: C.violet, title: 'Domínio', sub: 'Services · DTOs · Helpers', ic: I.layers,
    items: [
      { t: 'DTO + AutoMapper',        d: 'Domínio isolado dos contratos' },
      { t: 'Helpers de integração',   d: 'JWT · MailKit · PDF · WhatsApp' },
      { t: 'Injeção de dependência',  d: 'IServiceCollection · scoped' },
    ],
  },
  {
    color: C.blue, title: 'Persistência', sub: 'Repositories · Migrations', ic: I.db,
    items: [
      { t: 'Repository Pattern',   d: 'Acesso a dados via interfaces' },
      { t: 'EF Core + Migrations', d: 'PostgreSQL · JSONB dinâmico' },
      { t: 'Serilog estruturado',  d: 'Logs com contexto por request' },
    ],
  },
];

/** Glifos Unicode no tile, conforme o handoff — mono 15px peso 700 na cor do acento. */
const FEATURES = [
  { color: C.green,  glyph: '⚿', title: 'Autenticação JWT',
    desc: 'Cadastro e login com Bearer Token, autorização segmentada por claims e tipo de usuário.' },
  { color: C.violet, glyph: '◫', title: 'CRUD de modelos',
    desc: 'Gestão completa de talentos com campos dinâmicos armazenados em JSONB no PostgreSQL.' },
  { color: C.cyan,   glyph: '▤', title: 'Jobs e agendamentos',
    desc: 'Visualizações de portfólio, propostas e agendamento de trabalhos entre modelos e clientes.' },
  { color: C.amber,  glyph: '⎙', title: 'Contratos em PDF',
    desc: 'Geração dinâmica de contratos a partir de templates HTML via PuppeteerSharp headless.' },
  { color: C.rabbit, glyph: '✉', title: 'Notificações',
    desc: 'Disparo de WhatsApp pela fila RabbitMQ e e-mails transacionais com MailKit + templates HTML.' },
  { color: C.blue,   glyph: '⬆', title: 'Upload de arquivos',
    desc: 'Envio e armazenamento de fotos de portfólio e documentos contratuais.' },
];

const ENDPOINTS = [
  { verb: 'POST', path: '/api/User/register',     desc: 'Registro de usuário' },
  { verb: 'POST', path: '/api/User/login',        desc: 'Login com emissão de JWT' },
  { verb: 'POST', path: '/api/Model',             desc: 'Cadastro de modelo' },
  { verb: 'GET',  path: '/api/Job',               desc: 'Listar jobs disponíveis' },
  { verb: 'POST', path: '/api/Notification/send', desc: 'Enviar WhatsApp via RabbitMQ' },
];

const VERB_COLOR: Record<string, string> = {
  GET: C.green, POST: C.cyan, PUT: C.amber, DELETE: '#ef6b6b',
};

const GITHUB_URL = 'https://github.com/jntcloudcod2019/Projeto_Pregiato_API';
const PAGE_DESC =
  'API corporativa em ASP.NET Core 8 para agência de modelos: cadastro de talentos, agendamento de jobs, contratos em PDF via PuppeteerSharp, autenticação JWT e notificações por RabbitMQ.';

// ─── Página ───────────────────────────────────────────────────────────────────

export default function PregiatoApiPage() {
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
  const NodeCard = ({ node, absolute }: { node: FlowNode; absolute: boolean }) => (
    <div className="pa-node" style={{
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
          animation: `pa-blink 2s ${node.delay} infinite`,
        }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ ...tile(node.color, 44, 10), background: `${node.color}18`, alignSelf: 'center' }}>
          {stroke(node.ic, 22, node.color)}
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
        title="Pregiato API"
        description={PAGE_DESC}
        path="/project/pregiato-api"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareSourceCode',
          name: 'Pregiato API',
          description: PAGE_DESC,
          url: absoluteUrl('/project/pregiato-api'),
          codeRepository: GITHUB_URL,
          programmingLanguage: ['C#', 'ASP.NET Core 8', 'PostgreSQL', 'Entity Framework Core', 'RabbitMQ', 'Docker'],
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
          background: 'radial-gradient(130% 90% at 50% -10%,#150f22 0%,#0a0b0d 56%)',
          borderBottom: `1px solid ${C.borderSep}`,
        }}>
          <div style={{
            position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)',
            width: 640, height: 380, maxWidth: '170%',
            background: 'radial-gradient(circle,#a78bfa0d,transparent 70%)', pointerEvents: 'none',
          }} />
          <div style={{ ...inner, position: 'relative' }}>
            <a
              href="/projects"
              className="pa-back"
              onClick={(e) => { e.preventDefault(); router.canGoBack() ? router.back() : router.push('/projects'); }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                fontFamily: F.mono, fontSize: 12, color: C.muted, textDecoration: 'none',
                marginBottom: 28, letterSpacing: '.06em', transition: 'color .18s', cursor: 'pointer',
              }}
            >← Projetos</a>

            <div style={{
              fontFamily: F.mono, fontSize: 12, letterSpacing: '.28em',
              color: C.violet, textTransform: 'uppercase', marginBottom: 12,
            }}>// projeto · api corporativa</div>

            <h1 style={{
              margin: '0 0 16px', fontSize: isMobile ? 34 : 52, fontWeight: 700,
              letterSpacing: '-.03em', lineHeight: 1.02,
            }}>Pregiato API</h1>

            <p style={{
              margin: '0 0 26px', fontSize: 15.5, lineHeight: 1.7, color: C.text2, maxWidth: '64ch',
            }}>
              Cérebro operacional de uma agência de modelos digital. Centraliza cadastro de talentos,
              agendamento de jobs, geração de contratos em PDF, autenticação JWT e notificações via
              WhatsApp e e-mail — orquestrado com RabbitMQ sobre arquitetura limpa em camadas.
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
              className="pa-gh"
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
            <SectionHead title="Fluxo Principal" note="6 etapas · request → notificação" />

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
                }}>pipeline síncrono + notificação assíncrona</div>
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
                    <span style={{ color: C.dimmer, marginLeft: 8 }}>· pipeline síncrono + notificação assíncrona</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ══ ARQUITETURA ══ */}
        <div style={section()}>
          <div style={inner}>
            <SectionHead title="Arquitetura" note="camadas · clean architecture" />
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, minmax(0,1fr))',
              gap: 18,
            }}>
              {ARQUITETURA.map((a) => (
                <div key={a.title} className="pa-card" style={{
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

        {/* ══ FUNCIONALIDADES ══ */}
        <div style={section()}>
          <div style={inner}>
            <SectionHead title="Funcionalidades" />
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0,1fr))',
              gap: 14,
            }}>
              {FEATURES.map((f) => (
                <div key={f.title} className="pa-card" style={{
                  display: 'flex', gap: 15, background: C.bgCard,
                  border: `1px solid ${C.border}`, borderRadius: 14, padding: '18px 20px',
                }}>
                  <span style={{
                    ...tile(f.color, 40, 11),
                    fontFamily: F.mono, fontSize: 15, fontWeight: 700, color: f.color,
                  }}>{f.glyph}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14.5, fontWeight: 600, color: C.text1, marginBottom: 4 }}>{f.title}</div>
                    <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.55, color: C.text2 }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══ ENDPOINTS ══ */}
        <div style={section(true)}>
          <div style={inner}>
            <SectionHead title="Endpoints" note="localhost:5000/api" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {ENDPOINTS.map((e) => {
                const vc = VERB_COLOR[e.verb] ?? C.muted;
                return (
                  <div key={`${e.verb}-${e.path}`} className="pa-card" style={{
                    display: 'flex', alignItems: 'center', gap: 16,
                    background: C.bgCard, border: `1px solid ${C.border}`,
                    borderRadius: 11, padding: '14px 18px', flexWrap: 'wrap',
                  }}>
                    <span style={{
                      fontFamily: F.mono, fontSize: 10.5, fontWeight: 700, letterSpacing: '.08em',
                      color: vc, background: `${vc}14`, border: `1px solid ${vc}2e`,
                      padding: '4px 10px', borderRadius: 5, flexShrink: 0,
                      minWidth: 52, textAlign: 'center',
                    }}>{e.verb}</span>
                    <span style={{ fontFamily: F.mono, fontSize: 13, color: C.text1, flexShrink: 0 }}>{e.path}</span>
                    <span style={{ flex: 1, minWidth: 12 }} />
                    <span style={{ fontSize: 12.5, color: C.text3, textAlign: isMobile ? 'left' : 'right' }}>{e.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
