import { StyleSheet, Text, View } from 'react-native';

import { palette, spacing, type } from '@/constants/theme';

export function StudyProgress({ current, total, color }: { current: number; total: number; color: string }) {
  const progress = Math.min(current / total, 1);
  return (
    <View style={styles.row}>
      <Text style={[styles.count, { color }]}>{current} / {total}</Text>
      <View style={[styles.track, { backgroundColor: palette.light.line }]}>
        <View style={[styles.fill, { width: `${progress * 100}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.caption}>今日一组</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  count: { fontSize: type.small, fontWeight: '700', fontVariant: ['tabular-nums'] },
  track: { height: 5, flex: 1, overflow: 'hidden', borderRadius: 9 },
  fill: { height: '100%', borderRadius: 9 },
  caption: { color: '#879088', fontSize: type.micro },
});
