// app/(tabs)/deadlines.tsx
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import DateTimeWheel from '../../components/ui/DateTimeWheel';
import { Input } from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { colors, spacing } from '../../constants/theme';
import { DeadlineStatus, useModules } from '../../context/ModulesContext';

const STATUS_OPTS: {label:string; value:DeadlineStatus}[] = [
  { label:'Todo', value:'todo' },
  { label:'In progress', value:'in_progress' },
  { label:'Done', value:'done' },
];

export default function DeadlinesTab() {
  const { modules, deadlines, addDeadline, removeDeadline, setDeadlineStatus } = useModules();

  const [moduleId,setModuleId]=useState(modules[0]?.id ?? '');
  const [title,setTitle]=useState('');
  const [when,setWhen]=useState(new Date());

  const upcoming = useMemo(()=> deadlines
    .filter(d=>d.status!=='done')
    .sort((a,b)=> new Date(a.dueISO).getTime()-new Date(b.dueISO).getTime()), [deadlines]);

  const past = useMemo(()=> deadlines
    .filter(d=>d.status==='done')
    .sort((a,b)=> new Date(b.dueISO).getTime()-new Date(a.dueISO).getTime()), [deadlines]);

  const add = () => {
    if(!title.trim() || !moduleId) return;
    addDeadline({ moduleId, title: title.trim(), dueISO: when.toISOString(), details: null });
    setTitle('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Deadlines</Text>

      <Card style={{ padding: spacing(2), gap: spacing(1) }}>
        <Select
          label="Module"
          value={moduleId}
          options={modules.map(m=>({label:m.name,value:m.id}))}
          onChange={(o)=>setModuleId(String(o.value))}
        />
        <Input label="Title" value={title} onChangeText={setTitle} placeholder="Essay, Project…" />
        <DateTimeWheel label="Due" value={when} onChange={setWhen} />
        <Button title="Add deadline" onPress={add} />
      </Card>

      <Text style={styles.section}>Upcoming</Text>
      <FlatList
        data={upcoming}
        keyExtractor={(d)=>d.id}
        ListEmptyComponent={<Text style={styles.empty}>No upcoming deadlines.</Text>}
        renderItem={({ item }) => {
          const mod = modules.find(m=>m.id===item.moduleId);
          return (
            <Card style={styles.row}>
              <View style={{ flex:1 }}>
                <Text style={styles.rowTitle}>{item.title}</Text>
                <Text style={styles.dim}>{mod?.name ?? 'Unknown'} • {new Date(item.dueISO).toLocaleString()}</Text>
              </View>
              <Select
                label="Status"
                value={item.status}
                options={STATUS_OPTS}
                onChange={(o)=>setDeadlineStatus(item.id, o.value as DeadlineStatus)}
              />
              <Pressable onPress={()=>removeDeadline(item.id)} style={styles.delete}>
                <Text style={{ color:'#fff', fontWeight:'800' }}>Delete</Text>
              </Pressable>
            </Card>
          );
        }}
        ItemSeparatorComponent={()=><View style={{ height: spacing(1) }} />}
      />

      {past.length ? <Text style={styles.section}>Past</Text> : null}
      {past.map(item=>{
        const mod = modules.find(m=>m.id===item.moduleId);
        return (
          <Card key={item.id} style={styles.row}>
            <View style={{ flex:1 }}>
              <Text style={styles.rowTitle}>{item.title}</Text>
              <Text style={styles.dim}>{mod?.name ?? 'Unknown'} • {new Date(item.dueISO).toLocaleString()}</Text>
            </View>
            <Text style={{ color:'#22c55e', fontWeight:'900' }}>Done</Text>
          </Card>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, padding:spacing(2), backgroundColor:colors.bg },
  title:{ color:colors.text, fontWeight:'900', fontSize:22, marginBottom:spacing(1) },
  section:{ color:colors.textDim, fontWeight:'800', marginTop:spacing(2), marginBottom:spacing(1) },
  empty:{ color:colors.textDim, textAlign:'center', marginVertical:spacing(2) },
  row:{ padding:spacing(2), flexDirection:'row', gap:spacing(1), alignItems:'center' },
  rowTitle:{ color:colors.text, fontWeight:'800' },
  dim:{ color:colors.textDim, marginTop:2 },
  delete:{ backgroundColor:'#EF4444', borderRadius:999, paddingHorizontal:12, paddingVertical:8, marginLeft:6 },
});
