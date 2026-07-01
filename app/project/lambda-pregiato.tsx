import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SvgXml } from 'react-native-svg';

// ── Constants ──────────────────────────────────────────────────────────────────

const MONO = Platform.select({
  web: '"JetBrains Mono","Courier New",monospace',
  ios: 'Courier',
  android: 'monospace',
  default: 'monospace',
});

const GROTESK = Platform.select({
  web: '"Space Grotesk",system-ui,sans-serif',
  ios: 'System',
  android: 'sans-serif',
  default: 'sans-serif',
});

const C = {
  bg: '#0a0b0d',
  surface: '#0e1014',
  surfaceAlt: '#101216',
  diagramBg: '#0c0e13',
  nodeBg: '#141820',
  border: '#1c1f26',
  text: '#e8eaed',
  textSec: '#9aa0a8',
  textMuted: '#6b7280',
  textUltra: '#4b5159',
  cyan: '#38bdf8',
  purple: '#a78bfa',
  green: '#34d399',
  amber: '#f5a623',
  orange: '#ff9f2e',
  blue: '#5b8def',
  whatsapp: '#25d366',
  sep: '#161920',
} as const;

// ── CSS Keyframes ──────────────────────────────────────────────────────────────

const CSS = `
  @keyframes lp-blink{0%,100%{opacity:1}50%{opacity:.25}}
  @keyframes lp-in{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
`;

// ── Icon SVG helpers ───────────────────────────────────────────────────────────

function iconSvg(paths: string, color: string, size = 18) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
}

const CODE_PATHS = '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>';
const CPU_PATHS =
  '<rect x="9" y="9" width="6" height="6"/><rect x="2" y="6" width="20" height="12" rx="2"/>' +
  '<line x1="6" y1="2" x2="6" y2="6"/><line x1="10" y1="2" x2="10" y2="6"/>' +
  '<line x1="14" y1="2" x2="14" y2="6"/><line x1="18" y1="2" x2="18" y2="6"/>' +
  '<line x1="6" y1="18" x2="6" y2="22"/><line x1="10" y1="18" x2="10" y2="22"/>' +
  '<line x1="14" y1="18" x2="14" y2="22"/><line x1="18" y1="18" x2="18" y2="22"/>';
const DB_PATHS =
  '<ellipse cx="12" cy="5" rx="9" ry="3"/>' +
  '<path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>' +
  '<path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>';
const FILE_PATHS =
  '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>' +
  '<polyline points="14 2 14 8 20 8"/>' +
  '<line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>';
const SHIELD_PATHS =
  '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>' +
  '<polyline points="9 12 11 14 15 10"/>';
const LAYERS_PATHS =
  '<polygon points="12 2 2 7 12 12 22 7 12 2"/>' +
  '<polyline points="2 17 12 22 22 17"/>' +
  '<polyline points="2 12 12 17 22 12"/>';

const WA_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="${C.whatsapp}">
  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.464 3.488"/>
