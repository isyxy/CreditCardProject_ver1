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
export const availableCreditCards: AvailableCreditCard[] = [
  {
    bankName: '中國信託',
    cardName: 'OPENPOINT 聯名卡',
    logo: require('../../assets/banks/中信LOGO.png'),
    cashback: {
      '統一企業集團': 7,  // 最高1% + 2% + 4%(踩點5品牌)
      '國外實體店': 3,
      '國外網購': 2,
      '國內一般': 1,
    },
  },
  {
    bankName: '中國信託',
    cardName: 'LINE Pay 卡',
    logo: require('../../assets/banks/中信LOGO.png'),
    cashback: {
      '訂房': 16,  // Hotels.com最高
      '日式餐飲購物': 10,  // JCB卡登錄
      '美妝保養': 7,
      '外送平台': 5,
      '網購': 5,
      '生活百貨': 5,
      '旅遊': 10,
      '加油': 5,
      '國外實體': 2.8,
      '一般消費': 1,
    },
  },
  {
    bankName: '台新銀行',
    cardName: 'Richart卡',
    logo: require('../../assets/banks/台新LOGO.png'),
    cashback: {
      '台新Pay': 3.8,
      '網購': 3.3,
      '線上課程': 3.3,
      '時尚品牌': 3.3,
      '海外消費': 3.3,
      '旅遊訂房': 3.3,
      '航空': 3.3,
      '超商': 3.3,
      '交通': 3.3,
      '百貨': 3.3,
      'Outlet': 3.3,
      '居家': 3.3,
      '餐飲': 3.3,
      '外送': 3.3,
      '加油': 3.3,
      '樂園': 3.3,
      '假日消費': 2,
      '其他': 0.3,
    },
  },
  {
    bankName: '玉山銀行',
    cardName: 'Unicard',
    logo: require('../../assets/banks/玉山LOGO.png'),
    cashback: {
      '行動支付': 4.5,  // UP選最高
      '電商平台': 4.5,
      '百貨': 4.5,
      '生活採買': 4.5,
      '餐飲': 4.5,
      '加油': 4.5,
      '旅遊': 4.5,
      '航空': 4.5,
      '國外': 4.5,
      '3C家電': 4.5,
      '其他': 1,
    },
  },
  {
    bankName: '國泰世華',
    cardName: 'CUBE卡',
    logo: require('../../assets/banks/國泰LOGO.png'),
    cashback: {
      'AI工具': 3,
      '數位串流': 3,
      '網購': 3,
      '國際電商': 3,
      '百貨': 3,
      '外送': 3,
      '餐飲': 3,
      '藥妝': 3,
      '海外消費': 3,
      '日本樂園': 3,
      '交通': 3,
      '航空': 3,
      '旅遊訂房': 3,
      '旅行社': 3,
      '量販超市': 2,
      '超商': 2,
      '加油': 2,
      '生活家居': 2,
      'LINE Pay': 2,
      '其他': 0.3,
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

export const categoryMapping: { [key: string]: string[] } = {
  '咖啡廳': ['餐飲', '台新Pay', '統一企業集團', '日式餐飲購物', '生活採買', '國內一般', '一般消費', '其他'],
  '餐廳': ['餐飲', '日式餐飲購物', '台新Pay', '統一企業集團', '國內一般', '一般消費', '其他'],
  '超商': ['超商', '台新Pay', '統一企業集團', '行動支付', '生活採買', '國內一般', '一般消費', '其他'],
  '速食': ['餐飲', '台新Pay', '統一企業集團', '國內一般', '一般消費', '其他'],
  '購物': ['網購', '電商平台', '百貨', '行動支付', '台新Pay', '生活百貨', '生活採買', '國內一般', '一般消費', '其他'],
  '夜市': ['假日消費', '國內一般', '一般消費', '其他'],
  '影音': ['數位串流', 'AI工具', '國際電商', '網購', '國內一般', '一般消費', '其他'],
  '外送': ['外送', '外送平台', '餐飲', '國內一般', '一般消費', '其他'],
  '旅遊': ['旅遊訂房', '訂房', '旅遊', '旅行社', '航空', '海外消費', '國外實體', '國外', '其他'],
  '加油': ['加油', '交通', '台新Pay', '國內一般', '一般消費', '其他'],
  '交通': ['交通', '航空', '行動支付', '台新Pay', '國內一般', '一般消費', '其他'],
  '藥妝': ['藥妝', '美妝保養', '百貨', '生活百貨', '生活採買', '國內一般', '一般消費', '其他'],
  '量販': ['量販超市', '超商', '統一企業集團', '生活採買', '台新Pay', '國內一般', '一般消費', '其他'],
  '遊戲': ['數位串流', '國際電商', '網購', '國內一般', '一般消費', '其他'],
  '便利商店': ['超商', '統一企業集團', '台新Pay', '行動支付', '國內一般', '一般消費', '其他'],
  '百貨': ['百貨', '台新Pay', 'Outlet', '生活採買', '國內一般', '一般消費', '其他'],
  '網購': ['網購', '電商平台', '國際電商', '生活百貨', '行動支付', '國內一般', '一般消費', '其他'],
  '其他': ['假日消費', '國內一般', '一般消費', '其他'],
};