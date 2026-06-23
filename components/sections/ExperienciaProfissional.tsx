import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Section } from '@/components/layout/Section';
import { useAppConfig, useTranslations } from '@/context/AppConfigContext';

// ─── Types & Data ─────────────────────────────────────────────────────────────

interface Experiencia {
  accent:     string;
  mono:       string;
  status?:    string;
  role:       string;
  roleEn?:    string;
  company:    string;
  type:       string;
  typeEn?:    string;
  period:     string;
  duration:   string;
  location:   string;
  summary:    string;
  summaryEn:  string;
  bullets:    string[];
  bulletsEn:  string[];
  stack:      string[];
}

const EXPERIENCIAS: Experiencia[] = [
  {
    accent: '#34d399', mono: 'PG',
    role: 'Tech Services Lead',
    company: 'PREGIATO', type: 'Freelance',
    period: 'jan 2025 — mai 2026', duration: '1 ano 5 meses', location: 'São Paulo · Remoto',
    summary:
      'Tech Lead de uma plataforma SaaS para agência de modelos — do design da arquitetura ao deploy em produção: cadastro de talentos, agendamentos, portfólio, contratos em PDF, autenticação e notificações via WhatsApp e e-mail.',
    summaryEn:
      'Tech Lead of a SaaS platform for a talent agency — from architecture design to production deployment: talent registration, scheduling, portfolio, PDF contracts, authentication, and notifications via WhatsApp and email.',
    bullets: [
      'Projetei a arquitetura de microsserviços com .NET Core 8 e Node.js, garantindo escalabilidade e independência entre os módulos',
      'Defini toda a stack: mensageria com RabbitMQ, PostgreSQL + Entity Framework, autenticação stateless com JWT e observabilidade com Serilog',
      'Construí o pipeline de CI/CD com GitHub e Railway — deploy contínuo; produto no ar em pregiato.com.br',
    ],
    bulletsEn: [
      'Designed the microservices architecture with .NET Core 8 and Node.js, ensuring scalability and module independence',
      'Defined the full stack: messaging with RabbitMQ, PostgreSQL + Entity Framework, stateless authentication with JWT, and observability with Serilog',
      'Built the CI/CD pipeline with GitHub and Railway — continuous deployment; product live at pregiato.com.br',
    ],
    stack: ['C#', '.NET Core 8', 'Node.js', 'PostgreSQL', 'Entity Framework', 'RabbitMQ', 'Docker', 'JWT', 'Serilog', 'Railway'],
  },
  {
    accent: '#f5a623', mono: 'AC',
    role: 'Desenvolvedor .NET Pleno',
    roleEn: '.NET Developer (Mid-level)',
    company: 'act digital', type: 'Cliente: BTG Pactual',
    typeEn: 'Client: BTG Pactual',
    period: 'jun 2024 — mai 2025', duration: '1 ano', location: 'São Paulo · Híbrido',
    summary:
      'No time de Chargeback do BTG Pactual — área que orquestra todo o ciclo de contestações de compras com cartão de crédito, com impacto direto na experiência do cliente e na integridade financeira do banco.',
    summaryEn:
      'On the Chargeback team at BTG Pactual — the area orchestrating the full credit card dispute lifecycle, with direct impact on customer experience and the bank\'s financial integrity.',
    bullets: [
      'Evoluí o sistema CBK: modelagem de domínio com DDD e fluxos assíncronos com AWS SQS para orquestração das contestações em escala',
      'Construí serviços backend em C#/.NET Core com Arquitetura Hexagonal — código desacoplado, testável e aderente a regras complexas',
      'Implementei testes unitários, de integração e E2E, reduzindo regressões em um sistema crítico e regulado',
    ],
    bulletsEn: [
      'Evolved the CBK system: domain modeling with DDD and async flows with AWS SQS to orchestrate disputes at scale',
      'Built backend services in C#/.NET Core with Hexagonal Architecture — decoupled, testable code compliant with complex business rules',
      'Implemented unit, integration, and E2E tests, reducing regressions in a critical and regulated system',
    ],
    stack: ['C#', '.NET Core', 'Entity Framework', 'Dapper', 'PostgreSQL', 'AWS (SQS, S3, Athena, RDS)', 'DataDog', 'Grafana', 'Azure DevOps'],
  },
  {
    accent: '#38bdf8', mono: 'MH',
    role: 'Analista de API',
    roleEn: 'API Analyst',
    company: 'My Hunter', type: 'Cliente: Bradesco | API Studio',
    typeEn: 'Client: Bradesco | API Studio',
    period: 'set 2023 — jun 2024', duration: '10 meses', location: 'São Paulo · Híbrido',
    summary:
      'Integração end-to-end de APIs de pagamento do Bradesco para clientes estratégicos como Shopee, GringoPay e Globo, garantindo qualidade e estabilidade em produção.',
    summaryEn:
      'End-to-end integration of Bradesco payment APIs for strategic clients including Shopee, GringoPay, and Globo, ensuring quality and stability in production.',
    bullets: [
      'Conduzi integrações ponta a ponta (discovery → homologação → produção) para contas de alto volume transacional',
      'Atuei como principal ponto técnico na resolução de incidentes em produção, garantindo SLA e continuidade operacional',
      'Integrei modalidades críticas de pagamento: Boleto, PIX, Financiamentos e Débito Veicular',
    ],
    bulletsEn: [
      'Led end-to-end integrations (discovery → homologation → production) for high-volume transactional accounts',
      'Served as the primary technical point for production incident resolution, ensuring SLA compliance and operational continuity',
      'Integrated critical payment methods: Boleto, PIX, Installment Financing, and Vehicle Debit',
    ],
    stack: ['Java', 'REST APIs', 'Postman', 'Bitbucket', 'Azure DevOps'],
  },
  {
    accent: '#a78bfa', mono: 'IT',
    role: 'Engenheiro de Software Jr',
    roleEn: 'Jr Software Engineer',
    company: 'Itaú Unibanco', type: 'Tempo integral',
    typeEn: 'Full-time',
    period: 'jun 2021 — jun 2023', duration: '2 anos 1 mês', location: 'Remoto',
    summary:
      'No coração dos sistemas financeiros do Itaú — área de Risco de Mercado e Capital de Risco de Crédito Regulatório, em ambiente de alta criticidade e complexidade regulatória.',
    summaryEn:
      'At the core of Itaú\'s financial systems — Market Risk and Regulatory Credit Risk Capital unit, in a high-criticality and regulatory-complexity environment.',
    bullets: [
      'Migração de sistemas legados Mainframe (COBOL, DB2, JCL) para cloud AWS, modernizando a precificação de ativos como ações offshore e debêntures',
      'Sustentação de sistemas de precificação e risco de mercado, garantindo disponibilidade e integridade de dados sensíveis',
      'Desenvolvi soluções em .NET/C# integradas a Oracle e SQL Server; metodologia Ágil (Scrum) orientada a OKRs',
    ],
    bulletsEn: [
      'Migration of legacy Mainframe systems (COBOL, DB2, JCL) to AWS cloud, modernizing the pricing of assets such as offshore equities and debentures',
      'Maintenance of pricing and market risk systems, ensuring availability and integrity of sensitive data',
      'Developed .NET/C# solutions integrated with Oracle and SQL Server; Agile/Scrum methodology driven by OKRs',
    ],
    stack: ['C#', '.NET', 'SQL Server', 'Oracle', 'COBOL', 'DB2', 'AWS', 'JCL', 'Azure DevOps'],
  },
  {
    accent: '#fb7185', mono: 'IT',
    role: 'Estagiário de Engenharia',
    roleEn: 'Engineering Intern',
    company: 'Itaú Unibanco', type: 'Estágio',
    typeEn: 'Internship',
    period: 'set 2019 — jun 2021', duration: '1 ano 10 meses', location: 'Presencial',
    summary:
      'Primeiros passos em engenharia de software dentro do Itaú, com foco em metodologias ágeis e bases de dados em ambiente bancário de alta complexidade.',
    summaryEn:
      'First steps in software engineering at Itaú, focused on agile methodologies and databases in a high-complexity banking environment.',
    bullets: [
      'Apoio ao desenvolvimento e sustentação de sistemas financeiros críticos',
      'Atuação com metodologias Agile e bases de dados DB2',
    ],
    bulletsEn: [
      'Support for development and maintenance of critical financial systems',
      'Working with Agile methodologies and DB2 databases',
    ],
    stack: ['Metodologias Agile', 'DB2', 'SQL'],
  },
  {
    accent: '#94a3b8', mono: 'MP',
    role: 'Estagiário de TI',
    roleEn: 'IT Intern',
    company: 'Moraes Pitombo Advogados', type: 'Meio período',
    typeEn: 'Part-time',
    period: 'jul 2018 — set 2019', duration: '1 ano 3 meses', location: 'São Paulo · No local',
    summary:
      'Suporte de infraestrutura e TI em escritório de advocacia — redes, servidores, banco de dados e segurança.',
    summaryEn:
      'Infrastructure and IT support at a law firm — networks, servers, databases, and security.',
    bullets: [
      'Suporte a usuários e administração de redes (Windows Server)',
      'Gestão de banco de dados (backups, performance e manutenção) e segurança de redes (Cisco, PFSense)',
      'Manutenção de sites (WordPress) e operação do TOTVS',
    ],
    bulletsEn: [
      'User support and network administration (Windows Server)',
      'Database management (backups, performance, and maintenance) and network security (Cisco, PFSense)',
      'Website maintenance (WordPress) and TOTVS system operation',
    ],
    stack: ['Windows Server', 'Cisco', 'PFSense', 'WordPress', 'TOTVS'],
  },
];

