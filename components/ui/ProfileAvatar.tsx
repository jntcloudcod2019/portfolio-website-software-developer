import React from 'react';
import type { ImageSourcePropType } from 'react-native';

import { colors } from '@/constants/theme';

import { CircularImage } from './CircularImage';

export const PROFILE_AVATAR_SIZE = 220;

type ProfileAvatarProps = {
  source: ImageSourcePropType;
  accessibilityLabel?: string;
};

export function ProfileAvatar({ source, accessibilityLabel }: ProfileAvatarProps) {
  return (
    <CircularImage
      source={source}
      size={PROFILE_AVATAR_SIZE}
      borderWidth={3}
      borderColor={colors.textMuted}
      focus="top"
      accessibilityLabel={accessibilityLabel}
    />
  );
}
