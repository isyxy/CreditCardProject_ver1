// src/types/index.ts

// 商家資料結構
export interface Merchant {
  id: string;
  name: string;
  distance: string;
  address: string;
  category: MerchantCategory; // 商家分類
  description?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// 商家分類
export enum MerchantCategory {
  COFFEE = '咖啡廳',
  RESTAURANT = '餐廳',
  CONVENIENCE = '超商',
  FAST_FOOD = '速食',
  SHOPPING = '購物',
  NIGHT_MARKET = '夜市',
  OTHER = '其他'
}

// 回饋規則詳細資訊
export interface RewardDetail {
  name: string;
  rate: number;
  unit: string;
  limit?: number | null;
  limitType?: 'monthly' | 'activity' | 'perTransaction' | null;
  description?: string;
  brands?: string[];
  conditions?: string[];
  period?: string;
  breakdown?: string;
}

// 基礎回饋規則
export interface BaseRewards {
  domestic?: RewardDetail;
  foreignOnline?: RewardDetail;
  foreignInStore?: RewardDetail;
  [key: string]: RewardDetail | undefined;
}

// 特殊回饋規則
export interface SpecialRewards {
  [category: string]: RewardDetail;
}

// 最高回饋情境
export interface MaxRewardScenario {
  name: string;
  totalRate: number;
  breakdown?: string;
  conditions?: string[];
  limit?: number;
  limitType?: string;
  countries?: string[];
  platform?: string;
  [key: string]: any;
}

// 信用卡資料結構 (從 CardContext 導出)
export interface CreditCard {
  id: string;
  bankName: string;
  cardName: string;
  logo: any;
  cashback: {
    [category: string]: number;
  };
  isActive: boolean;
  // 權益提醒和消費上限
  notes?: {
    [category: string]: string;
  };
  limits?: {
    [category: string]: number;
  };
  generalNotes?: string[];

  // === 新增：詳細回饋資訊 (可選) ===
  cardType?: string; // 卡片類型（聯名卡、簽帳卡等）
  rewardType?: string; // 回饋類型（OPENPOINT、LINE POINTS等）
  rewardValue?: number; // 點數價值（1點 = NT$X）
  baseRewards?: BaseRewards; // 基礎回饋規則
  specialRewards?: SpecialRewards; // 特殊回饋規則
  maxRewardScenarios?: {
    [key: string]: MaxRewardScenario;
  }; // 最高回饋情境
  exclusions?: string[]; // 排除項目
}

// 使用者位置介面
export interface UserLocation {
  lat: number;
  lng: number;
  accuracy?: number;
  timestamp?: number;
}

// Google Places API 回應介面
export interface PlaceResult {
  name: string;
  address: string;
  place_id: string;
  location: {
    lat: number;
    lng: number;
  };
  types?: string[];
  rating?: number;
  user_ratings_total?: number;
}

// 導航參數類型
export type RootStackParamList = {
  Home: undefined;
  CardManagement: undefined;
  Recommendation: { merchant: Merchant };
  Search: undefined;
  CameraScanner: undefined;
};