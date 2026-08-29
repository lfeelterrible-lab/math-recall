import { create } from 'zustand';

import { mathCards } from '@/data/cards';
import { isDue, scheduleReview } from '@/lib/scheduler';
import type { CardProgress, MathCard, RecallRating } from '@/types/MathCard';

type ThemeMode = 'light' | 'dark';

type StudyStore = {
  hydrated: boolean;
  themeMode: ThemeMode;
  dailyNewGoal: number;
  newGroupIndex: number;
  streak: number;
  totalReviewed: number;
  totalStudyMinutes: number;
  progress: Record<string, CardProgress>;
  hydrate: () => void;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  advanceNewGroup: () => void;
  recordAnswer: (cardId: string, correct: boolean) => void;
  rateCard: (cardId: string, rating: RecallRating) => void;
  getProgress: (card: MathCard) => CardProgress;
  getDueCards: () => MathCard[];
  getHardCards: () => MathCard[];
};

const STORAGE_KEY = 'mathrecall-progress-v1';

type PersistedState = Pick<
  StudyStore,
  'themeMode' | 'dailyNewGoal' | 'newGroupIndex' | 'streak' | 'totalReviewed' | 'totalStudyMinutes' | 'progress'
>;

function persist(state: StudyStore) {
  if (typeof window === 'undefined') return;
  const payload: PersistedState = {
    themeMode: state.themeMode,
    dailyNewGoal: state.dailyNewGoal,
    newGroupIndex: state.newGroupIndex,
    streak: state.streak,
    totalReviewed: state.totalReviewed,
    totalStudyMinutes: state.totalStudyMinutes,
    progress: state.progress,
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function initialProgress(card: MathCard): CardProgress {
  return {
    masteryLevel: card.masteryLevel,
    correctCount: card.correctCount,
    wrongCount: card.wrongCount,
    lastReviewedAt: card.lastReviewedAt,
    nextReviewAt: card.nextReviewAt,
  };
}

export const useStudyStore = create<StudyStore>((set, get) => ({
  hydrated: false,
  themeMode: 'light',
  dailyNewGoal: 10,
  newGroupIndex: 0,
  streak: 9,
  totalReviewed: 126,
  totalStudyMinutes: 248,
  progress: {},
  hydrate: () => {
    if (typeof window === 'undefined') return;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Partial<PersistedState>;
        set({
          hydrated: true,
          themeMode: parsed.themeMode === 'dark' ? 'dark' : 'light',
          dailyNewGoal: parsed.dailyNewGoal ?? 10,
          newGroupIndex: parsed.newGroupIndex ?? 0,
          streak: parsed.streak ?? 9,
          totalReviewed: parsed.totalReviewed ?? 126,
          totalStudyMinutes: parsed.totalStudyMinutes ?? 248,
          progress: parsed.progress ?? {},
        });
        return;
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
    set({ hydrated: true });
  },
  toggleTheme: () => {
    set((state) => {
      const next = { themeMode: state.themeMode === 'light' ? 'dark' : 'light' } as const;
      persist({ ...state, ...next });
      return next;
    });
  },
  setThemeMode: (themeMode) => {
    set((state) => {
      persist({ ...state, themeMode });
      return { themeMode };
    });
  },
  advanceNewGroup: () => {
    set((state) => {
      const newGroupIndex = state.newGroupIndex + 1;
      persist({ ...state, newGroupIndex });
      return { newGroupIndex };
    });
  },
  recordAnswer: (cardId, correct) => {
    set((state) => {
      const card = mathCards.find((item) => item.id === cardId) ?? mathCards[0];
      const current = state.progress[cardId] ?? initialProgress(card);
      const nextProgress = {
        ...state.progress,
        [cardId]: {
          ...current,
          correctCount: current.correctCount + (correct ? 1 : 0),
          wrongCount: current.wrongCount + (correct ? 0 : 1),
          masteryLevel: (correct
            ? Math.min(4, Math.max(1, current.masteryLevel + 1))
            : Math.max(0, current.masteryLevel - 1)) as CardProgress['masteryLevel'],
        },
      };
      const nextState = { ...state, progress: nextProgress, totalReviewed: state.totalReviewed + 1 };
      persist(nextState);
      return { progress: nextProgress, totalReviewed: nextState.totalReviewed };
    });
  },
  rateCard: (cardId, rating) => {
    set((state) => {
      const card = mathCards.find((item) => item.id === cardId) ?? mathCards[0];
      const current = state.progress[cardId] ?? initialProgress(card);
      const nextMastery = rating === 'forgot'
        ? Math.max(0, current.masteryLevel - 1)
        : rating === 'fuzzy'
          ? Math.max(1, current.masteryLevel)
          : Math.min(4, current.masteryLevel + 1);
      const next = scheduleReview(rating, nextMastery);
      const progress = {
        ...state.progress,
        [cardId]: {
          ...current,
          masteryLevel: nextMastery as CardProgress['masteryLevel'],
          lastReviewedAt: new Date().toISOString(),
          nextReviewAt: next.nextReviewAt,
        },
      };
      const nextState = { ...state, progress };
      persist(nextState);
      return { progress };
    });
  },
  getProgress: (card) => get().progress[card.id] ?? initialProgress(card),
  getDueCards: () => mathCards.filter((card) => isDue(get().getProgress(card).nextReviewAt)),
  getHardCards: () => [...mathCards]
    .sort((a, b) => get().getProgress(b).wrongCount - get().getProgress(a).wrongCount)
    .slice(0, 5),
}));
