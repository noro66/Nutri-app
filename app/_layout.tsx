import React from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { View } from 'react-native';
import { AuthProvider, useAuth } from '../lib/auth-context';
import 'react-native-reanimated';

// Define custom theme
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4CAF50',
    accent: '#8BC34A',
  },
};

function RootLayoutNav() {
  const { user, isLoading, hasCompletedOnboarding } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  React.useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === 'auth';
    const inOnboardingGroup = segments[0] === 'onboarding';
    const inTabsGroup = segments[0] === '(tabs)';

    if (!user && !inAuthGroup) {
      // User is not signed in and not in auth group, redirect to login
      router.replace('/auth/login');
    } else if (user && !hasCompletedOnboarding && !inOnboardingGroup) {
      // User is signed in but hasn't completed onboarding
      router.replace('/onboarding/name');
    } else if (user && hasCompletedOnboarding && !inTabsGroup) {
      // User is signed in and has completed onboarding, redirect to tabs
      router.replace('/(tabs)');
    }
  }, [user, isLoading, hasCompletedOnboarding, segments]);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <View style={{ flex: 1 }}>
            <RootLayoutNav />
            <StatusBar style="auto" />
          </View>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
