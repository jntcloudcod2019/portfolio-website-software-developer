import React, { useState } from 'react';
import { Platform, StyleProp, View, ViewProps, ViewStyle } from 'react-native';

// Wrapper reutilizável que aplica `hoverStyle` enquanto o cursor está sobre o
// elemento (somente web). Usado para os hovers de nós e cards do diagrama.
type HoverableProps = ViewProps & {
  hoverStyle?: StyleProp<ViewStyle>;
};

const HoverableView = View as React.ComponentType<
  ViewProps & { onMouseEnter?: () => void; onMouseLeave?: () => void }
>;

export function Hoverable({ style, hoverStyle, children, ...rest }: HoverableProps) {
  const [hovered, setHovered] = useState(false);
  const webHandlers =
    Platform.OS === 'web'
      ? { onMouseEnter: () => setHovered(true), onMouseLeave: () => setHovered(false) }
      : {};

  return (
    <HoverableView style={[style, hovered && hoverStyle]} {...webHandlers} {...rest}>
      {children}
    </HoverableView>
  );
}
