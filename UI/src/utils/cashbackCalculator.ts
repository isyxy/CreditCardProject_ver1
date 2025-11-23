// src/utils/cashbackCalculator.ts
// 信用卡回饋計算工具

import { CreditCard } from '../types';
import { categoryMapping } from '../data/creditCards';

/**
 * 計算單張信用卡在特定商家類別的最佳回饋率
 */
export function calculateBestCashbackRate(
  card: CreditCard,
  merchantCategory: string
): {
  rate: number;
  matchedCategory: string;
  matchType: 'exact' | 'mapped' | 'general' | 'none';
} {
  let bestRate = 0;
  let matchedCategory = '';
  let matchType: 'exact' | 'mapped' | 'general' | 'none' = 'none';

  // 1. 首先嘗試精確匹配
  if (card.cashback[merchantCategory]) {
    return {
      rate: card.cashback[merchantCategory],
      matchedCategory: merchantCategory,
      matchType: 'exact',
    };
  }

  // 2. 使用 categoryMapping 進行對應
  const mappedCategories = categoryMapping[merchantCategory] || [];

  for (const category of mappedCategories) {
    if (card.cashback[category] && card.cashback[category] > bestRate) {
      bestRate = card.cashback[category];
      matchedCategory = category;
      matchType = 'mapped';
    }
  }

  // 3. 如果還是沒找到，使用一般消費或其他
  if (bestRate === 0) {
    if (card.cashback['一般消費']) {
      bestRate = card.cashback['一般消費'];
      matchedCategory = '一般消費';
      matchType = 'general';
    } else if (card.cashback['國內一般']) {
      bestRate = card.cashback['國內一般'];
      matchedCategory = '國內一般';
      matchType = 'general';
    } else if (card.cashback['其他']) {
      bestRate = card.cashback['其他'];
      matchedCategory = '其他';
      matchType = 'general';
    }
  }

  return {
    rate: bestRate,
    matchedCategory,
    matchType,
  };
}

/**
 * 計算實際回饋金額
 */
export function calculateCashbackAmount(
  amount: number,
  rate: number
): number {
  return Math.floor(amount * (rate / 100));
}

/**
 * 為所有卡片計算回饋並排序
 */
export function rankCardsByCategory(
  cards: CreditCard[],
  merchantCategory: string
): Array<CreditCard & {
  cashbackRate: number;
  matchedCategory: string;
  matchType: 'exact' | 'mapped' | 'general' | 'none';
  isRecommended: boolean;
  categoryNote?: string;      // 該類別的權益提醒
  categoryLimit?: number;      // 該類別的消費上限
}> {
  const activeCards = cards.filter((card) => card.isActive);

  if (activeCards.length === 0) {
    return [];
  }

  // 計算每張卡的回饋率
  const cardsWithScore = activeCards.map((card) => {
    const result = calculateBestCashbackRate(card, merchantCategory);

    // 取得對應類別的權益提醒和消費上限
    const categoryNote = card.notes?.[result.matchedCategory];
    const categoryLimit = card.limits?.[result.matchedCategory];

    return {
      ...card,
      cashbackRate: result.rate,
      matchedCategory: result.matchedCategory,
      matchType: result.matchType,
      isRecommended: false,
      categoryNote,
      categoryLimit,
    };
  });

  // 排序：回饋率從高到低
  const sorted = cardsWithScore.sort((a, b) => {
    if (b.cashbackRate !== a.cashbackRate) {
      return b.cashbackRate - a.cashbackRate;
    }
    // 回饋率相同時，優先推薦精確匹配
    const matchPriority = { exact: 3, mapped: 2, general: 1, none: 0 };
    return matchPriority[b.matchType] - matchPriority[a.matchType];
  });

  // 標記最佳推薦卡
  if (sorted.length > 0 && sorted[0].cashbackRate > 0) {
    sorted[0].isRecommended = true;
  }

  return sorted;
}

/**
 * 獲取信用卡的回饋摘要（前3高的類別）
 */
export function getCashbackSummary(cashback: { [key: string]: number }): string {
  const entries = Object.entries(cashback);

  if (entries.length === 0) {
    return '無回饋資訊';
  }

  const topThree = entries
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 3)
    .map(([category, rate]) => {
      // 特殊處理註解
      const cleanCategory = category.replace(/\s*\/\/.*$/, '').trim();
      return `${cleanCategory} ${rate}%`;
    })
    .join(' • ');

  return topThree;
}

/**
 * 格式化回饋率顯示
 */
export function formatCashbackRate(rate: number): string {
  if (rate === 0) {
    return '無回饋';
  }

  // 如果是整數，不顯示小數點
  if (Number.isInteger(rate)) {
    return `${rate}%`;
  }

  // 保留一位小數
  return `${rate.toFixed(1)}%`;
}
