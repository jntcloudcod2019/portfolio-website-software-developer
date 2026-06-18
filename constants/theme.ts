export const colors = {
  background: '#0b0b0f',
  surface: '#14141c',
  surfaceLight: '#1c1c28',
  border: '#2a2a3a',
  text: '#f4f4f8',
  textMuted: '#9ca3af',
  textName: '#8B9EB5',
  accent: '#22d3ee',
  accentSecondary: '#a78bfa',
  like: '#f472b6',
  borderGlow: {
    colors: ['#9ca3af', '#6b7280', '#d1d5db'],
    glowHsl: '0 0% 70%',
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;
