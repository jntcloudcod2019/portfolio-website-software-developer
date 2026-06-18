import { ResizeMode, Video } from 'expo-av';
import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors } from '@/constants/theme';

type ProjectVideoProps = {
  uri: string;
};

export function ProjectVideo({ uri }: ProjectVideoProps) {
  const videoRef = useRef<Video>(null);

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={{ uri }}
        style={styles.video}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        isLooping={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.surfaceLight,
    marginBottom: 16,
  },
  video: {
    width: '100%',
    height: 220,
  },
});
