// components/LoadingScreen.tsx
import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, StyleSheet, Text } from 'react-native';
import { colors } from '../constants/theme';

export default function LoadingScreen({ name }: { name?: string }) {
  const greeting = name ? `Hello, ${name}.` : 'Hello there.';
  return (
    <LinearGradient
      colors={['#12071d', '#0b0b0e']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.root}
    >
      <Text style={styles.title}>Module Tracker</Text>
      <Text style={styles.sub}>{greeting}</Text>
      <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 20 }} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { color: '#fff', fontSize: 28, fontWeight: '900', letterSpacing: 0.5 },
  sub: { color: '#cfcfe6', fontSize: 16, marginTop: 6 },
});
