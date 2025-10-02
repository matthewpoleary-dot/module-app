// app/(tabs)/calendar.tsx
import { useMemo, useState } from "react";
import { SectionList, StyleSheet, Text, TextInput, View } from "react-native";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import Select from "../../components/ui/Select";
import { colors, spacing } from "../../constants/theme";
import { useModules } from "../../context/ModulesContext";

type AgendaItem = {
  id: string;
  timeLabel: string;
  title: string;
  subtitle?: string;
  type: "meeting" | "deadline";
};

function addDays(d: Date, days: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}
function sameDate(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
const DAY_OPTS = [
  { label: "Sun", value: 0 },
  { label: "Mon", value: 1 },
  { label: "Tue", value: 2 },
  { label: "Wed", value: 3 },
  { label: "Thu", value: 4 },
  { label: "Fri", value: 5 },
  { label: "Sat", value: 6 },
];

export default function Calendar() {
  const { modules, meetings, deadlines, semesterStartISO, setSemesterStartISO, addMeeting } = useModules();

  // --- Add Meeting UI state
  const [mModuleId, setMModuleId] = useState<string>(modules[0]?.id ?? "");
  const [mKind, setMKind] = useState("Lecture");
  const [mDay, setMDay] = useState<number>(1);
  const [mStart, setMStart] = useState("09:00");
  const [mEnd, setMEnd] = useState("10:00");
  const [mLocation, setMLocation] = useState("");

  const canAddMeeting = mModuleId && /^\d{2}:\d{2}$/.test(mStart) && /^\d{2}:\d{2}$/.test(mEnd);

  const onAddMeeting = () => {
    if (!canAddMeeting) return;
    addMeeting({
      moduleId: mModuleId,
      kind: mKind.trim() || "Meeting",
      day: Number(mDay),
      start: mStart,
      end: mEnd,
      location: mLocation.trim() || null,
    });
  };

  const sections = useMemo(() => {
    const mapModule = new Map(modules.map((m) => [m.id, m]));
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(semesterStartISO);
    start.setHours(0, 0, 0, 0);

    const horizonDays = 7 * 8; // 8 weeks
    const days: { title: string; data: AgendaItem[] }[] = [];

    for (let i = 0; i < horizonDays; i++) {
      const date = addDays(today, i);
      const title = date.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "short" });
      const items: AgendaItem[] = [];

      // weekly meetings expanded
      meetings.forEach((m) => {
        if (date.getDay() === m.day && date >= start) {
          const mod = mapModule.get(m.moduleId);
          items.push({
            id: `meet-${m.id}-${date.toDateString()}`,
            type: "meeting",
            timeLabel: `${m.start}–${m.end}`,
            title: `${m.kind}${mod ? ` — ${mod.name}` : ""}`,
            subtitle: m.location || undefined,
          });
        }
      });

      // one-off deadlines
      deadlines.forEach((d) => {
        const due = new Date(d.dueISO);
        if (sameDate(date, due)) {
          const mod = mapModule.get(d.moduleId);
          items.push({
            id: `dl-${d.id}`,
            type: "deadline",
            timeLabel: due.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            title: `Deadline: ${d.title}${mod ? ` — ${mod.name}` : ""}`,
            subtitle: undefined,
          });
        }
      });

      if (items.length) {
        items.sort((a, b) => a.timeLabel.localeCompare(b.timeLabel));
        days.push({ title, data: items });
      }
    }

    return days;
  }, [modules, meetings, deadlines, semesterStartISO]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calendar</Text>

      {/* Add Meeting */}
      <Card style={{ padding: spacing(2), gap: spacing(1) }}>
        <Text style={styles.k}>Add weekly meeting</Text>

        <Select
          label="Module"
          value={mModuleId}
          options={modules.map((m) => ({ label: m.name, value: m.id }))}
          onChange={(o) => setMModuleId(String(o.value))}
        />

        <View style={{ flexDirection: "row", gap: spacing(1) }}>
          <View style={{ flex: 1 }}>
            <Select label="Day" value={mDay} options={DAY_OPTS} onChange={(o) => setMDay(Number(o.value))} />
          </View>
          <View style={{ flex: 1 }}>
            <Input label="Kind" value={mKind} onChangeText={setMKind} placeholder="Lecture / Tutorial" />
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: spacing(1) }}>
          <View style={{ flex: 1 }}>
            <Input label="Start (HH:MM)" value={mStart} onChangeText={setMStart} placeholder="09:00" />
          </View>
          <View style={{ flex: 1 }}>
            <Input label="End (HH:MM)" value={mEnd} onChangeText={setMEnd} placeholder="10:00" />
          </View>
        </View>

        <Input label="Location (optional)" value={mLocation} onChangeText={setMLocation} placeholder="Room / Building" />

        <Button title="Add meeting" onPress={onAddMeeting} disabled={!canAddMeeting} />
      </Card>

      {/* Semester start control */}
      <Card style={{ padding: spacing(2), gap: spacing(1), marginTop: spacing(1) }}>
        <Text style={styles.k}>Semester start (for weekly expansion)</Text>
        <Input
          label="YYYY-MM-DD"
          value={semesterStartISO.slice(0, 10)}
          onChangeText={(t: string) => {
            const iso = `${t}T00:00:00.000Z`;
            if (/^\d{4}-\d{2}-\d{2}$/.test(t)) setSemesterStartISO(iso);
          }}
          placeholder="2025-09-23"
        />
      </Card>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section: { title } }) => <Text style={styles.header}>{title}</Text>}
        renderItem={({ item }) => (
          <Card style={styles.row}>
            <Text style={[styles.time, item.type === "deadline" && { color: "#F59E0B" }]}>{item.timeLabel}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{item.title}</Text>
              {item.subtitle ? <Text style={styles.sub}>{item.subtitle}</Text> : null}
            </View>
          </Card>
        )}
        ItemSeparatorComponent={() => <View style={{ height: spacing(1) }} />}
        ListEmptyComponent={<Text style={styles.empty}>No upcoming items. Add meetings/deadlines above.</Text>}
        contentContainerStyle={{ paddingBottom: spacing(3) }}
      />
    </View>
  );
}

// Reuse your styled Input wrapper if you have one.
// Fallback minimal Input:
function Input(props: any) {
  return (
    <TextInput
      placeholderTextColor="#6b7280"
      {...props}
      style={[
        {
          backgroundColor: "#0f1522",
          borderWidth: 1,
          borderColor: "#1e293b",
          color: "#e6efff",
          paddingVertical: 10,
          paddingHorizontal: 12,
          borderRadius: 10,
        },
        props.style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing(2), backgroundColor: colors.bg, gap: spacing(1) },
  title: { color: colors.text, fontWeight: "900", fontSize: 22 },
  header: { color: colors.textDim, fontWeight: "800", marginTop: spacing(1.5), marginBottom: spacing(0.5) },
  row: { padding: spacing(1.5), gap: spacing(0.5), flexDirection: "row", alignItems: "center" },
  time: { width: 90, color: colors.textDim, fontWeight: "800" },
  rowTitle: { color: colors.text, fontWeight: "800" },
  sub: { color: colors.textDim, marginTop: 2 },
  empty: { color: colors.textDim, textAlign: "center", marginTop: spacing(4) },
  k: { color: colors.textDim, fontWeight: "800" },
});