</svg>`;

// ── Diagram SVG (background + paths + particles) ───────────────────────────────

const DIAGRAM_SVG = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 910 400" width="910" height="400">
  <defs>
    <filter id="gl-or" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="gl-cy" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="gl-bl" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="gl-am" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="gl-gr" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <pattern id="lp-grid" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#1a1e2a" opacity="0.65"/></pattern>
  </defs>
  <rect width="910" height="400" fill="#0c0e13"/>
  <rect width="910" height="400" fill="url(#lp-grid)"/>
  <path id="lp-p1" d="M 210,80 L 326,80" stroke="#ff9f2e" stroke-width="1.8" stroke-dasharray="5 3" fill="none" opacity="0.55"/>
  <path id="lp-p2" d="M 530,80 L 648,80" stroke="#38bdf8" stroke-width="1.8" stroke-dasharray="5 3" fill="none" opacity="0.55"/>
  <path id="lp-p3" d="M 754,132 L 754,262" stroke="#5b8def" stroke-width="1.8" stroke-dasharray="5 3" fill="none" opacity="0.55"/>
  <path id="lp-p4" d="M 648,320 L 530,320" stroke="#f5a623" stroke-width="1.8" stroke-dasharray="5 3" fill="none" opacity="0.55"/>
  <path id="lp-p5" d="M 326,320 L 210,320" stroke="#34d399" stroke-width="1.8" stroke-dasharray="5 3" fill="none" opacity="0.55"/>
  <polygon points="323,77 329,80 323,83" fill="#ff9f2e" opacity="0.85"/>
  <polygon points="645,77 651,80 645,83" fill="#38bdf8" opacity="0.85"/>
  <polygon points="751,259 754,265 757,259" fill="#5b8def" opacity="0.85"/>
  <polygon points="533,317 527,320 533,323" fill="#f5a623" opacity="0.85"/>
  <polygon points="213,317 207,320 213,323" fill="#34d399" opacity="0.85"/>
  <circle r="5" fill="#ff9f2e" filter="url(#gl-or)"><animateMotion dur="2s" repeatCount="indefinite" begin="0s"><mpath href="#lp-p1" xlink:href="#lp-p1"/></animateMotion></circle>
  <circle r="3.5" fill="#ff9f2e80"><animateMotion dur="2s" repeatCount="indefinite" begin="0.67s"><mpath href="#lp-p1" xlink:href="#lp-p1"/></animateMotion></circle>
  <circle r="5" fill="#ff9f2e" filter="url(#gl-or)"><animateMotion dur="2s" repeatCount="indefinite" begin="1.33s"><mpath href="#lp-p1" xlink:href="#lp-p1"/></animateMotion></circle>
  <circle r="5" fill="#38bdf8" filter="url(#gl-cy)"><animateMotion dur="2s" repeatCount="indefinite" begin="0s"><mpath href="#lp-p2" xlink:href="#lp-p2"/></animateMotion></circle>
  <circle r="3.5" fill="#38bdf880"><animateMotion dur="2s" repeatCount="indefinite" begin="0.67s"><mpath href="#lp-p2" xlink:href="#lp-p2"/></animateMotion></circle>
  <circle r="5" fill="#38bdf8" filter="url(#gl-cy)"><animateMotion dur="2s" repeatCount="indefinite" begin="1.33s"><mpath href="#lp-p2" xlink:href="#lp-p2"/></animateMotion></circle>
  <circle r="5" fill="#5b8def" filter="url(#gl-bl)"><animateMotion dur="2.2s" repeatCount="indefinite" begin="0s"><mpath href="#lp-p3" xlink:href="#lp-p3"/></animateMotion></circle>
  <circle r="3.5" fill="#5b8def80"><animateMotion dur="2.2s" repeatCount="indefinite" begin="0.73s"><mpath href="#lp-p3" xlink:href="#lp-p3"/></animateMotion></circle>
  <circle r="5" fill="#5b8def" filter="url(#gl-bl)"><animateMotion dur="2.2s" repeatCount="indefinite" begin="1.47s"><mpath href="#lp-p3" xlink:href="#lp-p3"/></animateMotion></circle>
  <circle r="5" fill="#f5a623" filter="url(#gl-am)"><animateMotion dur="2s" repeatCount="indefinite" begin="0s"><mpath href="#lp-p4" xlink:href="#lp-p4"/></animateMotion></circle>
  <circle r="3.5" fill="#f5a62380"><animateMotion dur="2s" repeatCount="indefinite" begin="0.67s"><mpath href="#lp-p4" xlink:href="#lp-p4"/></animateMotion></circle>
  <circle r="5" fill="#f5a623" filter="url(#gl-am)"><animateMotion dur="2s" repeatCount="indefinite" begin="1.33s"><mpath href="#lp-p4" xlink:href="#lp-p4"/></animateMotion></circle>
  <circle r="5" fill="#34d399" filter="url(#gl-gr)"><animateMotion dur="2s" repeatCount="indefinite" begin="0s"><mpath href="#lp-p5" xlink:href="#lp-p5"/></animateMotion></circle>
  <circle r="3.5" fill="#34d39980"><animateMotion dur="2s" repeatCount="indefinite" begin="0.67s"><mpath href="#lp-p5" xlink:href="#lp-p5"/></animateMotion></circle>
  <circle r="5" fill="#34d399" filter="url(#gl-gr)"><animateMotion dur="2s" repeatCount="indefinite" begin="1.33s"><mpath href="#lp-p5" xlink:href="#lp-p5"/></animateMotion></circle>
</svg>`;

