import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, radius } from '../../constants/theme';

export function Chip({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return (
    <View style={[styles.chip, style]}>
      <Text style={styles.text}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: colors.chip,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  text: { color: colors.text, fontWeight: '700' },
});
