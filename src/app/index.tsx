import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { Screen, SectionLabel } from '@/components/Screen';
import { palette, spacing, type } from '@/constants/theme';
import { mathCards } from '@/data/cards';
import { useStudyStore } from '@/store/useStudyStore';

const baseMastery: Record<string, number> = { 函数: 78, 三角函数: 61, 数列: 86 };

function ProgressBar({ value, color, background }: { value: number; color: string; background: string }) {
  return (
    <View style={[styles.progressTrack, { backgroundColor: background }]}>
      <View style={[styles.progressFill, { width: value + '%', backgroundColor: color } as never]} />
    </View>
  );
}

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const themeMode = useStudyStore((state) => state.themeMode);
  const dailyNewGoal = useStudyStore((state) => state.dailyNewGoal);
  const streak = useStudyStore((state) => state.streak);
  const progress = useStudyStore((state) => state.progress);
  const colors = palette[themeMode];
  const compact = width < 540;
  const newCount = dailyNewGoal;
  const dueCount = 18;

  const masteryFor = (chapter: string) => {
    const chapterCards = mathCards.filter((card) => card.chapter === chapter);
    const reviewed = chapterCards.filter((card) => progress[card.id]);
    if (!reviewed.length) return baseMastery[chapter] ?? 52;
    const live = reviewed.reduce((sum, card) => sum + (progress[card.id]?.masteryLevel ?? 0) / 4 * 100, 0) / reviewed.length;
    return Math.round((live + (baseMastery[chapter] ?? 52)) / 2);
  };

  return (
    <Screen title="今天" eyebrow="8 月 28 日 · 星期五">
      <View style={styles.introRow}>
        <View style={styles.introCopy}>
          <Text style={[styles.greeting, { color: colors.ink }]}>数忆</Text>
          <Text style={[styles.subGreeting, { color: colors.inkSoft }]}>今天也只记几件重要的事。</Text>
        </View>
        <View style={[styles.streakBadge, { backgroundColor: colors.orangeSoft }]}>
          <Text style={[styles.streakFire, { color: colors.orange }]}>火</Text>
          <View><Text style={[styles.streakNumber, { color: colors.orange }]}>{streak} 天</Text><Text style={[styles.streakLabel, { color: colors.inkSoft }]}>连续学习</Text></View>
        </View>
      </View>

      <View style={[styles.statGrid, compact && styles.statGridCompact]}>
        <StatCard value={newCount} label="新知识" detail="今天计划" color={colors.blue} background={colors.blueSoft} compact={compact} />
        <StatCard value={dueCount} label="待复习" detail="现在可以开始" color={colors.green} background={colors.greenSoft} compact={compact} />
        <StatCard value={streak} label="连续学习" detail="保持节奏" color={colors.orange} background={colors.orangeSoft} compact={compact} />
      </View>

      <Pressable
        onPress={() => router.push('/study')}
        style={({ pressed }) => [styles.startCard, { backgroundColor: colors.ink, opacity: pressed ? 0.9 : 1 }]}>
        <View style={styles.startCopy}>
          <Text style={[styles.startEyebrow, { color: colors.green }]}>今日学习组</Text>
          <Text style={styles.startTitle}>开始学习</Text>
          <Text style={[styles.startMeta, { color: 'rgba(255,255,255,0.62)' }]}>10 张 · 预计 12 分钟</Text>
        </View>
        <View style={styles.startArrow}><Text style={styles.startArrowText}>→</Text></View>
      </Pressable>

      <View style={styles.sectionHeader}>
        <SectionLabel color={colors.inkFaint}>本周掌握</SectionLabel>
        <Text style={[styles.sectionMeta, { color: colors.inkFaint }]}>已拆成独立知识点</Text>
      </View>
      <View style={[styles.masteryCard, { backgroundColor: colors.surface, borderColor: colors.line }]}>
        {['函数', '三角函数', '数列'].map((chapter, index) => {
          const chapterColor = [colors.blue, colors.green, colors.orange][index];
          const value = masteryFor(chapter);
          return (
            <View key={chapter} style={styles.masteryRow}>
              <View style={styles.masteryName}><View style={[styles.masteryDot, { backgroundColor: chapterColor }]} /><Text style={[styles.masteryText, { color: colors.ink }]}>{chapter}</Text></View>
              <ProgressBar value={value} color={chapterColor} background={colors.surfaceMuted} />
              <Text style={[styles.masteryValue, { color: colors.inkSoft }]}>{value}%</Text>
            </View>
          );
        })}
      </View>

      <View style={styles.bottomNote}>
        <Text style={[styles.noteMark, { color: colors.green }]}>∴</Text>
        <Text style={[styles.noteText, { color: colors.inkSoft }]}>把公式拆成小卡，才更容易在需要的时候想起来。</Text>
      </View>
    </Screen>
  );
}

