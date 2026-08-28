import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen, SectionLabel } from '@/components/Screen';
import { palette, spacing, type } from '@/constants/theme';
import { useStudyStore } from '@/store/useStudyStore';

export default function ProfileScreen() {
  const themeMode = useStudyStore((state) => state.themeMode);
  const toggleTheme = useStudyStore((state) => state.toggleTheme);
  const dailyNewGoal = useStudyStore((state) => state.dailyNewGoal);
  const totalReviewed = useStudyStore((state) => state.totalReviewed);
  const totalStudyMinutes = useStudyStore((state) => state.totalStudyMinutes);
  const streak = useStudyStore((state) => state.streak);
  const colors = palette[themeMode];

  return (
    <Screen title="我的" eyebrow="让记忆有自己的节奏">
      <View style={[styles.profileHero, { backgroundColor: colors.ink }]}>
        <View style={[styles.avatar, { backgroundColor: colors.greenSoft, borderColor: colors.green }]}><Text style={[styles.avatarText, { color: colors.green }]}>数</Text></View>
        <View style={styles.profileCopy}><Text style={styles.profileName}>我的学习轨迹</Text><Text style={styles.profileMeta}>MathRecall · 本机数据</Text></View>
        <Text style={[styles.profileStreak, { color: colors.green }]}>{streak}<Text style={styles.profileStreakUnit}>天</Text></Text>
      </View>

      <View style={styles.metricsGrid}>
        <Metric label="累计学习卡片" value={String(totalReviewed)} colors={colors} />
        <Metric label="本周学习时间" value={Math.round(totalStudyMinutes / 4) + ' min'} colors={colors} />
        <Metric label="当前掌握率" value="72%" colors={colors} />
      </View>

      <SectionLabel color={colors.inkFaint}>学习设置</SectionLabel>
      <View style={[styles.settings, { backgroundColor: colors.surface, borderColor: colors.line }]}>
        <SettingRow label="每日新卡" detail="控制每天第一次出现的数量" trailing={dailyNewGoal + ' 张'} colors={colors} />
        <SettingRow label="每日目标" detail="完成一组，就算今天来过" trailing="10 张" colors={colors} />
        <Pressable onPress={toggleTheme} style={({ pressed }) => [styles.settingRow, { borderBottomColor: colors.line, opacity: pressed ? 0.72 : 1 }]}>
          <View style={styles.settingCopy}><Text style={[styles.settingLabel, { color: colors.ink }]}>主题</Text><Text style={[styles.settingDetail, { color: colors.inkFaint }]}>浅色 / 深色界面</Text></View>
          <View style={[styles.themeToggle, { backgroundColor: colors.surfaceMuted }]}><View style={[styles.themeThumb, { backgroundColor: colors.green, alignSelf: themeMode === 'dark' ? 'flex-end' : 'flex-start' }]} /><Text style={[styles.themeValue, { color: colors.inkSoft }]}>{themeMode === 'dark' ? '深色' : '浅色'}</Text></View>
        </Pressable>
        <SettingRow label="数据与隐私" detail="所有状态仅保存在这台设备" trailing="离线" colors={colors} last />
      </View>

      <View style={[styles.principle, { backgroundColor: colors.greenSoft }]}>
        <Text style={[styles.principleMark, { color: colors.green }]}>“</Text>
        <Text style={[styles.principleText, { color: colors.ink }]}>今天不求刷很多，只求下一次遇到它时，能想起来。</Text>
      </View>
    </Screen>
  );
}

function Metric({ label, value, colors }: { label: string; value: string; colors: (typeof palette)[keyof typeof palette] }) {
  return <View style={[styles.metric, { backgroundColor: colors.surface, borderColor: colors.line }]}><Text style={[styles.metricValue, { color: colors.ink }]}>{value}</Text><Text style={[styles.metricLabel, { color: colors.inkFaint }]}>{label}</Text></View>;
}

function SettingRow({ label, detail, trailing, colors, last = false }: { label: string; detail: string; trailing: string; colors: (typeof palette)[keyof typeof palette]; last?: boolean }) {
  return <View style={[styles.settingRow, { borderBottomColor: colors.line }, last && styles.settingRowLast]}><View style={styles.settingCopy}><Text style={[styles.settingLabel, { color: colors.ink }]}>{label}</Text><Text style={[styles.settingDetail, { color: colors.inkFaint }]}>{detail}</Text></View><Text style={[styles.settingTrailing, { color: colors.green }]}>{trailing}</Text></View>;
}

const styles = StyleSheet.create({
  profileHero: { minHeight: 150, flexDirection: 'row', alignItems: 'center', padding: spacing.lg, borderRadius: 20, gap: 13 },
  avatar: { width: 52, height: 52, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderRadius: 17 },
  avatarText: { fontSize: 24, fontWeight: '800' },
  profileCopy: { flex: 1, gap: 5 },
  profileName: { color: '#FFFFFF', fontSize: type.title, fontWeight: '800' },
  profileMeta: { color: 'rgba(255,255,255,0.58)', fontSize: type.micro },
  profileStreak: { fontSize: 27, fontWeight: '800' },
  profileStreakUnit: { color: '#FFFFFF', fontSize: type.small, fontWeight: '600' },
  metricsGrid: { flexDirection: 'row', gap: spacing.sm, marginVertical: spacing.xl },
  metric: { flex: 1, minHeight: 92, justifyContent: 'space-between', padding: spacing.md, borderWidth: 1, borderRadius: 17 },
  metricValue: { fontSize: 22, fontWeight: '800' },
  metricLabel: { fontSize: type.micro },
  settings: { paddingHorizontal: spacing.md, borderWidth: 1, borderRadius: 18 },
  settingRow: { minHeight: 70, flexDirection: 'row', alignItems: 'center', gap: spacing.md, borderBottomWidth: 1 },
  settingRowLast: { borderBottomWidth: 0 },
  settingCopy: { flex: 1, gap: 4 },
  settingLabel: { fontSize: type.body, fontWeight: '700' },
  settingDetail: { fontSize: type.micro },
  settingTrailing: { fontSize: type.small, fontWeight: '800' },
  themeToggle: { minWidth: 74, minHeight: 32, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 4, borderRadius: 99, gap: 5 },
  themeThumb: { width: 24, height: 24, borderRadius: 99 },
  themeValue: { paddingRight: 5, fontSize: 10, fontWeight: '700' },
  principle: { flexDirection: 'row', alignItems: 'flex-start', marginTop: spacing.xl, padding: spacing.md, borderRadius: 17, gap: 8 },
  principleMark: { marginTop: -5, fontSize: 30, fontWeight: '800' },
  principleText: { flex: 1, fontSize: type.small, lineHeight: 21, fontWeight: '600' },
});
