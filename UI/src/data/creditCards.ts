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

// 信用卡資料庫 - 根據最新回饋規則更新
export const availableCreditCards: AvailableCreditCard[] = [
  {
    bankName: '國泰世華',
    cardName: 'CUBE卡',
    logo: require('../../assets/banks/國泰LOGO.png'),
    cashback: {
      'AI工具': 3,
      '影音串流': 3,
      '網購': 3,
      '百貨': 3,
      '外送': 3,
      '餐廳': 3,
      '藥妝': 3,
      '超商': 3,
      '量販': 3,
      '加油': 3,
      '海外消費': 3,
      '交通': 3,
      '旅遊': 3,
      '其他': 0.3,
    },
  },
  {
    bankName: '玉山銀行',
    cardName: 'Pi拍錢包卡',
    logo: require('../../assets/banks/玉山LOGO.png'),
    cashback: {
      'Pi錢包指定通路': 5,
      '網購': 3,
      '保費': 1.2,
      '其他': 1,
    },
  },
  {
    bankName: '玉山銀行',
    cardName: 'Unicard',
    logo: require('../../assets/banks/玉山LOGO.png'),
    cashback: {
      '行動支付': 4.5,
      '網購': 4.5,
      '百貨': 4.5,
      '超商': 4.5,
      '餐廳': 4.5,
      '加油': 4.5,
      '旅遊': 4.5,
      '國外': 4.5,
      '其他': 1,
    },
  },
  {
    bankName: '永豐銀行',
    cardName: 'DAWHO卡',
    logo: require('../../assets/banks/永豐LOGO.png'),
    cashback: {
      '影音娛樂': 5,
      '外送': 5,
      '交通': 5,
      '旅遊': 5,
      '學習': 5,
      '生活': 5,
      'AI工具': 5,
      '國內消費': 1,
    },
  },
  {
    bankName: '匯豐銀行',
    cardName: '匯鑽卡',
    logo: require('../../assets/banks/匯豐LOGO.png'),
    cashback: {
      '行動支付': 6,
      '網購': 6,
      '外送': 6,
      '線上訂房': 6,
      '影音': 6,
      '遊戲': 6,
      '其他': 1,
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
  '咖啡廳': ['餐廳', 'Pi錢包指定通路', '其他'],
  '餐廳': ['餐廳', '外送', 'Pi錢包指定通路', '其他'],
  '超商': ['超商', 'Pi錢包指定通路', '行動支付', '其他'],
  '速食': ['餐廳', 'Pi錢包指定通路', '其他'],
  '購物': ['網購', '百貨', '行動支付', 'Pi錢包指定通路', '其他'],
  '夜市': ['國內消費', '其他'],
  '影音': ['影音串流', '影音', '影音娛樂', 'AI工具', '其他'],
  '外送': ['外送', '餐廳', '其他'],
  '旅遊': ['旅遊', '線上訂房', '海外消費', '國外', '其他'],
  '加油': ['加油', '交通', '其他'],
  '交通': ['交通', '行動支付', '其他'],
  '藥妝': ['藥妝', '百貨', '其他'],
  '量販': ['量販', '超商', 'Pi錢包指定通路', '其他'],
  '遊戲': ['遊戲', '影音娛樂', '其他'],
  '其他': ['其他', '國內消費'],
};