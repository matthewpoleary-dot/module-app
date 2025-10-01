// app/_layout.tsx
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import LoadingScreen from '../components/LoadingScreen';
import { colors } from '../constants/theme';
import { ModulesProvider } from '../context/ModulesContext';

export default function RootLayout() {
  const [booting, setBooting] = useState(true);
  const [name, setName] = useState<string>('');

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    (async () => {
      t = setTimeout(() => setBooting(false), 900); // ~1s splash
    })();
    return () => clearTimeout(t);
  }, []);

  return (
    <ModulesProvider>
      <StatusBar style="light" />
      {booting ? (
        <LoadingScreen name={name} />
      ) : (
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: colors.surface },
            headerTintColor: '#fff',
            contentStyle: { backgroundColor: colors.bg },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="module/[id]" options={{ title: 'Edit Module' }} />
        </Stack>
      )}
    </ModulesProvider>
  );
}
