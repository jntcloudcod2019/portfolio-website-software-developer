import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { useWindowDimensions } from 'react-native';

import { useI18n } from '@/context/I18nProvider';
import { SeoHead } from '@/components/seo/SeoHead';
import { absoluteUrl, OG_IMAGE } from '@/constants/seo';

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

/** Abaixo desta largura a página troca para os layouts empilhados. */
const MOBILE_BP = 760;
/** Altura do NavHeader fixo do site. */
const NAV_H = 54;

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
  .ia-scroll { overflow-x:hidden; }
  .ia-scroll * { max-width:100%; }
`;

// ─── Conteúdo bilíngue ────────────────────────────────────────────────────────

type Lang = 'pt' | 'en';

const COPY = {
  pt: {
    back: '← Estudos e Artigos',
    badge: 'Estudo técnico',
    kicker: 'AIOps · Agentic AI · SRE',
    titleA: 'Inteligência Autônoma em Ecossistemas de ',
    titleB: 'Multiagentes e Kubernetes',
    lead: 'As operações de TI modernas atingiram um nível de complexidade que supera a capacidade humana de triagem e gestão manual. Com a ascensão das arquiteturas de microsserviços e nuvens distribuídas, engenheiros enfrentam o paradoxo da visibilidade: quanto mais ferramentas de monitoramento são instaladas, mais ruído e “tempestades de alertas” são gerados. Neste cenário, o AIOps deixa de ser uma tendência para se tornar uma necessidade estrutural, evoluindo de simples automações para sistemas agênticos e autônomos.',
    date: 'Agosto 2026',
    tocLabel: 'Índice',

    s1Title: 'Fundamentos de AIOps e a camada de inteligência',
    s1p1a: 'O AIOps é a aplicação de Machine Learning e análise de Big Data sobre dados de telemetria para automatizar a detecção de anomalias e acelerar o diagnóstico. Diferente da observabilidade tradicional, que foca em ',
    s1p1b: '“o que está acontecendo”',
    s1p1c: ', o AIOps busca responder ',
    s1p1d: '“qual a causa raiz”',
    s1p1e: ' e ',
    s1p1f: '“qual a melhor ação”',
    s1p2: 'Uma arquitetura técnica robusta de AIOps se divide em três camadas.',
    fig1: 'Fig. 01 — Arquitetura em três camadas',
    fig1n1: 'Ingestão & normalização',
    fig1s1: 'OpenTelemetry · logs · métricas · traces',
    fig1n2: 'Análise & detecção',
    fig1s2: 'Padrões probabilísticos de causa raiz · limites dinâmicos',
    fig1n3: 'Ação & automação',
    fig1s3: 'Execução de runbooks de remediação',
    callout: 'de redução no ruído de alertas — permitindo que times de SRE foquem em resiliência em vez de tarefas repetitivas.',
    s1p3: 'Casos de uso práticos incluem a detecção de anomalias com limites dinâmicos e a análise de causa raiz (RCA) automatizada, que correlaciona falhas em toda a stack tecnológica.',

    s2Title: 'Arquiteturas agênticas e sistemas multi-agentes',
    s2p1a: 'A evolução do AIOps passa pela transição de copilotos para ',
    s2p1b: 'Sistemas Multi-Agentes (MAS)',
    s2p1c: '. Enquanto um único agente pode ter dificuldades com tarefas complexas, uma arquitetura multi-agente decompõe o sistema em agentes especializados coordenados por um agente supervisor.',
    s2p2a: 'Ferramentas como o ',
    s2p2b: 'LangGraph',
    s2p2c: ' permitem orquestrar esses fluxos através de grafos de estados, mantendo o contexto e permitindo intervenção humana (',
    s2p2d: 'human-in-the-loop',
    s2p2e: ') em etapas críticas.',
    fig2: 'Fig. 02 — Equipe SRE virtual coordenada por supervisor',
    fig2sup: 'Agente supervisor',
    fig2supSub: 'LangGraph · grafo de estados',
    fig2a1: 'Observabilidade', fig2a1s: 'métricas · traces',
    fig2a2: 'Segurança',       fig2a2s: 'políticas · CVEs',
    fig2a3: 'Remediação',      fig2a3s: 'runbooks · rollback',
    fig2foot: 'acesso seguro a APIs sem expor credenciais',
    s2p3a: 'Para que esses agentes colaborem de forma segura, protocolos como o ',
    s2p3b: 'Model Context Protocol (MCP)',
    s2p3c: ' surgem como padrão universal, permitindo que os modelos acessem APIs de infraestrutura e compartilhem contexto sem expor credenciais sensíveis.',

    s3Title: 'Kubernetes autônomo e gestão de nuvem',
    s3p1a: 'O objetivo final da inteligência agêntica nas operações é a ',
    s3p1b: 'Nuvem Autônoma',
    s3p1c: '. No ecossistema Kubernetes, isso significa ir além das capacidades nativas de automação — frequentemente reativas e baseadas em limites estáticos. Um framework de Kubernetes Autônomo utiliza ciclos fechados de observação-ação.',
    fig3: 'Fig. 03 — Ciclo fechado observação → ação',
    fig3c1: 'Observar',     fig3s1: 'telemetria contínua',
    fig3c2: 'Detectar',     fig3s2: 'anomalias',
    fig3c3: 'Diagnosticar', fig3s3: 'causa raiz',
    fig3c4: 'Remediar',     fig3s4: 'Operators',
    fig3foot: 'ciclo contínuo · sem intervenção manual',
    d1: 'Escalonamento preditivo',
    d1t: 'Modelos de séries temporais (ARIMA, LSTM) preveem aumentos de carga antes que ocorram, evitando degradação de performance.',
    d2: 'Self-healing',
    d2t: 'Execução controlada de reinício de pods, drenagem de nós ou rollback de versões instáveis via Kubernetes Operators.',
    d3: 'Gestão de toil',
    d3t: 'Eliminação de trabalho manual repetitivo, permitindo que a infraestrutura se auto-otimize continuamente.',

    s4Title: 'GraphRAG: precisão com grafos de conhecimento',
    s4p1a: 'Um dos maiores desafios no uso de LLMs em operações de TI são as alucinações e a falta de contexto específico da empresa. O ',
    s4p1b: 'RAG',
    s4p1c: ' resolve isso fornecendo dados externos confiáveis ao modelo — mas o RAG tradicional foca em dados não estruturados.',
    s4p2a: 'O padrão ',
    s4p2b: 'GraphRAG',
    s4p2c: ' utiliza Grafos de Conhecimento para estruturar entidades e seus relacionamentos — dependências entre serviços, histórico de incidentes — garantindo respostas mais precisas e rastreáveis.',
    fig4: 'Fig. 04 — Topologia de dependências reconhecida pelo grafo',
    fig4db: 'DATABASE', fig4svc: 'SERVICE', fig4imp: 'IMPACTO',
    fig4foot: 'falha na origem → propagação rastreável até o sintoma observado',
    s4p3: 'Ao integrar grafos de conhecimento, o sistema entende a topologia da aplicação — reconhecendo que uma falha em um banco de dados específico causará lentidão em microsserviços dependentes. Isso permite que os agentes realizem consultas complexas envolvendo filtragem, contagem e agregação de dados operacionais.',

    s5Title: 'Event-driven e análise multimodal',
    s5p1: 'Para reduzir a latência na resposta a incidentes, as arquiteturas orientadas a eventos são fundamentais, permitindo que os agentes reajam em milissegundos assim que um limite de monitoramento é atingido.',
    s5p2a: 'A análise agêntica moderna é ',
    s5p2b: 'multimodal',
    s5p2c: ', fundindo métricas, logs e traces distribuídos para gerar hipóteses explicáveis de causa raiz.',
    fig5: 'Fig. 05 — Chain-of-thought na decomposição do incidente',
    fig5p1: 'Identificação de sintomas',       fig5t1: 'métricas',
    fig5p2: 'Análise de impacto',              fig5t2: 'logs',
    fig5p3: 'Busca por correlações temporais', fig5t3: 'traces',
    fig5p4: 'Conclusão da causa raiz',         fig5t4: 'auditável',
    s5p3: 'Esse processo aumenta a confiança na automação e fornece uma trilha de auditoria clara para os engenheiros humanos.',

    s6Title: 'Conclusão: o futuro das operações de TI',
    s6p1: 'A sinergia entre o julgamento humano e a escala da IA agêntica é o único caminho para sustentar o crescimento das infraestruturas modernas.',
    s6p2a: 'O futuro do DevOps e SRE não é sobre substituir o engenheiro, mas elevar seu papel para o de um ',
    s6p2b: 'orquestrador de sistemas autônomos',
    s6p2c: ' — focando em arquitetura e resiliência enquanto a IA cuida da operação rotineira. Organizações que adotarem essas arquiteturas agênticas e baseadas em grafos hoje ganharão vantagem competitiva crucial no gerenciamento de ecossistemas digitais complexos.',
    takeaway: 'O engenheiro deixa de ser o operador do sistema para se tornar o arquiteto do sistema que opera a si mesmo.',

    s7Title: 'Referências',
    refLivro: '(livro)',
    refRepo: '— repositório de código',
  },

  en: {
    back: '← Studies & Articles',
    badge: 'Technical study',
    kicker: 'AIOps · Agentic AI · SRE',
    titleA: 'Autonomous Intelligence in ',
    titleB: 'Multi-Agent and Kubernetes Ecosystems',
    lead: 'Modern IT operations have reached a level of complexity that outpaces any human capacity for manual triage and management. With the rise of microservice architectures and distributed clouds, engineers face the visibility paradox: the more monitoring tools they install, the more noise and “alert storms” they generate. In this landscape, AIOps stops being a trend and becomes a structural necessity, evolving from simple automation into agentic, autonomous systems.',
    date: 'August 2026',
    tocLabel: 'Contents',

    s1Title: 'AIOps fundamentals and the intelligence layer',
    s1p1a: 'AIOps is the application of machine learning and big-data analysis over telemetry to automate anomaly detection and speed up diagnosis. Unlike traditional observability, which focuses on ',
    s1p1b: '“what is happening”',
    s1p1c: ', AIOps sets out to answer ',
    s1p1d: '“what is the root cause”',
    s1p1e: ' and ',
    s1p1f: '“what is the best action”',
    s1p2: 'A robust technical AIOps architecture breaks down into three layers.',
    fig1: 'Fig. 01 — Three-layer architecture',
    fig1n1: 'Ingestion & normalization',
    fig1s1: 'OpenTelemetry · logs · metrics · traces',
    fig1n2: 'Analysis & detection',
    fig1s2: 'Probabilistic root-cause patterns · dynamic thresholds',
    fig1n3: 'Action & automation',
    fig1s3: 'Execution of remediation runbooks',
    callout: 'reduction in alert noise — letting SRE teams focus on resilience instead of repetitive work.',
    s1p3: 'Practical use cases include anomaly detection with dynamic thresholds and automated root-cause analysis (RCA), which correlates failures across the entire technology stack.',

    s2Title: 'Agentic architectures and multi-agent systems',
    s2p1a: 'The evolution of AIOps runs through the shift from copilots to ',
    s2p1b: 'Multi-Agent Systems (MAS)',
    s2p1c: '. While a single agent can struggle with complex tasks, a multi-agent architecture decomposes the system into specialized agents coordinated by a supervisor agent.',
    s2p2a: 'Tools such as ',
    s2p2b: 'LangGraph',
    s2p2c: ' orchestrate these flows through state graphs, preserving context and allowing human intervention (',
    s2p2d: 'human-in-the-loop',
    s2p2e: ') at critical steps.',
    fig2: 'Fig. 02 — Virtual SRE team coordinated by a supervisor',
    fig2sup: 'Supervisor agent',
    fig2supSub: 'LangGraph · state graph',
    fig2a1: 'Observability', fig2a1s: 'metrics · traces',
    fig2a2: 'Security',      fig2a2s: 'policies · CVEs',
    fig2a3: 'Remediation',   fig2a3s: 'runbooks · rollback',
    fig2foot: 'secure API access without exposing credentials',
    s2p3a: 'For these agents to collaborate safely, protocols such as the ',
    s2p3b: 'Model Context Protocol (MCP)',
    s2p3c: ' are emerging as a universal standard, letting models reach infrastructure APIs and share context without exposing sensitive credentials.',

    s3Title: 'Autonomous Kubernetes and cloud management',
    s3p1a: 'The end goal of agentic intelligence in operations is the ',
    s3p1b: 'Autonomous Cloud',
    s3p1c: '. In the Kubernetes ecosystem this means going beyond native automation — often reactive and based on static thresholds. An Autonomous Kubernetes framework relies on closed observation-action loops.',
    fig3: 'Fig. 03 — Closed observation → action loop',
    fig3c1: 'Observe',   fig3s1: 'continuous telemetry',
    fig3c2: 'Detect',    fig3s2: 'anomalies',
    fig3c3: 'Diagnose',  fig3s3: 'root cause',
    fig3c4: 'Remediate', fig3s4: 'Operators',
    fig3foot: 'continuous loop · no manual intervention',
    d1: 'Predictive scaling',
    d1t: 'Time-series models (ARIMA, LSTM) forecast load spikes before they happen, preventing performance degradation.',
    d2: 'Self-healing',
    d2t: 'Controlled pod restarts, node draining or rollback of unstable versions through Kubernetes Operators.',
    d3: 'Toil management',
    d3t: 'Elimination of repetitive manual work, letting the infrastructure continuously optimize itself.',

    s4Title: 'GraphRAG: precision with knowledge graphs',
    s4p1a: 'One of the biggest challenges in using LLMs for IT operations is hallucination and the lack of company-specific context. ',
    s4p1b: 'RAG',
    s4p1c: ' addresses this by feeding trustworthy external data to the model — but traditional RAG focuses on unstructured data.',
    s4p2a: 'The ',
    s4p2b: 'GraphRAG',
    s4p2c: ' pattern uses knowledge graphs to structure entities and their relationships — service dependencies, incident history — yielding more accurate and traceable answers.',
    fig4: 'Fig. 04 — Dependency topology recognized by the graph',
    fig4db: 'DATABASE', fig4svc: 'SERVICE', fig4imp: 'IMPACT',
    fig4foot: 'failure at the source → traceable propagation to the observed symptom',
    s4p3: 'By integrating knowledge graphs, the system understands the application topology — recognizing that a failure in a specific database will slow down dependent microservices. This lets agents run complex queries involving filtering, counting and aggregation of operational data.',

    s5Title: 'Event-driven and multimodal analysis',
    s5p1: 'To cut latency in incident response, event-driven architectures are essential, letting agents react within milliseconds as soon as a monitoring threshold is crossed.',
    s5p2a: 'Modern agentic analysis is ',
    s5p2b: 'multimodal',
    s5p2c: ', fusing metrics, logs and distributed traces to produce explainable root-cause hypotheses.',
    fig5: 'Fig. 05 — Chain-of-thought in incident decomposition',
    fig5p1: 'Symptom identification',       fig5t1: 'metrics',
    fig5p2: 'Impact analysis',              fig5t2: 'logs',
    fig5p3: 'Search for time correlations', fig5t3: 'traces',
    fig5p4: 'Root-cause conclusion',        fig5t4: 'auditable',
    s5p3: 'This process increases trust in automation and provides a clear audit trail for human engineers.',

    s6Title: 'Conclusion: the future of IT operations',
    s6p1: 'The synergy between human judgment and the scale of agentic AI is the only way to sustain the growth of modern infrastructure.',
    s6p2a: 'The future of DevOps and SRE is not about replacing the engineer, but elevating their role to that of an ',
    s6p2b: 'orchestrator of autonomous systems',
    s6p2c: ' — focusing on architecture and resilience while AI handles routine operations. Organizations that adopt these agentic, graph-based architectures today will gain a crucial competitive edge in managing complex digital ecosystems.',
    takeaway: 'The engineer stops being the operator of the system and becomes the architect of the system that operates itself.',

    s7Title: 'References',
    refLivro: '(book)',
    refRepo: '— code repository',
  },
} as const;

const TOC_KEYS = [
  { n: '01', key: 's1Title', short: { pt: 'Fundamentos de AIOps',      en: 'AIOps fundamentals' },      color: C.cyan,   href: '#s1' },
  { n: '02', key: 's2Title', short: { pt: 'Sistemas multi-agentes',    en: 'Multi-agent systems' },     color: C.purple, href: '#s2' },
  { n: '03', key: 's3Title', short: { pt: 'Kubernetes autônomo',       en: 'Autonomous Kubernetes' },   color: C.green,  href: '#s3' },
  { n: '04', key: 's4Title', short: { pt: 'GraphRAG',                  en: 'GraphRAG' },                color: C.amber,  href: '#s4' },
  { n: '05', key: 's5Title', short: { pt: 'Event-driven e multimodal', en: 'Event-driven & multimodal' }, color: C.orange, href: '#s5' },
  { n: '06', key: 's6Title', short: { pt: 'Conclusão',                 en: 'Conclusion' },              color: C.blue,   href: '#s6' },
] as const;

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
  { n: '04', titulo: 'Essential GraphRAG', sufixoKey: 'refLivro' as const,
    fonte: 'Manning · Tomaž Bratanič e Oskar Hane',
    url: 'https://www.manning.com/books/essential-graphrag' },
  { n: '05', titulo: 'kg-rag', sufixoKey: 'refRepo' as const,
    fonte: 'GitHub · tomasonjo',
    url: 'https://github.com/tomasonjo/kg-rag' },
  { n: '06', titulo: 'Event-Driven AI Agents: Patterns That Scale',
    fonte: 'DEV Community · The Daily Agent',
    url: 'https://dev.to/thedailyagent/event-driven-ai-agents-patterns-that-scale-39ld' },
];

const ARTICLE_PATH = '/estudo/inteligencia-agentica';
const PUBLISHED = '2026-08-01';

const META = {
  pt: {
    title: 'Inteligência Autônoma em Ecossistemas de Multiagentes e Kubernetes',
    desc: 'Estudo técnico sobre AIOps, sistemas multi-agentes com LangGraph, Kubernetes autônomo, GraphRAG e arquiteturas event-driven aplicados à operação de infraestrutura e SRE.',
    keywords: 'AIOps, agentic AI, sistemas multi-agentes, LangGraph, Kubernetes autônomo, GraphRAG, MCP, SRE, observabilidade, event-driven',
  },
  en: {
    title: 'Autonomous Intelligence in Multi-Agent and Kubernetes Ecosystems',
    desc: 'Technical study on AIOps, multi-agent systems with LangGraph, autonomous Kubernetes, GraphRAG and event-driven architectures applied to infrastructure operations and SRE.',
    keywords: 'AIOps, agentic AI, multi-agent systems, LangGraph, autonomous Kubernetes, GraphRAG, MCP, SRE, observability, event-driven',
  },
} as const;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ArtigoInteligenciaAgentica() {
  const router = useRouter();
  const { currentLanguage } = useI18n();
  const { width } = useWindowDimensions();

  const lang: Lang = currentLanguage === 'en' ? 'en' : 'pt';
  const L = COPY[lang];
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

  const onAnchor = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // ── Estilos derivados da largura ──
  const PAD = isMobile ? 22 : 56;

  const para: React.CSSProperties = {
    margin: '0 0 18px',
    fontSize: isMobile ? 15 : 16,
    lineHeight: 1.75,
    color: C.text2,
    maxWidth: '68ch',
    textWrap: 'pretty' as React.CSSProperties['textWrap'],
  };
  const paraLast: React.CSSProperties = { ...para, margin: 0 };
  const paraFig: React.CSSProperties = { ...para, margin: '0 0 28px' };

  const figure: React.CSSProperties = {
    background: C.bgFigure,
    border: `1px solid ${C.border}`,
    borderRadius: 16,
    padding: isMobile ? 18 : 26,
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
  const emp = (color: string): React.CSSProperties => ({ color, fontStyle: 'normal', fontWeight: 500 });

  const nodeStyle = (color: string): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: isMobile ? 12 : 16,
    background: C.bgNode,
    border: `1px solid ${color}44`,
    borderLeft: `3px solid ${color}`,
    borderRadius: 11,
    padding: isMobile ? '13px 14px' : '15px 18px',
  });

  const heading = (children: React.ReactNode) => (
    <h2 style={{
      margin: '0 0 20px',
      fontSize: isMobile ? 22 : 27,
      fontWeight: 700,
      letterSpacing: '-.022em',
      lineHeight: 1.25,
    }}>{children}</h2>
  );

  const ArrowDown = () => (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
      <svg width="14" height="18" viewBox="0 0 14 18" fill="none" stroke={C.arrow}
           strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 1v13" /><path d="M2 10l5 5 5-5" />
      </svg>
    </div>
  );

  const Dot = ({ color, delay }: { color: string; delay: string }) => (
    <span style={{
      width: 7, height: 7, borderRadius: '50%', background: color, flexShrink: 0,
      animation: `ia-blink 2s ${delay} infinite`,
    }} />
  );

  const NodeCard = ({ n, color, title, sub, delay }: {
    n: string; color: string; title: string; sub: string; delay: string;
  }) => (
    <div className="ia-node" style={nodeStyle(color)}>
      <span style={{ fontFamily: F.mono, fontSize: 11, fontWeight: 700, color, minWidth: 22 }}>{n}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: isMobile ? 13.5 : 14.5, fontWeight: 600, marginBottom: 3 }}>{title}</div>
        <div style={{ fontFamily: F.mono, fontSize: 10.5, color: C.text4, lineHeight: 1.5 }}>{sub}</div>
      </div>
      <Dot color={color} delay={delay} />
    </div>
  );

  const GraphNode = ({ label, name, color, style }: {
    label: string; name: string; color: string; style?: React.CSSProperties;
  }) => (
    <div className="ia-node" style={{
      background: C.bgNode, border: `1px solid ${color}55`,
      borderLeft: `3px solid ${color}`, borderRadius: 10, padding: '11px 13px',
      ...style,
    }}>
      <div style={{
        fontFamily: F.mono, fontSize: 8.5, letterSpacing: '.1em', color,
        textTransform: 'uppercase', marginBottom: 5,
      }}>{label}</div>
      <div style={{ fontSize: 12.5, fontWeight: 600 }}>{name}</div>
    </div>
  );

  const AGENTES = [
    { ns: 'AGENT.OBSERVE', titulo: L.fig2a1, sub: L.fig2a1s, color: C.cyan },
    { ns: 'AGENT.SECURE',  titulo: L.fig2a2, sub: L.fig2a2s, color: C.amber },
    { ns: 'AGENT.REMEDY',  titulo: L.fig2a3, sub: L.fig2a3s, color: C.green },
  ];

  const CICLO = [
    { n: '01', titulo: L.fig3c1, sub: L.fig3s1, color: C.cyan },
    { n: '02', titulo: L.fig3c2, sub: L.fig3s2, color: C.purple },
    { n: '03', titulo: L.fig3c3, sub: L.fig3s3, color: C.amber },
    { n: '04', titulo: L.fig3c4, sub: L.fig3s4, color: C.green },
  ];

  const DESTAQUES = [
    { color: C.cyan,  titulo: L.d1, texto: L.d1t,
      paths: <><path d="M3 17l6-6 4 4 8-8" /><path d="M21 7v6h-6" /></> },
    { color: C.green, titulo: L.d2, texto: L.d2t,
      paths: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /> },
    { color: C.amber, titulo: L.d3, texto: L.d3t,
      paths: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6h.09A1.65 1.65 0 0 0 10.6 3.09V3a2 2 0 1 1 4 0v.09A1.65 1.65 0 0 0 16.11 4.6" /></> },
  ];

  const CHAIN = [
    { n: '01', passo: L.fig5p1, tag: L.fig5t1, color: C.orange, forte: false },
    { n: '02', passo: L.fig5p2, tag: L.fig5t2, color: C.amber,  forte: false },
    { n: '03', passo: L.fig5p3, tag: L.fig5t3, color: C.purple, forte: false },
    { n: '04', passo: L.fig5p4, tag: L.fig5t4, color: C.green,  forte: true  },
  ];

  return (
    <>
      <SeoHead
        title={META[lang].title}
        description={META[lang].desc}
        path={ARTICLE_PATH}
        type="article"
        locale={lang === 'en' ? 'en_US' : 'pt_BR'}
        publishedTime={PUBLISHED}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'TechArticle',
          headline: META[lang].title,
          description: META[lang].desc,
          keywords: META[lang].keywords,
          url: absoluteUrl(ARTICLE_PATH),
          image: OG_IMAGE,
          inLanguage: lang === 'en' ? 'en' : 'pt-BR',
          datePublished: PUBLISHED,
          dateModified: PUBLISHED,
          author: { '@type': 'Person', name: 'Jonathan F. Silva' },
          publisher: { '@type': 'Person', name: 'Jonathan F. Silva' },
          articleSection: TOC_KEYS.map((s) => s.short[lang]),
          citation: REFERENCIAS.map((r) => ({
            '@type': 'CreativeWork',
            name: r.titulo,
            url: r.url,
          })),
        }}
      />

      {/* O shell do app (RN Web) trava os wrappers em 100vh com `overflow:hidden`
          no body — as demais rotas rolam via <ScrollView>. Aqui o próprio
          container do artigo é o elemento rolável. O paddingTop compensa o
          NavHeader fixo de 54px. */}
      <div className="ia-scroll" style={{
        fontFamily: `'${F.body}',system-ui,sans-serif`,
        background: C.bg,
        color: C.text1,
        height: '100%',
        overflowY: 'auto',
        paddingTop: NAV_H,
        WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'],
      }}>

        {/* ── Hero ── */}
        <div style={{
          position: 'relative', overflow: 'hidden',
          padding: isMobile ? '40px 22px 36px' : '64px 56px 52px',
          background: 'radial-gradient(130% 90% at 50% -10%, #0d1320 0%, #0a0b0d 56%)',
          borderBottom: `1px solid ${C.borderSep}`,
        }}>
          <div style={{
            position: 'absolute', top: -90, left: '50%', transform: 'translateX(-50%)',
            width: 680, height: 400, maxWidth: '160%',
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
            >{L.back}</a>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
              <span style={{
                fontFamily: F.mono, fontSize: 10.5, fontWeight: 700, letterSpacing: '.14em',
                textTransform: 'uppercase', color: C.purple,
                background: '#a78bfa16', border: '1px solid #a78bfa2e',
                padding: '4px 10px', borderRadius: 6,
              }}>{L.badge}</span>
              <span style={{ fontFamily: F.mono, fontSize: 11, color: C.muted }}>{L.kicker}</span>
            </div>

            <h1 style={{
              margin: '0 0 18px',
              fontSize: isMobile ? 30 : 44,
              fontWeight: 700, letterSpacing: '-.032em', lineHeight: 1.1,
              textWrap: 'pretty' as React.CSSProperties['textWrap'],
            }}>
              {L.titleA}
              <span style={{ color: C.cyan }}>{L.titleB}</span>
            </h1>

            <p style={{
              margin: '0 0 28px',
              fontSize: isMobile ? 15 : 16.5,
              lineHeight: 1.72, color: C.text3, maxWidth: '66ch',
              textWrap: 'pretty' as React.CSSProperties['textWrap'],
            }}>{L.lead}</p>

            <div style={{ fontFamily: F.mono, fontSize: 11, color: C.muted, letterSpacing: '.04em' }}>
              {L.date}
            </div>
          </div>
        </div>

        {/* ── Corpo ── */}
        <div style={{
          maxWidth: 880, margin: '0 auto',
          padding: isMobile ? '38px 22px 90px' : '52px 56px 120px',
        }}>

          {/* Índice */}
          <div style={{
            background: C.bgCard, border: `1px solid ${C.border}`,
            borderRadius: 16, padding: isMobile ? '18px 18px' : '22px 24px',
            marginBottom: isMobile ? 48 : 68,
          }}>
            <div style={{
              fontFamily: F.mono, fontSize: 10.5, letterSpacing: '.22em',
              textTransform: 'uppercase', color: C.muted, marginBottom: 16,
            }}>{L.tocLabel}</div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
              gap: 8,
            }}>
              {TOC_KEYS.map((it) => (
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
                  {it.short[lang]}
                </a>
              ))}
            </div>
          </div>

          {/* ══ 01 ══ */}
          <div id="s1" style={{ marginBottom: isMobile ? 56 : 76 }}>
            {heading(L.s1Title)}

            <p style={para}>
              {L.s1p1a}<em style={emp(C.text1)}>{L.s1p1b}</em>{L.s1p1c}
              <em style={emp(C.cyan)}>{L.s1p1d}</em>{L.s1p1e}
              <em style={emp(C.cyan)}>{L.s1p1f}</em>.
            </p>
            <p style={paraFig}>{L.s1p2}</p>

            <div style={figure}>
              <div style={figureLabel}>{L.fig1}</div>
              <NodeCard n="01" color={C.cyan}   title={L.fig1n1} sub={L.fig1s1} delay="0s" />
              <ArrowDown />
              <NodeCard n="02" color={C.purple} title={L.fig1n2} sub={L.fig1s2} delay=".5s" />
              <ArrowDown />
              <NodeCard n="03" color={C.green}  title={L.fig1n3} sub={L.fig1s3} delay="1s" />
            </div>

            <div style={{
              display: 'flex', gap: 14, background: C.bgCard,
              border: '1px solid #34d39933', borderLeft: `3px solid ${C.green}`,
              borderRadius: 12, padding: '18px 20px', marginBottom: 22,
              flexWrap: isMobile ? 'wrap' : 'nowrap',
            }}>
              <div style={{ fontSize: 30, fontWeight: 700, color: C.green, letterSpacing: '-.03em', lineHeight: 1, flexShrink: 0 }}>95%</div>
              <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.65, color: C.text2 }}>{L.callout}</p>
            </div>

            <p style={paraLast}>{L.s1p3}</p>
          </div>

          {/* ══ 02 ══ */}
          <div id="s2" style={{ marginBottom: isMobile ? 56 : 76 }}>
            {heading(L.s2Title)}

            <p style={para}>{L.s2p1a}<strong style={strong}>{L.s2p1b}</strong>{L.s2p1c}</p>
            <p style={paraFig}>
              {L.s2p2a}<strong style={strong}>{L.s2p2b}</strong>{L.s2p2c}
              <em style={{ fontStyle: 'normal', color: C.purple }}>{L.s2p2d}</em>{L.s2p2e}
            </p>

            <div style={{ ...figure, marginBottom: 24 }}>
              <div style={{ ...figureLabel, marginBottom: 22 }}>{L.fig2}</div>

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
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{L.fig2sup}</div>
                  <div style={{ fontFamily: F.mono, fontSize: 10, color: C.text4, marginTop: 2 }}>{L.fig2supSub}</div>
                </div>
              </div>

              {isMobile ? (
                <ArrowDown />
              ) : (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0 12px' }}>
                  <svg width="100%" height="26" viewBox="0 0 760 26" preserveAspectRatio="none"
                       fill="none" stroke={C.arrow} strokeWidth="1.5" strokeLinecap="round">
                    <path d="M380 0v8M380 8H152v18M380 8h228v18M380 8v18" />
                  </svg>
                </div>
              )}

              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                gap: isMobile ? 9 : 12,
              }}>
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
                MCP · <span style={{ color: C.text4 }}>{L.fig2foot}</span>
              </div>
            </div>

            <p style={paraLast}>{L.s2p3a}<strong style={strong}>{L.s2p3b}</strong>{L.s2p3c}</p>
          </div>

          {/* ══ 03 ══ */}
          <div id="s3" style={{ marginBottom: isMobile ? 56 : 76 }}>
            {heading(L.s3Title)}

            <p style={paraFig}>{L.s3p1a}<strong style={strong}>{L.s3p1b}</strong>{L.s3p1c}</p>

            <div style={{ ...figure, padding: isMobile ? 18 : '30px 26px', marginBottom: 24 }}>
              <div style={{ ...figureLabel, marginBottom: 24 }}>{L.fig3}</div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
                gap: 10, alignItems: 'stretch',
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
                fontFamily: F.mono, fontSize: 9.5, color: C.dim, textAlign: 'center',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.green}
                     strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M23 4v6h-6" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                </svg>
                {L.fig3foot}
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
              gap: 14,
            }}>
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
                         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{d.paths}</svg>
                  </div>
                  <div style={{ fontSize: 14.5, fontWeight: 600, marginBottom: 7 }}>{d.titulo}</div>
                  <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: C.text3 }}>{d.texto}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ══ 04 ══ */}
          <div id="s4" style={{ marginBottom: isMobile ? 56 : 76 }}>
            {heading(L.s4Title)}

            <p style={para}>{L.s4p1a}<strong style={strong}>{L.s4p1b}</strong>{L.s4p1c}</p>
            <p style={paraFig}>
              {L.s4p2a}<strong style={{ color: C.amber, fontWeight: 600 }}>{L.s4p2b}</strong>{L.s4p2c}
            </p>

            <div style={{ ...figure, marginBottom: 24 }}>
              <div style={figureLabel}>{L.fig4}</div>

              {isMobile ? (
                /* Mobile: o grafo vira uma cadeia vertical — origem → serviços → impacto. */
                <div>
                  <GraphNode label={L.fig4db} name="postgres-main" color={C.blue} />
                  <ArrowDown />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }}>
                    <GraphNode label={L.fig4svc} name="svc-orders"  color={C.cyan} />
                    <GraphNode label={L.fig4svc} name="svc-billing" color={C.cyan} />
                  </div>
                  <ArrowDown />
                  <GraphNode label={L.fig4imp} name="checkout lento" color={C.pink} />
                </div>
              ) : (
                <div style={{ position: 'relative', height: 200 }}>
                  <svg width="100%" height="200" viewBox="0 0 760 200" fill="none"
                       preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
                    <path d="M150 100 L300 60"  stroke={C.amber} strokeWidth="1.6" strokeDasharray="4 3" opacity=".5" />
                    <path d="M150 100 L300 140" stroke={C.amber} strokeWidth="1.6" strokeDasharray="4 3" opacity=".5" />
                    <path d="M420 60 L570 100"  stroke={C.pink}  strokeWidth="1.6" strokeDasharray="4 3" opacity=".5" />
                    <path d="M420 140 L570 100" stroke={C.pink}  strokeWidth="1.6" strokeDasharray="4 3" opacity=".5" />
                  </svg>
                  <GraphNode label={L.fig4db}  name="postgres-main"  color={C.blue} style={{ position: 'absolute', left: 0,   top: 74,  width: 150 }} />
                  <GraphNode label={L.fig4svc} name="svc-orders"     color={C.cyan} style={{ position: 'absolute', left: 296, top: 34,  width: 130 }} />
                  <GraphNode label={L.fig4svc} name="svc-billing"    color={C.cyan} style={{ position: 'absolute', left: 296, top: 114, width: 130 }} />
                  <GraphNode label={L.fig4imp} name="checkout lento" color={C.pink} style={{ position: 'absolute', right: 0,  top: 74,  width: 150 }} />
                </div>
              )}

              <div style={{
                textAlign: 'center', fontFamily: F.mono, fontSize: 10,
                color: C.dim, marginTop: isMobile ? 16 : 8, lineHeight: 1.6,
              }}>{L.fig4foot}</div>
            </div>

            <p style={paraLast}>{L.s4p3}</p>
          </div>

          {/* ══ 05 ══ */}
          <div id="s5" style={{ marginBottom: isMobile ? 56 : 76 }}>
            {heading(L.s5Title)}

            <p style={para}>{L.s5p1}</p>
            <p style={paraFig}>{L.s5p2a}<strong style={strong}>{L.s5p2b}</strong>{L.s5p2c}</p>

            <div style={{ ...figure, marginBottom: 24 }}>
              <div style={figureLabel}>{L.fig5}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {CHAIN.map((c) => (
                  <div key={c.n} className="ia-node" style={{
                    display: 'flex', alignItems: 'center', gap: isMobile ? 10 : 14,
                    background: C.bgNode, border: `1px solid ${c.color}44`,
                    borderLeft: `3px solid ${c.color}`, borderRadius: 10,
                    padding: isMobile ? '12px 13px' : '13px 16px',
                    flexWrap: isMobile ? 'wrap' : 'nowrap',
                  }}>
                    <span style={{ fontFamily: F.mono, fontSize: 10, fontWeight: 700, color: c.color, minWidth: 20 }}>{c.n}</span>
                    <span style={{
                      fontSize: 13.5, flex: 1, minWidth: 0,
                      fontWeight: c.forte ? 600 : 500,
                      color: c.forte ? C.text1 : undefined,
                    }}>{c.passo}</span>
                    <span style={{ fontFamily: F.mono, fontSize: 10, color: c.forte ? C.green : C.text4 }}>{c.tag}</span>
                  </div>
                ))}
              </div>
            </div>

            <p style={paraLast}>{L.s5p3}</p>
          </div>

          {/* ══ 06 ══ */}
          <div id="s6">
            {heading(L.s6Title)}

            <p style={para}>{L.s6p1}</p>
            <p style={{ ...para, margin: '0 0 32px' }}>
              {L.s6p2a}<strong style={strong}>{L.s6p2b}</strong>{L.s6p2c}
            </p>

            <div style={{
              background: C.bgCard, border: `1px solid ${C.border}`,
              borderTop: '2px solid #38bdf880', borderRadius: 16,
              padding: isMobile ? '22px 20px' : '28px 30px',
            }}>
              <div style={{
                fontFamily: F.mono, fontSize: 10, letterSpacing: '.2em',
                textTransform: 'uppercase', color: C.cyan, marginBottom: 14,
              }}>// takeaway</div>
              <p style={{
                margin: 0, fontSize: isMobile ? 15.5 : 17, lineHeight: 1.7,
                color: C.text1, fontWeight: 500,
                textWrap: 'pretty' as React.CSSProperties['textWrap'],
              }}>{L.takeaway}</p>
            </div>
          </div>

          {/* ══ 07 — Referências (fora do índice) ══ */}
          <div id="s7" style={{ marginTop: isMobile ? 56 : 76 }}>
            {heading(L.s7Title)}

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
                    display: 'flex', alignItems: 'center', gap: isMobile ? 12 : 16,
                    padding: isMobile ? '14px 16px' : '16px 20px',
                    borderBottom: i === REFERENCIAS.length - 1 ? 'none' : `1px solid ${C.border}`,
                    textDecoration: 'none',
                  }}
                >
                  <span style={{ fontFamily: F.mono, fontSize: 11, fontWeight: 700, color: C.pink, minWidth: 20 }}>{r.n}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: isMobile ? 13.5 : 14.5, fontWeight: 600, color: C.text1, marginBottom: 4, lineHeight: 1.4 }}>
                      {r.titulo}
                      {r.sufixoKey ? <span style={{ fontWeight: 400, color: C.text4 }}> {L[r.sufixoKey]}</span> : null}
                    </div>
                    <div style={{ fontFamily: F.mono, fontSize: 10.5, color: C.text4, lineHeight: 1.5 }}>{r.fonte}</div>
                  </div>
                  <span style={{ color: C.dim, flexShrink: 0, display: 'inline-flex' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 17L17 7" /><path d="M7 7h10v10" />
                    </svg>
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
