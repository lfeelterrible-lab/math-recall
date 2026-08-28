import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FormulaView } from '@/components/FormulaView';
import { Screen, SectionLabel } from '@/components/Screen';
import { palette, spacing, type } from '@/constants/theme';
import { mathCards } from '@/data/cards';
import { useStudyStore } from '@/store/useStudyStore';

const reviewChapters = [
  { name: '函数', count: 8, tone: 'blue' as const },
  { name: '三角函数', count: 6, tone: 'green' as const },
  { name: '数列', count: 4, tone: 'orange' as const },
  { name: '解析几何', count: 3, tone: 'blue' as const },
  { name: '其他', count: 3, tone: 'green' as const },
];

const hardIds = ['log-domain', 'function-odd', 'sequence-geometric-sum', 'vector-dot'];

export default function ReviewScreen() {
  const themeMode = useStudyStore((state) => state.themeMode);
  const colors = palette[themeMode];
  const progress = useStudyStore((state) => state.progress);
  const hardCards = hardIds.map((id) => mathCards.find((card) => card.id === id)).filter(Boolean);

  return (
    <Screen title="复习" eyebrow="把快要忘的，再见一次">
      <View style={[styles.dueHero, { backgroundColor: colors.surface, borderColor: colors.line }]}>
        <View><Text style={[styles.heroKicker, { color: colors.green }]}>今天待复习</Text><Text style={[styles.heroNumber, { color: colors.ink }]}>24</Text><Text style={[styles.heroMeta, { color: colors.inkSoft }]}>分散在 5 个章节里</Text></View>
        <View style={[styles.heroRing, { borderColor: colors.green }]}><Text style={[styles.heroRingText, { color: colors.green }]}>12<Text style={styles.heroRingUnit}> min</Text></Text></View>
      </View>

      <SectionLabel color={colors.inkFaint}>按章节</SectionLabel>
      <View style={[styles.chapterList, { backgroundColor: colors.surface, borderColor: colors.line }]}>
        {reviewChapters.map((chapter) => {
          const tone = colors[chapter.tone];
          return (
            <View key={chapter.name} style={[styles.chapterRow, { borderBottomColor: colors.line }]}>
              <View style={[styles.chapterDot, { backgroundColor: tone }]} />
              <Text style={[styles.chapterName, { color: colors.ink }]}>{chapter.name}</Text>
              <Text style={[styles.chapterCount, { color: tone }]}>{chapter.count}</Text>
              <Text style={[styles.chapterUnit, { color: colors.inkFaint }]}>张</Text>
              <Text style={[styles.chevron, { color: colors.inkFaint }]}>›</Text>
            </View>
          );
        })}
      </View>

      <Pressable onPress={() => router.push('/study?mode=review')} style={({ pressed }) => [styles.startButton, { backgroundColor: colors.green, opacity: pressed ? 0.84 : 1 }]}>
        <Text style={styles.startButtonText}>开始复习</Text><Text style={styles.startButtonArrow}>→</Text>
      </Pressable>

      <View style={styles.hardHeader}><SectionLabel color={colors.inkFaint}>最近总错</SectionLabel><Text style={[styles.hardHint, { color: colors.inkFaint }]}>自动统计</Text></View>
      <View style={[styles.hardList, { backgroundColor: colors.surface, borderColor: colors.line }]}>
        {hardCards.map((card, index) => card ? (
          <Pressable key={card.id} onPress={() => router.push({ pathname: '/study', params: { cardId: card.id } })} style={({ pressed }) => [styles.hardRow, { borderBottomColor: colors.line, opacity: pressed ? 0.72 : 1 }]}>
            <Text style={[styles.hardIndex, { color: colors.red }]}>{String(index + 1).padStart(2, '0')}</Text>
            <View style={styles.hardCopy}><Text style={[styles.hardTitle, { color: colors.ink }]}>{card.title}</Text><Text style={[styles.hardTopic, { color: colors.inkFaint }]}>{card.chapter} · {card.topic}</Text></View>
            <Text style={[styles.hardCount, { color: colors.red }]}>{Math.max(2, progress[card.id]?.wrongCount ?? 0)} 次</Text>
          </Pressable>
        ) : null)}
      </View>

      <View style={[styles.scheduleNote, { backgroundColor: colors.blueSoft }]}>
        <Text style={[styles.scheduleFormula, { color: colors.blue }]}>10 min → 1 天 → 3 天 → 7 天</Text>
        <Text style={[styles.scheduleCopy, { color: colors.inkSoft }]}>每张卡有自己的复习周期，记住的会慢慢走远。</Text>
      </View>
      <FormulaView formula={'f(-x)=f(x)'} size="small" color={colors.inkFaint} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  dueHero: { minHeight: 168, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.xl, paddingHorizontal: spacing.lg, borderWidth: 1, borderRadius: 20 },
  heroKicker: { marginBottom: 7, fontSize: type.small, fontWeight: '800' },
  heroNumber: { fontSize: 52, fontWeight: '800', letterSpacing: -2 },
  heroMeta: { marginTop: 4, fontSize: type.small },
  heroRing: { width: 86, height: 86, alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderRadius: 99 },
  heroRingText: { fontSize: 20, fontWeight: '800' },
  heroRingUnit: { fontSize: type.micro, fontWeight: '600' },
  chapterList: { paddingHorizontal: spacing.md, borderWidth: 1, borderRadius: 18 },
  chapterRow: { minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: 10, borderBottomWidth: 1 },
  chapterDot: { width: 7, height: 7, borderRadius: 99 },
  chapterName: { flex: 1, fontSize: type.body, fontWeight: '700' },
  chapterCount: { fontSize: type.body, fontWeight: '800' },
  chapterUnit: { fontSize: type.micro },
  chevron: { marginLeft: 4, fontSize: 24, fontWeight: '300' },
  startButton: { minHeight: 58, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.lg, marginBottom: spacing.xxl, paddingHorizontal: spacing.lg, borderRadius: 16 },
  startButtonText: { color: '#FFFFFF', fontSize: type.body, fontWeight: '800' },
  startButtonArrow: { color: '#FFFFFF', fontSize: 24 },
  hardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  hardHint: { marginBottom: spacing.sm, fontSize: type.micro },
  hardList: { paddingHorizontal: spacing.md, borderWidth: 1, borderRadius: 18 },
  hardRow: { minHeight: 66, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1 },
  hardIndex: { width: 25, fontSize: type.micro, fontWeight: '800' },
  hardCopy: { flex: 1, gap: 3 },
  hardTitle: { fontSize: type.body, fontWeight: '700' },
  hardTopic: { fontSize: type.micro },
  hardCount: { fontSize: type.micro, fontWeight: '800' },
  scheduleNote: { marginTop: spacing.lg, padding: spacing.md, borderRadius: 16, gap: 6 },
  scheduleFormula: { fontSize: type.small, fontWeight: '800', letterSpacing: 0.5 },
  scheduleCopy: { fontSize: type.micro, lineHeight: 18 },
});
