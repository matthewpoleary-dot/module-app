// components/ui/Select.tsx
import React, { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../../constants/theme';

type Opt = { label: string; value: string | number };

export default function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string | number;
  options: Opt[];
  onChange: (v: Opt) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find(o => o.value === value);

  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <Pressable style={styles.input} onPress={() => setOpen(true)}>
        <Text style={styles.inputText}>{selected?.label ?? 'Select…'}</Text>
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>{label}</Text>
            <FlatList
              data={options}
              keyExtractor={(o) => String(o.value)}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.row}
                  onPress={() => {
                    onChange(item);
                    setOpen(false);
                  }}
                >
                  <Text style={styles.rowText}>{item.label}</Text>
                </Pressable>
              )}
              ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            />
            <Pressable style={styles.cancel} onPress={() => setOpen(false)}>
              <Text style={{ color: colors.text }}>Cancel</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  label: { color: colors.textDim, fontWeight: '700', marginBottom: 6 },
  input: {
    backgroundColor: '#191a1f',
    borderRadius: radius.lg,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1, borderColor: '#2b2c33',
    marginBottom: spacing(1),
  },
  inputText: { color: colors.text, fontWeight: '700' },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', padding: spacing(2), justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#14151a', borderRadius: radius.xl, padding: spacing(2), maxHeight: '70%' },
  sheetTitle: { color: colors.text, fontWeight: '900', fontSize: 18, marginBottom: spacing(1) },
  row: { backgroundColor: '#1b1c22', borderRadius: radius.lg, padding: 14 },
  rowText: { color: colors.text },
  cancel: { alignSelf: 'center', paddingVertical: 12, marginTop: 6 },
});