// ─── Constants ────────────────────────────────────────────────────────────────

const MONO = Platform.select({
  web: '"JetBrains Mono", "Courier New", monospace',
  ios: 'Courier',
  android: 'monospace',
  default: 'monospace',
});

const TRACK_WIDTH  = 46;
const HALO_SIZE    = 24;
const ITEM_GAP     = 28;
const CONNECTOR_TOP  = 4 + HALO_SIZE + 6;
const CONNECTOR_LEFT = (TRACK_WIDTH - 2) / 2;

const HoverableView = View as React.ComponentType<
  React.ComponentProps<typeof View> & {
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
  }
>;

// ─── Node ─────────────────────────────────────────────────────────────────────

function Node({ accent, pulse }: { accent: string; pulse: boolean }) {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!pulse) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.35, duration: 900, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1,    duration: 900, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity, pulse]);

  const inner = (
    <View style={[styles.nodeHalo, { backgroundColor: accent + '1a' }]}>
      <View style={[styles.nodeCore, { borderColor: accent }]} />
    </View>
  );

  return pulse ? <Animated.View style={{ opacity }}>{inner}</Animated.View> : inner;
}

// ─── Status Pill ─────────────────────────────────────────────────────────────

function StatusPill({ status, accent }: { status: string; accent: string }) {
  return (
    <View style={[styles.pill, { backgroundColor: accent + '14', borderColor: accent + '33' }]}>
      <View style={[styles.pillDot, { backgroundColor: accent }]} />
      <Text style={[styles.pillText, { color: accent, fontFamily: MONO }]}>
        {status.toUpperCase()}
      </Text>
    </View>
  );
}

