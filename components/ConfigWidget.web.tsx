import React from 'react';
import { useAppConfig, type Theme, type Lang } from '@/context/AppConfigContext';

// ─── Inline HTML elements ─────────────────────────────────────────────────────

const Div    = 'div'    as unknown as React.FC<React.HTMLAttributes<HTMLDivElement>>;
const Button = 'button' as unknown as React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>>;
const Svg    = 'svg'    as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
const Path   = 'path'   as unknown as React.FC<React.SVGProps<SVGPathElement>>;
const Circle = 'circle' as unknown as React.FC<React.SVGProps<SVGCircleElement>>;
const Line   = 'line'   as unknown as React.FC<React.SVGProps<SVGLineElement>>;

// ─── Icons (12px) ─────────────────────────────────────────────────────────────

function MoonIcon({ color }: { color: string }) {
  return (
    <Svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      style={{ display: 'block', flexShrink: 0 }}>
      <Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </Svg>
  );
}

function SunIcon({ color }: { color: string }) {
  return (
    <Svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      style={{ display: 'block', flexShrink: 0 }}>
      <Circle cx="12" cy="12" r="5" />
      <Line x1="12" y1="1"     x2="12" y2="3"     />
      <Line x1="12" y1="21"    x2="12" y2="23"    />
      <Line x1="4.22"  y1="4.22"  x2="5.64"  y2="5.64"  />
      <Line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <Line x1="1"     y1="12"    x2="3"     y2="12"    />
      <Line x1="21"    y1="12"    x2="23"    y2="12"    />
      <Line x1="4.22"  y1="19.78" x2="5.64"  y2="18.36" />
      <Line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"  />
    </Svg>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const css = {
  container: {
    position:   'fixed',
    top:        14,
    right:      16,
    zIndex:     999,
    display:    'flex',
    alignItems: 'center',
    gap:        6,
  } as React.CSSProperties,

  segment: {
    display:             'flex',
    alignItems:          'center',
    flexDirection:       'row',
    background:          'var(--bg-surface)',
    border:              '1px solid var(--border)',
    borderRadius:        999,
    padding:             3,
    gap:                 2,
    backdropFilter:      'blur(10px)',
    WebkitBackdropFilter:'blur(10px)',
  } as React.CSSProperties,

  btnActive: {
    display:      'flex',
    alignItems:   'center',
    gap:          5,
    background:   'var(--bg-card)',
    border:       '1px solid rgba(56,189,248,.22)',
    color:        'var(--text-primary)',
    fontWeight:   '600',
    borderRadius: 999,
    padding:      '3px 9px',
    cursor:       'pointer',
    fontFamily:   '"Space Grotesk", sans-serif',
    fontSize:     11.5,
    transition:   'background .18s, color .18s, border-color .18s',
    outline:      'none',
    whiteSpace:   'nowrap',
  } as React.CSSProperties,

  btnInactive: {
    display:      'flex',
    alignItems:   'center',
    gap:          5,
    background:   'transparent',
    border:       '1px solid transparent',
    color:        'var(--text-muted)',
    fontWeight:   '400',
    borderRadius: 999,
    padding:      '3px 9px',
    cursor:       'pointer',
    fontFamily:   '"Space Grotesk", sans-serif',
    fontSize:     11.5,
    transition:   'background .18s, color .18s',
    outline:      'none',
    whiteSpace:   'nowrap',
  } as React.CSSProperties,

  divider: {
    width:      1,
    height:     18,
    background: 'var(--border)',
    flexShrink: 0,
  } as React.CSSProperties,
};

// ─── Segments ─────────────────────────────────────────────────────────────────

function ThemeSegment() {
  const { theme, setTheme } = useAppConfig();
  return (
    <Div style={css.segment}>
      <Button style={theme === 'dark' ? css.btnActive : css.btnInactive}
        onClick={() => setTheme('dark' as Theme)}>
        <MoonIcon color={theme === 'dark' ? 'var(--text-primary)' : 'var(--text-muted)'} />
        Dark
      </Button>
      <Button style={theme === 'light' ? css.btnActive : css.btnInactive}
        onClick={() => setTheme('light' as Theme)}>
        <SunIcon color={theme === 'light' ? 'var(--text-primary)' : 'var(--text-muted)'} />
        Light
      </Button>
    </Div>
  );
}

function LangSegment() {
  const { lang, setLang } = useAppConfig();
  return (
    <Div style={css.segment}>
      <Button style={lang === 'pt' ? css.btnActive : css.btnInactive}
        onClick={() => setLang('pt' as Lang)}>
        🇧🇷 PT
      </Button>
      <Button style={lang === 'en' ? css.btnActive : css.btnInactive}
        onClick={() => setLang('en' as Lang)}>
        🇺🇸 EN
      </Button>
    </Div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export function ConfigWidget() {
  return (
    <Div style={css.container}>
      <ThemeSegment />
      <Div style={css.divider} />
      <LangSegment />
    </Div>
  );
}
