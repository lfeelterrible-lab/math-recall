import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { AnswerOption } from '@/components/AnswerOption';
import { ExplanationSheet } from '@/components/ExplanationSheet';
import { FormulaView } from '@/components/FormulaView';
import { FunctionGraph } from '@/components/FunctionGraph';
import { RecallButtons } from '@/components/RecallButtons';
import { StudyProgress } from '@/components/StudyProgress';
import { palette, spacing, type } from '@/constants/theme';
import { mathCards } from '@/data/cards';
import { answerMatches } from '@/lib/scheduler';
import { useStudyStore } from '@/store/useStudyStore';
import type { MathCard, RecallRating } from '@/types/MathCard';

type QueueItem = { id: string; retry?: boolean };

const GROUP_SIZE = 10;
const reviewIds = ['trig-identity', 'function-domain', 'function-increasing', 'function-even', 'trig-sin30', 'trig-double-angle', 'sequence-arithmetic-term', 'sequence-arithmetic-sum', 'sequence-geometric-sum', 'log-domain'];

function looksLikeFormula(value: string) {
  return !/[一-龥]/.test(value) && /[a-zA-Zα-ωΑ-Ω=^_√≤≥−/]/.test(value);
}

function getGroupIds(groupIndex: number) {
  if (!mathCards.length) return [];
  const start = (groupIndex * GROUP_SIZE) % mathCards.length;
  return Array.from({ length: Math.min(GROUP_SIZE, mathCards.length) }, (_, offset) => mathCards[(start + offset) % mathCards.length].id);
}

function getInitialQueue(mode: string | undefined, focusId: string | undefined, groupIndex: number, reviewCardIds = reviewIds): QueueItem[] {
  const preferred = mode === 'review' ? reviewCardIds : getGroupIds(groupIndex);
  const ids = focusId ? [focusId, ...preferred.filter((id) => id !== focusId)] : preferred;
  return ids.map((id) => ({ id }));
}

