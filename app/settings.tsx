import { StyleSheet, Switch, Text, View } from "react-native";
import { useAppTheme } from "./useAppTheme";

export default function Settings() {
  const { theme, toggle } = useAppTheme();
  const isDark = theme === "dark";

  return (
    <View style={[styles.container, { backgroundColor: isDark ? "#000" : "#fff" }]}>
      <Text style={[styles.title, { color: isDark ? "#fff" : "#111" }]}>Appearance</Text>
      <View style={styles.row}>
        <Text style={{ color: isDark ? "#ddd" : "#333", fontSize: 16, marginRight: 12 }}>
          Dark Mode
        </Text>
        <Switch value={isDark} onValueChange={toggle} />
      </View>
      <Text style={{ color: isDark ? "#aaa" : "#666", marginTop: 10 }}>
        (This toggle is in-memory; app restarts will follow your system theme again.)
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "800", marginBottom: 8 },
  row: { flexDirection: "row", alignItems: "center" },
});