// ── Node data ──────────────────────────────────────────────────────────────────

type NodeDef = {
  namespace: string;
  name: string;
  subKey: string;
  color: string;
  icon: string;
  left: number;
  top: number;
  width: number;
  delay: string;
};

const NODES: NodeDef[] = [
  { namespace: 'LAMBDA.RABBITMQ',  name: 'RabbitMQ',       subKey: 'lp_node_rabbitmq_sub',  color: C.orange,   icon: iconSvg(CPU_PATHS, C.orange),   left: 16,  top: 28,  width: 208, delay: '0s'   },
  { namespace: 'LAMBDA.CONSUMER',  name: 'Consumer',        subKey: 'lp_node_consumer_sub',  color: C.cyan,     icon: iconSvg(CPU_PATHS, C.cyan),     left: 338, top: 28,  width: 192, delay: '0.4s' },
  { namespace: 'LAMBDA.POSTGRES',  name: 'PostgreSQL',      subKey: 'lp_node_postgres_sub',  color: C.blue,     icon: iconSvg(DB_PATHS, C.blue),      left: 660, top: 28,  width: 194, delay: '0.8s' },
  { namespace: 'LAMBDA.CONVERTER', name: 'PDF Converter',   subKey: 'lp_node_converter_sub', color: C.amber,    icon: iconSvg(FILE_PATHS, C.amber),   left: 660, top: 272, width: 194, delay: '1.2s' },
  { namespace: 'LAMBDA.AUTHQ',     name: 'Authentique API', subKey: 'lp_node_authq_sub',     color: C.green,    icon: iconSvg(SHIELD_PATHS, C.green), left: 338, top: 272, width: 192, delay: '1.6s' },
  { namespace: 'LAMBDA.WHATSAPP',  name: 'WhatsApp',        subKey: 'lp_node_whatsapp_sub',  color: C.whatsapp, icon: WA_SVG,                         left: 16,  top: 272, width: 208, delay: '2s'   },
];

// ── Data labels ────────────────────────────────────────────────────────────────

type DataLabel = { text: string; left: number; top: number; width?: number };

const DATA_LABELS: DataLabel[] = [
  { text: 'ContractMessage JSON',         left: 59,  top: 144, width: 130 },
  { text: 'ModelId · ContractId · Phone', left: 373, top: 148, width: 130 },
  { text: 'bytea PDF',                     left: 789, top: 181 },
  { text: 'PDF Buffer · stream',          left: 539, top: 238, width: 130 },
  { text: 'document_id · phone',          left: 204, top: 236, width: 130 },
];

// ── Steps bar ──────────────────────────────────────────────────────────────────

const STEPS = [
  { n: '01', color: C.orange },
  { n: '02', color: C.cyan   },
  { n: '03', color: C.blue   },
  { n: '04', color: C.amber  },
  { n: '05', color: C.green  },
  { n: '06', color: C.whatsapp },
];

// ── Tech tags ──────────────────────────────────────────────────────────────────

const TECH_TAGS = [
  { label: 'C# · .NET 8',              color: C.purple   },
  { label: 'RabbitMQ',                  color: C.orange   },
  { label: 'PostgreSQL · EF Core',      color: C.blue     },
  { label: 'Authentique GraphQL',        color: C.green    },
  { label: 'Docker',                     color: '#3aa4ec'  },
];

// ── Architecture cards ─────────────────────────────────────────────────────────

const GH_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="#0a0b0d">
  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
