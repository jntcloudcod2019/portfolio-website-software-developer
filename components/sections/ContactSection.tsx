import * as Linking from 'expo-linking';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { Section } from '@/components/layout/Section';
import { portfolio } from '@/content/portfolio';

// ─── Data ─────────────────────────────────────────────────────────────────────

const { email, phone, linkedin, github } = portfolio.contact;
const phoneHref = `tel:${phone.replace(/\s/g, '')}`;

// ─── Constants ────────────────────────────────────────────────────────────────

const ACCENT = '#38bdf8';

const MONO = Platform.select({
  web: '"JetBrains Mono", "Courier New", monospace',
  ios: 'Courier',
  android: 'monospace',
  default: 'monospace',
});

const SPACE_GROTESK = Platform.select({
  web: '"Space Grotesk", sans-serif',
  default: 'sans-serif',
});

const HoverableView = View as React.ComponentType<
  React.ComponentProps<typeof View> & {
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
  }
>;

const TRANSITION: object =
  Platform.OS === 'web' ? { transition: 'all 0.2s ease', cursor: 'pointer' } : {};

// ─── Email CTA ────────────────────────────────────────────────────────────────

function EmailButton() {
  const [hovered, setHovered] = useState(false);

  const hoverWeb: object =
    hovered && Platform.OS === 'web'
      ? { transform: 'translateY(-2px)', boxShadow: '0 10px 30px -10px #38bdf877' }
      : {};

  return (
    <HoverableView
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Pressable
        onPress={() => Linking.openURL(`mailto:${email}`)}
        style={[styles.btnPrimary, hoverWeb as object, TRANSITION as object]}
        accessibilityRole="link"
      >
        <Text style={styles.btnPrimaryText}>Enviar e-mail</Text>
        <MaterialCommunityIcons name="arrow-top-right" size={16} color="#06222e" />
      </Pressable>
    </HoverableView>
  );
}

// ─── Copy Email ───────────────────────────────────────────────────────────────

function CopyEmailButton() {
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleCopy = () => {
    if (Platform.OS === 'web') {
      (navigator as any).clipboard
        ?.writeText(email)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        })
        .catch(() => {});
    }
  };

  const iconColor = copied ? ACCENT : hovered ? ACCENT : '#cdd1d7';
  const textColor = copied ? ACCENT : hovered ? ACCENT : '#cdd1d7';
  const borderColor = hovered ? ACCENT + '55' : '#2b2f37';

  return (
    <HoverableView
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Pressable
        onPress={handleCopy}
        style={[styles.btnSecondary, { borderColor }, TRANSITION as object]}
        accessibilityRole="button"
      >
        {copied ? (
          <Ionicons name="checkmark" size={15} color={ACCENT} />
        ) : (
          <Ionicons name="copy-outline" size={15} color={iconColor} />
        )}
        <Text style={[styles.btnSecondaryText, { color: textColor }]}>
          {copied ? '✓ Copiado!' : 'copiar e-mail'}
        </Text>
      </Pressable>
    </HoverableView>
  );
}

// ─── Channel Pill ─────────────────────────────────────────────────────────────

