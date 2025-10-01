// app/module/[id].tsx
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import TimePicker from '../../components/ui/TimePicker';
import { colors, spacing } from '../../constants/theme';
import { useModules } from '../../context/ModulesContext';

const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const KIND_OPTS = ['Lecture','Tutorial','Lab','Seminar','Other'].map(k => ({ label:k, value:k }));

export default function EditModule() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { modules, upsert, remove, meetings, addMeeting, removeMeeting, deadlines, addDeadline, removeDeadline } = useModules();
  const router = useRouter();
  const current = modules.find((m) => m.id === id);

  const [name, setName] = useState(current?.name ?? '');
  const [credits, setCredits] = useState(String(current?.credits ?? ''));
  const [grade, setGrade] = useState(current?.grade != null ? String(current?.grade) : '');
  const [semester, setSemester] = useState(current?.semester ?? '');

  // meeting form (dropdowns)
  const [kind, setKind] = useState<string>('Lecture');
  const [day, setDay] = useState<number>(1);
  const [start, setStart] = useState('09:00');
  const [end, setEnd] = useState('10:00');
  const [location, setLocation] = useState('');

  // deadline quick add (kept here too)
  const [title, setTitle] = useState('');
  const [dateISO, setDateISO] = useState(new Date().toISOString().slice(0,10));
  const [time, setTime] = useState('23:59');

  useEffect(() => {
    if (!current) Alert.alert('Not found', 'This module no longer exists.', [{ text: 'OK', onPress: () => router.back() }]);
  }, [current]);

  const myMeetings = useMemo(() => meetings.filter(m => m.moduleId === id), [meetings, id]);
  const myDeadlines = useMemo(() => deadlines.filter(d => d.moduleId === id), [deadlines, id]);

  if (!current) return null;

  const save = () => {
    const ects = Number(credits);
    const gr = grade.trim() === '' ? null : Number(grade);
    if (!name.trim()) return Alert.alert('Name required');
    if (!Number.isFinite(ects) || ects <= 0) return Alert.alert('Enter valid ECTS');
    if (gr != null && (!Number.isFinite(gr) || gr < 0 || gr > 100)) return Alert.alert('Grade must be 0–100');
    upsert({ id: current.id, name, credits: ects, grade: gr, semester: semester || null });
    Alert.alert('Saved', 'Module updated');
  };

  const addMeetingClick = () => {
    addMeeting({ moduleId: current.id, kind, day: day as any, start, end, location: location || null });
    setLocation('');
  };

  const addDeadlineClick = () => {
    if (!title.trim()) return Alert.alert('Title required');
    addDeadline({ moduleId: current.id, title: title.trim(), dueISO: `${dateISO}T${time}:00`, details: null });
    setTitle('');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: spacing(2), paddingBottom: spacing(6), gap: spacing(1) }}>
        <Text style={styles.h1}>Edit Module</Text>
        <Input label="Name" value={name} onChangeText={setName} />
        <Input label="ECTS" value={credits} onChangeText={setCredits} keyboardType="numeric" />
        <Input label="Grade (optional)" value={grade} onChangeText={setGrade} keyboardType="numeric" />
        <Input label="Semester (optional)" value={semester} onChangeText={setSemester} />
        <Button title="Save" onPress={save} style={{ marginTop: spacing(1) }} />
        <Button title="Delete Module" onPress={() =>
          Alert.alert('Delete', `Remove "${current.name}"?`, [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => { remove(current.id); router.back(); } },
          ])
        } variant="ghost" style={{ marginTop: spacing(1) }} />

        {/* Meetings */}
        <Text style={[styles.h1, { marginTop: spacing(2) }]}>Meetings</Text>
        <Card style={{ padding: spacing(2), gap: spacing(1) }}>
          <Select label="Type" value={kind} options={KIND_OPTS} onChange={(o)=>setKind(String(o.value))} />
          <Select
            label="Day"
            value={day}
            options={DAYS.map((d,i)=>({ label:d, value:i }))}
            onChange={(o)=>setDay(Number(o.value))}
          />
          <View style={{ flexDirection: 'row', gap: spacing(1) }}>
            <TimePicker label="Start (HH:MM)" value={start} onChange={setStart} />
            <TimePicker label="End (HH:MM)" value={end} onChange={setEnd} />
          </View>
          <Input label="Location (optional)" value={location} onChangeText={setLocation} />
          <Button title="Add meeting" onPress={addMeetingClick} />
        </Card>

        {myMeetings.length ? <Text style={[styles.h2]}>Your sessions</Text> : null}
        {myMeetings.map(item => (
          <Card key={item.id} style={styles.row}>
            <Text style={styles.rowText}>
              {item.kind} — {DAYS[item.day]} {item.start}-{item.end}{item.location ? ` • ${item.location}` : ''}
            </Text>
            <Pressable onPress={() => removeMeeting(item.id)} style={styles.trash}>
              <Ionicons name="trash" size={16} color="#fff" />
            </Pressable>
          </Card>
        ))}

        {/* Quick deadlines (per-module) */}
        <Text style={[styles.h1, { marginTop: spacing(2) }]}>Quick Deadline</Text>
        <Card style={{ padding: spacing(2), gap: spacing(1) }}>
          <Input label="Title" value={title} onChangeText={setTitle} placeholder="Assignment 1" />
          <View style={{ flexDirection: 'row', gap: spacing(1) }}>
            {/* simple date dropdown (yyyy-mm-dd strings) */}
            {/* re-use the Select with generated options */}
            <Select
              label="Date"
              value={dateISO}
              options={Array.from({length: 180}).map((_,i)=> {
                const d = new Date(); d.setHours(0,0,0,0); d.setDate(d.getDate()+i);
                const v = d.toISOString().slice(0,10);
                return { label: d.toDateString(), value: v };
              })}
              onChange={(o)=>setDateISO(String(o.value))}
            />
            <TimePicker label="Time" value={time} onChange={setTime} />
          </View>
          <Button title="Add deadline" onPress={addDeadlineClick} />
        </Card>

        {myDeadlines.length ? <Text style={styles.h2}>Your deadlines</Text> : null}
        {myDeadlines.map(item => (
          <Card key={item.id} style={styles.row}>
            <Text style={styles.rowText}>
              {item.title} — {new Date(item.dueISO).toLocaleString()}
            </Text>
            <Pressable onPress={() => removeDeadline(item.id)} style={styles.trash}>
              <Ionicons name="trash" size={16} color="#fff" />
            </Pressable>
          </Card>
        ))}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  h1: { color: colors.text, fontWeight: '900', fontSize: 20 },
  h2: { color: colors.textDim, fontWeight: '800', marginTop: spacing(1) },
  row: { padding: spacing(1.5), marginTop: spacing(1), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowText: { color: colors.text },
  trash: { backgroundColor: '#EF4444', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
});
