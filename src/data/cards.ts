import rawCards from '../../assets/data/math-cards.json';

import type { MathCard } from '@/types/MathCard';

export const mathCards = rawCards as MathCard[];

export const chapters = [
  '集合与逻辑',
  '函数',
  '三角函数',
  '数列',
  '向量',
  '解析几何',
  '概率统计',
  '导数',
];

export const chapterShortcuts = [
  { label: '函数', count: mathCards.filter((card) => card.chapter === '函数').length, tone: 'blue' },
  { label: '三角函数', count: mathCards.filter((card) => card.chapter === '三角函数').length, tone: 'green' },
  { label: '数列', count: mathCards.filter((card) => card.chapter === '数列').length, tone: 'orange' },
] as const;
