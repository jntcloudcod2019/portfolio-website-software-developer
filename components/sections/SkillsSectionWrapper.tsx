import React, { useState } from 'react';
import { useWindowDimensions, View } from 'react-native';

import { Section } from '@/components/layout/Section';
import { SectionSeparator } from '@/components/ui/SectionSeparator';
import { useI18n } from '@/context/I18nProvider';
import { useTranslation } from 'react-i18next';

// Seção Skills: card único com rail de domínios à esquerda e painel de itens à
// direita. Implementada conforme o handoff de design — tokens C/F, CSS inline e
// DOM real (Expo Web / React Native Web). Sem bibliotecas de UI externas.

// ─── Design tokens ────────────────────────────────────────────────────────────

// A pilha mono é a MESMA de components/ui/SectionSeparator.tsx — o rail de domínios
// precisa renderizar na fonte dos títulos de seção. Manter as duas em sincronia.
const F = {
  body: 'Space Grotesk',
  mono: '"JetBrains Mono", "Courier New", monospace',
} as const;

const C = {
  bgCard:    '#0b0c0f',
  bgRail:    '#0a0b0e',
  bgItem:    '#101216',
  bgItemHov: '#12151b',
  border:    '#1c1f26',
  borderSep: '#16181d',
  text1:     '#e8eaed',
  muted:     '#5b616b',
  dim:       '#4b5159',
  dimmer:    '#3a3f47',
  railIdle:  '#7b8290',
} as const;

const TRANSITION =
  'transform .22s cubic-bezier(.2,.7,.2,1), border-color .22s, background .22s';

/** Abaixo desta largura o split vira layout empilhado. */
const MOBILE_BP = 860;

// ─── Fontes de ícone ──────────────────────────────────────────────────────────

const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/';

/** Slugs removidos da Simple Icons (404) — precisam vir do Devicon. */
const AWS_WORDMARK = `${DEVICON}amazonwebservices/amazonwebservices-original-wordmark.svg`;

// ─── Dados ────────────────────────────────────────────────────────────────────

type Item = { label: string; slug?: string; url?: string; brand?: string; mono?: string };
type Domain = { name: string; color: string; items: Item[] };

