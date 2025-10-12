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