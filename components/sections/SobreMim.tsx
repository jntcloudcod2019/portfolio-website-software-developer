import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Image,
  Platform,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

// ─── Data ─────────────────────────────────────────────────────────────────────

const PERFIL = {
  name: 'Jonathan F. Silva',
  role: 'Engenheiro de Software Full Stack',
  focus: 'sistemas financeiros · escaláveis · alta disponibilidade',
  domains: 'Risco, Pricing, Pagamentos, Chargeback',
  stack: 'C# · .NET · Node.js · AWS · Azure · PostgreSQL',
  local: 'São Paulo · Remoto',
  bio: 'Engenheiro de Software com mais de 6 anos de experiência no mercado financeiro e bancário, especializado em construir sistemas robustos, escaláveis. Já atuei em domínios críticos como Risco de Crédito Regulatório, Risco de Mercado, Pricing, Liquidez, APIs de Pagamentos e Chargeback — entregando soluções que movimentam operações financeiras reais. Durante esses anos contribuí para a evolução de plataformas de sistemas Legacy Code para Cloud.\n\nPerfil hands-on com visão de arquitetura, contribuindo para o desenvolvimento de aplicações de alta disponibilidade e seguras.',
};

const profilePhoto = require('../../assets/profile-photo.jpeg') as number;

// ─── Constants ────────────────────────────────────────────────────────────────

const MONO = Platform.select({
  web: '"JetBrains Mono", "Courier New", monospace',
  ios: 'Courier',
  android: 'monospace',
  default: 'monospace',
});

const SPACE = Platform.select({
  web: '"Space Grotesk", sans-serif',
  default: 'sans-serif',
});

const KV_ROWS: { key: string; value: string }[] = [
  { key: 'name', value: PERFIL.name },
  { key: 'role', value: PERFIL.role },
  { key: 'focus', value: PERFIL.focus },
  { key: 'domains', value: PERFIL.domains },
  { key: 'stack', value: PERFIL.stack },
  { key: 'local', value: PERFIL.local },
];

const PHOTO_W = 200;
const PHOTO_H = 230;
const WIDE_BREAKPOINT = 680;

// ─── WindowBar ────────────────────────────────────────────────────────────────

function WindowBar() {
  return (
    <View style={styles.windowBar}>
      <View style={styles.dotsRow}>
        <View style={[styles.dot, { backgroundColor: '#ff5f57' }]} />
        <View style={[styles.dot, { backgroundColor: '#febc2e' }]} />
        <View style={[styles.dot, { backgroundColor: '#28c840' }]} />
      </View>
      <Text style={[styles.pathText, { fontFamily: MONO }]}>
        jonathan@portfolio: ~/about
      </Text>
    </View>
  );
}

// ─── OnlineBadge ─────────────────────────────────────────────────────────────

function OnlineBadge() {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.4, duration: 800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 800, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <View style={styles.onlineBadge}>
      <Animated.View style={[styles.onlineDot, { opacity: pulse }]} />
      <Text style={[styles.onlineText, { fontFamily: MONO }]}>online</Text>
    </View>
  );
}

// ─── PhotoColumn ─────────────────────────────────────────────────────────────

function PhotoColumn({ isWide }: { isWide: boolean }) {
  const imageWeb: object =
    Platform.OS === 'web' ? { objectPosition: 'center 15%' } : {};

  return (
    <View style={[styles.photoCol, isWide ? styles.photoColWide : styles.photoColNarrow]}>
      <View style={styles.photoFrame}>
        <Image
          source={profilePhoto}
          style={[styles.photo, imageWeb as object]}
          resizeMode="cover"
          accessibilityLabel="Foto de Jonathan F. Silva"
        />
      </View>
      <OnlineBadge />
    </View>
  );
}

// ─── BlinkingCursor ───────────────────────────────────────────────────────────