function ChannelPill({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);

  const hoverStyle = {
    backgroundColor: hovered ? '#13161b' : '#101216',
    borderColor: hovered ? ACCENT + '55' : '#1c1f26',
  };
  const transformWeb: object =
    hovered && Platform.OS === 'web' ? { transform: 'translateX(3px)' } : {};

  return (
    <HoverableView
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Pressable
        onPress={() => Linking.openURL(href)}
        style={[styles.pill, hoverStyle, transformWeb as object, TRANSITION as object]}
        accessibilityRole="link"
      >
        {icon}
        <Text style={styles.pillText}>{label}</Text>
      </Pressable>
    </HoverableView>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export function ContactSection({ sectionRef }: { sectionRef?: React.Ref<View> }) {
  const cardBgWeb: object =
    Platform.OS === 'web'
      ? { background: 'radial-gradient(120% 140% at 50% 0%, #0f151b 0%, #0b0d11 55%)' }
      : {};

  const titleWeb: object =
    Platform.OS === 'web'
      ? { fontFamily: SPACE_GROTESK, maxWidth: '16ch', fontSize: 'clamp(32px, 4vw, 46px)' }
      : {};

  const subtitleWeb: object =
    Platform.OS === 'web' ? { maxWidth: '46ch' } : {};

  return (
    <Section ref={sectionRef}>
      <View
        style={[styles.card, cardBgWeb as object]}
      >
        {/* Decorative radial glow */}
        {Platform.OS === 'web' && (
          <View
            style={[
              styles.glowBase,
              {
                background: 'radial-gradient(circle at 50% 0%, #38bdf820, transparent 70%)',
                pointerEvents: 'none',
              } as object,
            ]}
          />
        )}

        {/* Label */}
        <Text style={[styles.label, { fontFamily: MONO }]}>CONTATO</Text>

        {/* Title */}
        <Text style={[styles.title, titleWeb as object]}>
          Vamos construir algo juntos?
        </Text>

        {/* Subtitle */}
        <Text style={[styles.subtitle, subtitleWeb as object]}>
          Tem um projeto em mente ou uma vaga que combina comigo? Me chama — respondo rápido.
        </Text>

        {/* CTA buttons */}
        <View style={styles.ctaRow}>
          <EmailButton />
          <CopyEmailButton />
        </View>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={[styles.dividerLabel, { fontFamily: MONO }]}>ou me encontre em</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Channel pills */}
        <View style={styles.pillsRow}>
          <ChannelPill
            href={phoneHref}
            label={phone}
            icon={<Ionicons name="call-outline" size={16} color={ACCENT} />}
          />
          <ChannelPill
            href={linkedin}
            label="LinkedIn"
            icon={<MaterialCommunityIcons name="linkedin" size={16} color={ACCENT} />}
          />
          <ChannelPill
            href={github}
            label="GitHub"
            icon={<MaterialCommunityIcons name="github" size={16} color={ACCENT} />}
          />
        </View>
      </View>
    </Section>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  /* Card container */
  card: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 760,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#1c1f26',
    paddingTop: 64,
    paddingBottom: 48,
    paddingHorizontal: 48,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#0f151b',
    gap: 20,
  },

  /* Glow overlay */
  glowBase: {
    position: 'absolute',
    top: -80,
    left: 0,
    right: 0,
    height: 280,
    zIndex: 0,
  },

  /* Label */
  label: {
    fontSize: 12,
    letterSpacing: 4.8,
    color: ACCENT,
    textTransform: 'uppercase',
    marginBottom: 2,
  },

  /* Title */
  title: {
    fontSize: 40,
    fontWeight: '700',
    color: '#e8eaed',
    textAlign: 'center',
    letterSpacing: -1,
    lineHeight: 46,
    fontFamily: 'sans-serif',
  },

  /* Subtitle */
  subtitle: {
    fontSize: 16,
    lineHeight: 26,
    color: '#9aa0a8',
    textAlign: 'center',
  },

  /* CTA row */
  ctaRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 4,
  },

  /* Primary button */
  btnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: ACCENT,
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 26,
  },
  btnPrimaryText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#06222e',
  },

  /* Secondary button */
  btnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 26,
  },
  btnSecondaryText: {
    fontSize: 15,
    fontWeight: '500',
  },

  /* Divider */
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    width: '100%',
    maxWidth: 560,
    marginVertical: 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#1c1f26',
  },
  dividerLabel: {
    fontSize: 11,
    color: '#5b616b',
    letterSpacing: 0.4,
  },

  /* Pills row */
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },

  /* Pill */
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 11,
    paddingHorizontal: 18,
    borderRadius: 999,
    borderWidth: 1,
  },
  pillText: {
    fontSize: 13.5,
    color: '#cdd1d7',
  },
});
