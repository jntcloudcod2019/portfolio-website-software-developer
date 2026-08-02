import React, {
  useEffect,
  useRef,
  useState } from 'react';
import {
  Animated,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { Text } from '@/components/ui/AppText';

import { Section } from '@/components/layout/Section';
import { useTranslation } from 'react-i18next';
import { useI18n } from '@/context/I18nProvider';

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
    accent: '#38bdf8', mono: 'TIN',
    role: 'Engenheiro de Software Full-Stack | InfoMoney',
    roleEn: 'Full-Stack Software Engineer | InfoMoney',
    company: 'XP Inc.', type: 'Tempo integral',
    period: 'novembro de 2025 - julho de 2026', duration: '9 meses', location: 'São Paulo, Brasil · Híbrido',
    summary:
      'Atuação como Engenheiro de Software Full Stack no ecossistema do portal InfoMoney, desenvolvendo e escalando recursos de alta visibilidade e tráfego na web.',
    summaryEn:
      'Worked as a Full-Stack Software Engineer in the InfoMoney portal ecosystem, building and scaling high-visibility, high-traffic web features.',
    bullets: [
      'Participação ativa no ciclo de vida de desenvolvimento ágil orientado por demandas no Azure DevOps, colaborando de ponta a ponta com os times de UX e QA a partir de especificações e tokens de design do Figma',
      'Desenvolvimento e documentação de componentes de interface isolados no Storybook, garantindo consistência visual e reusabilidade',
      'Implementação dos componentes na aplicação principal em WordPress / PHP, estruturando blocos dinâmicos em Gutenberg com integração front-end em React e JavaScript moderno (ES6+)',
      'Garantia de qualidade e confiabilidade do código backend por meio da criação de testes unitários robustos utilizando PHPUnit',
    ],
    bulletsEn: [
      'Actively participated in the demand-driven agile development cycle in Azure DevOps, collaborating end-to-end with UX and QA teams based on Figma specs and design tokens',
      'Developed and documented isolated UI components in Storybook, ensuring visual consistency and reusability',
      'Implemented components in the main WordPress / PHP application, building dynamic Gutenberg blocks with front-end integration in React and modern JavaScript (ES6+)',
      'Ensured backend code quality and reliability by creating robust unit tests using PHPUnit',
    ],
    stack: ['TypeScript', 'React', 'JavaScript (ES6+)', 'Storybook', 'WordPress', 'Gutenberg', 'PHP', 'PHPUnit', 'HTML', 'CSS', 'Figma', 'Azure DevOps'],
  },
  {
    accent: '#34d399', mono: 'PG',
    role: 'Engenheiro de Software | Líder Técnico',
    roleEn: 'Software Engineer | Technical Lead',
    company: 'PREGIATO', type: 'PJ',
    period: 'jan 2025 — mai 2026', duration: '1 ano 5 meses', location: 'São Paulo ',
    summary:
      'Empreendi como Líder Técnico na construção do MVP à operação de uma plataforma SaaS multi-domínio end-to-end para gestão de agências de modelos.',
    summaryEn:
      'Acted as Technical Lead building a multi-tenant SaaS platform for modeling agencies from MVP to production.',
    bullets: [
      'Concebi e implementei do zero uma plataforma SaaS multi-domínio para gestão de agências de modelos, cobrindo CRM de leads, atendimento omnichannel via WhatsApp, geração e assinatura digital de contratos e plataforma de treinamentos',
      'Projetei uma arquitetura distribuída event-driven com três serviços independentes — API .NET 8 (C#), SPA React/TypeScript e bot Node.js — desacoplados por RabbitMQ (7 filas duráveis, mensagens persistentes e ack manual), com atualização em tempo real de ponta a ponta via SignalR',
      'Estruturei o back-end em Clean/Hexagonal Architecture (Core sem dependências externas, portas e adapters para storage), com EF Core 8',
      'Implementei resiliência de canal externo — circuit breaker, retry com backoff exponencial e dead-letter queue — com integração à WhatsApp Cloud API (Meta Graph), autenticação de usuários com Clerk, storage S3-compatible (MinIO) para mídias pesadas e integração com a API do Autentique',
    ],
    bulletsEn: [
      'Conceived and implemented a multi-domain SaaS platform for modeling agencies, covering lead CRM, omnichannel WhatsApp support, digital contract generation and signing, and a training platform',
      'Designed an event-driven distributed architecture with three independent services — .NET 8 (C#) API, React/TypeScript SPA and Node.js bot — decoupled via RabbitMQ (7 durable queues, persistent messages, manual ack), with real-time end-to-end updates via SignalR',
      'Structured the backend using Clean/Hexagonal Architecture (external-independent Core, ports, and adapters for storage), with EF Core 8',
      'Implemented external-channel resilience — circuit breaker, exponential backoff retry and dead-letter queue — with WhatsApp Cloud API (Meta Graph) integration, user authentication with Clerk, S3-compatible storage (MinIO) for heavy media, and integration with the Autentique API',
    ],
    stack: ['C#', '.NET 8', 'ASP.NET Web API', 'Entity Framework Core', 'MySQL', 'RabbitMQ', 'SignalR', 'Node.js', 'React', 'TypeScript', 'Docker', 'MinIO (S3)', 'Clerk'],
  },
  {
    accent: '#f5a623', mono: 'AC',
    role: 'Engenheiro de Software .NET | BTG Pactual',
    roleEn: 'Software Engineer .NET',
    company: 'act digital', type: 'Cliente: BTG Pactual',
    typeEn: 'Client: BTG Pactual',
    period: 'jun 2024 — mai 2025', duration: '1 ano', location: 'São Paulo · Híbrido',
    summary:
      'Atuação em ambiente de alta criticidade no sistema de contestações de cartão no BTG Pactual, desenvolvendo e sustentando o core da plataforma de chargeback.',
    summaryEn:
      'Worked in a high-criticality environment on BTG Pactual\'s dispute system, building and supporting the core of the chargeback platform.',
    bullets: [
      'Desenvolvimento de serviços back-end em C# / .NET Core para o sistema de Chargeback (CBK), orquestrando o ciclo de vida completo de contestações de compras com cartão de crédito',
      'Implementação de arquiteturas orientadas a eventos e workflows assíncronos utilizando AWS SQS, assegurando escalabilidade, resiliência e estratégias seguras de reprocessamento para o fluxo de contestações',
      'Sustentação e observabilidade de ponta a ponta, abrangendo persistência transacional otimizada em PostgreSQL / AWS RDS e monitoramento proativo em produção com Datadog e Grafana',
    ],
    bulletsEn: [
      'Developed backend services in C# / .NET Core for the Chargeback (CBK) system, orchestrating the full lifecycle of credit-card purchase disputes',
      'Implemented event-driven architectures and asynchronous workflows using AWS SQS, ensuring scalability, resilience and safe reprocessing strategies for the disputes lifecycle',
      'Delivered end-to-end support and observability, covering optimized transactional persistence on PostgreSQL / AWS RDS and proactive production monitoring with Datadog and Grafana',
    ],
    stack: ['C#', '.NET Core', 'AWS SQS', 'PostgreSQL', 'AWS RDS', 'Datadog', 'Grafana'],
  },
  {
    accent: '#38bdf8', mono: 'MH',
    role: 'Engenheiro de Software | Bradesco',
    roleEn: 'Software Engineer | Bradesco',
    company: 'My Hunter', type: 'Bradesco | API Studio',
    typeEn: 'Bradesco | API Studio',
    period: 'set 2023 — jun 2024', duration: '10 meses', location: 'São Paulo · Híbrido',
    summary:
      'Atuação estratégica como Developer Relations (DevRel) acelerando o consumo de APIs de pagamento de alto volume por parceiros e clientes, do Sandbox à produção.',
    summaryEn:
      'Strategic Developer Relations (DevRel) role accelerating adoption of high-volume payment APIs by partners and clients, from sandbox to production.',
    bullets: [
      'Atuação estratégica como Developer Relations (DevRel) focado no processo de homologação técnica (Technical Onboarding) de parceiros e clientes para consumo de APIs de pagamento, liderando desde o provisionamento em ambiente de Sandbox e execução de processos de testes obrigatórios (Test Cases) até a certificação e promoção para produção',
      'Responsável pela sustentação e operação de APIs de pagamento de alto volume, garantindo a resiliência operacional por meio de monitoramento ativo, alertas preditivos, gestão de falhas transacionais e de autenticações, governança de ciclos de vida de certificados digitais',
    ],
    bulletsEn: [
      'Strategic Developer Relations (DevRel) role focused on the technical onboarding process for partners and clients consuming payment APIs, leading everything from Sandbox provisioning and mandatory test execution (Test Cases) through certification and promotion to production',
      'Responsible for the support and operation of high-volume payment APIs, ensuring operational resilience through active monitoring, predictive alerts, management of transactional and authentication failures, and digital-certificate lifecycle governance',
    ],
    stack: ['Java', 'REST APIs', 'Postman', 'Bitbucket', 'Azure DevOps'],
  },
  {
    accent: '#a78bfa', mono: 'IT',
    role: 'Engenheiro de Software Jr',
    roleEn: 'Jr Software Engineer',
    company: 'Itaú Unibanco', type: 'Tempo integral',
    typeEn: 'Full-time',
    period: 'jun 2021 — jun 2023', duration: '2 anos 1 mês', location: 'São Paulo',
    summary:
      'Atuação na Comunidade de Riscos (Pricing, Liquidez, Risco de Mercado e Risco de Crédito Regulatório) em ambientes de criticidade e rigor regulatório, processando grandes volumes de dados para alimentar sistemas internos essenciais à sustentação de plataformas de precificação e risco de mercado, com foco na disponibilidade e integridade das informações.',
    summaryEn:
      'Worked in the Risk Community (Pricing, Liquidity, Market Risk and Regulatory Credit Risk) in critical, regulatory-rigor environments, processing large data volumes to feed internal systems essential to pricing and market-risk platforms, with a focus on data availability and integrity.',
    bullets: [
      'Sustentei plataformas críticas de precificação e risco no Itaú, dentro da Comunidade de Riscos, atuando em processos de alto rigor regulatório com foco na disponibilidade e integridade das informações',
      'Participação ativa na estratégia de migração de sistemas legados em Mainframe (COBOL, DB2, JCL) para a nuvem AWS, modernizando plataformas de precificação de ativos financeiros, como ações offshore e debêntures',
      'Atuação no modelo de sustentação em produção, garantindo a resolução de incidentes e disponibilidade dos serviços e sistemas',
      'Desenvolvimento e manutenção de soluções em arquitetura distribuída, com criação de pipelines de CI/CD voltados para a migração e otimização de rotinas batch (processamento em lote)',
      'Concepção e implementação de APIs e motores de ETL para integrações com grandes provedores e bolsas de dados do mercado financeiro, incluindo Bloomberg, B3, FGV e New York Stock Exchange',
    ],
    bulletsEn: [
      'Supported critical pricing and risk platforms at Itaú, within the Risk Community, acting on highly regulated processes with a focus on data availability and integrity',
      'Actively participated in migrating legacy Mainframe systems (COBOL, DB2, JCL) to AWS cloud, modernizing pricing platforms for financial assets such as offshore equities and debentures',
      'Acted in the production support model, ensuring incident resolution and the availability of services and systems',
      'Developed and maintained solutions in distributed architecture, building CI/CD pipelines for migrating and optimizing batch-processing routines',
      'Designed and implemented APIs and ETL engines for integrations with major financial-market data providers and exchanges, including Bloomberg, B3, FGV and the New York Stock Exchange',
    ],
    stack: ['C#', '.NET', 'SQL Server', 'Oracle', 'COBOL', 'DB2', 'AWS', 'JCL', 'ETL', 'CI/CD'],
  },
  {
    accent: '#fb7185', mono: 'IT',
    role: 'Estagiário Engenharia de Software',
    roleEn: 'Software Engineering  Intern',
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
    role: 'Estagiário de Infraestrutura ',
    roleEn: 'Infrastructure Intern',
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
        Animated.timing(opacity, { toValue: 0.35, duration: 900, useNativeDriver: Platform.OS !== 'web' }),
        Animated.timing(opacity, { toValue: 1,    duration: 900, useNativeDriver: Platform.OS !== 'web' }),
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
  const { t } = useTranslation();
  const leftWeb: object =
    Platform.OS === 'web' ? { background: 'linear-gradient(to right, transparent, #374151)' } : {};
  const rightWeb: object =
    Platform.OS === 'web' ? { background: 'linear-gradient(to left, transparent, #374151)' } : {};

  return (
    <View style={styles.headerRow}>
      <View style={[styles.headerLine, leftWeb]} />
      <Text style={[styles.headerText, { fontFamily: MONO }]}>{t('section_experience')}</Text>
      <View style={[styles.headerLine, rightWeb]} />
    </View>
  );
}

// ─── Timeline Item ────────────────────────────────────────────────────────────

function TimelineItem({ item, isLast }: { item: Experiencia; isLast: boolean }) {
  const [hovered, setHovered] = useState(false);
  const { currentLanguage } = useI18n();

  const isEn      = currentLanguage === 'en';
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
