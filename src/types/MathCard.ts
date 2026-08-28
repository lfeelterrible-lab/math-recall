export type CardType =
  | 'choice'
  | 'judgement'
  | 'completion'
  | 'fill'
  | 'quick'
  | 'graph'
  | 'concept'
  | 'order';

export type MasteryLevel = 0 | 1 | 2 | 3 | 4;

export type MathCard = {
  id: string;
  chapter: string;
  topic: string;
  title: string;
  type: CardType;
  prompt: string;
  latexPrompt?: string;
  options?: string[];
  correctAnswer: string;
  acceptedAnswers?: string[];
  shortExplanation: string;
  coreRule: string;
  formula?: string;
  example?: string;
  exampleFormula?: string;
  pitfall?: string;
  pitfallFormula?: string;
  memoryTip?: string;
  relatedCards: string[];
  difficulty: '基础' | '进阶';
  tags: string[];
  masteryLevel: MasteryLevel;
  correctCount: number;
  wrongCount: number;
  lastReviewedAt?: string;
  nextReviewAt?: string;
};

export type CardProgress = Pick<
  MathCard,
  'masteryLevel' | 'correctCount' | 'wrongCount' | 'lastReviewedAt' | 'nextReviewAt'
>;

export type RecallRating = 'forgot' | 'fuzzy' | 'remembered';
