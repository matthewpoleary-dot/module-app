// app/(tabs)/stats.tsx
import { StyleSheet, Text, View } from 'react-native';
import { Card } from '../../components/ui/Card';
import { colors, spacing } from '../../constants/theme';
import { useModules } from '../../context/ModulesContext';

function bar(pct:number){ return (
  <View style={{ height:10, backgroundColor:'#262733', borderRadius:999 }}>
    <View style={{ height:10, width:`${Math.min(100,Math.max(0,pct))}%`, backgroundColor:colors.accent, borderRadius:999 }}/>
  </View>
);}

export default function Stats(){
  const { modules, totals } = useModules();
  const sem = (n:1|2) => modules
    .filter(m => (m.semester || '').toString().toLowerCase().includes(n===1?'1':'2'))
    .reduce((s,m)=>s+(Number(m.credits)||0),0);
  const s1 = sem(1), s2 = sem(2);
  const goal = 30;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stats</Text>

      <Card style={{ padding: spacing(2), gap: spacing(1) }}>
        <Text style={styles.k}>Total ECTS</Text>
        <Text style={styles.v}>{totals.ects}</Text>
        <Text style={styles.k}>Weighted Avg</Text>
        <Text style={styles.v}>{totals.weightedAvg==null?'—':totals.weightedAvg.toFixed(1)}</Text>
      </Card>

      <Card style={{ padding: spacing(2), gap: spacing(1), marginTop: spacing(1) }}>
        <Text style={styles.k}>Sem 1 progress — {s1}/{goal} ECTS</Text>
        {bar((s1/goal)*100)}
        <Text style={[styles.k,{marginTop:spacing(1)}]}>Sem 2 progress — {s2}/{goal} ECTS</Text>
        {bar((s2/goal)*100)}
      </Card>
    </View>
  );
}
const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:colors.bg, padding:spacing(2), gap:spacing(1) },
  title:{ color:colors.text, fontWeight:'900', fontSize:22 },
  k:{ color:colors.textDim, fontWeight:'800' },
  v:{ color:colors.text, fontWeight:'900', fontSize:24 },
});
