import React from 'react';
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ScrollBarProps {
  scrollY:       number;
  contentHeight: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const NAV_OFFSET  = 62;  // 54px nav + 8px gap
const BOTTOM_PAD  = 16;
const TRACK_WIDTH = 4;
const THUMB_MIN_H = 28;

// ─── ScrollBar ────────────────────────────────────────────────────────────────

export function ScrollBar({ scrollY, contentHeight }: ScrollBarProps) {
  const { height: vh } = useWindowDimensions();

  if (Platform.OS !== 'web' || contentHeight <= vh) return null;

  const trackH    = Math.max(vh - NAV_OFFSET - BOTTOM_PAD, 1);
  const thumbH    = Math.max((vh / contentHeight) * trackH, THUMB_MIN_H);
  const maxTravel = trackH - thumbH;
  const ratio     = Math.min(Math.max(scrollY / (contentHeight - vh), 0), 1);
  const thumbTop  = ratio * maxTravel;

  /* Web-only CSS values */
  const containerFixed: object = {
    position: 'fixed',
    right:    8,
    top:      NAV_OFFSET,
    height:   trackH,
    zIndex:   400,
  };

  const thumbGradient: object = {
    background: 'linear-gradient(to bottom, #4b5563, #374151)',
    transition: 'top 0.14s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  return (
    <View style={[styles.track, containerFixed as object]}>
      <View
        style={[
          styles.thumb,
          { height: thumbH, top: thumbTop },
          thumbGradient as object,
        ]}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  track: {
    width:           TRACK_WIDTH,
    borderRadius:    TRACK_WIDTH / 2,
    backgroundColor: '#13161d',
    position:        'relative',
    overflow:        'hidden',
  },
  thumb: {
    position:        'absolute',
    left:            0,
    right:           0,
    borderRadius:    TRACK_WIDTH / 2,
    backgroundColor: '#4b5563',
  },
});
