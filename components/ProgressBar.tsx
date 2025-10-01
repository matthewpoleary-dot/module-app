import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import { colors, radius } from '../constants/theme';

export function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = Math.max(0, Math.min(100, (value / Math.max(1, max)) * 100));
  return (
    <View style={styles.track}>
      <LinearGradient
        colors={[colors.accent, colors.accent2]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={[styles.fill, { width: `${pct}%` }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: '#111218',
    borderRadius: radius.pill,
    height: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1f2130',
  },
  fill: { height: '100%' },
});
