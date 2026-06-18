import React from 'react';
import type { ImageSourcePropType } from 'react-native';

import { colors } from '@/constants/theme';

import BorderGlow from './BorderGlow.web';
import { CircularImage } from './CircularImage';

export const PROFILE_AVATAR_SIZE = 220;
const GLOW_RADIUS = 40;

type ProfileAvatarProps = {
  source: ImageSourcePropType;
  accessibilityLabel?: string;
};

export function ProfileAvatar({ source, accessibilityLabel }: ProfileAvatarProps) {
  const radius = PROFILE_AVATAR_SIZE / 2;

  return (
    <div
      style={{
        padding: GLOW_RADIUS,
        overflow: 'visible',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <BorderGlow
        edgeSensitivity={22}
        glowColor={colors.borderGlow.glowHsl}
        backgroundColor={colors.background}
        borderRadius={radius}
        glowRadius={GLOW_RADIUS}
        glowIntensity={1.2}
        coneSpread={28}
        animated
        idleBorderOpacity={0.35}
        colors={[...colors.borderGlow.colors]}
        style={{
          width: PROFILE_AVATAR_SIZE,
          height: PROFILE_AVATAR_SIZE,
        }}
      >
        <div
          style={{
            width: PROFILE_AVATAR_SIZE,
            height: PROFILE_AVATAR_SIZE,
            overflow: 'hidden',
            borderRadius: radius,
          }}
        >
          <CircularImage
            source={source}
            size={PROFILE_AVATAR_SIZE}
            borderWidth={0}
            focus="top"
            accessibilityLabel={accessibilityLabel}
          />
        </div>
      </BorderGlow>
    </div>
  );
}
