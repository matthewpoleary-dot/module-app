import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useAppTheme } from "./useAppTheme";

export default function Contact() {
  const { theme } = useAppTheme();
  const isDark = theme === "dark";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function submit() {
    if (!name || !email || !message) {
      Alert.alert("Missing info", "Please fill in all fields.");
      return;
    }
    Alert.alert("Thanks!", `Message sent.\n\nName: ${name}\nEmail: ${email}`);
    setName(""); setEmail(""); setMessage("");
  }

  const inputStyle = [
    styles.input,
    { backgroundColor: isDark ? "#0f0f0f" : "#fff", color: isDark ? "#fff" : "#111", borderColor: isDark ? "#222" : "#e5e5e5" },
  ];

  return (
    <View style={[styles.container, { backgroundColor: isDark ? "#000" : "#f7f7f7" }]}>
      <Text style={[styles.heading, { color: isDark ? "#fff" : "#111" }]}>Contact Us</Text>

      <TextInput placeholder="Your name" placeholderTextColor={isDark ? "#888" : "#999"} value={name} onChangeText={setName} style={inputStyle} />
      <TextInput placeholder="Email" placeholderTextColor={isDark ? "#888" : "#999"} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" style={inputStyle} />
      <TextInput
        placeholder="Message"
        placeholderTextColor={isDark ? "#888" : "#999"}
        value={message}
        onChangeText={setMessage}
        multiline
        numberOfLines={4}
        style={[...inputStyle, { height: 120, textAlignVertical: "top" }]}
      />

      <Pressable onPress={submit} style={({ pressed }) => [styles.button, { opacity: pressed ? 0.85 : 1, backgroundColor: isDark ? "#1e1e1e" : "#111" }]}>
        <Text style={{ color: "#fff", fontWeight: "700" }}>Send</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 12 },
  heading: { fontSize: 24, fontWeight: "800", marginBottom: 6 },
  input: { borderWidth: 1, borderRadius: 10, padding: 12 },
  button: { alignSelf: "flex-start", paddingVertical: 12, paddingHorizontal: 18, borderRadius: 10, marginTop: 6 },
});
