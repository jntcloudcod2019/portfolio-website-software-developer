import React from 'react';
import { StyleSheet, View } from 'react-native';

import { colors } from '@/constants/theme';

type ProjectVideoProps = {
  uri: string;
};

export function ProjectVideo({ uri }: ProjectVideoProps) {
  return (
    <View style={styles.container}>
      <video
        src={uri}
        controls
        style={{
          width: '100%',
          maxHeight: 360,
          borderRadius: 12,
          backgroundColor: colors.surfaceLight,
        }}
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
});
