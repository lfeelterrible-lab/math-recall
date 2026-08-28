import { Pressable, StyleSheet, Text, View } from 'react-native';

import { palette, spacing, type } from '@/constants/theme';
import type { RecallRating } from '@/types/MathCard';

export function RecallButtons({ onRate, themeMode }: { onRate: (rating: RecallRating) => void; themeMode: 'light' | 'dark' }) {
  const colors = palette[themeMode];
  const items: Array<{ label: string; detail: string; rating: RecallRating; color: string }> = [
    { label: '忘了', detail: '今天再见', rating: 'forgot', color: colors.red },
    { label: '模糊', detail: '明天再见', rating: 'fuzzy', color: colors.orange },
    { label: '记住了', detail: '3 天后', rating: 'remembered', color: colors.green },
  ];
  return (
    <View style={styles.row}>
      {items.map((item) => (
        <Pressable
          key={item.rating}
          onPress={() => onRate(item.rating)}
          style={({ pressed }) => [styles.button, { borderColor: colors.line, backgroundColor: colors.surface, opacity: pressed ? 0.78 : 1 }]}>
          <Text style={[styles.label, { color: item.color }]}>{item.label}</Text>
          <Text style={[styles.detail, { color: colors.inkFaint }]}>{item.detail}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  button: { flex: 1, minHeight: 56, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderRadius: 15, gap: 3 },
  label: { fontSize: type.small, fontWeight: '800' },
  detail: { fontSize: type.micro },
});