// ─── Stack Chip ──────────────────────────────────────────────────────────────

function StackChip({ label }: { label: string }) {
  return (
    <View style={styles.chip}>
      <Text style={[styles.chipText, { fontFamily: MONO }]}>{label}</Text>
    </View>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader() {
  const t = useTranslations();
  const leftWeb: object =
    Platform.OS === 'web' ? { background: 'linear-gradient(to right, transparent, #374151)' } : {};
  const rightWeb: object =
    Platform.OS === 'web' ? { background: 'linear-gradient(to left, transparent, #374151)' } : {};

  return (
    <View style={styles.headerRow}>
      <View style={[styles.headerLine, leftWeb]} />
      <Text style={[styles.headerText, { fontFamily: MONO }]}>{t['section_experience']}</Text>
      <View style={[styles.headerLine, rightWeb]} />
    </View>
  );
}

// ─── Timeline Item ────────────────────────────────────────────────────────────

function TimelineItem({ item, isLast }: { item: Experiencia; isLast: boolean }) {
  const [hovered, setHovered] = useState(false);
  const { lang } = useAppConfig();

  const isEn      = lang === 'en';
  const role      = isEn ? (item.roleEn    ?? item.role)    : item.role;
  const type      = isEn ? (item.typeEn    ?? item.type)    : item.type;
  const summary   = isEn ? item.summaryEn  : item.summary;
  const bullets   = isEn ? item.bulletsEn  : item.bullets;

  const cardTransitionWeb: object =
    Platform.OS === 'web'
      ? { transition: 'all 0.22s cubic-bezier(0.4, 0, 0.2, 1)' }
      : {};
  const cardHoverWeb: object =
    hovered && Platform.OS === 'web'
      ? {
          boxShadow: `0 0 0 1px ${item.accent}45, 0 16px 48px ${item.accent}14`,
          transform: 'translateY(-2px)',
        }
      : {};

  return (
    <HoverableView
      style={[styles.itemRow, isLast && styles.itemRowLast]}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Track */}
      <View style={styles.trackCol}>
        <Node accent={item.accent} pulse={!!item.status} />
        {!isLast && (
          <View
            style={[
              styles.connector,
              {
                backgroundColor: item.accent + '33',
                position: 'absolute',
                top:    CONNECTOR_TOP,
                bottom: -(ITEM_GAP),
                left:   CONNECTOR_LEFT,
                width:  2,
              },
            ]}
          />
        )}
      </View>

      {/* Card */}
      <View
        style={[
          styles.card,
          {
            borderTopColor:  hovered ? item.accent : item.accent + '80',
            borderColor:     hovered ? '#2a3040' : '#1c1f26',
            backgroundColor: hovered ? '#141820' : '#101216',
          },
          cardHoverWeb as object,
          cardTransitionWeb as object,
        ]}
      >
        {/* Role + status */}
        <View style={styles.topRow}>
          <Text style={[styles.roleText, hovered && { color: '#ffffff' }]}>{role}</Text>
          {item.status != null && <StatusPill status={item.status} accent={item.accent} />}
        </View>

        {/* Company · type */}
        <Text style={styles.subtitleRow} numberOfLines={1}>
          <Text style={styles.company}>{item.company}</Text>
          <Text style={styles.sep}> · </Text>
          <Text style={styles.typeText}>{type}</Text>
        </Text>

        {/* Meta: period · duration · location */}
        <Text style={[styles.meta, { fontFamily: MONO }]}>
          {item.period} · {item.duration} · {item.location}
        </Text>

        {/* Summary */}
        <Text style={styles.summary}>{summary}</Text>

        {/* Bullets */}
        <View style={styles.bulletsWrap}>
          {bullets.map((bullet, i) => (
            <View key={i} style={styles.bulletRow}>
              <View style={[styles.bulletDot, { backgroundColor: item.accent }]} />
              <Text style={styles.bulletText}>{bullet}</Text>
            </View>
          ))}
        </View>

        {/* Stack chips */}
        <View style={styles.stackRow}>
          {item.stack.map((tech) => (
            <StackChip key={tech} label={tech} />
          ))}
        </View>
      </View>
    </HoverableView>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export function ExperienciaProfissional({ sectionRef }: { sectionRef?: React.Ref<View> }) {
  return (
    <Section ref={sectionRef} style={styles.sectionOverride as object}>
      <SectionHeader />
      <View>
        {EXPERIENCIAS.map((exp, index) => (
          <TimelineItem
            key={`${exp.company}-${exp.role}`}
            item={exp}
            isLast={index === EXPERIENCIAS.length - 1}
          />
        ))}
      </View>
    </Section>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  sectionOverride: {
    justifyContent: 'flex-start',
  },

  /* Section header */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 40,
  },
  headerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#374151',
  },
  headerText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9ca3af',
    letterSpacing: 4,
    textTransform: 'uppercase',
  },

  /* Timeline row */
  itemRow: {
    flexDirection: 'row',
    marginBottom: ITEM_GAP,
  },
  itemRowLast: {
    marginBottom: 0,
  },

  /* Track column */
  trackCol: {
    width: TRACK_WIDTH,
    alignItems: 'center',
    paddingTop: 4,
    position: 'relative',
  },
  connector: {
    borderRadius: 1,
  },

  /* Node */
  nodeHalo: {
    width: HALO_SIZE,
    height: HALO_SIZE,
    borderRadius: HALO_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeCore: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#0a0b0d',
    borderWidth: 3,
  },

  /* Card */
  card: {
    flex: 1,
    borderWidth: 1,
    borderTopWidth: 2,
    borderRadius: 16,
    padding: 24,
    gap: 10,
  },

  /* Top row */
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  roleText: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#e8eaed',
    lineHeight: 26,
  },

  /* Status pill */
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 6,
  },
  pillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  pillText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
  },

  /* Subtitle */
  subtitleRow: {
    fontSize: 14,
  },
  company: {
    color: '#cdd1d7',
    fontWeight: '500',
  },
  sep: {
    color: '#4b5563',
  },
  typeText: {
    color: '#9ca3af',
  },

  /* Meta */
  meta: {
    fontSize: 11.5,
    color: '#6b7280',
    lineHeight: 18,
  },

  /* Summary */
  summary: {
    fontSize: 14,
    color: '#b7bcc4',
    lineHeight: 22,
  },

  /* Bullets */
  bulletsWrap: {
    gap: 8,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  bulletDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginTop: 6,
    flexShrink: 0,
  },
  bulletText: {
    flex: 1,
    fontSize: 13.5,
    color: '#9aa0a8',
    lineHeight: 21,
  },

  /* Stack */
  stackRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  chip: {
    backgroundColor: '#15171c',
    borderWidth: 1,
    borderColor: '#23272f',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 9,
  },
  chipText: {
    fontSize: 11,
    color: '#9ca3af',
  },
});