function StatCard({ value, label, detail, color, background, compact }: { value: number; label: string; detail: string; color: string; background: string; compact?: boolean }) {
  return (
    <View style={[styles.statCard, compact && styles.statCardCompact, { backgroundColor: background }]}>
      <Text style={[styles.statValue, compact && styles.statValueCompact, { color }]}>{value}</Text>
      <Text style={[styles.statLabel, compact && styles.statLabelCompact, { color }]}>{label}</Text>
      <Text style={[styles.statDetail, compact && styles.statDetailCompact, { color }]}>{detail}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  introRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: spacing.lg, marginBottom: spacing.xl },
  introCopy: { gap: 7 },
  greeting: { fontSize: type.display, fontWeight: '800', letterSpacing: -1.5 },
  subGreeting: { fontSize: type.body },
  streakBadge: { flexDirection: 'row', alignItems: 'center', gap: 9, paddingHorizontal: 13, paddingVertical: 10, borderRadius: 16 },
  streakFire: { fontSize: 17, fontWeight: '900' },
  streakNumber: { fontSize: type.small, fontWeight: '800' },
  streakLabel: { marginTop: 2, fontSize: type.micro },
  statGrid: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  statGridCompact: { flexDirection: 'row' },
  statCard: { flex: 1, minHeight: 126, justifyContent: 'space-between', padding: spacing.md, borderRadius: 18 },
  statCardCompact: { minHeight: 100, padding: 12 },
  statValue: { fontSize: 32, fontWeight: '800', letterSpacing: -1 },
  statValueCompact: { fontSize: 26 },
  statLabel: { marginTop: 'auto', fontSize: type.body, fontWeight: '800' },
  statLabelCompact: { fontSize: type.small },
  statDetail: { marginTop: 4, fontSize: type.micro, opacity: 0.78 },
  statDetailCompact: { fontSize: 9 },
  startCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 142, marginBottom: spacing.xxl, paddingHorizontal: spacing.lg, borderRadius: 20 },
  startCopy: { gap: 7 },
  startEyebrow: { fontSize: type.micro, fontWeight: '800', letterSpacing: 1.1 },
  startTitle: { color: '#FFFFFF', fontSize: 26, fontWeight: '800', letterSpacing: -0.7 },
  startMeta: { fontSize: type.small },
  startArrow: { width: 54, height: 54, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.26)', borderRadius: 99 },
  startArrowText: { color: '#FFFFFF', fontSize: 27, fontWeight: '300' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionMeta: { marginBottom: spacing.sm, fontSize: type.micro },
  masteryCard: { paddingHorizontal: spacing.md, paddingVertical: 8, borderWidth: 1, borderRadius: 18 },
  masteryRow: { minHeight: 57, flexDirection: 'row', alignItems: 'center', gap: 12 },
  masteryName: { width: 86, flexDirection: 'row', alignItems: 'center', gap: 8 },
  masteryDot: { width: 7, height: 7, borderRadius: 99 },
  masteryText: { fontSize: type.small, fontWeight: '700' },
  progressTrack: { height: 7, flex: 1, overflow: 'hidden', borderRadius: 99 },
  progressFill: { height: '100%', borderRadius: 99 },
  masteryValue: { width: 38, fontSize: type.micro, textAlign: 'right' },
  bottomNote: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: spacing.xl },
  noteMark: { fontSize: 20, fontWeight: '800' },
  noteText: { flex: 1, fontSize: type.small, lineHeight: 21 },
});
