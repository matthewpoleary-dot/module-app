// app/(tabs)/weightings.tsx
import { useMemo, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { colors, spacing } from "../../constants/theme";
import { useModules } from "../../context/ModulesContext";

type W = { exam: number; project: number; assessments: number; attendance: number };

export default function WeightingsScreen() {
  const { modules, getWeightings, replaceModuleWeightings } = useModules();
  const [local, setLocal] = useState<Record<string, W>>({});

  const data = useMemo(() => modules, [modules]);

  const view = (id: string): W =>
    local[id] ?? getWeightings(id) ?? { exam: 100, project: 0, assessments: 0, attendance: 0 };

  const setField = (id: string, key: keyof W, val: string) =>
    setLocal((s) => ({
      ...s,
      [id]: { ...view(id), [key]: Number(val) || 0 },
    }));

  const total = (w: W) => w.exam + w.project + w.assessments + w.attendance;

  const save = (id: string) => {
    const w = view(id);
    if (total(w) !== 100) {
      Alert.alert("Weights must sum to 100%");
      return;
    }
    replaceModuleWeightings(id, w);
    setLocal((s) => {
      const next = { ...s };
      delete next[id];
      return next;
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Module weightings</Text>

      <FlatList
        data={data}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ paddingVertical: spacing(1) }}
        renderItem={({ item }) => {
          const w = view(item.id);
          const sum = total(w);
          const dirty = !!local[item.id];

          return (
            <Card style={{ padding: spacing(2), marginBottom: spacing(1.2), gap: spacing(1) }}>
              <Text style={styles.name}>{item.name}</Text>

              <Input
                label="Exam %"
                keyboardType="numeric"
                value={String(w.exam)}
                onChangeText={(t: string) => setField(item.id, "exam", t)}
              />
              <Input
                label="Project %"
                keyboardType="numeric"
                value={String(w.project)}
                onChangeText={(t: string) => setField(item.id, "project", t)}
              />
              <Input
                label="Assessments %"
                keyboardType="numeric"
                value={String(w.assessments)}
                onChangeText={(t: string) => setField(item.id, "assessments", t)}
              />
              <Input
                label="Attendance %"
                keyboardType="numeric"
                value={String(w.attendance)}
                onChangeText={(t: string) => setField(item.id, "attendance", t)}
              />

              <Text style={styles.sum}>
                Total: {sum}% {sum !== 100 ? "⚠️ must be 100%" : "✅"}
              </Text>

              <Button
                title={dirty ? "Save changes" : "Save"}
                onPress={() => {
                  if (sum === 100) save(item.id);
                }}
                style={{ opacity: sum !== 100 ? 0.6 : 1 }}
              />
            </Card>
          );
        }}
        ListEmptyComponent={
          <Card style={{ padding: spacing(2), alignItems: "center" }}>
            <Text style={{ color: colors.textDim }}>No modules to edit.</Text>
          </Card>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: spacing(2) },
  h1: { color: colors.text, fontSize: 20, fontWeight: "900", marginBottom: spacing(1) },
  name: { color: colors.text, fontWeight: "800", marginBottom: spacing(0.5) },
  sum: { color: colors.textDim, fontWeight: "700", marginTop: spacing(0.5) },
});