const DOMAINS: Domain[] = [
  { name: 'Back-end', color: '#a78bfa', items: [
    { label: 'C#',               url: `${DEVICON}csharp/csharp-original.svg`, brand: '#9B4F96' },
    { label: '.NET Core 6-10',   slug: 'dotnet',      brand: '#512BD4' },
    { label: 'Node.js',          slug: 'nodedotjs',   brand: '#5FA04E' },
    { label: 'TypeScript',       slug: 'typescript',  brand: '#3178C6' },
    { label: 'COBOL',            mono: 'CB' },
    { label: 'PHP',              slug: 'php',         brand: '#777BB4' },
  ]},
  { name: 'Front-end', color: '#38bdf8', items: [
    { label: 'React Native', slug: 'react',      brand: '#61DAFB' },
    { label: 'Angular',      slug: 'angular',    brand: '#DD0031' },
    { label: 'WordPress',    slug: 'wordpress',  brand: '#21759B' },
    { label: 'HTML',         slug: 'html5',      brand: '#E34F26' },
    { label: 'CSS',          slug: 'css',        brand: '#663399' },
    { label: 'JavaScript',   slug: 'javascript', brand: '#F7DF1E' },
  ]},
  { name: 'Databases', color: '#34d399', items: [
    { label: 'SQL Server', url: `${DEVICON}microsoftsqlserver/microsoftsqlserver-plain.svg`, brand: '#CC2927' },
    { label: 'Oracle',     url: `${DEVICON}oracle/oracle-original.svg`,                      brand: '#F80000' },
    { label: 'PostgreSQL', slug: 'postgresql', brand: '#4169E1' },
    { label: 'MySQL',      slug: 'mysql',      brand: '#4479A1' },
    { label: 'MongoDB',    slug: 'mongodb',    brand: '#47A248' },
  ]},
  { name: 'Architectures', color: '#8b5cf6', items: [
    { label: 'Microservices',   mono: 'MS' },
    { label: 'Hexagonal',       mono: 'HX' },
    { label: 'DDD',             mono: 'DD' },
    { label: 'CQRS',            mono: 'CQ' },
    { label: 'Event-Driven',    mono: 'ED' },
    { label: 'SOLID',           mono: 'SO' },
    { label: 'Design Patterns', mono: 'DP' },
  ]},
  { name: 'Messaging', color: '#f59e0b', items: [
    { label: 'RabbitMQ',     slug: 'rabbitmq',    brand: '#FF6600' },
    { label: 'Apache Kafka', slug: 'apachekafka', brand: '#231F20' },
    { label: 'AWS SQS',      url: AWS_WORDMARK,   brand: '#FF4F8B' },
    { label: 'ActiveMQ',     mono: 'AM' },
  ]},
  { name: 'Cloud', color: '#38bdf8', items: [
    { label: 'AWS Cloud Practitioner', url: AWS_WORDMARK, brand: '#FF9900' },
    { label: 'Azure',   url: `${DEVICON}azure/azure-original.svg`, brand: '#0078D4' },
    { label: 'Railway', slug: 'railway', brand: '#B794F6' },
  ]},
  { name: 'DevOps / CI-CD', color: '#3b82f6', items: [
    { label: 'Azure DevOps',   url: `${DEVICON}azuredevops/azuredevops-original.svg`, brand: '#0078D7' },
    { label: 'GitHub Actions', slug: 'githubactions', brand: '#2088FF' },
    { label: 'Docker',         slug: 'docker',        brand: '#2496ED' },
    { label: 'Kubernetes',     slug: 'kubernetes',    brand: '#326CE5' },
  ]},
  { name: 'Quality', color: '#fb7185', items: [
    { label: 'TDD',               mono: 'TD' },
    { label: 'Unit tests',        mono: 'UT' },
    { label: 'Integration tests', mono: 'IT' },
    { label: 'E2E',               mono: 'E2' },
    { label: 'Code review',       mono: 'CR' },
  ]},
  { name: 'Observability', color: '#f59e0b', items: [
    { label: 'Datadog',       slug: 'datadog',       brand: '#632CA6' },
    { label: 'Grafana',       slug: 'grafana',       brand: '#F46800' },
    { label: 'Prometheus',    slug: 'prometheus',    brand: '#E6522C' },
    { label: 'OpenTelemetry', slug: 'opentelemetry', brand: '#425CC7' },
  ]},
  { name: 'AI & LLMs', color: '#cbd5e1', items: [
    { label: 'Claude',           slug: 'claude',               brand: '#D97757' },
    { label: 'Copilot',          slug: 'githubcopilot',        brand: '#E8EAED' },
    { label: 'OpenCode',         mono: 'OC' },
    { label: 'Cursor (Grok)',    slug: 'cursor',               brand: '#E8EAED' },
    { label: 'MCPs',             slug: 'modelcontextprotocol', brand: '#E8EAED' },
    { label: 'RAG',              mono: 'RG' },
    { label: 'Azure AI Foundry', mono: 'AF' },
  ]},
];

// ─── Textos da interface (o nome dos domínios é técnico e não traduz) ─────────

const COPY = {
  pt: {
    title: 'Tecnologias,  Frameworks e conceitos tecnicos.',
    rail: 'DOMÍNIOS',
  },
  en: {
    title: 'Technologies,  frameworks and technical concepts.',
    rail: 'DOMAINS',
  },
} as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Tile do ícone. O logo entra como `background-image` do próprio tile — nunca
 * como <img> filho — para não gerar um elemento quebrado durante o primeiro
 * paint e manter o tile como um único nó.
 */
function tileStyle(
  color: string,
  size: number,
  radius: number,
  logo: string,
  glyph: number,
): React.CSSProperties {
  const s: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: radius,
    background: `${color}14`,
    border: `1px solid ${color}2e`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  };
  if (logo) {
    s.backgroundImage = `url(${logo})`;
    s.backgroundSize = `${glyph}px`;
    s.backgroundRepeat = 'no-repeat';
    s.backgroundPosition = 'center';
  }
  return s;
}

function resolveLogo(it: Item, catColor: string) {
  const brand = it.brand ?? catColor;
  const logo =
    it.url ?? (it.slug ? `https://cdn.simpleicons.org/${it.slug}/${brand.replace('#', '')}` : '');
  return { brand, logo, isMono: !logo };
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function DomainTab({
  domain, index, active, onSelect,
}: {
  domain: Domain; index: number; active: boolean; onSelect: (i: number) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(index)}
      aria-pressed={active}
      style={{
        display: 'flex', alignItems: 'center', gap: 11, width: '100%',
        background: active ? `${domain.color}12` : 'transparent',
        border: `1px solid ${active ? `${domain.color}3d` : 'transparent'}`,
        borderRadius: 9, padding: '10px 12px', cursor: 'pointer',
        color: active ? domain.color : C.railIdle,
        transition: 'background .16s, border-color .16s, color .16s',
        fontFamily: `'${F.body}',system-ui,sans-serif`,
      }}
    >
      <span style={{
        width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
        background: domain.color,
        boxShadow: active ? `0 0 6px ${domain.color}` : 'none',
      }} />
      <span style={{
        fontFamily: F.mono, fontSize: 11.5, fontWeight: 600, letterSpacing: '.06em',
        textTransform: 'uppercase', flex: 1, textAlign: 'left', color: 'inherit',
        whiteSpace: 'nowrap',
      }}>{domain.name}</span>
    </button>
  );
}

