// app/(tabs)/add.tsx
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { colors, spacing } from '../../constants/theme';
import { useModules } from '../../context/ModulesContext';

export default function AddModule() {
  const { upsert } = useModules();
  const [name, setName] = useState('');
  const [credits, setCredits] = useState('');
  const [grade, setGrade] = useState('');
  const [semester, setSemester] = useState('');
  const [proj, setProj] = useState('0');
  const [assess, setAssess] = useState('0');
  const [attend, setAttend] = useState('0');
  const [exam, setExam] = useState('100');

  const save = () => {
    const ects = Number(credits);
    const gr = grade.trim() === '' ? null : Number(grade);
    const w = {
      project: Number(proj) || 0,
      assessment: Number(assess) || 0,
      attendance: Number(attend) || 0,
      exam: Number(exam) || 0,
    };
    const total = w.project + w.assessment + w.attendance + w.exam;

    if (!name.trim()) return Alert.alert('Name required');
    if (!Number.isFinite(ects) || ects <= 0) return Alert.alert('Enter valid ECTS');
    if (gr != null && (!Number.isFinite(gr) || gr < 0 || gr > 100)) return Alert.alert('Grade must be 0–100');
    if (total !== 100) return Alert.alert('Weightings must add up to 100%');

    upsert({ name, credits: ects, grade: gr, semester: semester || null });
    setName(''); setCredits(''); setGrade(''); setSemester('');
    setProj('0'); setAssess('0'); setAttend('0'); setExam('100');
    Alert.alert('Saved', 'Module added!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Module</Text>
      <Input label="Name" value={name} onChangeText={setName} placeholder="e.g., Algorithms I" />
      <Input label="ECTS" value={credits} onChangeText={setCredits} keyboardType="numeric" placeholder="e.g., 5" />
      <Input label="Grade (optional)" value={grade} onChangeText={setGrade} keyboardType="numeric" placeholder="0–100" />
      <Input label="Semester (optional)" value={semester} onChangeText={setSemester} placeholder="e.g., SF1" />

      <Text style={styles.section}>Weightings (must total 100%)</Text>
      <View style={styles.row}>
        <Input style={styles.w} label="Project %" keyboardType="numeric" value={proj} onChangeText={setProj} />
        <Input style={styles.w} label="Assess. %" keyboardType="numeric" value={assess} onChangeText={setAssess} />
      </View>
      <View style={styles.row}>
        <Input style={styles.w} label="Attendance %" keyboardType="numeric" value={attend} onChangeText={setAttend} />
        <Input style={styles.w} label="Exam %" keyboardType="numeric" value={exam} onChangeText={setExam} />
      </View>

      <Button title="Save Module" onPress={save} style={{ marginTop: spacing(1) }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: spacing(1.25), padding: spacing(2), backgroundColor: colors.bg },
  title: { color: colors.text, fontWeight: '900', fontSize: 22, marginBottom: spacing(0.5) },
  section: { color: colors.text, fontWeight: '800', marginTop: spacing(1) },
  row: { flexDirection: 'row', gap: spacing(1) },
  w: { flex: 1 },
});
