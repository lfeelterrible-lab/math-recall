import type { RecallRating } from '@/types/MathCard';

const intervals: Record<RecallRating, number[]> = {
  forgot: [0.25, 0.5, 1],
  fuzzy: [1, 2, 4],
  remembered: [3, 7, 14, 30, 60],
};

export function scheduleReview(
  rating: RecallRating,
  masteryLevel: number,
  now = new Date(),
) {
  const bucket = intervals[rating];
  const index = Math.min(Math.max(masteryLevel - 1, 0), bucket.length - 1);
  const days = bucket[index];
  const next = new Date(now);
  next.setMinutes(next.getMinutes() + Math.round(days * 24 * 60));
  return {
    nextReviewAt: next.toISOString(),
    intervalDays: days,
  };
}

export function isDue(nextReviewAt?: string, now = new Date()) {
  return !nextReviewAt || new Date(nextReviewAt).getTime() <= now.getTime();
}

export function normalizeAnswer(value: string) {
  return value
    .trim()
    .replaceAll(' ', '')
    .replaceAll('（', '(')
    .replaceAll('）', ')')
    .replaceAll('，', ',')
    .replaceAll('＝', '=')
    .toLowerCase();
}

export function answerMatches(answer: string, correctAnswer: string, acceptedAnswers: string[] = []) {
  const normalized = normalizeAnswer(answer);
  return [correctAnswer, ...acceptedAnswers].some((candidate) => normalizeAnswer(candidate) === normalized);
}

export function masteryLabel(level: number) {
  return ['新知识', '学过', '熟悉', '掌握', '长期记忆'][Math.min(level, 4)] ?? '新知识';
}
