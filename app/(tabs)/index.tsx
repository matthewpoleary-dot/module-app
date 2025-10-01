// app/(tabs)/index.tsx
import { Link } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Chip } from '../../components/ui/Chip';
import { colors, spacing } from '../../constants/theme';
import { useModules } from '../../context/ModulesContext';

export default function ModulesScreen() {
  const { modules, totals, defaultWeighting } = useModules();

  return (
    <View style={styles.container}>
      <Card style={styles.summary}>
        <View style={{ gap: 6 }}>
          <Text style={styles.kpiLabel}>ECTS</Text>
          <Text style={styles.kpiValue}>{totals.ects}</Text>
        </View>
        <View style={{ gap: 6 }}>
          <Text style={styles.kpiLabel}>Weighted Avg</Text>
          <Text style={styles.kpiValue}>{totals.weightedAvg == null ? '—' : totals.weightedAvg.toFixed(1)}</Text>
        </View>
      </Card>

      <FlatList
        data={modules}
        keyExtractor={(m) => m.id}
        ListEmptyComponent={
          <Card style={{ padding: spacing(2), alignItems: 'center' }}>
            <Text style={{ color: colors.textDim }}>No modules yet.</Text>
            <Link href="/add" asChild>
              <Button title="Add your first module" style={{ marginTop: spacing(1) }} />
            </Link>
          </Card>
        }
        renderItem={({ item }) => (
          <Link href={`/module/${item.id}`} asChild>
            <Pressable>
              <Card style={styles.row}>
                <View style={{ flex: 1, gap: 6 }}>
                  <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                  <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <Chip>{item.credits} ECTS</Chip>
                    {item.semester ? <Chip>{item.semester}</Chip> : null}
                  </View>
                  {/* weightings preview removed */}
                </View>
              </Card>
            </Pressable>
          </Link>
        )}
        ItemSeparatorComponent={() => <View style={{ height: spacing(1) }} />}
      />

      <Link href="/add" asChild>
        <Button title="Add Module" style={{ marginTop: spacing(1.5) }} />
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing(2), gap: spacing(1), backgroundColor: colors.bg },
  summary: {
    padding: spacing(2),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  kpiLabel: { color: colors.textDim, fontWeight: '700' },
  kpiValue: { color: colors.text, fontWeight: '900', fontSize: 24 },
  row: { padding: spacing(2), flexDirection: 'row', gap: spacing(2), alignItems: 'center' },
  name: { color: colors.text, fontSize: 18, fontWeight: '800', maxWidth: '95%' },
  weights: { color: colors.textDim, marginTop: 6 },
});
