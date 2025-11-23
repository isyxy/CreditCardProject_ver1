// src/data/creditCards.ts
// 此檔案現在使用詳細的信用卡資料（從 credit-card-rewards-data.js 轉換）
import { CreditCard } from '../types';
import {
  availableCreditCardsDetailed,
  recommendCards as recommendCardsFunc,
  categoryMapping as categoryMap,
  AvailableCreditCardDetailed
} from './creditCardsDetailed';

// 定義沒有 id 和 isActive 的卡片型別
export interface AvailableCreditCard extends AvailableCreditCardDetailed {}

// 使用詳細資料（從 creditCardsDetailed.ts 導入）
export const availableCreditCards: AvailableCreditCard[] = availableCreditCardsDetailed;

// 推薦演算法（從 creditCardsDetailed.ts 重新導出）
export function recommendCards(category: string, userCards: CreditCard[]): CreditCard[] {
  return recommendCardsFunc(category, userCards);
}

// 商家類別映射（從 creditCardsDetailed.ts 重新導出）
export const categoryMapping: { [key: string]: string[] } = categoryMap;
