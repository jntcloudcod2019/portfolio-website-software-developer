import { useEffect, useRef } from 'react';
import {
  Animated,
  Image,
  Platform,
  StyleSheet,
  View,
  type ImageProps,
  type ImageSourcePropType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { colors } from '@/constants/theme';

type ImageWithSkeletonProps = Omit<ImageProps, 'source'> & {
  source: ImageSourcePropType;
  skeletonWidth?: number | string;
  skeletonHeight?: number | string;
  skeletonStyle?: StyleProp<ViewStyle>;
  eager?: boolean;
};

export function ImageWithSkeleton({
  source,
  style,
  skeletonWidth,
  skeletonHeight,
  skeletonStyle,
  eager,
  ...rest
}: ImageWithSkeletonProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  const onLoad = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  };

  return (
    <View style={[styles.wrapper, style as ViewStyle]}>
      <View
        style={[
          styles.skeleton,
          skeletonWidth ? { width: skeletonWidth as any } : StyleSheet.absoluteFill,
          skeletonHeight ? { height: skeletonHeight as any } : StyleSheet.absoluteFill,
          skeletonStyle,
        ]}
      />
      <Animated.Image
        source={source}
        style={[StyleSheet.absoluteFill, { width: '100%', height: '100%', opacity }]}
        onLoad={onLoad}
        {...(Platform.OS === 'web' && !eager ? { loading: 'lazy' } : {})}
        {...(rest as any)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  skeleton: {
    backgroundColor: colors.surfaceLight,
  },
});
