import React from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  View,
  type ImageSourcePropType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors } from '@/constants/theme';

type CircularImageProps = {
  source: ImageSourcePropType;
  size?: number;
  borderWidth?: number;
  borderColor?: string;
  focus?: 'top' | 'center';
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

export function CircularImage({
  source,
  size = 140,
  borderWidth = 3,
  borderColor = colors.textMuted,
  focus = 'top',
  style,
  accessibilityLabel = 'Foto de perfil',
}: CircularImageProps) {
  const radius = size / 2;
  const imageHeight = focus === 'top' ? size * 1.35 : size;

  return (
    <View
      style={[
        styles.ring,
        {
          width: size,
          height: size,
          borderRadius: radius,
          borderWidth,
          borderColor,
        },
        style,
      ]}
      accessibilityLabel={accessibilityLabel}
    >
      <View
        style={[
          styles.clip,
          {
            width: size - borderWidth * 2,
            height: size - borderWidth * 2,
            borderRadius: radius - borderWidth,
          },
        ]}
      >
        <Image
          source={source}
          style={[
            styles.image,
            {
              width: size - borderWidth * 2,
              height: imageHeight,
              ...(Platform.OS === 'web' && focus === 'top'
                ? ({ objectPosition: 'center 15%' } as object)
                : {}),
            },
            focus === 'top' && Platform.OS !== 'web' ? styles.imageTopFocus : null,
          ]}
          resizeMode="cover"
          accessibilityLabel={accessibilityLabel}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: colors.surface,
  },
  clip: {
    overflow: 'hidden',
    alignItems: 'center',
  },
  image: {
    alignSelf: 'center',
  },
  imageTopFocus: {
    position: 'absolute',
    top: 0,
  },
});
