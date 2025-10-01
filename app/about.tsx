import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { useAppTheme } from "./useAppTheme";

export default function About() {
  const { theme } = useAppTheme();
  const isDark = theme === "dark";

  return (
    <View style={[styles.container, { backgroundColor: isDark ? "#000" : "#fff" }]}>
      <Text style={[styles.headline, { color: isDark ? "#fff" : "#111" }]}>
        About This App
      </Text>
      <Text style={{ color: isDark ? "#ddd" : "#333", textAlign: "center", marginTop: 8 }}>
        Built with Expo + Expo Router. This screen is just a simple example of
        static content. You can link out or add more sections here.
      </Text>

      <Pressable
        onPress={() => Linking.openURL("https://expo.dev")}
        style={({ pressed }) => [
          styles.button,
          { opacity: pressed ? 0.8 : 1, backgroundColor: isDark ? "#1e1e1e" : "#111" },
        ]}
      >
        <Text style={{ color: "#fff", fontWeight: "600" }}>Learn more at expo.dev</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  headline: { fontSize: 26, fontWeight: "800" },
  button: { marginTop: 20, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10 },
});
