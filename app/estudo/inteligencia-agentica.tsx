import { useRouter } from 'expo-router';
import Head from 'expo-router/head';
import React, { useEffect } from 'react';

// Página de artigo técnico long-form. Implementada conforme o handoff de design:
// tokens C/F, CSS inline e DOM real (Expo Web / React Native Web).
// Sem bibliotecas de UI externas.

// ─── Design tokens ────────────────────────────────────────────────────────────

const F = { body: 'Space Grotesk', mono: 'JetBrains Mono' } as const;

const C = {
  bg:        '#0a0b0d',
  bgCard:    '#0e1014',
  bgFigure:  '#0c0e13',
  bgNode:    '#141820',
  bgItem:    '#101216',
  border:    '#1c1f26',
  borderSep: '#161920',
  arrow:     '#2b2f37',
  text1:     '#e8eaed',
  text2:     '#b7bcc4',
  text3:     '#9aa0a8',
  text4:     '#6b7280',
  muted:     '#5b616b',
  dim:       '#4b5159',
  cyan:      '#38bdf8',
  purple:    '#a78bfa',
  green:     '#34d399',
  amber:     '#f5a623',
  orange:    '#ff9f2e',
  blue:      '#5b8def',
  pink:      '#fb7185',
} as const;

const CSS = `
  @keyframes ia-blink { 0%,100%{opacity:1} 50%{opacity:.25} }
  .ia-toc  { transition:background .16s,border-color .16s,color .16s; }
  .ia-toc:hover  { background:#12161c; border-color:#38bdf855; color:#38bdf8; }
  .ia-node { transition:transform .25s cubic-bezier(.2,.7,.2,1); }
  .ia-node:hover { transform:translateY(-3px); }
  .ia-back:hover { color:#38bdf8; }
  .ia-ref  { transition:background .18s; }
  .ia-ref:hover { background:#101216; }
  .ia-ref:hover svg { color:#38bdf8; }
  @media (max-width: 720px) {
    .ia-pad  { padding-left:24px !important; padding-right:24px !important; }
    .ia-toc-grid { grid-template-columns:1fr !important; }
    .ia-h1   { font-size:32px !important; }
    .ia-cols { grid-template-columns:1fr !important; }
    .ia-cols-4 { grid-template-columns:repeat(2,1fr) !important; }
  }
`;

// ─── Reusable style fragments ─────────────────────────────────────────────────

const para: React.CSSProperties = {
  margin: '0 0 18px',
  fontSize: 16,
  lineHeight: 1.75,
  color: C.text2,
  maxWidth: '68ch',
  textWrap: 'pretty' as React.CSSProperties['textWrap'],
};
const paraLast: React.CSSProperties = { ...para, margin: 0 };
const paraBeforeFigure: React.CSSProperties = { ...para, margin: '0 0 28px' };

const figure: React.CSSProperties = {
  background: C.bgFigure,
  border: `1px solid ${C.border}`,
  borderRadius: 16,
  padding: 26,
  marginBottom: 22,
};
const figureLabel: React.CSSProperties = {
  fontFamily: F.mono,
  fontSize: 9.5,
  letterSpacing: '.18em',
  textTransform: 'uppercase',
  color: C.muted,
  marginBottom: 20,
};

const strong: React.CSSProperties = { color: C.text1, fontWeight: 600 };
const em = (color: string): React.CSSProperties => ({
  color,
  fontStyle: 'normal',
  fontWeight: 500,
});

function nodeStyle(color: string): React.CSSProperties {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    background: C.bgNode,
    border: `1px solid ${color}44`,
    borderLeft: `3px solid ${color}`,
    borderRadius: 11,
    padding: '15px 18px',
  };
}

// ─── Small building blocks ────────────────────────────────────────────────────

function SectionHeading({ n, accent, children }: { n: string; accent: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 20 }}>
      <span style={{ fontFamily: F.mono, fontSize: 34, fontWeight: 700, color: accent, opacity: 0.32, lineHeight: 1 }}>
        {n}
      </span>
      <h2 style={{ margin: 0, fontSize: 27, fontWeight: 700, letterSpacing: '-.022em', lineHeight: 1.25 }}>
        {children}
      </h2>
    </div>
  );
}

