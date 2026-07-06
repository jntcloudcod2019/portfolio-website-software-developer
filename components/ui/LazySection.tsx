import React, { useEffect, useState } from 'react';
import { Platform, View, type ViewStyle } from 'react-native';

type LazySectionProps = {
  load: () => Promise<{ default: React.ComponentType<any> }>;
  sectionRef?: React.Ref<View>;
  fallback?: React.ReactNode;
};

export function LazySection({ load, sectionRef, fallback }: LazySectionProps) {
  const [Component, setComponent] = useState<React.ComponentType<{ sectionRef?: React.Ref<View> }> | null>(null);

  useEffect(() => {
    let mounted = true;
    load().then((mod) => {
      if (mounted) setComponent(() => mod.default);
    });
    return () => { mounted = false; };
  }, [load]);

  if (!Component) {
    return (fallback as React.ReactElement) ?? <View style={lazyFallback} />;
  }

  return <Component sectionRef={sectionRef} />;
}

const lazyFallback: ViewStyle = {
  height: Platform.OS === 'web' ? ('100vh' as any) : 600,
  backgroundColor: 'transparent',
};
