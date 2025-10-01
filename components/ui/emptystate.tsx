import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "../../constants/theme";
import { Card } from "./Card";

type Props = { title: string; subtitle?: string; cta?: ReactNode };

export default function EmptyState({ title, subtitle, cta }: Props) {
  return (
    <Card style={[styles.card, shadow()]}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {cta ? <View style={{ marginTop: spacing(1) }}>{cta}</View> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing(2),
    alignItems: "center",
    backgroundColor: colors.surface,
  },
  title: { color: colors.text, fontWeight: "900", fontSize: 16 },
  subtitle: {
    marginTop: 6,
    color: colors.textDim,
    textAlign: "center",
    lineHeight: 20,
  },
});

function shadow() {
  return {
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  } as const;
}