export default function StudyScreen() {
  const params = useLocalSearchParams<{ mode?: string; cardId?: string; ids?: string }>();
  const themeMode = useStudyStore((state) => state.themeMode);
  const hydrated = useStudyStore((state) => state.hydrated);
  const storedNewGroupIndex = useStudyStore((state) => state.newGroupIndex);
  const advanceNewGroup = useStudyStore((state) => state.advanceNewGroup);
  const recordAnswer = useStudyStore((state) => state.recordAnswer);
  const rateCard = useStudyStore((state) => state.rateCard);
  const colors = palette[themeMode];
  const isNewStudy = params.mode !== 'review' && !params.cardId;
  const reviewCardIds = useMemo(() => params.ids ? params.ids.split(',').filter(Boolean) : reviewIds, [params.ids]);
  const [groupIndex, setGroupIndex] = useState(() => (isNewStudy ? storedNewGroupIndex : 0));
  const [queue, setQueue] = useState<QueueItem[]>(() => getInitialQueue(params.mode, params.cardId, isNewStudy ? storedNewGroupIndex : 0, reviewCardIds));
  const hasInitializedSession = useRef(false);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState('');
  const [input, setInput] = useState('');
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [retryAdded, setRetryAdded] = useState<Record<string, boolean>>({});
  const [summary, setSummary] = useState<{ correct: number; fuzzy: number; forgot: number } | null>(null);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });

  useEffect(() => {
    if (!hydrated || hasInitializedSession.current) return;
    hasInitializedSession.current = true;
    const initialGroupIndex = isNewStudy ? storedNewGroupIndex : 0;
    setGroupIndex(initialGroupIndex);
    setQueue(getInitialQueue(params.mode, params.cardId, initialGroupIndex, reviewCardIds));
  }, [hydrated, isNewStudy, params.cardId, params.ids, params.mode, reviewCardIds, storedNewGroupIndex]);

  const item = queue[index];
  const card = useMemo<MathCard | undefined>(() => mathCards.find((candidate) => candidate.id === item?.id), [item?.id]);

  if (!card || summary) {
    const result = summary ?? { correct: score.correct, fuzzy: 0, forgot: score.wrong };
    return <StudySummary result={result} colors={colors} onRestart={() => {
      const nextGroupIndex = isNewStudy ? groupIndex + 1 : groupIndex;
      setGroupIndex(nextGroupIndex);
      setQueue(getInitialQueue(params.mode, params.cardId, nextGroupIndex, reviewCardIds));
      setIndex(0);
      setSummary(null);
      setScore({ correct: 0, wrong: 0 });
      setRetryAdded({});
      setSelected('');
      setInput('');
      setAnswered(false);
    }} />;
  }

  const submit = (value: string) => {
    if (answered || !value.trim()) return;
    const correct = card.type === 'choice' || card.type === 'judgement' || card.type === 'completion' || card.type === 'concept' || card.type === 'graph'
      ? answerMatches(value, card.correctAnswer, card.acceptedAnswers)
      : answerMatches(value, card.correctAnswer, card.acceptedAnswers);
    setSelected(value);
    setAnswered(true);
    setIsCorrect(correct);
    recordAnswer(card.id, correct);
    setScore((current) => ({ correct: current.correct + (correct ? 1 : 0), wrong: current.wrong + (correct ? 0 : 1) }));
    if (!correct && !retryAdded[card.id]) {
      setRetryAdded((current) => ({ ...current, [card.id]: true }));
      setQueue((current) => [...current, { id: card.id, retry: true }]);
    }
  };

  const goNext = (rating: RecallRating) => {
    rateCard(card.id, rating);
    if (index + 1 >= queue.length) {
      if (isNewStudy) advanceNewGroup();
      setSummary({ correct: score.correct, fuzzy: rating === 'fuzzy' ? 1 : 0, forgot: score.wrong + (rating === 'forgot' ? 1 : 0) });
      return;
    }
    setIndex((current) => current + 1);
    setSelected('');
    setInput('');
    setAnswered(false);
    setIsCorrect(false);
  };

  const typeLabel = card.type === 'quick' ? '秒答' : card.type === 'completion' ? '公式补全' : card.type === 'judgement' ? '判断' : card.type === 'graph' ? '看图判断' : card.type === 'concept' ? '题型识别' : '选择';
  const baseTotal = Math.max(GROUP_SIZE, queue.length);
  const shownProgress = Math.min(index + 1, baseTotal);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.studyScroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.studyHeader}>
          <Pressable onPress={() => router.replace('/')} style={({ pressed }) => [styles.exitButton, { borderColor: colors.line, opacity: pressed ? 0.7 : 1 }]}><Text style={[styles.exitText, { color: colors.inkSoft }]}>× 退出</Text></Pressable>
          <View style={styles.progressWrap}><StudyProgress current={shownProgress} total={baseTotal} color={colors.green} /></View>
          <Text style={[styles.cardType, { color: colors.inkFaint }]}>{typeLabel}</Text>
        </View>

        <View style={styles.topicRow}><Text style={[styles.topicLabel, { color: colors.blue }]}>{card.chapter}</Text><Text style={[styles.topicDivider, { color: colors.lineStrong }]}>/</Text><Text style={[styles.topicLabel, { color: colors.inkFaint }]}>{card.topic}</Text></View>
        <Text style={[styles.cardTitle, { color: colors.ink }]}>{card.title}</Text>
        <Text style={[styles.prompt, { color: colors.inkSoft }]}>{card.prompt}</Text>
        {card.latexPrompt ? <View style={[styles.formulaPrompt, { backgroundColor: colors.surface, borderColor: colors.line }]}><FormulaView formula={card.latexPrompt} size="large" color={colors.ink} /></View> : null}
        {card.type === 'graph' ? <View style={[styles.graphBox, { backgroundColor: colors.surfaceMuted }]}><FunctionGraph kind={card.id === 'trig-period' ? 'sine' : 'parabola'} color={colors.green} dark={themeMode === 'dark'} /></View> : null}

        {card.options ? (
          <View style={styles.options}>
            {card.options.map((option, optionIndex) => (
              <AnswerOption key={option} index={optionIndex} value={option} selected={selected === option} revealed={answered} correct={option === card.correctAnswer} latex={looksLikeFormula(option)} themeMode={themeMode} onPress={() => submit(option)} />
            ))}
          </View>
        ) : (
          <View style={styles.inputBlock}>
            <TextInput autoFocus={false} value={input} onChangeText={setInput} onSubmitEditing={() => submit(input)} editable={!answered} placeholder="写下你的答案" placeholderTextColor={colors.inkFaint} style={[styles.answerInput, { color: colors.ink, backgroundColor: colors.surface, borderColor: answered ? (isCorrect ? colors.green : colors.red) : colors.line }]} />
            <Pressable disabled={answered || !input.trim()} onPress={() => submit(input)} style={({ pressed }) => [styles.submitButton, { backgroundColor: colors.green, opacity: pressed || answered || !input.trim() ? 0.58 : 1 }]}><Text style={styles.submitText}>确认答案</Text></Pressable>
          </View>
        )}

        {answered ? (
          <View>
            <ExplanationSheet card={card} correct={isCorrect} themeMode={themeMode} />
            <Text style={[styles.recallPrompt, { color: colors.inkSoft }]}>看完解析，你现在记得吗？</Text>
            <RecallButtons onRate={goNext} themeMode={themeMode} />
          </View>
        ) : <Text style={[styles.microHint, { color: colors.inkFaint }]}>先从记忆里找答案，再看解释。</Text>}
      </ScrollView>
    </SafeAreaView>
  );
}

