import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen, SectionLabel } from '@/components/Screen';
import { palette, spacing, type } from '@/constants/theme';
import { mathCards } from '@/data/cards';
import { useStudyStore } from '@/store/useStudyStore';

const reviewGroups = [
  { name: '函数', chapters: ['函数'], tone: 'blue' as const },
  { name: '三角函数', chapters: ['三角函数'], tone: 'green' as const },
  { name: '数列', chapters: ['数列'], tone: 'orange' as const },
  { name: '解析几何', chapters: ['解析几何'], tone: 'blue' as const },
  { name: '其他', chapters: ['集合与逻辑', '向量', '概率统计', '导数'], tone: 'green' as const },
];

export default function ReviewScreen() {
  const themeMode = useStudyStore((state) => state.themeMode);
  const colors = palette[themeMode];
  const hydrated = useStudyStore((state) => state.hydrated);
  const progress = useStudyStore((state) => state.progress);
  const getDueCards = useStudyStore((state) => state.getDueCards);
  const dueCards = hydrated ? getDueCards() : [];
  const reviewChapters = reviewGroups.map((group) => ({
    ...group,
    count: dueCards.filter((card) => group.chapters.includes(card.chapter)).length,
  }));
  const hardCards = mathCards
    .filter((card) => (progress[card.id]?.wrongCount ?? 0) > 0)
    .sort((a, b) => (progress[b.id]?.wrongCount ?? 0) - (progress[a.id]?.wrongCount ?? 0))
    .slice(0, 5);
  const dueChapterCount = reviewChapters.filter((chapter) => chapter.count > 0).length;
  const reviewMinutes = Math.max(1, Math.ceil(dueCards.length * 0.5));

  return (
    <Screen title="复习" eyebrow="把快要忘的，再见一次">
      <View style={[styles.dueHero, { backgroundColor: colors.surface, borderColor: colors.line }]}>
        <View><Text style={[styles.heroKicker, { color: colors.green }]}>今天待复习</Text><Text style={[styles.heroNumber, { color: colors.ink }]}>{dueCards.length}</Text><Text style={[styles.heroMeta, { color: colors.inkSoft }]}>分散在 {dueChapterCount} 个章节里</Text></View>
        <View style={[styles.heroRing, { borderColor: colors.green }]}><Text style={[styles.heroRingText, { color: colors.green }]}>{reviewMinutes}<Text style={styles.heroRingUnit}> min</Text></Text></View>
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
            </View>
          );
        })}
      </View>

      <Pressable accessibilityRole="button" accessibilityLabel={dueCards.length ? `开始复习，${dueCards.length} 张` : '今天已复习完'} accessibilityState={{ disabled: !dueCards.length }} disabled={!dueCards.length} onPress={() => router.push({ pathname: '/study', params: { mode: 'review', ids: dueCards.map((card) => card.id).join(',') } })} style={({ pressed }) => [styles.startButton, { backgroundColor: colors.green, opacity: !dueCards.length ? 0.45 : pressed ? 0.84 : 1 }]}>
        <Text style={styles.startButtonText}>{dueCards.length ? '开始复习' : '今天已复习完'}</Text><Text style={styles.startButtonArrow}>→</Text>
      </Pressable>

      <View style={styles.hardHeader}><SectionLabel color={colors.inkFaint}>最近总错</SectionLabel><Text style={[styles.hardHint, { color: colors.inkFaint }]}>自动统计</Text></View>
      <View style={[styles.hardList, { backgroundColor: colors.surface, borderColor: colors.line }]}>
        {hardCards.length ? hardCards.map((card, index) => (
          <Pressable key={card.id} onPress={() => router.push({ pathname: '/study', params: { cardId: card.id } })} style={({ pressed }) => [styles.hardRow, { borderBottomColor: colors.line, opacity: pressed ? 0.72 : 1 }]}>
            <Text style={[styles.hardIndex, { color: colors.red }]}>{String(index + 1).padStart(2, '0')}</Text>
            <View style={styles.hardCopy}><Text style={[styles.hardTitle, { color: colors.ink }]}>{card.title}</Text><Text style={[styles.hardTopic, { color: colors.inkFaint }]}>{card.chapter} · {card.topic}</Text></View>
            <Text style={[styles.hardCount, { color: colors.red }]}>{progress[card.id]?.wrongCount ?? 0} 次</Text>
          </Pressable>
        )) : <Text style={[styles.emptyHard, { color: colors.inkSoft }]}>暂时没有错题，先学一组，错点会自动出现在这里。</Text>}
      </View>

      <View style={[styles.scheduleNote, { backgroundColor: colors.blueSoft }]}>
        <Text style={[styles.scheduleFormula, { color: colors.blue }]}>10 min → 1 天 → 3 天 → 7 天</Text>
        <Text style={[styles.scheduleCopy, { color: colors.inkSoft }]}>每张卡有自己的复习周期，记住的会慢慢走远。</Text>
      </View>
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
  startButton: { minHeight: 58, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.lg, marginBottom: spacing.lg, paddingHorizontal: spacing.lg, borderRadius: 16 },
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
  emptyHard: { paddingVertical: 24, textAlign: 'center', fontSize: type.small, lineHeight: 21 },
  scheduleNote: { marginTop: spacing.lg, padding: spacing.md, borderRadius: 16, gap: 6 },
  scheduleFormula: { fontSize: type.small, fontWeight: '800', letterSpacing: 0.5 },
  scheduleCopy: { fontSize: type.micro, lineHeight: 18 },
});
