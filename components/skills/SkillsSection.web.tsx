import React from 'react';
import { View } from 'react-native';

import { colors } from '@/constants/theme';

import LogoLoop from './LogoLoop.web';
import { buildTechLogos } from './techLogos.web';

export default function SkillsSection() {
  const techLogos = React.useMemo(() => buildTechLogos(), []);

  return (
    <View style={{ height: 140, width: '100%', position: 'relative', overflow: 'hidden' }}>
      <LogoLoop
        logos={techLogos}
        speed={80}
        direction="left"
        logoHeight={40}
        gap={36}
        hoverSpeed={0}
        fadeOut
        fadeOutColor={colors.background}
        scaleOnHover
        ariaLabel="Tecnologias"
      />
    </View>
  );
}
