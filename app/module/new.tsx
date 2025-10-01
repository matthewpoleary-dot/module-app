// app/module/new.tsx
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import { useModulesStore } from "../../lib/modulestore"; // ✅ correct

export default function NewModuleScreen() {
  const router = useRouter();
  const addModule = useModulesStore((s) => s.addModule);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [ectsStr, setEctsStr] = useState("");

  const [exam, setExam] = useState("70");
  const [project, setProject] = useState("30");
  const [assessments, setAssessments] = useState("0");
  const [attendance, setAttendance] = useState("0");

  const total = useMemo(() => {
    const n = (v: string) => Number(v || 0);
    return n(exam) + n(project) + n(assessments) + n(attendance);
  }, [exam, project, assessments, attendance]);

  const onSave = () => {
    const ects = Number(ectsStr);
    if (!name.trim()) return Alert.alert("Missing name", "Please enter a module name.");
    if (!Number.isFinite(ects) || ects <= 0) return Alert.alert("ECTS", "Enter a valid ECTS value.");
    if (total !== 100) return Alert.alert("Weightings must total 100%", `Current total is ${total}%.`);

    addModule({
      name: name.trim(),
      code: code.trim() || undefined,
      ects,
      weightings: {
        exam: Number(exam),
        project: Number(project),
        assessments: Number(assessments),
        attendance: Number(attendance),
      },
    });

    router.replace("/"); // back to Home
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#0B0B0F" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ color: "white", fontSize: 22, fontWeight: "900", marginBottom: 12 }}>
          New module
        </Text>

        <Field label="Name" value={name} onChangeText={setName} placeholder="e.g. Microeconomics" />
        <Field label="Code (optional)" value={code} onChangeText={setCode} placeholder="e.g. ECON10020" />
        <Field label="ECTS" value={ectsStr} onChangeText={setEctsStr} keyboardType="numeric" placeholder="e.g. 10" />

        <Text style={{ color: "#C7C7D0", marginTop: 18, marginBottom: 6, fontWeight: "700" }}>
          Weightings (must sum to 100%)
        </Text>
        <Field label="Exam %" value={exam} onChangeText={setExam} keyboardType="numeric" />
        <Field label="Project %" value={project} onChangeText={setProject} keyboardType="numeric" />
        <Field label="Assessments %" value={assessments} onChangeText={setAssessments} keyboardType="numeric" />
        <Field label="Attendance %" value={attendance} onChangeText={setAttendance} keyboardType="numeric" />

        <Text style={{ color: total === 100 ? "#22C55E" : "#F59E0B", marginTop: 4 }}>
          Total: {total}%
        </Text>

        <Pressable
          onPress={onSave}
          style={{
            marginTop: 20,
            borderRadius: 12,
            paddingVertical: 16,
            alignItems: "center",
            backgroundColor: "#2563EB",
            opacity: name.trim() && ectsStr ? 1 : 0.8,
          }}
          accessibilityRole="button"
          accessibilityLabel="Save module"
        >
          <Text style={{ color: "white", fontWeight: "900" }}>Save</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field(props: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "numeric";
}) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ color: "#9CA3AF", marginBottom: 6 }}>{props.label}</Text>
      <TextInput
        value={props.value}
        onChangeText={props.onChangeText}
        placeholder={props.placeholder}
        keyboardType={props.keyboardType ?? "default"}
        placeholderTextColor="#6B7280"
        returnKeyType="done"
        style={{
          backgroundColor: "#12121A",
          color: "white",
          borderRadius: 12,
          paddingHorizontal: 14,
          paddingVertical: 12,
          borderWidth: 1,
          borderColor: "#1F2937",
        }}
      />
    </View>
  );
}