</svg>`;

const ARCH_CARDS = [
  {
    titleKey: 'lp_arch_entry_title',
    subtitleKey: 'lp_arch_entry_subtitle',
    color: C.cyan,
    iconPaths: CODE_PATHS,
    items: [
      { dot: C.cyan,   title: 'Web API + Swagger',   subKey: 'lp_arch_entry_i1_sub' },
      { dot: C.cyan,   title: 'BackgroundService',    subKey: 'lp_arch_entry_i2_sub' },
      { dot: C.cyan,   title: 'Docker multi-stage',   subKey: 'lp_arch_entry_i3_sub' },
    ],
  },
  {
    titleKey: 'lp_arch_services_title',
    subtitleKey: 'lp_arch_services_subtitle',
    color: C.purple,
    iconPaths: LAYERS_PATHS,
    items: [
      { dot: C.orange, title: 'RabbitMQConsumer',     subKey: 'lp_arch_services_i1_sub' },
      { dot: C.green,  title: 'AutentiqueService',    subKey: 'lp_arch_services_i2_sub' },
      { dot: C.amber,  title: 'ContractServices',     subKey: 'lp_arch_services_i3_sub' },
    ],
  },
  {
    titleKey: 'lp_arch_data_title',
    subtitleKey: 'lp_arch_data_subtitle',
    color: C.blue,
    iconPaths: DB_PATHS,
    items: [
      { dot: C.blue,   title: 'LambdaContextDB',      subKey: 'lp_arch_data_i1_sub' },
      { dot: C.blue,   title: 'IContractRepository',  subKey: 'lp_arch_data_i2_sub' },
      { dot: C.blue,   title: 'IModelRepository',     subKey: 'lp_arch_data_i3_sub' },
    ],
  },
] as const;

// ── Sub-components ─────────────────────────────────────────────────────────────

function TechTag({ label, color }: { label: string; color: string }) {
  const bg = `${color}14`;
  const border = `${color}2e`;
  return (
    <View style={[styles.techTag, { backgroundColor: bg, borderColor: border }]}>
      <Text style={[styles.techTagText, { color, fontFamily: MONO }]}>{label}</Text>
    </View>
  );
}

function BlinkDot({ color, delay }: { color: string; delay: string }) {
  const webStyle =
    Platform.OS === 'web'
      ? ({ animation: `lp-blink 2s ${delay} infinite` } as object)
      : {};
  return <View style={[styles.dot, { backgroundColor: color }, webStyle as object]} />;
}

function DiagramNode({ node }: { node: NodeDef }) {
  const { t } = useTranslation();
  const [hovered, setHovered] = React.useState(false);
  const border = `${node.color}44`;
  return (
    <Pressable
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={[
        styles.node,
        {
          left: node.left,
          top: node.top,
          width: node.width,
          borderColor: border,
          borderLeftColor: node.color,
        },
        hovered && styles.nodeHovered,
      ]}
    >
      <View style={styles.nodeHeader}>
        <Text
          style={[styles.nodeNs, { color: node.color, fontFamily: MONO }]}
          numberOfLines={1}
        >
          {node.namespace}
        </Text>
        <BlinkDot color={node.color} delay={node.delay} />
      </View>
      <View style={styles.nodeBody}>
        <View
          style={[
            styles.nodeIconTile,
            { backgroundColor: `${node.color}18`, borderColor: `${node.color}33` },
          ]}
        >
          <SvgXml xml={node.icon} width={18} height={18} />
        </View>
        <View style={styles.nodeText}>
          <Text style={[styles.nodeName, { fontFamily: GROTESK }]}>{node.name}</Text>
          <Text style={[styles.nodeSub, { fontFamily: MONO }]}>{t(node.subKey)}</Text>
        </View>
      </View>
    </Pressable>
  );
}

function SectionHeader({
  label,
  right,
}: {
  label: string;
  right?: string;
}) {
  const ruleStyle: object =
    Platform.OS === 'web'
      ? { background: 'linear-gradient(90deg,#23262d,transparent)' }
      : { backgroundColor: '#23262d' };

  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionLabel, { fontFamily: MONO }]}>{label}</Text>
      <View style={[styles.sectionRule, ruleStyle as object]} />
      {right ? (
        <Text style={[styles.sectionRight, { fontFamily: MONO }]}>{right}</Text>
      ) : null}
    </View>
  );
}

function ArchCard({
  card,
}: {
  card: (typeof ARCH_CARDS)[number];
}) {
  const { t } = useTranslation();
  const [hovered, setHovered] = React.useState(false);
  return (
    <Pressable
      style={[
        styles.archCard,
        { borderTopColor: `${card.color}80` },
        hovered && styles.archCardHovered,
      ]}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onPress={() => {}}
    >
      <View style={styles.archCardHeader}>
        <View
          style={[
            styles.archIconTile,
            { backgroundColor: `${card.color}14`, borderColor: `${card.color}33` },
          ]}
        >
          <SvgXml xml={iconSvg(card.iconPaths, card.color)} width={18} height={18} />
        </View>
        <View>
          <Text style={[styles.archCardTitle, { fontFamily: GROTESK }]}>{t(card.titleKey)}</Text>
          <Text style={[styles.archCardSub, { color: card.color, fontFamily: MONO }]}>
            {t(card.subtitleKey)}
          </Text>
        </View>
      </View>
      <View style={styles.archItemList}>
        {card.items.map((item) => (
          <View key={item.title} style={styles.archItem}>
            <View style={[styles.archDot, { backgroundColor: item.dot }]} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.archItemTitle, { fontFamily: GROTESK }]}>{item.title}</Text>
              <Text style={[styles.archItemSub, { fontFamily: MONO }]}>{t(item.subKey)}</Text>
            </View>
          </View>
        ))}
      </View>
    </Pressable>
  );
}

// ── Sections ───────────────────────────────────────────────────────────────────

function HeroSection({ onBack }: { onBack: () => void }) {
  const { t } = useTranslation();
  const heroBgWeb: object =
    Platform.OS === 'web'
      ? {
          background: 'radial-gradient(130% 90% at 50% -10%, #0d1320 0%, #0a0b0d 56%)',
        }
      : { backgroundColor: C.bg };

  const glowStyle: object =
    Platform.OS === 'web'
      ? {
          position: 'absolute',
          width: 640,
          height: 380,
          top: -80,
          left: '50%',
          transform: [{ translateX: -320 }],
          background: 'radial-gradient(circle, #38bdf80b, transparent 70%)',
          pointerEvents: 'none',
        }
      : {};

  return (
    <View style={[styles.hero, heroBgWeb as object]}>
      {Platform.OS === 'web' && <View style={glowStyle as object} />}
      <View style={styles.heroContent}>
        <Pressable onPress={onBack} style={styles.backLink}>
          <Text style={[styles.backLinkText, { fontFamily: MONO }]}>← {t('lp_back')}</Text>
        </Pressable>

        <Text style={[styles.eyebrow, { fontFamily: MONO }]}>{t('lp_eyebrow')}</Text>

        <Text style={[styles.heroTitle, { fontFamily: GROTESK }]}>
          Lambda
          <Text style={{ color: C.cyan }}>.</Text>
          Pregiato
        </Text>

        <Text style={[styles.heroDesc, { fontFamily: GROTESK }]}>{t('lp_hero_desc')}</Text>

        <View style={styles.tagsRow}>
          {TECH_TAGS.map((t) => (
            <TechTag key={t.label} label={t.label} color={t.color} />
          ))}
        </View>

        <Pressable
          style={({ pressed }) => [styles.ghBtn, pressed && { opacity: 0.9, transform: [{ scale: 1.02 }] }]}
          onPress={() =>
            Linking.openURL('https://github.com/jntcloudcod2019/Lambda.Pregiato')
          }
        >
          <SvgXml xml={GH_SVG} width={18} height={18} />
          <Text style={[styles.ghBtnText, { fontFamily: GROTESK }]}>GitHub</Text>
        </Pressable>
      </View>
    </View>
  );
}

function FlowSection() {
  const { t } = useTranslation();
  const svgRef = useRef<View>(null);
  const scrollStyle: object =
    Platform.OS === 'web' ? { overflowX: 'auto' } : { overflow: 'scroll' };

  // react-native-svg does not run SMIL <animateMotion> on web, so inject the raw
  // animated SVG straight into the DOM node and let the browser animate it.
  useEffect(() => {
    if (Platform.OS !== 'web' || !svgRef.current) return;
    (svgRef.current as unknown as HTMLElement).innerHTML = DIAGRAM_SVG;
  }, []);

  return (
    <View style={[styles.section, { borderBottomWidth: 1, borderBottomColor: C.sep }]}>
      <View style={styles.sectionInner}>
        <SectionHeader label={t('lp_flow_label')} right={t('lp_flow_right')} />

        <View style={[styles.diagramScroll, scrollStyle as object]}>
          <View style={styles.diagramWrapper}>
            <View style={styles.diagramCanvas}>
              {/* SVG background + paths + particles */}
              {Platform.OS === 'web' ? (
                <View ref={svgRef} style={StyleSheet.absoluteFill} pointerEvents="none" />
              ) : (
                <View style={StyleSheet.absoluteFill} pointerEvents="none">
                  <SvgXml xml={DIAGRAM_SVG} width={910} height={400} />
                </View>
              )}

              {/* Nodes */}
              {NODES.map((node) => (
                <DiagramNode key={node.namespace} node={node} />
              ))}

              {/* Data labels */}
              {DATA_LABELS.map((lbl) => (
                <View
                  key={lbl.text}
                  style={[
                    styles.dataLabel,
                    { left: lbl.left, top: lbl.top },
                    lbl.width ? { width: lbl.width } : null,
                  ]}
                >
                  <Text
                    style={[
                      styles.dataLabelText,
                      { fontFamily: MONO },
                      lbl.width ? { textAlign: 'center' } : null,
                    ]}
                  >
                    {lbl.text}
                  </Text>
                </View>
              ))}

              {/* Steps bar */}
              <View style={styles.stepsBar}>
                {STEPS.map((s, i) => (
                  <React.Fragment key={s.n}>
                    <Text style={[styles.stepNum, { color: s.color, fontFamily: MONO }]}>{s.n}</Text>
                    {i < STEPS.length - 1 && (
                      <Text style={[styles.stepArrow, { fontFamily: MONO }]}> → </Text>
                    )}
                  </React.Fragment>
                ))}
                <Text style={[styles.stepSuffix, { fontFamily: MONO }]}>{t('lp_steps_suffix')}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

function ArchitectureSection({ isWide }: { isWide: boolean }) {
  const { t } = useTranslation();
  return (
    <View style={styles.section}>
      <View style={styles.sectionInner}>
        <SectionHeader label={t('lp_arch_label')} />
        <View style={[styles.archGrid, isWide && styles.archGridWide]}>
          {ARCH_CARDS.map((card) => (
            <ArchCard key={card.titleKey} card={card} />
          ))}
        </View>
      </View>
    </View>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function LambdaPregiatoPage() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWide = width > 768;

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const el = document.createElement('style');
    el.textContent = CSS;
    document.head.appendChild(el);
    return () => { document.head.removeChild(el); };
  }, []);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
      <HeroSection onBack={() => router.back()} />
      <FlowSection />
      <ArchitectureSection isWide={isWide} />
    </ScrollView>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: C.bg },
  scrollContent: { paddingBottom: 80 },

  // ─ Hero ───────────────────────────────────────────────────────────────────
  hero: {
    paddingVertical: 64,
    paddingHorizontal: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#161920',
    overflow: 'hidden',
  },
  heroContent: { maxWidth: 1040, alignSelf: 'center', width: '100%' },
  backLink: { marginBottom: 28, alignSelf: 'flex-start' },
  backLinkText: { fontSize: 12, color: '#5b616b', letterSpacing: 0.2 },
  eyebrow: {
    fontSize: 12,
    color: C.cyan,
    letterSpacing: 4,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: '700',
    color: C.text,
    letterSpacing: -1.5,
    lineHeight: 52,
    marginBottom: 16,
  },
  heroDesc: {
    fontSize: 15,
    lineHeight: 26,
    color: C.textSec,
    marginBottom: 24,
    maxWidth: 640,
  },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 28 },
  techTag: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 11,
    paddingVertical: 5,
  },
  techTagText: { fontSize: 11, fontWeight: '600' },
  ghBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: C.text,
    borderRadius: 11,
    paddingHorizontal: 22,
    paddingVertical: 12,
    alignSelf: 'flex-start',
  },
  ghBtnText: { fontSize: 14, fontWeight: '600', color: C.bg },

  // ─ Section ────────────────────────────────────────────────────────────────
  section: { paddingVertical: 56, paddingHorizontal: 32 },
  sectionInner: { width: '100%', maxWidth: 1040, alignSelf: 'center' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 32 },
  sectionLabel: {
    fontSize: 13,
    color: '#9ca3af',
    letterSpacing: 5,
    textTransform: 'uppercase',
  },
  sectionRule: { flex: 1, height: 1 },
  sectionRight: { fontSize: 11, color: C.textUltra },

  // ─ Diagram ────────────────────────────────────────────────────────────────
  diagramScroll: { width: '100%' },
  diagramWrapper: {
    width: 910,
    alignSelf: 'flex-start',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.border,
    overflow: 'hidden',
  },
  diagramCanvas: {
    width: 910,
    height: 400,
    position: 'relative',
    backgroundColor: C.diagramBg,
  },

  // ─ Node ───────────────────────────────────────────────────────────────────
  node: {
    position: 'absolute',
    backgroundColor: C.nodeBg,
    borderWidth: 1,
    borderLeftWidth: 3,
    borderRadius: 12,
    padding: 13,
    zIndex: 2,
  },
  nodeHovered: { transform: [{ translateY: -4 }], zIndex: 4 },
  nodeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  nodeNs: { fontSize: 9, letterSpacing: 1, opacity: 0.8, flexShrink: 1, marginRight: 6 },
  dot: { width: 7, height: 7, borderRadius: 4, flexShrink: 0 },
  nodeBody: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  nodeIconTile: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  nodeText: { flex: 1 },
  nodeName: { fontSize: 13, fontWeight: '600', color: C.text },
  nodeSub: { fontSize: 9.5, color: C.textMuted, marginTop: 2 },

  // ─ Data labels ────────────────────────────────────────────────────────────
  dataLabel: {
    position: 'absolute',
    zIndex: 3,
    backgroundColor: C.diagramBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  dataLabelText: { fontSize: 9, color: '#8b9099', textAlign: 'center' },

  // ─ Steps bar ──────────────────────────────────────────────────────────────
  stepsBar: {
    position: 'absolute',
    bottom: 14,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  stepNum: { fontSize: 9.5, fontWeight: '600' },
  stepArrow: { fontSize: 9.5, color: C.textUltra },
  stepSuffix: { fontSize: 9.5, color: '#3a3f47' },

  // ─ Architecture ───────────────────────────────────────────────────────────
  archGrid: { gap: 18 },
  archGridWide: { flexDirection: 'row' },
  archCard: {
    flex: 1,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderTopWidth: 2,
    borderRadius: 16,
    padding: 24,
  },
  archCardHovered: {
    borderColor: '#38bdf855',
    transform: [{ translateY: -3 }],
  },
  archCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 18,
  },
  archIconTile: {
    width: 40,
    height: 40,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  archCardTitle: { fontSize: 15, fontWeight: '600', color: C.text },
  archCardSub: { fontSize: 11, marginTop: 2 },
  archItemList: { gap: 8 },
  archItem: {
    flexDirection: 'row',
    gap: 10,
    padding: 10,
    backgroundColor: C.surfaceAlt,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 9,
    alignItems: 'flex-start',
  },
  archDot: { width: 6, height: 6, borderRadius: 3, marginTop: 7, flexShrink: 0 },
  archItemTitle: { fontSize: 13, fontWeight: '500', color: C.text },
  archItemSub: { fontSize: 10, color: C.textMuted, marginTop: 2 },
});
