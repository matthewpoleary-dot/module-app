import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function About() {
  return (
    <View style={[styles.container, { backgroundColor: "#fff" }]}>
      <Text style={[styles.headline, { color: "#111" }] }>
        About This App
      </Text>
      <Text style={{ color: "#333", textAlign: "center", marginTop: 8 }}>
        Built with Expo + Expo Router. This screen is just a simple example of
        static content. You can link out or add more sections here.
      </Text>
      <View style={styles.button}>
        <Link href="https://expo.dev" target="_blank" style={{ color: "#111", fontWeight: "600" }}>
          Learn more at expo.dev
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  headline: { fontSize: 26, fontWeight: "800" },
  button: { marginTop: 20, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10, backgroundColor: "#f2f2f2" },
});
