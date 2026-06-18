import * as Linking from 'expo-linking';
import React, { useCallback, useRef, useState } from 'react';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa';
import { MdEmail, MdPhone } from 'react-icons/md';

import { colors } from '@/constants/theme';
import { portfolio } from '@/content/portfolio';

const BASE_SIZE = 56;
const MAX_SCALE = 1.65;
const FALLOFF = 85;

type DockItem = {
  label: string;
  icon: React.ReactNode;
  href: string;
};

function buildItems(contact: typeof portfolio.contact): DockItem[] {
  return [
    { label: 'E-mail', icon: <MdEmail />, href: `mailto:${contact.email}` },
    { label: 'Telefone', icon: <MdPhone />, href: `tel:${contact.phone.replace(/\s/g, '')}` },
    { label: 'LinkedIn', icon: <FaLinkedinIn />, href: contact.linkedin },
    { label: 'GitHub', icon: <FaGithub />, href: contact.github },
  ];
}

export default function ContactDock() {
  const { contact } = portfolio;
  const items = buildItems(contact);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [mouseX, setMouseX] = useState<number | null>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMouseX(e.clientX);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMouseX(null);
  }, []);

  const getScale = (index: number): number => {
    if (mouseX === null) return 1;
    const el = itemRefs.current[index];
    if (!el) return 1;
    const rect = el.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    const dist = Math.abs(mouseX - center);
    return 1 + (MAX_SCALE - 1) * Math.exp(-(dist * dist) / (2 * FALLOFF * FALLOFF));
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        display: 'inline-flex',
        alignItems: 'flex-end',
        gap: 14,
        padding: '16px 28px',
        background: 'rgba(20, 20, 28, 0.88)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        borderRadius: 24,
        border: `1px solid ${colors.border}`,
        boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
      }}
    >
      {items.map((item, i) => {
        const scale = getScale(i);
        return (
          <div
            key={item.label}
            ref={(el) => { itemRefs.current[i] = el; }}
            onClick={() => Linking.openURL(item.href)}
            title={item.label}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 7,
              cursor: 'pointer',
              transform: `scale(${scale})`,
              transformOrigin: 'bottom center',
              transition: 'transform 0.1s ease',
              userSelect: 'none',
            }}
          >
            <div
              style={{
                width: BASE_SIZE,
                height: BASE_SIZE,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 26,
                color: colors.accent,
                background: colors.surfaceLight,
                borderRadius: 15,
                border: `1px solid ${colors.border}`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
              }}
            >
              {item.icon}
            </div>
            <span
              style={{
                fontSize: 10,
                color: colors.textMuted,
                fontWeight: 600,
                letterSpacing: 0.4,
              }}
            >
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
