import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { FormulaView } from '@/components/FormulaView';
import { Screen, SectionLabel } from '@/components/Screen';
import { palette, spacing, type } from '@/constants/theme';
import { chapters, mathCards } from '@/data/cards';
import { useStudyStore } from '@/store/useStudyStore';

const chapterColors = ['blue', 'green', 'orange', 'blue', 'green', 'orange', 'blue', 'green'] as const;

export default function LibraryScreen() {
  const [query, setQuery] = useState('');
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const themeMode = useStudyStore((state) => state.themeMode);
  const progress = useStudyStore((state) => state.progress);
  const colors = palette[themeMode];

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return mathCards.filter((card) => {
      const inChapter = !selectedChapter || card.chapter === selectedChapter;
      const haystack = [card.title, card.topic, card.prompt, card.formula, ...card.tags].join(' ').toLowerCase();
      return inChapter && (!normalized || haystack.includes(normalized));
    });
  }, [query, selectedChapter]);

  return (
    <Screen title="知识库" eyebrow="把数学拆成可回忆的小单元">
      <View style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.line }]}>
        <Text style={[styles.searchIcon, { color: colors.inkFaint }]}>⌕</Text>
        <TextInput value={query} onChangeText={setQuery} placeholder="搜索：二倍角、定义域、周期…" placeholderTextColor={colors.inkFaint} style={[styles.searchInput, { color: colors.ink }]} />
        {query ? <Pressable onPress={() => setQuery('')}><Text style={[styles.clear, { color: colors.inkFaint }]}>×</Text></Pressable> : null}
      </View>

      <SectionLabel color={colors.inkFaint}>{selectedChapter ? selectedChapter : '高中数学'}</SectionLabel>
      {!selectedChapter && !query ? (
        <View style={styles.chapterGrid}>
          {chapters.map((chapter, index) => {
            const count = mathCards.filter((card) => card.chapter === chapter).length;
            const tone = colors[chapterColors[index]];
            const reviewed = mathCards.filter((card) => card.chapter === chapter && progress[card.id]).length;
            const percent = reviewed ? Math.min(100, reviewed / count * 100) : 60;
            return (
              <Pressable key={chapter} onPress={() => setSelectedChapter(chapter)} style={({ pressed }) => [styles.chapterCard, { backgroundColor: colors.surface, borderColor: colors.line, opacity: pressed ? 0.78 : 1 }]}>
                <View style={[styles.chapterLine, { backgroundColor: tone }]} />
                <Text style={[styles.chapterTitle, { color: colors.ink }]}>{chapter}</Text>
                <Text style={[styles.chapterMeta, { color: colors.inkFaint }]}>掌握 {reviewed || Math.round(count * 0.6)} / {count}</Text>
                <View style={[styles.chapterProgress, { backgroundColor: colors.surfaceMuted }]}><View style={[styles.chapterProgressFill, { width: percent + '%', backgroundColor: tone } as never]} /></View>
              </Pressable>
            );
          })}
        </View>
      ) : null}

      {(query || selectedChapter) ? (
        <View style={[styles.resultList, { backgroundColor: colors.surface, borderColor: colors.line }]}>
          {results.length ? results.map((card) => (
            <Pressable key={card.id} onPress={() => router.push({ pathname: '/study', params: { cardId: card.id } })} style={({ pressed }) => [styles.resultRow, { borderBottomColor: colors.line, opacity: pressed ? 0.7 : 1 }]}>
              <View style={[styles.resultDot, { backgroundColor: colors.green }]} />
              <View style={styles.resultCopy}><Text style={[styles.resultTitle, { color: colors.ink }]}>{card.title}</Text><Text style={[styles.resultMeta, { color: colors.inkFaint }]}>{card.chapter} · {card.topic}</Text></View>
              <Text style={[styles.resultArrow, { color: colors.inkFaint }]}>›</Text>
            </Pressable>
          )) : <Text style={[styles.empty, { color: colors.inkSoft }]}>还没有找到这个知识点。</Text>}
        </View>
      ) : null}

      {selectedChapter ? <Pressable onPress={() => setSelectedChapter(null)} style={styles.backLink}><Text style={[styles.backLinkText, { color: colors.blue }]}>← 返回全部章节</Text></Pressable> : null}

      {!query && !selectedChapter ? (
        <View style={[styles.relationship, { backgroundColor: colors.blueSoft }]}>
          <Text style={[styles.relationshipLabel, { color: colors.blue }]}>公式关系</Text>
          <View style={styles.relationshipRow}><FormulaView formula={'\\sin(\\alpha+\\beta)'} size="small" color={colors.ink} /><Text style={[styles.relationshipArrow, { color: colors.blue }]}>→</Text><FormulaView formula={'\\sin(2\\alpha)'} size="small" color={colors.ink} /></View>
          <Text style={[styles.relationshipCopy, { color: colors.inkSoft }]}>两角和公式 · 令 β=α · 二倍角公式</Text>
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchBox: { minHeight: 52, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, borderWidth: 1, borderRadius: 16, gap: 9, marginBottom: spacing.xl },
  searchIcon: { fontSize: 25, lineHeight: 25 },
  searchInput: { flex: 1, minWidth: 0, fontSize: type.small, outlineStyle: 'none' } as never,
  clear: { fontSize: 23, lineHeight: 23 },
  chapterGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.xl },
  chapterCard: { width: '48%', minHeight: 124, position: 'relative', justifyContent: 'flex-end', padding: spacing.md, borderWidth: 1, borderRadius: 17, gap: 7 },
  chapterLine: { position: 'absolute', top: 0, left: spacing.md, width: 26, height: 3, borderBottomLeftRadius: 2, borderBottomRightRadius: 2 },
  chapterTitle: { fontSize: type.body, fontWeight: '800' },
  chapterMeta: { fontSize: type.micro },
  chapterProgress: { height: 5, overflow: 'hidden', borderRadius: 99 },
  chapterProgressFill: { height: '100%', borderRadius: 99 },
  resultList: { paddingHorizontal: spacing.md, borderWidth: 1, borderRadius: 18 },
  resultRow: { minHeight: 68, flexDirection: 'row', alignItems: 'center', gap: 11, borderBottomWidth: 1 },
  resultDot: { width: 7, height: 7, borderRadius: 99 },
  resultCopy: { flex: 1, gap: 3 },
  resultTitle: { fontSize: type.body, fontWeight: '700' },
  resultMeta: { fontSize: type.micro },
  resultArrow: { fontSize: 25 },
  empty: { paddingVertical: 30, textAlign: 'center', fontSize: type.small },
  backLink: { alignSelf: 'flex-start', marginTop: spacing.md },
  backLinkText: { fontSize: type.small, fontWeight: '700' },
  relationship: { marginTop: spacing.lg, padding: spacing.md, borderRadius: 17, gap: 9 },
  relationshipLabel: { fontSize: type.micro, fontWeight: '800', letterSpacing: 1 },
  relationshipRow: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  relationshipArrow: { fontSize: 19 },
  relationshipCopy: { fontSize: type.micro },
});