function BlinkingCursor() {
  const blink = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(blink, { toValue: 0, duration: 530, useNativeDriver: true }),
        Animated.timing(blink, { toValue: 1, duration: 530, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [blink]);

  return (
    <View style={styles.cursorRow}>
      <Text style={[styles.monoBase, { fontFamily: MONO }]}>
        <Text style={{ color: '#38bdf8' }}>jonathan@portfolio</Text>
        <Text style={{ color: '#4b5159' }}>: </Text>
        <Text style={{ color: '#a78bfa' }}>~</Text>
        <Text style={{ color: '#4b5159' }}> $ </Text>
      </Text>
      <Animated.View style={[styles.cursorBlock, { opacity: blink }]} />
      <Text style={[styles.monoBase, { fontFamily: MONO, color: '#4b5159' }]}>_</Text>
    </View>
  );
}

// ─── CodeColumn ──────────────────────────────────────────────────────────────

function CodeColumn() {
  const bioWeb: object =
    Platform.OS === 'web' ? { fontFamily: SPACE, fontWeight: '300' } : {};

  return (
    <View style={styles.codeCol}>
      {/* Prompt 1 */}
      <Text style={[styles.monoBase, { fontFamily: MONO }]}>
        <Text style={{ color: '#38bdf8' }}>jonathan@portfolio</Text>
        <Text style={{ color: '#4b5159' }}>: </Text>
        <Text style={{ color: '#a78bfa' }}>~</Text>
        <Text style={{ color: '#4b5159' }}> $ </Text>
        <Text style={{ color: '#e8eaed' }}>whoami</Text>
      </Text>

      {/* Key-value block */}
      <View style={styles.kvBlock}>
        {KV_ROWS.map((row) => (
          <View key={row.key} style={styles.kvRow}>
            <Text style={[styles.kvKey, { fontFamily: MONO }]}>{row.key}:</Text>
            <Text style={[styles.kvValue, { fontFamily: MONO }]} numberOfLines={2}>
              {row.value}
            </Text>
          </View>
        ))}
      </View>

      {/* Prompt 2 */}
      <Text style={[styles.monoBase, { fontFamily: MONO, marginTop: 18 }]}>
        <Text style={{ color: '#4b5159' }}>… $ </Text>
        <Text style={{ color: '#e8eaed' }}>cat bio.txt</Text>
      </Text>

      {/* Bio */}
      <View style={styles.bioBorder}>
        <Text style={[styles.bioText, bioWeb as object]}>{PERFIL.bio}</Text>
      </View>

      {/* Blinking cursor */}
      <BlinkingCursor />
    </View>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export function SobreMim() {
  const { width } = useWindowDimensions();
  const isWide = width >= WIDE_BREAKPOINT;
  const cardRef = useRef<View>(null);

  useEffect(() => {
    if (Platform.OS !== 'web' || !cardRef.current) return;
    const el = cardRef.current as unknown as HTMLElement;
    el.style.transition = 'transform 0.45s cubic-bezier(.2,.8,.3,1), box-shadow 0.45s ease';
    const onEnter = () => {
      el.style.transform = 'perspective(1400px) translateZ(28px) translateY(-4px)';
      el.style.boxShadow = '0 44px 80px -24px rgba(0,0,0,.75), 0 0 0 1px #23272f';
    };
    const onLeave = () => {
      el.style.transform = '';
      el.style.boxShadow = '';
    };
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <View ref={cardRef} style={styles.card}>
      <WindowBar />
      <View style={[styles.body, isWide && styles.bodyRow]}>
        <PhotoColumn isWide={isWide} />
        <CodeColumn />
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  /* Card */
  card: {
    width: '100%',
    backgroundColor: '#0c0e12',
    borderWidth: 1,
    borderColor: '#1c1f26',
    borderRadius: 16,
    overflow: 'hidden',
  },

  /* Window bar */
  windowBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 18,
    backgroundColor: '#0e1014',
    borderBottomWidth: 1,
    borderBottomColor: '#1c1f26',
    gap: 16,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 7,
  },
  dot: {
    width: 11,
    height: 11,
    borderRadius: 5.5,
  },
  pathText: {
    fontSize: 12.5,
    color: '#6b7280',
  },

  /* Body */
  body: {
    flexDirection: 'column',
  },
  bodyRow: {
    flexDirection: 'row',
  },

  /* Photo column */
  photoCol: {
    padding: 30,
    alignItems: 'center',
  },
  photoColWide: {
    width: 264,
    borderRightWidth: 1,
    borderRightColor: '#1c1f26',
  },
  photoColNarrow: {
    borderBottomWidth: 1,
    borderBottomColor: '#1c1f26',
    paddingBottom: 24,
  },
  photoFrame: {
    width: PHOTO_W,
    height: PHOTO_H,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#23272f',
    overflow: 'hidden',
  },
  photo: {
    width: PHOTO_W,
    // taller than frame — top portion (face) visible, overflow clipped
    height: Math.round(PHOTO_H * 1.45),
  },

  /* Online badge */
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 14,
    backgroundColor: '#34d39912',
    borderWidth: 1,
    borderColor: '#34d39933',
    borderRadius: 999,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#34d399',
  },
  onlineText: {
    fontSize: 12,
    color: '#5fe3b6',
  },

  /* Code column */
  codeCol: {
    flex: 1,
    padding: 30,
    paddingHorizontal: 34,
  },

  /* Shared mono base */
  monoBase: {
    fontSize: 13.5,
    lineHeight: 21,
    color: '#e8eaed',
  },

  /* Key-value block */
  kvBlock: {
    marginTop: 10,
    gap: 4,
  },
  kvRow: {
    flexDirection: 'row',
  },
  kvKey: {
    width: 92,
    fontSize: 13.5,
    color: '#38bdf8',
    lineHeight: 21,
  },
  kvValue: {
    flex: 1,
    fontSize: 13.5,
    color: '#cdd1d7',
    lineHeight: 21,
  },

  /* Bio */
  bioBorder: {
    borderLeftWidth: 2,
    borderLeftColor: '#1c1f26',
    paddingLeft: 16,
    marginTop: 10,
    marginBottom: 4,
  },
  bioText: {
    fontSize: 14.5,
    color: '#9aa0a8',
    lineHeight: 26,
    fontFamily: 'sans-serif',
  },

  /* Cursor row */
  cursorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    flexWrap: 'wrap',
  },
  cursorBlock: {
    width: 8,
    height: 16,
    backgroundColor: '#38bdf8',
    marginLeft: 1,
  },
});