function StudySummary({ result, colors, onRestart }: { result: { correct: number; fuzzy: number; forgot: number }; colors: (typeof palette)[keyof typeof palette]; onRestart: () => void }) {
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.summary}>
        <Text style={[styles.summaryEyebrow, { color: colors.green }]}>本组完成</Text>
        <Text style={[styles.summaryTitle, { color: colors.ink }]}>今天的 10 张，收好。</Text>
        <Text style={[styles.summaryCopy, { color: colors.inkSoft }]}>答错的卡已经放回本组后面，下次会更容易想起来。</Text>
        <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.line }]}>
          <SummaryMetric label="正确" value={result.correct} color={colors.green} />
          <SummaryMetric label="模糊" value={result.fuzzy} color={colors.orange} />
          <SummaryMetric label="忘记" value={result.forgot} color={colors.red} />
        </View>
        <Text style={[styles.nextReview, { color: colors.inkSoft }]}>预计下次复习：明天</Text>
        <View style={styles.summaryActions}>
          <Pressable onPress={() => router.replace('/')} style={[styles.restButton, { borderColor: colors.line }]}><Text style={[styles.restButtonText, { color: colors.inkSoft }]}>休息一下</Text></Pressable>
          <Pressable onPress={onRestart} style={[styles.continueButton, { backgroundColor: colors.green }]}><Text style={styles.continueButtonText}>继续下一组</Text></Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

function SummaryMetric({ label, value, color }: { label: string; value: number; color: string }) {
  return <View style={styles.summaryMetric}><Text style={[styles.summaryValue, { color }]}>{value}</Text><Text style={styles.summaryLabel}>{label}</Text></View>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  studyScroll: { width: '100%', maxWidth: 760, alignSelf: 'center', paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.xxl },
  studyHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.xxl },
  exitButton: { paddingHorizontal: 11, paddingVertical: 8, borderWidth: 1, borderRadius: 99 },
  exitText: { fontSize: type.micro, fontWeight: '700' },
  progressWrap: { flex: 1 },
  cardType: { fontSize: type.micro, fontWeight: '700' },
  topicRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: spacing.sm },
  topicLabel: { fontSize: type.micro, fontWeight: '800', letterSpacing: 0.7 },
  topicDivider: { fontSize: type.small },
  cardTitle: { marginBottom: spacing.lg, fontSize: 30, fontWeight: '800', letterSpacing: -0.8 },
  prompt: { marginBottom: spacing.md, fontSize: type.body, lineHeight: 24 },
  formulaPrompt: { minHeight: 110, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg, padding: spacing.md, borderWidth: 1, borderRadius: 20 },
  graphBox: { marginBottom: spacing.lg, paddingHorizontal: spacing.sm, borderRadius: 18 },
  options: { gap: spacing.sm },
  inputBlock: { gap: spacing.sm, marginBottom: spacing.lg },
  answerInput: { minHeight: 58, paddingHorizontal: 16, borderWidth: 1, borderRadius: 16, fontSize: type.body, outlineStyle: 'none' } as never,
  submitButton: { minHeight: 54, alignItems: 'center', justifyContent: 'center', borderRadius: 15 },
  submitText: { color: '#FFFFFF', fontSize: type.body, fontWeight: '800' },
  recallPrompt: { marginTop: spacing.lg, fontSize: type.small, fontWeight: '700' },
  microHint: { marginTop: spacing.lg, textAlign: 'center', fontSize: type.micro },
  summary: { width: '100%', maxWidth: 560, alignSelf: 'center', justifyContent: 'center', flex: 1, padding: spacing.lg },
  summaryEyebrow: { marginBottom: 10, fontSize: type.small, fontWeight: '800', letterSpacing: 1.1 },
  summaryTitle: { fontSize: 32, fontWeight: '800', letterSpacing: -1 },
  summaryCopy: { marginTop: 10, fontSize: type.body, lineHeight: 23 },
  summaryCard: { flexDirection: 'row', marginTop: spacing.xl, paddingVertical: spacing.lg, borderWidth: 1, borderRadius: 20 },
  summaryMetric: { flex: 1, alignItems: 'center', gap: 5, borderRightWidth: 1, borderRightColor: '#00000012' },
  summaryValue: { fontSize: 31, fontWeight: '800' },
  summaryLabel: { color: '#879088', fontSize: type.micro },
  nextReview: { marginTop: spacing.lg, textAlign: 'center', fontSize: type.small },
  summaryActions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xl },
  restButton: { flex: 1, minHeight: 54, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderRadius: 15 },
  restButtonText: { fontSize: type.small, fontWeight: '700' },
  continueButton: { flex: 1, minHeight: 54, alignItems: 'center', justifyContent: 'center', borderRadius: 15 },
  continueButtonText: { color: '#FFFFFF', fontSize: type.small, fontWeight: '800' },
});
