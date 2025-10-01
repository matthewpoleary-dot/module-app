// app/(tabs)/weightings.tsx
import { FlatList, Keyboard, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { Card } from '../../components/ui/Card';
import { Chip } from '../../components/ui/Chip';
import { colors, spacing } from '../../constants/theme';
import { useModules } from '../../context/ModulesContext';

export default function Weightings() {
  const { modules } = useModules();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>Module Weightings</Text>

        {/* Default template removed per request */}

        <Text style={[styles.section, { marginTop: spacing(2) }]}>Preview</Text>
        <FlatList
          data={modules}
          keyExtractor={(m)=>m.id}
          ItemSeparatorComponent={()=><View style={{ height: spacing(1) }}/>}
          ListEmptyComponent={<Text style={styles.empty}>No modules yet.</Text>}
          renderItem={({item})=>(
            <Card style={styles.card}>
              <View style={styles.left}>
                <Chip>{item.credits} ECTS</Chip>
                {item.semester ? <Chip style={{ marginTop: 6 }}>{item.semester}</Chip> : null}
              </View>
              <View style={styles.center}>
                <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
                <View style={styles.grid2}>
                  <Text style={{ color: colors.textDim }}>Weightings per module coming soon</Text>
                </View>
              </View>
            </Card>
          )}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}
function W({label,v}:{label:string; v:number}){ return(<View style={{minWidth:70,alignItems:'center'}}><Text style={{color:colors.textDim,fontSize:12}}>{label}</Text><Text style={{color:colors.accent,fontWeight:'900',fontSize:16}}>{v}%</Text></View>); }

const styles = StyleSheet.create({
  container:{ flex:1, padding:spacing(2), gap:spacing(1), backgroundColor:colors.bg },
  title:{ color:colors.text, fontWeight:'900', fontSize:22 },
  section:{ color:colors.text, fontWeight:'800' },
  grid:{ flexDirection:'row', gap:spacing(1), flexWrap:'wrap' },
  total:{ color:colors.text, fontWeight:'800' },
  empty:{ color:colors.textDim, textAlign:'center', marginTop:spacing(3) },
  card:{ padding:spacing(2), flexDirection:'row', gap:spacing(2) },
  left:{ alignItems:'center', justifyContent:'center', width:72, gap:6 },
  center:{ flex:1, minWidth:0 },
  name:{ color:colors.text, fontSize:18, fontWeight:'800' },
  grid2:{ flexDirection:'row', gap:spacing(1), marginTop:10, flexWrap:'wrap' },
});
