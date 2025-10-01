// app/(tabs)/index.tsx
import { Link } from "expo-router";
import { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Chip } from "../../components/ui/Chip";
import EmptyState from "../../components/ui/emptystate";
import FAB from "../../components/ui/fab";
import { colors, spacing } from "../../constants/theme";
import { useModules } from "../../context/ModulesContext";

export default function ModulesScreen() {
  const { modules, totals } = useModules();
  const [q, setQ] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "ects" | "grade">("name");

  const data = useMemo(() => {
    const filtered = q.trim()
      ? modules.filter((m) =>
          m.name.toLowerCase().includes(q.trim().toLowerCase())
        )
      : modules;

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "ects") return (b.credits ?? 0) - (a.credits ?? 0);
      const ag = a.grade ?? -1;
      const bg = b.grade ?? -1;
      return bg - ag;
    });

    return sorted;
  }, [modules, q, sortBy]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 400);
  };

  return (
    <View style={styles.container}>
      {/* Hero */}
      <View style={styles.hero}>
        <View style={{ gap: 4 }}>
          <Text style={styles.heroEyebrow}>Your modules</Text>
          <Text style={styles.heroTitle}>Plan. Track. Finish strong.</Text>
        </View>

        <Card style={[styles.kpiRow, shadow()]}>
          <View style={{ gap: 4 }}>
            <Text style={styles.kpiLabel}>Total ECTS</Text>
            <Text style={styles.kpiValue}>{totals.ects}</Text>
          </View>
          <View style={{ gap: 4 }}>
            <Text style={styles.kpiLabel}>Weighted Avg</Text>
            <Text style={styles.kpiValue}>
              {totals.weightedAvg == null ? "—" : totals.weightedAvg.toFixed(1)}
            </Text>
          </View>
        </Card>

        {/* Search + Sort */}
        <View style={styles.controlsRow}>
          <View style={styles.searchWrap}>
            <TextInput
              placeholder="Search modules…"
              placeholderTextColor={colors.textDim}
              value={q}
              onChangeText={setQ}
              style={styles.search}
              returnKeyType="search"
            />
          </View>

          <Pressable
            onPress={() =>
              setSortBy((prev) =>
                prev === "name" ? "ects" : prev === "ects" ? "grade" : "name"
              )
            }
            style={styles.sortButton}
          >
            <Text style={styles.sortText}>
              Sort: {sortBy === "name" ? "Name" : sortBy === "ects" ? "ECTS" : "Grade"}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* List */}
      <FlatList
        data={data}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ padding: spacing(2), paddingTop: 0 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <EmptyState
            title="No modules yet"
            subtitle="Create your first module to start tracking ECTS, grades, meetings and deadlines."
            cta={
              <Link href="/add" asChild>
                <Button title="Add your first module" onPress={() => {}} />
              </Link>
            }
          />
        }
        renderItem={({ item }) => (
          <Link href={`/module/${item.id}`} asChild>
            <Pressable>
              <Card style={[styles.row, shadowSmall()]}>
                <View style={{ flex: 1, gap: 6 }}>
                  <Text style={styles.name} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 8,
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <Chip>{item.credits} ECTS</Chip>
                    {item.semester ? <Chip>{item.semester}</Chip> : null}
                    {typeof item.grade === "number" ? (
                      <Chip>{item.grade.toFixed(0)}%</Chip>
                    ) : null}
                  </View>
                </View>
              </Card>
            </Pressable>
          </Link>
        )}
        ItemSeparatorComponent={() => <View style={{ height: spacing(1) }} />}
      />

      {/* Floating Add */}
      <Link href="/add" asChild>
        <FAB label="Add module" />
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  hero: {
    paddingTop: spacing(3),
    paddingHorizontal: spacing(2),
    paddingBottom: spacing(1.5),
    backgroundColor: colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  heroEyebrow: {
    color: colors.textDim,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  heroTitle: { color: colors.text, fontSize: 22, fontWeight: "900" },
  kpiRow: {
    marginTop: spacing(1.5),
    padding: spacing(2),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  kpiLabel: { color: colors.textDim, fontWeight: "700" },
  kpiValue: { color: colors.text, fontWeight: "900", fontSize: 24 },
  controlsRow: {
    marginTop: spacing(1.5),
    marginBottom: spacing(1),
    flexDirection: "row",
    gap: spacing(1),
  },
  searchWrap: { flex: 1 },
  search: {
    paddingHorizontal: spacing(1.5),
    paddingVertical: spacing(1.1),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
    backgroundColor: colors.bg,
    fontSize: 14,
  },
  sortButton: {
    paddingHorizontal: spacing(1.5),
    paddingVertical: spacing(1.1),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bg,
  },
  sortText: { color: colors.text, fontWeight: "800" },
  row: { padding: spacing(2), flexDirection: "row", gap: spacing(2), alignItems: "center" },
  name: { color: colors.text, fontSize: 18, fontWeight: "800", maxWidth: "95%" },
});

function shadow() {
  return {
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  } as const;
}
function shadowSmall() {
  return {
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  } as const;
}
