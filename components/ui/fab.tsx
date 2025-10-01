import { StyleSheet, Text, View } from "react-native";
import { spacing } from "../../constants/theme";

type Props = { label?: string };

export default function FAB({ label = "Add" }: Props) {
  return (
    <View style={[styles.wrap, shadow()]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.plus}>＋</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    right: spacing(2),
    bottom: spacing(2),
    backgroundColor: "#2563EB",
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(1.2),
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  label: { color: "#fff", fontWeight: "800" },
  plus: { color: "#fff", fontWeight: "900", fontSize: 18, marginTop: -2 },
});

function shadow() {
  return {
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  } as const;
}
