import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors, radius } from '../../constants/theme';

type Props = {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  variant?: 'primary' | 'ghost';
  disabled?: boolean;
};

export function Button({ title, onPress, style, variant = 'primary', disabled = false }: Props) {
  if (variant === 'ghost') {
    return (
      <Pressable
        disabled={disabled}
        onPress={() => { if (disabled) return; Haptics.selectionAsync(); onPress(); }}
        style={[styles.ghost, disabled ? { opacity: 0.6 } : null, style]}
      >
        <Text style={styles.ghostText}>{title}</Text>
      </Pressable>
    );
  }
  return (
    <Pressable
      disabled={disabled}
      onPress={() => { if (disabled) return; Haptics.selectionAsync(); onPress(); }}
      style={[{ borderRadius: radius.xl, overflow: 'hidden', opacity: disabled ? 0.6 : 1 }, style]}
    >
      <LinearGradient
        colors={[colors.accent, colors.accent2]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.gradient}
      >
        <Text style={styles.text}>{title}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  gradient: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { color: '#fff', fontWeight: '800', fontSize: 16 },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.xl,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  ghostText: { color: colors.text, fontWeight: '700' },
});
