// src/data/creditCards.ts
import { CreditCard } from '../types';

// 定義沒有 id 和 isActive 的卡片型別
export interface AvailableCreditCard {
  bankName: string;
  cardName: string;
  logo: any;
  cashback: {
    [category: string]: number;
  };
}

// 信用卡資料庫 - 根據 credit-card-rewards-data.js 更新
// 注意：回饋率已簡化為 APP 支援的基本類別，移除品牌特定回饋
export const availableCreditCards: AvailableCreditCard[] = [
  {
    bankName: '中國信託',
    cardName: 'OPENPOINT 聯名卡',
    logo: require('../../assets/banks/中信LOGO.png'),
    cashback: {
      '餐飲': 1,        // 基礎國內消費 (星巴克等統一集團可達7%，但需APP識別)
      '超商': 1,        // 基礎國內消費 (7-11/全家等統一集團可達7%，但需APP識別)
      '購物': 1,        // 基礎國內消費
      '海外消費': 3,    // 國外實體店
      '一般消費': 1,    // 國內一般消費
    },
  },
  {
    bankName: '中國信託',
    cardName: 'LINE Pay 卡',
    logo: require('../../assets/banks/中信LOGO.png'),
    cashback: {
      '餐飲': 1,        // 基礎消費 (日式品牌需JCB卡登錄可達10%)
      '外送': 5,        // Uber Eats等需VISA登錄
      '網購': 5,        // 蝦皮等需VISA登錄或ShopBack
      '美妝': 7,        // 需登錄
      '旅遊': 10,       // 旅遊訂房
      '海外消費': 2.8,  // 國外實體店
      '一般消費': 1,    // 基礎消費
    },
  },
  {
    bankName: '台新銀行',
    cardName: 'Richart卡',
    logo: require('../../assets/banks/台新LOGO.png'),
    cashback: {
      // 切換刷機制：以下為各方案回饋，實際一次只能選一個方案
      '餐飲': 3.3,      // 天天刷/樂滿刷方案
      '超商': 3.3,      // 天天刷方案 (需台新Pay)
      '交通': 3.3,      // 天天刷方案
      '百貨': 3.3,      // 大筆刷方案
      '網購': 3.3,      // 數趣刷方案
      '海外消費': 3.3,  // 玩旅刷方案
      '旅遊': 3.3,      // 玩旅刷方案
      '假日消費': 2,    // 假日限定
      '一般消費': 0.3,  // 未選方案或非指定消費
    },
  },
  {
    bankName: '玉山銀行',
    cardName: 'Unicard',
    logo: require('../../assets/banks/玉山LOGO.png'),
    cashback: {
      // UP選方案：百大特店3.5% + 基礎1% = 4.5%
      '餐飲': 4.5,      // UP選百大特店
      '超商': 4.5,      // UP選百大特店
      '網購': 4.5,      // UP選百大特店
      '百貨': 4.5,      // UP選百大特店
      '交通': 4.5,      // UP選百大特店
      '旅遊': 4.5,      // UP選百大特店
      '海外消費': 4.5,  // UP選百大特店
      '一般消費': 1,    // 基礎消費 (帳單e化+自動扣繳)
    },
  },
  {
    bankName: '國泰世華',
    cardName: 'CUBE卡',
    logo: require('../../assets/banks/國泰LOGO.png'),
    cashback: {
      // 每日可切換方案：假設用戶會切換到最優方案
      '餐飲': 3,        // 樂饗購方案
      '百貨': 3,        // 樂饗購方案
      '外送': 3,        // 樂饗購方案
      '網購': 3,        // 玩數位方案
      '超商': 2,        // 好食券方案
      '交通': 3,        // 趣旅行方案
      '旅遊': 3,        // 趣旅行方案
      '海外消費': 3,    // 趣旅行方案
      '一般消費': 0.3,  // 基礎消費
    },
  },
];

// 推薦演算法
export function recommendCards(category: string, userCards: CreditCard[]): CreditCard[] {
  const activeCards = userCards.filter((card) => card.isActive);
  
  const cardsWithScore = activeCards.map((card) => {
    let score = 0;
    
    if (card.cashback[category]) {
      score = card.cashback[category];
    } else if (card.cashback['全通路']) {
      score = card.cashback['全通路'];
    } else if (card.cashback['其他']) {
      score = card.cashback['其他'];
    }
    
    return { ...card, score };
  });
  
  return cardsWithScore
    .sort((a, b) => b.score - a.score)
    .filter((card) => card.score > 0);
}

// 商家類別映射 - 將 APP 的商家類別映射到信用卡回饋類別
// 移除品牌特定映射，只保留通用類別映射
export const categoryMapping: { [key: string]: string[] } = {
  '咖啡廳': ['餐飲', '一般消費'],
  '餐廳': ['餐飲', '一般消費'],
  '超商': ['超商', '一般消費'],
  '速食': ['餐飲', '一般消費'],
  '購物': ['購物', '百貨', '網購', '一般消費'],
  '夜市': ['假日消費', '一般消費'],
  '其他': ['一般消費'],
};