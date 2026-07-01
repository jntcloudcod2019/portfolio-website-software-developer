import '../global.css';

import '../i18n';

import { Stack, useRouter, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, Pressable, Text, Platform } from 'react-native';

import { LikesProvider } from '@/context/LikesContext';
import { AppConfigProvider } from '@/context/AppConfigContext';
import { I18nProvider } from '@/context/I18nProvider';
import { colors, spacing } from '@/constants/theme';
import { NavHeader } from '@/components/layout/NavHeader';

export default function RootLayout() {
  const router = useRouter();
  const pathname = usePathname();

  const BackButton = () => (
    <Pressable onPress={() => router.back()} style={{ paddingHorizontal: spacing.md }}>
      <Text style={{ color: colors.text, fontSize: 20, fontWeight: '600' }}>{"<"}</Text>
    </Pressable>
  );

  const isProjectRoute = pathname.startsWith('/project') || pathname === '/projects';
  const showWebNavHeader = Platform.OS === 'web' && isProjectRoute;

  return (
    <GestureHandlerRootView style={styles.root}>
      <AppConfigProvider>
      <I18nProvider>
      <LikesProvider>
        <StatusBar style="light" />
        {showWebNavHeader && (
          <NavHeader
            activeSection="projects"
            onNavigate={() => router.push('/')}
          />
        )}
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.text,
            headerTitleStyle: { fontWeight: '600' },
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen
            name="projects"
            options={{
              title: 'Projetos',
              headerShown: Platform.OS !== 'web',
              headerLeft: () => <BackButton />,
            }}
          />
          <Stack.Screen
            name="project/[id]"
            options={{
              title: 'Projeto',
              headerShown: Platform.OS !== 'web',
              headerLeft: () => <BackButton />,
            }}
          />
        </Stack>
      </LikesProvider>
      </I18nProvider>
      </AppConfigProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
