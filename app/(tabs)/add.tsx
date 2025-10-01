import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { colors, spacing } from "../../constants/theme";
import { useModules } from "../../context/ModulesContext";

export default function AddModuleScreen() {
  const router = useRouter();
  const { addModule, defaultWeighting } = useModules();

  const [name, setName] = useState("");
  const [credits, setCredits] = useState("");
  const [semester, setSemester] = useState<string | undefined>(undefined);
  const [weights, setWeights] = useState({ ...defaultWeighting });

  const sum = weights.exam + weights.project + weights.assessments + weights.attendance;
  const canSave = name.trim().length > 0 && Number(credits) > 0 && sum === 100;

  const save = () => {
    const ects = Number(credits);
    if (!name.trim()) return Alert.alert("Name required");
    if (!Number.isFinite(ects) || ects <= 0) return Alert.alert("Enter valid ECTS");
    if (sum !== 100) return Alert.alert("Weights must sum to 100%");

    addModule({
      name: name.trim(),
      credits: ects,
      semester: semester?.trim() || null,
      weightings: { ...weights },
    });

    router.replace("/"); // go home
  };

  const set = (k: keyof typeof weights, v: string) =>
    setWeights((w: typeof weights) => ({ ...w, [k]: Number(v) || 0 }));

  return (
    <KeyboardAvoidingView behavior={Platform.select({ ios: "padding" })} style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.h1}>Add module</Text>

        <Card style={{ padding: spacing(2), gap: spacing(1) }}>
          <Input label="Name" value={name} onChangeText={setName} />
          <Input label="ECTS" value={credits} onChangeText={setCredits} keyboardType="numeric" />
          <Input label="Semester (optional)" value={semester ?? ""} onChangeText={setSemester} />
        </Card>

        <Text style={[styles.h2, { marginTop: spacing(2) }]}>Weightings</Text>
        <Card style={{ padding: spacing(2), gap: spacing(1) }}>
          <Input
            label="Exam %"
            keyboardType="numeric"
            value={String(weights.exam)}
            onChangeText={(t: string) => set("exam", t)}
          />
          <Input
            label="Project %"
            keyboardType="numeric"
            value={String(weights.project)}
            onChangeText={(t: string) => set("project", t)}
          />
          <Input
            label="Assessments %"
            keyboardType="numeric"
            value={String(weights.assessments)}
            onChangeText={(t: string) => set("assessments", t)}
          />
          <Input
            label="Attendance %"
            keyboardType="numeric"
            value={String(weights.attendance)}
            onChangeText={(t: string) => set("attendance", t)}
          />
          <Text style={styles.sum}>Total: {sum}% {sum !== 100 ? "⚠️ (must be 100%)" : "✅"}</Text>
        </Card>

        <Button title="Save module" onPress={save} style={{ marginTop: spacing(2) }} disabled={!canSave} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: spacing(2), gap: spacing(1) },
  h1: { color: colors.text, fontSize: 22, fontWeight: "900" },
  h2: { color: colors.textDim, fontWeight: "800" },
  sum: { marginTop: spacing(0.5), color: colors.textDim, fontWeight: "700" },
});
