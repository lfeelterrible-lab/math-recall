import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FormulaView } from '@/components/FormulaView';
import { palette, type } from '@/constants/theme';

type AnswerOptionProps = {
  index: number;
  value: string;
  selected: boolean;
  revealed: boolean;
  correct: boolean;
  latex?: boolean;
  themeMode: 'light' | 'dark';
  onPress: () => void;
};

export function AnswerOption({ index, value, selected, revealed, correct, latex, themeMode, onPress }: AnswerOptionProps) {
  const colors = palette[themeMode];
  const tone = revealed ? (correct ? colors.green : selected ? colors.red : colors.inkSoft) : colors.ink;
  const background = revealed ? (correct ? colors.greenSoft : selected ? colors.redSoft : colors.surface) : colors.surface;
  const border = revealed ? (correct ? colors.green : selected ? colors.red : colors.line) : selected ? colors.blue : colors.line;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      disabled={revealed}
      onPress={onPress}
      style={({ pressed }) => [styles.option, { backgroundColor: background, borderColor: border, opacity: pressed ? 0.84 : 1 }]}>
      <View style={[styles.index, { backgroundColor: selected || (revealed && correct) ? border : colors.surfaceMuted }]}>
        <Text style={[styles.indexText, { color: selected || (revealed && correct) ? '#FFFFFF' : colors.inkSoft }]}>{String.fromCharCode(65 + index)}</Text>
      </View>
      <View style={styles.value}>
        {latex ? <FormulaView formula={value} size="small" color={tone} displayMode={false} /> : <Text style={[styles.label, { color: tone }]}>{value}</Text>}
      </View>
      {revealed ? <Text style={[styles.status, { color: tone }]}>{correct ? '✓' : selected ? '×' : ''}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  option: { minHeight: 58, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, borderWidth: 1, borderRadius: 16, gap: 12 },
  index: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center', borderRadius: 99 },
  indexText: { fontSize: type.micro, fontWeight: '800' },
  value: { flex: 1, minWidth: 0 },
  label: { fontSize: type.body, fontWeight: '600' },
  status: { width: 20, fontSize: 20, fontWeight: '700', textAlign: 'center' },
});
