import React, { forwardRef } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type ViewProps,
} from 'react-native';

import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { colors, spacing } from '@/constants/theme';

type SectionProps = ViewProps & {
  title?:    string;
  subtitle?: string;
  children:  React.ReactNode;
};

export const Section = forwardRef<View, SectionProps>(
  ({ title, subtitle, children, style, ...rest }, ref) => {
    const { height } = useWindowDimensions();

    return (
      <View
        ref={ref}
        style={[
          styles.section,
          { minHeight: height },
          Platform.OS === 'web' && styles.sectionWeb,
          style,
        ]}
        {...rest}
      >
        <ScrollReveal>
          {(title || subtitle) && (
            <View style={styles.header}>
              {title ? <Text style={styles.title}>{title}</Text> : null}
              {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
            </View>
          )}
          <View style={styles.content}>{children}</View>
        </ScrollReveal>
      </View>
    );
  },
);

Section.displayName = 'Section';

const styles = StyleSheet.create({
  section: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    justifyContent: 'center',
  },
  sectionWeb: {
    scrollSnapAlign: 'start',
  } as object,
  header: {
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 0.5,
  },
  subtitle: {
    marginTop: spacing.sm,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    maxWidth: 480,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    maxWidth: 1100,
    alignSelf: 'center',
  },
});
