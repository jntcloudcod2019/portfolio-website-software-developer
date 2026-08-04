import '../global.css';

import '../i18n';

import {
  Stack,
  useRouter,
  usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet,
  Pressable,
  Platform,
} from 'react-native';
import { Text } from '@/components/ui/AppText';

import { LikesProvider } from '@/context/LikesContext';
import { AppConfigProvider } from '@/context/AppConfigContext';
import { I18nProvider } from '@/context/I18nProvider';
import { colors, spacing } from '@/constants/theme';
import { NavHeader, type SectionKey } from '@/components/layout/NavHeader';

export default function RootLayout() {
  const router = useRouter();
  const pathname = usePathname();

  const BackButton = () => (
    <Pressable onPress={() => router.back()} style={{ paddingHorizontal: spacing.md }}>
      <Text style={{ color: colors.text, fontSize: 20, fontWeight: '600' }}>{"<"}</Text>
    </Pressable>
  );

  // O header é padrão em todas as páginas web. A home é a exceção: ela monta o
  // próprio NavHeader porque precisa do scroll-spy entre as seções.
  const isHome = pathname === '/' || pathname === '/index';
  const showWebNavHeader = Platform.OS === 'web' && !isHome;

  const activeSection: SectionKey = pathname.startsWith('/estudo') ? 'studies' : 'projects';

  return (
    <GestureHandlerRootView style={styles.root}>
      <AppConfigProvider>
      <I18nProvider>
      <LikesProvider>
        <StatusBar style="light" />
        {showWebNavHeader && (
          <NavHeader
            activeSection={activeSection}
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
          <Stack.Screen
            name="estudo/inteligencia-agentica"
            options={{
              title: 'Estudo',
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
