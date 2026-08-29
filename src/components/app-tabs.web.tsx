import { TabList, TabSlot, TabTrigger, Tabs, type TabListProps, type TabTriggerSlotProps } from 'expo-router/ui';
import { usePathname } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { palette, type } from '@/constants/theme';
import { mathCards } from '@/data/cards';
import { useStudyStore } from '@/store/useStudyStore';

const tabItems = [
  { name: 'index', href: '/', icon: '⌂', label: '学习', hint: '今天的 10 张' },
  { name: 'review', href: '/review', icon: '↻', label: '复习', hint: '需要再见的卡' },
  { name: 'library', href: '/library', icon: '▦', label: '知识库', hint: `${mathCards.length} 个知识点` },
  { name: 'profile', href: '/profile', icon: '○', label: '我的', hint: '你的学习记录' },
] as const;

export default function AppTabs() {
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const compact = width < 760;
  const isStudy = pathname.startsWith('/study');
  const themeMode = useStudyStore((state) => state.themeMode);
  const hydrate = useStudyStore((state) => state.hydrate);
  const colors = palette[themeMode];

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <Tabs>
      <TabSlot style={[styles.slot, { backgroundColor: colors.background }, compact ? styles.slotCompact : styles.slotWide]} />
      <TabList asChild>
        <CustomTabList compact={compact} colors={colors} hidden={isStudy}>
          {!isStudy ? tabItems.map((item) => (
            <TabTrigger key={item.name} name={item.name} href={item.href} asChild>
              <TabButton item={item} compact={compact} colors={colors} />
            </TabTrigger>
          )) : null}
          <TabTrigger name="study" href="/study" asChild>
            <View style={styles.hiddenTrigger} />
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

function TabButton({ item, compact, colors, isFocused, ...props }: TabTriggerSlotProps & { item: (typeof tabItems)[number]; compact: boolean; colors: (typeof palette)[keyof typeof palette] }) {
  return (
    <Pressable {...props} accessibilityRole="tab" accessibilityLabel={item.label} style={({ pressed }) => [styles.tabButton, compact && styles.tabButtonCompact, pressed && styles.pressed]}>
      <View style={[styles.tabButtonInner, compact && styles.tabButtonInnerCompact, { backgroundColor: isFocused ? colors.surfaceMuted : 'transparent', borderColor: isFocused ? colors.line : 'transparent' }]}>
        <Text style={[styles.icon, compact && styles.iconCompact, { color: isFocused ? colors.green : colors.inkFaint }]}>{item.icon}</Text>
        <View style={[styles.tabCopy, compact && styles.tabCopyCompact]}>
          <Text style={[styles.tabLabel, compact && styles.tabLabelCompact, { color: isFocused ? colors.ink : colors.inkSoft }]}>{item.label}</Text>
          {!compact ? <Text style={[styles.tabHint, { color: colors.inkFaint }]}>{item.hint}</Text> : null}
        </View>
        {isFocused && !compact ? <View style={[styles.activeDot, { backgroundColor: colors.green }]} /> : null}
      </View>
    </Pressable>
  );
}

function CustomTabList({ children, compact, colors, hidden, ...props }: TabListProps & { compact: boolean; colors: (typeof palette)[keyof typeof palette]; hidden?: boolean }) {
  return (
    <View {...props} style={[styles.tabList, compact ? styles.tabListCompact : styles.tabListWide, hidden && styles.tabListHidden, { backgroundColor: colors.surface, borderColor: colors.line }]}>
      {!compact ? <View style={styles.brandBlock}>
        <View style={[styles.brandMark, { borderColor: colors.green }]}>
          <Text style={[styles.brandMarkText, { color: colors.green }]}>∑</Text>
        </View>
        <View><Text style={[styles.brandName, { color: colors.ink }]}>数忆</Text><Text style={[styles.brandMeta, { color: colors.inkFaint }]}>MATHRECALL</Text></View>
      </View> : null}
      <View style={[styles.tabItems, compact ? styles.tabItemsCompact : undefined]}>{children}</View>
      {!compact ? (
        <View style={[styles.offlineNote, { borderColor: colors.line }]}>
          <View style={[styles.offlineDot, { backgroundColor: colors.green }]} />
          <View><Text style={[styles.offlineLabel, { color: colors.inkSoft }]}>离线优先</Text><Text style={[styles.offlineCopy, { color: colors.inkFaint }]}>状态保存在本机</Text></View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  slot: { flex: 1 },
  slotWide: { paddingLeft: 248, paddingBottom: 0 },
  slotCompact: { paddingBottom: 76 },
  tabList: { position: 'absolute', zIndex: 20, borderRightWidth: 1 },
  tabListWide: { top: 0, bottom: 0, left: 0, width: 248, padding: 26, justifyContent: 'flex-start' },
  tabListCompact: { right: 12, bottom: 12, left: 12, borderWidth: 1, borderRadius: 21, paddingVertical: 7, paddingHorizontal: 8 },
  tabListHidden: { display: 'none' },
  hiddenTrigger: { width: 1, height: 1 },
  brandBlock: { flexDirection: 'row', alignItems: 'center', gap: 11, marginBottom: 50 },
  brandMark: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderRadius: 12 },
  brandMarkText: { fontSize: 21, fontWeight: '700' },
  brandName: { fontSize: 18, fontWeight: '800', letterSpacing: -0.4 },
  brandMeta: { marginTop: 2, fontSize: 9, fontWeight: '700', letterSpacing: 1.7 },
  tabItems: { gap: 8 },
  tabItemsCompact: { flexDirection: 'row', justifyContent: 'space-around', gap: 3 },
  tabButton: { minWidth: 0 },
  tabButtonCompact: { flex: 1 },
  tabButtonInner: { minHeight: 52, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, borderWidth: 1, borderRadius: 15, gap: 11 },
  tabButtonInnerCompact: { minHeight: 50, flexDirection: 'column', justifyContent: 'center', paddingHorizontal: 4, gap: 1, borderRadius: 14 },
  icon: { width: 22, fontSize: 22, lineHeight: 24, textAlign: 'center' },
  iconCompact: { width: 18, fontSize: 18, lineHeight: 20 },
  tabCopy: { flex: 1, gap: 3 },
  tabCopyCompact: { flex: 0, gap: 0 },
  tabLabel: { fontSize: type.small, fontWeight: '800' },
  tabLabelCompact: { fontSize: 11 },
  tabHint: { fontSize: type.micro },
  activeDot: { width: 6, height: 6, borderRadius: 99 },
  offlineNote: { flexDirection: 'row', gap: 9, marginTop: 'auto', paddingTop: 18, borderTopWidth: 1 },
  offlineDot: { width: 7, height: 7, marginTop: 4, borderRadius: 99 },
  offlineLabel: { fontSize: type.small, fontWeight: '700' },
  offlineCopy: { marginTop: 3, fontSize: type.micro },
  pressed: { opacity: 0.78 },
});
