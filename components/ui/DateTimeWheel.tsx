// components/ui/DateTimeWheel.tsx
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../../constants/theme';

export default function DateTimeWheel({
  label, value, onChange,
}: { label: string; value: Date; onChange: (d: Date)=>void }) {
  const [open,setOpen]=useState(false);
  const [temp,setTemp]=useState(value);

  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <Pressable style={styles.input} onPress={()=>{setTemp(value); setOpen(true);}}>
        <Text style={styles.inputText}>{value.toLocaleString()}</Text>
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={()=>setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={()=>setOpen(false)}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>{label}</Text>
            <DateTimePicker
              display={Platform.OS==='ios'?'spinner':'default'}
              value={temp}
              mode="datetime"
              onChange={(_,d)=> d && setTemp(d)}
              style={{ alignSelf:'stretch' }}
            />
            <View style={{ flexDirection:'row', gap:12, marginTop: spacing(1) }}>
              <Pressable style={[styles.btn,{backgroundColor:'#2a2b33'}]} onPress={()=>setOpen(false)}>
                <Text style={{color:colors.text}}>Cancel</Text>
              </Pressable>
              <Pressable style={[styles.btn,{backgroundColor:'#3b82f6'}]} onPress={()=>{onChange(temp); setOpen(false);}}>
                <Text style={{color:'#fff', fontWeight:'800'}}>Set</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
const styles = StyleSheet.create({
  label:{ color:colors.textDim, fontWeight:'700', marginBottom:6 },
  input:{ backgroundColor:'#191a1f', borderRadius:radius.lg, paddingHorizontal:14, paddingVertical:14, borderWidth:1, borderColor:'#2b2c33', marginBottom:12 },
  inputText:{ color:colors.text, fontWeight:'700' },
  backdrop:{ flex:1, backgroundColor:'rgba(0,0,0,0.5)', padding:spacing(2), justifyContent:'flex-end' },
  sheet:{ backgroundColor:'#14151a', borderRadius:radius.xl, padding:spacing(2) },
  sheetTitle:{ color:colors.text, fontWeight:'900', fontSize:18, marginBottom:spacing(1) },
  btn:{ paddingVertical:12, paddingHorizontal:16, borderRadius:radius.lg },
});
