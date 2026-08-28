import { StyleSheet, Text, View } from 'react-native';

import { FormulaView } from '@/components/FormulaView';
import { palette, spacing, type } from '@/constants/theme';
import type { MathCard } from '@/types/MathCard';

export function ExplanationSheet({ card, correct, themeMode }: { card: MathCard; correct: boolean; themeMode: 'light' | 'dark' }) {
  const colors = palette[themeMode];
  return (
    <View style={[styles.sheet, { backgroundColor: colors.surface, borderColor: correct ? colors.green : colors.red }]}>
      <View style={styles.resultRow}>
        <View style={[styles.resultDot, { backgroundColor: correct ? colors.green : colors.red }]}>
          <Text style={styles.resultIcon}>{correct ? '✓' : '!'}</Text>
        </View>
        <View style={styles.resultCopy}>
          <Text style={[styles.resultTitle, { color: correct ? colors.green : colors.red }]}>{correct ? '答对了' : '先记住这个坑'}</Text>
          <Text style={[styles.resultSubtitle, { color: colors.inkSoft }]}>{correct ? '把这条规则留在脑中。' : '没关系，稍后它会再次出现。'}</Text>
        </View>
      </View>

      <View style={[styles.ruleBlock, { backgroundColor: colors.surfaceMuted }]}>
        <Text style={[styles.ruleLabel, { color: colors.inkFaint }]}>核心规则</Text>
        {card.formula ? <FormulaView formula={card.formula} size="regular" color={colors.ink} /> : <Text style={[styles.ruleText, { color: colors.ink }]}>{card.coreRule}</Text>}
        <Text style={[styles.ruleText, { color: colors.inkSoft }]}>{card.shortExplanation}</Text>
      </View>

      {card.example ? (
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.blue }]}>例</Text>
          <View style={styles.infoCopy}><Text style={[styles.infoText, { color: colors.inkSoft }]}>{card.example}</Text>{card.exampleFormula ? <FormulaView formula={card.exampleFormula} size="small" color={colors.ink} /> : null}</View>
        </View>
      ) : null}
      {card.pitfall ? (
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.orange }]}>坑</Text>
          <View style={styles.infoCopy}><Text style={[styles.infoText, { color: colors.inkSoft }]}>{card.pitfall}</Text>{card.pitfallFormula ? <FormulaView formula={card.pitfallFormula} size="small" color={colors.red} /> : null}</View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: { marginTop: spacing.lg, padding: spacing.md, borderWidth: 1, borderRadius: 20, gap: spacing.md },
  resultRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  resultDot: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center', borderRadius: 99 },
  resultIcon: { color: '#FFFFFF', fontSize: 17, fontWeight: '800' },
  resultCopy: { gap: 2 },
  resultTitle: { fontSize: type.title, fontWeight: '800' },
  resultSubtitle: { fontSize: type.small },
  ruleBlock: { padding: spacing.md, borderRadius: 14, gap: 9 },
  ruleLabel: { fontSize: type.micro, fontWeight: '700', letterSpacing: 1 },
  ruleText: { fontSize: type.body, lineHeight: 23 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  infoLabel: { width: 24, paddingTop: 2, fontSize: type.micro, fontWeight: '800' },
  infoCopy: { flex: 1, gap: 6 },
  infoText: { flex: 1, fontSize: type.small, lineHeight: 21 },
});