function SkillCard({ item, catColor }: { item: Item; catColor: string }) {
  const [hover, setHover] = useState(false);
  const { brand, logo, isMono } = resolveLogo(item, catColor);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 13,
        background: hover ? C.bgItemHov : C.bgItem,
        border: `1px solid ${hover ? `${brand}77` : C.border}`,
        borderRadius: 13, padding: '14px 15px',
        transform: hover ? 'translateY(-3px)' : 'translateY(0)',
        transition: TRANSITION,
      }}
    >
      <span style={tileStyle(isMono ? catColor : brand, 42, 11, logo, 24)}>
        {isMono ? (
          <span style={{
            fontFamily: F.mono, fontSize: 12, fontWeight: 700, color: catColor,
          }}>{item.mono}</span>
        ) : null}
      </span>
      <span style={{
        fontSize: 13, fontWeight: 500, color: C.text1, lineHeight: 1.35, minWidth: 0,
      }}>{item.label}</span>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export function SkillsSectionWrapper({ sectionRef }: { sectionRef?: React.Ref<View> }) {
  const [active, setActive] = useState(0);
  const { currentLanguage } = useI18n();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();

  const L = currentLanguage === 'en' ? COPY.en : COPY.pt;
  const isMobile = width < MOBILE_BP;
  const domain = DOMAINS[active];

  const cols = isMobile ? (width < 520 ? 1 : 2) : 3;

  return (
    <Section ref={sectionRef} style={{ justifyContent: 'flex-start' } as object}>
      {/* Título da seção FORA do card, no mesmo padrão de Projetos/Estudos/Contato. */}
      <SectionSeparator label={t('section_skills')} />

      <div style={{
        fontFamily: `'${F.body}',system-ui,sans-serif`,
        background: C.bgCard,
        border: `1px solid ${C.border}`,
        borderRadius: 20,
        overflow: 'hidden',
        width: '100%',
      }}>

        {/* ── Header do card ── */}
        <div style={{
          padding: isMobile ? '26px 20px 22px' : '34px 36px 28px',
          background: 'radial-gradient(120% 130% at 50% -30%, #0f1622 0%, #0b0c0f 62%)',
          borderBottom: `1px solid ${C.borderSep}`,
        }}>
          <h2 style={{
            margin: 0, fontSize: isMobile ? 20 : 25, fontWeight: 700,
            letterSpacing: '-.025em', color: C.text1, lineHeight: 1.25,
          }}>{L.title}</h2>
        </div>

        {/* ── Split ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '262px 1fr',
          minHeight: isMobile ? undefined : 430,
        }}>

          {/* Rail */}
          <div style={{
            borderRight: isMobile ? 'none' : `1px solid ${C.borderSep}`,
            borderBottom: isMobile ? `1px solid ${C.borderSep}` : 'none',
            padding: isMobile ? '14px 12px' : '20px 16px',
            background: C.bgRail,
            display: 'flex',
            flexDirection: isMobile ? 'row' : 'column',
            gap: isMobile ? 6 : 3,
            overflowX: isMobile ? 'auto' : 'visible',
          }}>
            {!isMobile ? (
              <div style={{
                fontFamily: F.mono, fontSize: 9.5, letterSpacing: '.2em',
                textTransform: 'uppercase', color: C.dimmer,
                padding: '0 10px', marginBottom: 11,
              }}>{L.rail}</div>
            ) : null}

            {DOMAINS.map((d, i) => (
              <div key={d.name} style={{ flexShrink: 0 }}>
                <DomainTab
                  domain={d}
                  index={i}
                  active={i === active}
                  onSelect={setActive}
                />
              </div>
            ))}
          </div>

          {/* Panel */}
          <div style={{ padding: isMobile ? '20px 18px 24px' : '26px 30px 30px' }}>
            <h3 style={{
              margin: '0 0 22px', fontSize: 20, fontWeight: 700,
              letterSpacing: '-.02em', color: domain.color,
            }}>{domain.name}</h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
              gap: 11,
            }}>
              {domain.items.map((it) => (
                <SkillCard key={it.label} item={it} catColor={domain.color} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </Section>
  );
}
