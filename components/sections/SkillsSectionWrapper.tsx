import React, { useState } from 'react';
import {
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { Text } from '@/components/ui/AppText';

import { Section } from '@/components/layout/Section';
import { SectionSeparator } from '@/components/ui/SectionSeparator';
import { useTranslation } from 'react-i18next';
import { useI18n } from '@/context/I18nProvider';

// ─── Types & Data ─────────────────────────────────────────────────────────────

interface SkillTopic {
  accent:   string;
  label:    string;
  labelEn:  string;
  items:    string[];
  itemsEn?: string[];
}

const TOPICS: SkillTopic[] = [
  {
    accent: '#a78bfa',
    label: 'Back-end', labelEn: 'Back-end',
    items: ['C#', '.NET Core 6-10', 'Entity Framework', 'Dapper', 'LINQ', 'Node.js', 'TypeScript', 'COBOL', 'PHP'],
  },
  {
    accent: '#61dafb',
    label: 'Front-end', labelEn: 'Front-end',
    items: ['React Native', 'Angular', 'WordPress', 'HTML', 'CSS', 'JavaScript'],
  },
  {
    accent: '#34d399',
    label: 'Banco de Dados', labelEn: 'Databases',
    items: ['SQL Server', 'Oracle', 'PostgreSQL', 'MySQL', 'MongoDB'],
  },
  {
    accent: '#8b6ff0',
    label: 'Arquiteturas', labelEn: 'Architectures',
    items: ['Microsserviços', 'Hexagonal', 'DDD', 'CQRS', 'Event-Driven', 'SOLID', 'Design Patterns'],
    itemsEn: ['Microservices', 'Hexagonal', 'DDD', 'CQRS', 'Event-Driven', 'SOLID', 'Design Patterns'],
  },
  {
    accent: '#ff9f2e',
    label: 'Mensageria', labelEn: 'Messaging',
    items: ['RabbitMQ', 'Apache Kafka', 'AWS SQS', 'ActiveMQ'],
  },
  {
    accent: '#38bdf8',
    label: 'Cloud', labelEn: 'Cloud',
    items: ['AWS Certified Cloud Practitioner', 'Azure', 'Railway'],
  },
  {
    accent: '#5b8def',
    label: 'DevOps / CI-CD', labelEn: 'DevOps / CI-CD',
    items: ['Azure DevOps', 'GitHub Actions', 'Docker', 'Kubernetes'],
  },
  {
    accent: '#fb7185',
    label: 'Qualidade', labelEn: 'Quality',
    items: ['TDD', 'Testes unitários', 'Testes de integração', 'E2E', 'Code review'],
    itemsEn: ['TDD', 'Unit tests', 'Integration tests', 'E2E', 'Code review'],
  },
  {
    accent: '#f5a623',
    label: 'Observabilidade', labelEn: 'Observability',
    items: ['Datadog', 'Grafana', 'Serilog', 'OpenTelemetry (OTel)'],
  },
  {
    accent: '#94a3b8',
    label: 'IA & LLMs', labelEn: 'AI & LLMs',
    items: ['Claude', 'Copilot', 'OpenCode', 'Cursor (Grok)', 'MCPs', 'RAG', 'Azure AI Foundry'],
  },
];

// ─── Constants ────────────────────────────────────────────────────────────────

const MONO = Platform.select({
  web: '"JetBrains Mono", "Courier New", monospace',
  ios: 'Courier',
  android: 'monospace',
  default: 'monospace',
});

const HoverableView = View as React.ComponentType<
  React.ComponentProps<typeof View> & {
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
  }
>;

// ─── Skill Chip ───────────────────────────────────────────────────────────────

function SkillChip({ label, accent, hovered }: { label: string; accent: string; hovered: boolean }) {
  const chipTransitionWeb: object =
    Platform.OS === 'web' ? { transition: 'all 0.2s ease' } : {};

  return (
    <View
      style={[
        styles.chip,
        hovered && { borderColor: accent + '45', backgroundColor: accent + '0e' },
        chipTransitionWeb as object,
      ]}
    >
      <Text style={[styles.chipText, { fontFamily: MONO }, hovered && styles.chipTextHovered]}>
        {label}
      </Text>
    </View>
  );
}

// ─── Topic Row ────────────────────────────────────────────────────────────────

function TopicRow({ topic, striped }: { topic: SkillTopic; striped: boolean }) {
  const [hovered, setHovered] = useState(false);
  const { currentLanguage } = useI18n();

  const isEn = currentLanguage === 'en';
  const label = isEn ? topic.labelEn : topic.label;
  const items = isEn ? (topic.itemsEn ?? topic.items) : topic.items;

  const rowTransitionWeb: object =
    Platform.OS === 'web' ? { transition: 'background-color 0.2s ease' } : {};

  return (
    <HoverableView
      style={[
        styles.topicRow,
        striped && styles.topicRowStriped,
        hovered && { backgroundColor: topic.accent + '0f' },
        rowTransitionWeb as object,
      ]}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Accent bar */}
      <View style={[styles.accentBar, { backgroundColor: topic.accent }]} />

      {/* Label + chips */}
      <View style={styles.topicBody}>
        <Text style={[styles.topicLabel, { color: topic.accent, fontFamily: MONO }]}>
          {label}
        </Text>
        <View style={styles.chipsRow}>
          {items.map((item) => (
            <SkillChip key={item} label={item} accent={topic.accent} hovered={hovered} />
          ))}
        </View>
      </View>
    </HoverableView>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export function SkillsSectionWrapper({ sectionRef }: { sectionRef?: React.Ref<View> }) {
  const { t } = useTranslation();

  return (
    <Section ref={sectionRef} style={styles.sectionOverride as object}>
      <SectionSeparator label={t('section_skills')} />
      <Text style={styles.subtitle}>{t('section_skills_sub')}</Text>
      <View style={styles.list}>
        {TOPICS.map((topic, index) => (
          <TopicRow key={topic.label} topic={topic} striped={index % 2 === 0} />
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

  /* Subtitle */
  subtitle: {
    fontSize: 14,
    color: '#9aa0a8',
    lineHeight: 22,
    marginTop: -24,
    marginBottom: 32,
  },

  /* List */
  list: {
    borderWidth: 1,
    borderColor: '#1c1f26',
    borderRadius: 10,
    overflow: 'hidden',
  },

  /* Topic row — zebra-striped */
  topicRow: {
    flexDirection: 'row',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  topicRowStriped: {
    backgroundColor: '#101216',
  },
  accentBar: {
    width: 3,
    borderRadius: 2,
    flexShrink: 0,
  },
  topicBody: {
    flex: 1,
    gap: 8,
  },
  topicLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },

  /* Chips */
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
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
  chipTextHovered: {
    color: '#cdd1d7',
  },
});