function ArrowDown() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
      <svg width="14" height="18" viewBox="0 0 14 18" fill="none" stroke={C.arrow}
           strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 1v13" /><path d="M2 10l5 5 5-5" />
      </svg>
    </div>
  );
}

function Dot({ color, delay }: { color: string; delay: string }) {
  return (
    <span style={{
      width: 7, height: 7, borderRadius: '50%', background: color, flexShrink: 0,
      animation: `ia-blink 2s ${delay} infinite`,
    }} />
  );
}

function ExternalIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17L17 7" /><path d="M7 7h10v10" />
    </svg>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const TOC = [
  { n: '01', label: 'Fundamentos de AIOps',      color: C.cyan,   href: '#s1' },
  { n: '02', label: 'Sistemas multi-agentes',    color: C.purple, href: '#s2' },
  { n: '03', label: 'Kubernetes autônomo',       color: C.green,  href: '#s3' },
  { n: '04', label: 'GraphRAG',                  color: C.amber,  href: '#s4' },
  { n: '05', label: 'Event-driven e multimodal', color: C.orange, href: '#s5' },
  { n: '06', label: 'Conclusão',                 color: C.blue,   href: '#s6' },
];

const AGENTES = [
  { ns: 'AGENT.OBSERVE', titulo: 'Observabilidade', sub: 'métricas · traces',   color: C.cyan },
  { ns: 'AGENT.SECURE',  titulo: 'Segurança',       sub: 'políticas · CVEs',    color: C.amber },
  { ns: 'AGENT.REMEDY',  titulo: 'Remediação',      sub: 'runbooks · rollback', color: C.green },
];

const CICLO = [
  { n: '01', titulo: 'Observar',     sub: 'telemetria contínua', color: C.cyan },
  { n: '02', titulo: 'Detectar',     sub: 'anomalias',           color: C.purple },
  { n: '03', titulo: 'Diagnosticar', sub: 'causa raiz',          color: C.amber },
  { n: '04', titulo: 'Remediar',     sub: 'Operators',           color: C.green },
];

const DESTAQUES = [
  {
    color: C.cyan,
    titulo: 'Escalonamento preditivo',
    texto: 'Modelos de séries temporais (ARIMA, LSTM) preveem aumentos de carga antes que ocorram, evitando degradação de performance.',
    paths: <><path d="M3 17l6-6 4 4 8-8" /><path d="M21 7v6h-6" /></>,
  },
  {
    color: C.green,
    titulo: 'Self-healing',
    texto: 'Execução controlada de reinício de pods, drenagem de nós ou rollback de versões instáveis via Kubernetes Operators.',
    paths: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />,
  },
  {
    color: C.amber,
    titulo: 'Gestão de toil',
    texto: 'Eliminação de trabalho manual repetitivo, permitindo que a infraestrutura se auto-otimize continuamente.',
    paths: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6h.09A1.65 1.65 0 0 0 10.6 3.09V3a2 2 0 1 1 4 0v.09A1.65 1.65 0 0 0 16.11 4.6" /></>,
  },
];

const GRAFO_NOS = [
  { pos: { left: 0,   top: 74  as number, width: 150 }, label: 'DATABASE', nome: 'postgres-main',  color: C.blue },
  { pos: { left: 296, top: 34  as number, width: 130 }, label: 'SERVICE',  nome: 'svc-orders',     color: C.cyan },
  { pos: { left: 296, top: 114 as number, width: 130 }, label: 'SERVICE',  nome: 'svc-billing',    color: C.cyan },
  { pos: { right: 0,  top: 74  as number, width: 150 }, label: 'IMPACTO',  nome: 'checkout lento', color: C.pink },
];

const CHAIN = [
  { n: '01', passo: 'Identificação de sintomas',       tag: 'métricas',  color: C.orange, forte: false },
  { n: '02', passo: 'Análise de impacto',              tag: 'logs',      color: C.amber,  forte: false },
  { n: '03', passo: 'Busca por correlações temporais', tag: 'traces',    color: C.purple, forte: false },
  { n: '04', passo: 'Conclusão da causa raiz',         tag: 'auditável', color: C.green,  forte: true  },
];

