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

// 信用卡資料庫
export const availableCreditCards: AvailableCreditCard[] = [
  {
    bankName: '中國信託',
    cardName: 'LINE Pay 卡',
    logo: require('../../assets/banks/中信LOGO.png'),
    cashback: {
      '全通路': 1,
      '指定通路': 3,
      'LINE Points': 5,
    },
  },
  {
    bankName: '中國信託',
    cardName: '全聯聯名卡',
    logo: require('../../assets/banks/中信LOGO.png'),
    cashback: {
      '全聯': 3,
      '其他': 0.5,
    },
  },
  {
    bankName: '台新銀行',
    cardName: '@GOGO卡',
    logo: require('../../assets/banks/台新LOGO.png'),
    cashback: {
      '影音串流': 3,
      '外送平台': 3,
      '網購': 1.5,
    },
  },
  {
    bankName: '台新銀行',
    cardName: 'FlyGo卡',
    logo: require('../../assets/banks/台新LOGO.png'),
    cashback: {
      '國內消費': 1.2,
      '國外消費': 3,
      '日韓': 3,
    },
  },
  {
    bankName: '國泰世華',
    cardName: 'CUBE卡',
    logo: require('../../assets/banks/國泰LOGO.png'),
    cashback: {
      '指定通路': 3,
      '國內': 0.5,
      '國外': 2,
    },
  },
  {
    bankName: '國泰世華',
    cardName: '現金回饋御璽卡',
    logo: require('../../assets/banks/國泰LOGO.png'),
    cashback: {
      '全通路': 1.5,
    },
  },
  {
    bankName: '玉山銀行',
    cardName: 'U Bear卡',
    logo: require('../../assets/banks/玉山LOGO.png'),
    cashback: {
      '超商': 3.8,
      '餐廳': 3.8,
      '加油': 3.8,
    },
  },
  {
    bankName: '玉山銀行',
    cardName: 'Pi拍錢包卡',
    logo: require('../../assets/banks/玉山LOGO.png'),
    cashback: {
      '超商': 5,
      'Pi錢包': 3,
      '其他': 1,
    },
  },
  {
    bankName: '永豐銀行',
    cardName: '大戶現金回饋卡',
    logo: require('../../assets/banks/永豐LOGO.png'),
    cashback: {
      '全通路': 1.5,
      '指定通路': 3,
    },
  },
  {
    bankName: '永豐銀行',
    cardName: 'JCB晶緻卡',
    logo: require('../../assets/banks/永豐LOGO.png'),
    cashback: {
      '日本': 5,
      '國外': 2,
      '國內': 0.5,
    },
  },
  {
    bankName: '匯豐銀行',
    cardName: '現金回饋御璽卡',
    logo: require('../../assets/banks/匯豐LOGO.png'),
    cashback: {
      '國外': 2.22,
      '國內': 1.22,
    },
  },
  {
    bankName: '匯豐銀行',
    cardName: '匯鑽卡',
    logo: require('../../assets/banks/匯豐LOGO.png'),
    cashback: {
      '精選通路': 6,
      '其他': 1,
    },
  },
  {
    bankName: '聯邦銀行',
    cardName: '吉鶴卡',
    logo: require('../../assets/banks/聯邦LOGO.png'),
    cashback: {
      '超商': 3,
      '量販': 3,
      '加油': 2,
    },
  },
  {
    bankName: '聯邦銀行',
    cardName: '賴點卡',
    logo: require('../../assets/banks/聯邦LOGO.png'),
    cashback: {
      '全通路': 2,
      'LINE Points': 2,
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
  '咖啡廳': ['咖啡', '餐廳', '指定通路'],
  '餐廳': ['餐廳', '指定通路', '全通路'],
  '超商': ['超商', '全通路'],
  '速食': ['餐廳', '指定通路'],
  '購物': ['網購', '百貨', '指定通路'],
  '夜市': ['全通路'],
  '其他': ['全通路'],
};