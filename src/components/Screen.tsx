import { useEffect, type ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { palette, spacing, type } from '@/constants/theme';
import { useStudyStore } from '@/store/useStudyStore';

type ScreenProps = {
  title: string;
  eyebrow?: string;
  children: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  scroll?: boolean;
};

export function Screen({ title, eyebrow, children, contentStyle, scroll = true }: ScreenProps) {
  const themeMode = useStudyStore((state) => state.themeMode);
  const hydrate = useStudyStore((state) => state.hydrate);
  const colors = palette[themeMode];

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const content = (
    <View style={[styles.content, contentStyle]}>
      <View style={styles.header}>
        <View>
          {eyebrow ? <Text style={[styles.eyebrow, { color: colors.blue }]}>{eyebrow}</Text> : null}
          <Text style={[styles.title, { color: colors.ink }]}>{title}</Text>
        </View>
        <View style={[styles.headerMark, { borderColor: colors.lineStrong }]}>
          <View style={[styles.headerMarkDot, { backgroundColor: colors.green }]} />
          <Text style={[styles.headerMarkText, { color: colors.inkFaint }]}>离线可用</Text>
        </View>
      </View>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {content}
        </ScrollView>
      ) : content}
    </SafeAreaView>
  );
}

export function SectionLabel({ children, color }: { children: ReactNode; color: string }) {
  return <Text style={[styles.sectionLabel, { color }]}>{children}</Text>;
}

export function Divider({ color }: { color: string }) {
  return <View style={[styles.divider, { backgroundColor: color }]} />;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  content: { width: '100%', maxWidth: 960, alignSelf: 'center', paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: 112 },
  header: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: spacing.xl, gap: spacing.md },
  eyebrow: { marginBottom: 8, fontSize: type.micro, fontWeight: '700', letterSpacing: 1.4 },
  title: { fontSize: type.headline, fontWeight: '700', letterSpacing: -0.6 },
  headerMark: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 10, paddingVertical: 7, borderWidth: 1, borderRadius: 99 },
  headerMarkDot: { width: 6, height: 6, borderRadius: 99 },
  headerMarkText: { fontSize: type.micro },
  sectionLabel: { marginBottom: spacing.sm, fontSize: type.micro, fontWeight: '700', letterSpacing: 1.1 },
  divider: { height: 1, marginVertical: spacing.lg },
});
