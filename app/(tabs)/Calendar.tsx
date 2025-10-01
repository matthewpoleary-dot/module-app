// app/(tabs)/calendar.tsx
import { useMemo } from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';
import { Card } from '../../components/ui/Card';
import { colors, spacing } from '../../constants/theme';
import { useModules } from '../../context/ModulesContext';

type AgendaItem = {
  id: string;
  timeLabel: string;
  title: string;
  subtitle?: string;
  type: 'meeting' | 'deadline';
};

function addDays(d: Date, days: number) { const x = new Date(d); x.setDate(x.getDate() + days); return x; }
function sameDate(a: Date, b: Date) { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }

export default function Calendar() {
  const { modules, meetings, deadlines, semesterStartISO } = useModules();

  const sections = useMemo(() => {
    const mapModule = new Map(modules.map(m => [m.id, m]));
    const today = new Date();
    today.setHours(0,0,0,0);

    const start = new Date(semesterStartISO);
    start.setHours(0,0,0,0);

    const horizonDays = 7 * 8; // 8 weeks
    const days: { title: string; data: AgendaItem[] }[] = [];

    for (let i = 0; i < horizonDays; i++) {
      const date = addDays(today, i);
      const title = date.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short' });
      const items: AgendaItem[] = [];

      // weekly meetings (expand from semester start)
      meetings.forEach(m => {
        // find the first occurrence on/after start with the right weekday
        // then check if current "date" matches weekday and is >= start
        if (date.getDay() === m.day && date >= start) {
          const mod = mapModule.get(m.moduleId);
          items.push({
            id: `meet-${m.id}-${date.toDateString()}`,
            type: 'meeting',
            timeLabel: `${m.start}–${m.end}`,
            title: `${m.kind}${mod ? ` — ${mod.name}` : ''}`,
            subtitle: m.location || undefined,
          });
        }
      });

      // one-off deadlines
      deadlines.forEach(d => {
        const due = new Date(d.dueISO);
        if (sameDate(date, due)) {
          const mod = mapModule.get(d.moduleId);
          items.push({
            id: `dl-${d.id}`,
            type: 'deadline',
            timeLabel: due.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            title: `Deadline: ${d.title}${mod ? ` — ${mod.name}` : ''}`,
            subtitle: undefined,
          });
        }
      });

      if (items.length) {
        // sort by time label where available (deadlines + meetings)
        items.sort((a, b) => a.timeLabel.localeCompare(b.timeLabel));
        days.push({ title, data: items });
      }
    }

    return days;
  }, [modules, meetings, deadlines, semesterStartISO]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calendar</Text>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section: { title } }) => <Text style={styles.header}>{title}</Text>}
        renderItem={({ item }) => (
          <Card style={styles.row}>
            <Text style={[styles.time, item.type === 'deadline' && { color: '#F59E0B' }]}>{item.timeLabel}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{item.title}</Text>
              {item.subtitle ? <Text style={styles.sub}>{item.subtitle}</Text> : null}
            </View>
          </Card>
        )}
        ItemSeparatorComponent={() => <View style={{ height: spacing(1) }} />}
        ListEmptyComponent={<Text style={styles.empty}>No upcoming items. Add meetings/deadlines from a module.</Text>}
        contentContainerStyle={{ paddingBottom: spacing(3) }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing(2), backgroundColor: colors.bg, gap: spacing(1) },
  title: { color: colors.text, fontWeight: '900', fontSize: 22 },
  header: { color: colors.textDim, fontWeight: '800', marginTop: spacing(1.5), marginBottom: spacing(0.5) },
  row: { padding: spacing(1.5), gap: spacing(0.5), flexDirection: 'row', alignItems: 'center' },
  time: { width: 90, color: colors.textDim, fontWeight: '800' },
  rowTitle: { color: colors.text, fontWeight: '800' },
  sub: { color: colors.textDim, marginTop: 2 },
  empty: { color: colors.textDim, textAlign: 'center', marginTop: spacing(4) },
});