const REFERENCIAS = [
  { n: '01', titulo: 'AIOps: Inteligência Artificial e Eficiência nas Operações de TI',
    fonte: 'Curso DevOps · Iago Ferreira TI',
    url: 'https://cursodevops.com.br/aiops-inteligencia-artificial-e-eficiencia-nas-operacoes-de-ti/' },
  { n: '02', titulo: 'Build multi-agent systems with LangGraph and Amazon Bedrock',
    fonte: 'AWS Machine Learning Blog',
    url: 'https://aws.amazon.com/blogs/machine-learning/build-multi-agent-systems-with-langgraph-and-amazon-bedrock/' },
  { n: '03', titulo: 'Building AI Agents for Autonomous Clouds: Challenges and Design Principles',
    fonte: 'arXiv · Microsoft Research · DOI 10.48550/ARXIV.2401.13810',
    url: 'https://arxiv.org/abs/2401.13810' },
  { n: '04', titulo: 'Essential GraphRAG', sufixo: '(livro)',
    fonte: 'Manning · Tomaž Bratanič e Oskar Hane',
    url: 'https://www.manning.com/books/essential-graphrag' },
  { n: '05', titulo: 'kg-rag', sufixo: '— repositório de código',
    fonte: 'GitHub · tomasonjo',
    url: 'https://github.com/tomasonjo/kg-rag' },
  { n: '06', titulo: 'Event-Driven AI Agents: Patterns That Scale',
    fonte: 'DEV Community · The Daily Agent',
    url: 'https://dev.to/thedailyagent/event-driven-ai-agents-patterns-that-scale-39ld' },
];

