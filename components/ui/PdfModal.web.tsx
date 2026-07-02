import React from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/components/ui/AppText';

import type { PdfModalProps } from './PdfModal';

const MONO = Platform.select({
  web: '"JetBrains Mono", "Courier New", monospace',
  default: 'monospace',
});

// Estilos exclusivos de web (position:fixed, backdrop-filter, vh) passam por cast
// `as object`, seguindo o padrão do projeto (ex.: NavHeader.tsx).
const backdropWeb = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(8,9,11,0.6)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 24,
  zIndex: 1000,
} as object;

const windowWeb = {
  position: 'relative',
  width: '92%',
  maxWidth: 900,
  height: '88vh',
  backgroundColor: '#0e1014',
  borderWidth: 1,
  borderColor: '#1c1f26',
  borderRadius: 16,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 24px 60px -12px rgba(0,0,0,0.72)',
} as object;

export function PdfModal({ visible, uri, onClose, title, accent = '#38bdf8' }: PdfModalProps) {
  if (!visible) return null;

  return (
    <View style={backdropWeb}>
      {/* Backdrop clicável fecha o modal (fica atrás da janela) */}
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Fechar" />

      <View style={windowWeb}>
        {/* Header */}
        <View style={styles.header}>
          {title ? (
            <Text style={[styles.title, { fontFamily: MONO }]} numberOfLines={1}>
              {title}
            </Text>
          ) : (
            <View />
          )}
        </View>

        {/* Botão fechar (×) no canto superior direito */}
        <Pressable
          onPress={onClose}
          style={[styles.close, { borderColor: `${accent}55` }]}
          accessibilityRole="button"
          accessibilityLabel="Fechar"
        >
          <Text style={[styles.closeText, { color: accent }]}>✕</Text>
        </Pressable>

        {/* Viewer do PDF */}
        {uri ? (
          <iframe
            src={uri}
            title={title ?? 'PDF'}
            style={{ width: '100%', flex: 1, border: 'none', background: '#ffffff' }}
          />
        ) : (
          <View style={styles.empty}>
            <Text style={[styles.emptyText, { fontFamily: MONO }]}>Documento indisponível.</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    paddingHorizontal: 18,
    paddingRight: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#1c1f26',
    backgroundColor: '#101216',
  },
  title: {
    fontSize: 12,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: '#9aa0a8',
    flex: 1,
  },
  close: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: '#13161d',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  closeText: { fontSize: 15, fontWeight: '700', lineHeight: 18 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 12, color: '#6b7280' },
});