const PAGE_TITLE = 'Inteligência Autônoma em Ecossistemas de Multiagentes e Kubernetes | Jonathan F. Silva';
const PAGE_DESC =
  'Estudo técnico sobre AIOps, sistemas multi-agentes, Kubernetes autônomo e GraphRAG aplicados à operação de infraestrutura.';

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ArtigoInteligenciaAgentica() {
  const router = useRouter();

  useEffect(() => {
    const el = document.createElement('style');
    el.textContent = CSS;
    document.head.appendChild(el);
    return () => { document.head.removeChild(el); };
  }, []);

  const onAnchor = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <Head>
        <title>{PAGE_TITLE}</title>
        <meta name="description" content={PAGE_DESC} />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={PAGE_DESC} />
      </Head>

      {/* O shell do app (RN Web) trava os wrappers em 100vh com `overflow:hidden`
          no body — as demais rotas rolam via <ScrollView>. Aqui o próprio
          container do artigo é o elemento rolável. */}
      <div style={{
        fontFamily: `'${F.body}',system-ui,sans-serif`,
        background: C.bg,
        color: C.text1,
        height: '100%',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'],
      }}>

        {/* ── Hero ── */}
        <div className="ia-pad" style={{
          position: 'relative', overflow: 'hidden', padding: '64px 56px 52px',
          background: 'radial-gradient(130% 90% at 50% -10%, #0d1320 0%, #0a0b0d 56%)',
          borderBottom: `1px solid ${C.borderSep}`,
        }}>
          <div style={{
            position: 'absolute', top: -90, left: '50%', transform: 'translateX(-50%)',
            width: 680, height: 400,
            background: 'radial-gradient(circle,#38bdf80d,transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{ maxWidth: 880, margin: '0 auto', position: 'relative' }}>
            <a
              href="/"
              className="ia-back"
              onClick={(e) => { e.preventDefault(); router.back(); }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                fontFamily: F.mono, fontSize: 12, color: C.muted,
                textDecoration: 'none', letterSpacing: '.06em', marginBottom: 30,
                transition: 'color .18s', cursor: 'pointer',
              }}
            >
              ← Estudos e Artigos
            </a>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
              <span style={{
                fontFamily: F.mono, fontSize: 10.5, fontWeight: 700, letterSpacing: '.14em',
                textTransform: 'uppercase', color: C.purple,
                background: '#a78bfa16', border: '1px solid #a78bfa2e',
                padding: '4px 10px', borderRadius: 6,
              }}>Estudo técnico</span>
              <span style={{ fontFamily: F.mono, fontSize: 11, color: C.muted }}>AIOps · Agentic AI · SRE</span>
            </div>

            <h1 className="ia-h1" style={{
              margin: '0 0 18px', fontSize: 44, fontWeight: 700,
              letterSpacing: '-.032em', lineHeight: 1.1,
              textWrap: 'pretty' as React.CSSProperties['textWrap'],
            }}>
              Inteligência Autônoma em Ecossistemas de{' '}
              <span style={{ color: C.cyan }}>Multiagentes e Kubernetes</span>
            </h1>

            <p style={{
              margin: '0 0 28px', fontSize: 16.5, lineHeight: 1.72, color: C.text3,
              maxWidth: '66ch', textWrap: 'pretty' as React.CSSProperties['textWrap'],
            }}>
              As operações de TI modernas atingiram um nível de complexidade que supera a capacidade humana de
              triagem e gestão manual. Com a ascensão das arquiteturas de microsserviços e nuvens distribuídas,
              engenheiros enfrentam o paradoxo da visibilidade: quanto mais ferramentas de monitoramento são
              instaladas, mais ruído e “tempestades de alertas” são gerados. Neste cenário, o AIOps deixa de ser
              uma tendência para se tornar uma necessidade estrutural, evoluindo de simples automações para
              sistemas agênticos e autônomos.
            </p>

            <div style={{
              display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
              fontFamily: F.mono, fontSize: 11, color: C.muted, letterSpacing: '.04em',
            }}>
              <span>12 min de leitura</span>
              <span style={{ color: C.arrow }}>·</span>
              <span>Agosto 2026</span>
              <span style={{ color: C.arrow }}>·</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                <Dot color={C.green} delay="0s" />
                5 seções + conclusão
              </span>
            </div>
          </div>
        </div>

        {/* ── Corpo ── */}
        <div className="ia-pad" style={{ maxWidth: 880, margin: '0 auto', padding: '52px 56px 120px' }}>

          {/* Índice */}
          <div style={{
            background: C.bgCard, border: `1px solid ${C.border}`,
            borderRadius: 16, padding: '22px 24px', marginBottom: 68,
          }}>
            <div style={{
              fontFamily: F.mono, fontSize: 10.5, letterSpacing: '.22em',
              textTransform: 'uppercase', color: C.muted, marginBottom: 16,
            }}>Índice</div>
            <div className="ia-toc-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              {TOC.map((it) => (
                <a
                  key={it.n}
                  href={it.href}
                  className="ia-toc"
                  onClick={(e) => onAnchor(e, it.href)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 11,
                    background: C.bgItem, border: `1px solid ${C.border}`,
                    borderRadius: 9, padding: '11px 14px',
                    textDecoration: 'none', color: '#cdd1d7', fontSize: 13.5, cursor: 'pointer',
                  }}
                >
                  <span style={{ fontFamily: F.mono, fontSize: 11, fontWeight: 700, color: it.color }}>{it.n}</span>
                  {it.label}
                </a>
              ))}
            </div>
          </div>

          {/* ══ 01 ══ */}
          <div id="s1" style={{ marginBottom: 76 }}>
            <SectionHeading n="01" accent={C.cyan}>Fundamentos de AIOps e a camada de inteligência</SectionHeading>

            <p style={para}>
              O AIOps é a aplicação de Machine Learning e análise de Big Data sobre dados de telemetria para
              automatizar a detecção de anomalias e acelerar o diagnóstico. Diferente da observabilidade
              tradicional, que foca em <em style={em(C.text1)}>“o que está acontecendo”</em>, o AIOps busca
              responder <em style={em(C.cyan)}>“qual a causa raiz”</em> e <em style={em(C.cyan)}>“qual a melhor ação”</em>.
            </p>
            <p style={paraBeforeFigure}>Uma arquitetura técnica robusta de AIOps se divide em três camadas.</p>

            <div style={figure}>
              <div style={figureLabel}>Fig. 01 — Arquitetura em três camadas</div>

              <div className="ia-node" style={nodeStyle(C.cyan)}>
                <span style={{ fontFamily: F.mono, fontSize: 11, fontWeight: 700, color: C.cyan, minWidth: 22 }}>01</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 600, marginBottom: 3 }}>Ingestão &amp; normalização</div>
                  <div style={{ fontFamily: F.mono, fontSize: 10.5, color: C.text4 }}>OpenTelemetry · logs · métricas · traces</div>
                </div>
                <Dot color={C.cyan} delay="0s" />
              </div>

              <ArrowDown />

              <div className="ia-node" style={nodeStyle(C.purple)}>
                <span style={{ fontFamily: F.mono, fontSize: 11, fontWeight: 700, color: C.purple, minWidth: 22 }}>02</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 600, marginBottom: 3 }}>Análise &amp; detecção</div>
                  <div style={{ fontFamily: F.mono, fontSize: 10.5, color: C.text4 }}>Padrões probabilísticos de causa raiz · limites dinâmicos</div>
                </div>
                <Dot color={C.purple} delay=".5s" />
              </div>

              <ArrowDown />

              <div className="ia-node" style={nodeStyle(C.green)}>
                <span style={{ fontFamily: F.mono, fontSize: 11, fontWeight: 700, color: C.green, minWidth: 22 }}>03</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 600, marginBottom: 3 }}>Ação &amp; automação</div>
                  <div style={{ fontFamily: F.mono, fontSize: 10.5, color: C.text4 }}>Execução de runbooks de remediação</div>
                </div>
                <Dot color={C.green} delay="1s" />
              </div>
            </div>

            <div style={{
              display: 'flex', gap: 14, background: C.bgCard,
              border: '1px solid #34d39933', borderLeft: `3px solid ${C.green}`,
              borderRadius: 12, padding: '18px 20px', marginBottom: 22,
            }}>
              <div style={{ fontSize: 30, fontWeight: 700, color: C.green, letterSpacing: '-.03em', lineHeight: 1, flexShrink: 0 }}>95%</div>
              <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.65, color: C.text2 }}>
                de redução no ruído de alertas — permitindo que times de SRE foquem em resiliência em vez de
                tarefas repetitivas.
              </p>
            </div>

            <p style={paraLast}>
              Casos de uso práticos incluem a detecção de anomalias com limites dinâmicos e a análise de causa
              raiz (RCA) automatizada, que correlaciona falhas em toda a stack tecnológica.
            </p>
          </div>

          {/* ══ 02 ══ */}
          <div id="s2" style={{ marginBottom: 76 }}>
            <SectionHeading n="02" accent={C.purple}>Arquiteturas agênticas e sistemas multi-agentes</SectionHeading>

            <p style={para}>
              A evolução do AIOps passa pela transição de copilotos para{' '}
              <strong style={strong}>Sistemas Multi-Agentes (MAS)</strong>. Enquanto um único agente pode ter
              dificuldades com tarefas complexas, uma arquitetura multi-agente decompõe o sistema em agentes
              especializados coordenados por um agente supervisor.
            </p>
            <p style={paraBeforeFigure}>
              Ferramentas como o <strong style={strong}>LangGraph</strong> permitem orquestrar esses fluxos
              através de grafos de estados, mantendo o contexto e permitindo intervenção humana (
              <em style={{ fontStyle: 'normal', color: C.purple }}>human-in-the-loop</em>) em etapas críticas.
            </p>

            <div style={{ ...figure, marginBottom: 24 }}>
              <div style={{ ...figureLabel, marginBottom: 22 }}>Fig. 02 — Equipe SRE virtual coordenada por supervisor</div>

              <div className="ia-node" style={{
                maxWidth: 280, margin: '0 auto 4px', display: 'flex', alignItems: 'center', gap: 14,
                background: C.bgNode, border: '1px solid #a78bfa55', borderRadius: 12, padding: '14px 18px',
              }}>
                <span style={{
                  width: 36, height: 36, borderRadius: 9, background: '#a78bfa18',
                  border: '1px solid #a78bfa33', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: C.purple, flexShrink: 0,
                }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a3 3 0 0 1 3 3v1h1a3 3 0 0 1 0 6h-1v1a3 3 0 0 1-6 0v-1H8a3 3 0 0 1 0-6h1V5a3 3 0 0 1 3-3z" />
                    <path d="M12 16v6" />
                  </svg>
                </span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>Agente supervisor</div>
                  <div style={{ fontFamily: F.mono, fontSize: 10, color: C.text4, marginTop: 2 }}>LangGraph · grafo de estados</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0 12px' }}>
                <svg width="100%" height="26" viewBox="0 0 760 26" preserveAspectRatio="none"
                     fill="none" stroke={C.arrow} strokeWidth="1.5" strokeLinecap="round">
                  <path d="M380 0v8M380 8H152v18M380 8h228v18M380 8v18" />
                </svg>
              </div>

              <div className="ia-cols" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {AGENTES.map((a) => (
                  <div key={a.ns} className="ia-node" style={{
                    background: C.bgNode, border: `1px solid ${a.color}44`,
                    borderTop: `2px solid ${a.color}`, borderRadius: 11, padding: 14,
                  }}>
                    <div style={{
                      fontFamily: F.mono, fontSize: 9, letterSpacing: '.1em', textTransform: 'uppercase',
                      color: a.color, opacity: 0.8, marginBottom: 8,
                    }}>{a.ns}</div>
                    <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 3 }}>{a.titulo}</div>
                    <div style={{ fontFamily: F.mono, fontSize: 10, color: C.text4 }}>{a.sub}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 16, textAlign: 'center', fontFamily: F.mono, fontSize: 10, color: C.dim }}>
                MCP · <span style={{ color: C.text4 }}>acesso seguro a APIs sem expor credenciais</span>
              </div>
            </div>

            <p style={paraLast}>
              Para que esses agentes colaborem de forma segura, protocolos como o{' '}
              <strong style={strong}>Model Context Protocol (MCP)</strong> surgem como padrão universal,
              permitindo que os modelos acessem APIs de infraestrutura e compartilhem contexto sem expor
              credenciais sensíveis.
            </p>
          </div>

          {/* ══ 03 ══ */}
          <div id="s3" style={{ marginBottom: 76 }}>
            <SectionHeading n="03" accent={C.green}>Kubernetes autônomo e gestão de nuvem</SectionHeading>

            <p style={paraBeforeFigure}>
              O objetivo final da inteligência agêntica nas operações é a{' '}
              <strong style={strong}>Nuvem Autônoma</strong>. No ecossistema Kubernetes, isso significa ir além
              das capacidades nativas de automação — frequentemente reativas e baseadas em limites estáticos.
              Um framework de Kubernetes Autônomo utiliza ciclos fechados de observação-ação.
            </p>

            <div style={{ ...figure, padding: '30px 26px', marginBottom: 24 }}>
              <div style={{ ...figureLabel, marginBottom: 24 }}>Fig. 03 — Ciclo fechado observação → ação</div>

              <div className="ia-cols-4" style={{
                display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, alignItems: 'stretch',
              }}>
                {CICLO.map((c) => (
                  <div key={c.n} className="ia-node" style={{
                    background: C.bgNode, border: `1px solid ${c.color}44`,
                    borderLeft: `3px solid ${c.color}`, borderRadius: 11, padding: 14,
                  }}>
                    <div style={{ fontFamily: F.mono, fontSize: 9, color: c.color, marginBottom: 8 }}>{c.n}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>{c.titulo}</div>
                    <div style={{ fontFamily: F.mono, fontSize: 9.5, color: C.text4, lineHeight: 1.5 }}>{c.sub}</div>
                  </div>
                ))}
              </div>

              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 18,
                fontFamily: F.mono, fontSize: 9.5, color: C.dim,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.green}
                     strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 4v6h-6" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                </svg>
                ciclo contínuo · sem intervenção manual
              </div>
            </div>

            <div className="ia-cols" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
              {DESTAQUES.map((d) => (
                <div key={d.titulo} style={{
                  background: C.bgCard, border: `1px solid ${C.border}`,
                  borderTop: `2px solid ${d.color}80`, borderRadius: 14, padding: 20,
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 9, background: `${d.color}14`,
                    border: `1px solid ${d.color}33`, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', color: d.color, marginBottom: 14,
                  }}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {d.paths}
                    </svg>
                  </div>
                  <div style={{ fontSize: 14.5, fontWeight: 600, marginBottom: 7 }}>{d.titulo}</div>
                  <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: C.text3 }}>{d.texto}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ══ 04 ══ */}
          <div id="s4" style={{ marginBottom: 76 }}>
            <SectionHeading n="04" accent={C.amber}>GraphRAG: precisão com grafos de conhecimento</SectionHeading>

            <p style={para}>
              Um dos maiores desafios no uso de LLMs em operações de TI são as alucinações e a falta de contexto
              específico da empresa. O <strong style={strong}>RAG</strong> resolve isso fornecendo dados externos
              confiáveis ao modelo — mas o RAG tradicional foca em dados não estruturados.
            </p>
            <p style={paraBeforeFigure}>
              O padrão <strong style={{ color: C.amber, fontWeight: 600 }}>GraphRAG</strong> utiliza Grafos de
              Conhecimento para estruturar entidades e seus relacionamentos — dependências entre serviços,
              histórico de incidentes — garantindo respostas mais precisas e rastreáveis.
            </p>

            <div style={{ ...figure, marginBottom: 24 }}>
              <div style={figureLabel}>Fig. 04 — Topologia de dependências reconhecida pelo grafo</div>

              <div style={{ position: 'relative', height: 200, minWidth: 560 }}>
                <svg width="100%" height="200" viewBox="0 0 760 200" fill="none"
                     preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
                  <path d="M150 100 L300 60"  stroke={C.amber} strokeWidth="1.6" strokeDasharray="4 3" opacity=".5" />
                  <path d="M150 100 L300 140" stroke={C.amber} strokeWidth="1.6" strokeDasharray="4 3" opacity=".5" />
                  <path d="M420 60 L570 100"  stroke={C.pink}  strokeWidth="1.6" strokeDasharray="4 3" opacity=".5" />
                  <path d="M420 140 L570 100" stroke={C.pink}  strokeWidth="1.6" strokeDasharray="4 3" opacity=".5" />
                </svg>

                {GRAFO_NOS.map((no) => (
                  <div key={no.nome} className="ia-node" style={{
                    position: 'absolute', ...no.pos,
                    background: C.bgNode, border: `1px solid ${no.color}55`,
                    borderLeft: `3px solid ${no.color}`, borderRadius: 10, padding: '11px 13px',
                  }}>
                    <div style={{
                      fontFamily: F.mono, fontSize: 8.5, letterSpacing: '.1em', color: no.color,
                      textTransform: 'uppercase', marginBottom: 5,
                    }}>{no.label}</div>
                    <div style={{ fontSize: 12.5, fontWeight: 600 }}>{no.nome}</div>
                  </div>
                ))}
              </div>

              <div style={{ textAlign: 'center', fontFamily: F.mono, fontSize: 10, color: C.dim, marginTop: 8 }}>
                falha na origem → propagação rastreável até o sintoma observado
              </div>
            </div>

            <p style={paraLast}>
              Ao integrar grafos de conhecimento, o sistema entende a topologia da aplicação — reconhecendo que
              uma falha em um banco de dados específico causará lentidão em microsserviços dependentes. Isso
              permite que os agentes realizem consultas complexas envolvendo filtragem, contagem e agregação de
              dados operacionais.
            </p>
          </div>

          {/* ══ 05 ══ */}
          <div id="s5" style={{ marginBottom: 76 }}>
            <SectionHeading n="05" accent={C.orange}>Event-driven e análise multimodal</SectionHeading>

            <p style={para}>
              Para reduzir a latência na resposta a incidentes, as arquiteturas orientadas a eventos são
              fundamentais, permitindo que os agentes reajam em milissegundos assim que um limite de
              monitoramento é atingido.
            </p>
            <p style={paraBeforeFigure}>
              A análise agêntica moderna é <strong style={strong}>multimodal</strong>, fundindo métricas, logs e
              traces distribuídos para gerar hipóteses explicáveis de causa raiz.
            </p>

            <div style={{ ...figure, marginBottom: 24 }}>
              <div style={figureLabel}>Fig. 05 — Chain-of-thought na decomposição do incidente</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {CHAIN.map((c) => (
                  <div key={c.n} className="ia-node" style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    background: C.bgNode, border: `1px solid ${c.color}44`,
                    borderLeft: `3px solid ${c.color}`, borderRadius: 10, padding: '13px 16px',
                  }}>
                    <span style={{ fontFamily: F.mono, fontSize: 10, fontWeight: 700, color: c.color, minWidth: 20 }}>{c.n}</span>
                    <span style={{
                      fontSize: 13.5, flex: 1,
                      fontWeight: c.forte ? 600 : 500,
                      color: c.forte ? C.text1 : undefined,
                    }}>{c.passo}</span>
                    <span style={{ fontFamily: F.mono, fontSize: 10, color: c.forte ? C.green : C.text4 }}>{c.tag}</span>
                  </div>
                ))}
              </div>
            </div>

            <p style={paraLast}>
              Esse processo aumenta a confiança na automação e fornece uma trilha de auditoria clara para os
              engenheiros humanos.
            </p>
          </div>

          {/* ══ 06 ══ */}
          <div id="s6">
            <SectionHeading n="06" accent={C.blue}>Conclusão: o futuro das operações de TI</SectionHeading>

            <p style={para}>
              A sinergia entre o julgamento humano e a escala da IA agêntica é o único caminho para sustentar o
              crescimento das infraestruturas modernas.
            </p>
            <p style={{ ...para, margin: '0 0 32px' }}>
              O futuro do DevOps e SRE não é sobre substituir o engenheiro, mas elevar seu papel para o de um{' '}
              <strong style={strong}>orquestrador de sistemas autônomos</strong> — focando em arquitetura e
              resiliência enquanto a IA cuida da operação rotineira. Organizações que adotarem essas arquiteturas
              agênticas e baseadas em grafos hoje ganharão vantagem competitiva crucial no gerenciamento de
              ecossistemas digitais complexos.
            </p>

            <div style={{
              background: C.bgCard, border: `1px solid ${C.border}`,
              borderTop: '2px solid #38bdf880', borderRadius: 16, padding: '28px 30px',
            }}>
              <div style={{
                fontFamily: F.mono, fontSize: 10, letterSpacing: '.2em',
                textTransform: 'uppercase', color: C.cyan, marginBottom: 14,
              }}>// takeaway</div>
              <p style={{
                margin: 0, fontSize: 17, lineHeight: 1.7, color: C.text1, fontWeight: 500,
                textWrap: 'pretty' as React.CSSProperties['textWrap'],
              }}>
                O engenheiro deixa de ser o operador do sistema para se tornar o arquiteto do sistema que opera
                a si mesmo.
              </p>
            </div>
          </div>

          {/* ══ 07 — Referências (fora do índice) ══ */}
          <div id="s7" style={{ marginTop: 76 }}>
            <SectionHeading n="07" accent={C.pink}>Referências</SectionHeading>

            <div style={{
              display: 'flex', flexDirection: 'column', background: C.bgCard,
              border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden',
            }}>
              {REFERENCIAS.map((r, i) => (
                <a
                  key={r.n}
                  href={r.url}
                  target="_blank"
                  rel="noopener"
                  className="ia-ref"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px',
                    borderBottom: i === REFERENCIAS.length - 1 ? 'none' : `1px solid ${C.border}`,
                    textDecoration: 'none',
                  }}
                >
                  <span style={{ fontFamily: F.mono, fontSize: 11, fontWeight: 700, color: C.pink, minWidth: 20 }}>{r.n}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14.5, fontWeight: 600, color: C.text1, marginBottom: 4, lineHeight: 1.4 }}>
                      {r.titulo}
                      {r.sufixo ? <span style={{ fontWeight: 400, color: C.text4 }}> {r.sufixo}</span> : null}
                    </div>
                    <div style={{ fontFamily: F.mono, fontSize: 10.5, color: C.text4 }}>{r.fonte}</div>
                  </div>
                  <span style={{ color: C.dim, flexShrink: 0, display: 'inline-flex' }}>
                    <ExternalIcon />
                  </span>
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
