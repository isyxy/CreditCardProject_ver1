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
  // 權益提醒和消費上限
  notes?: {
    [category: string]: string;  // 各類別的權益提醒
  };
  limits?: {
    [category: string]: number;  // 各類別的每月消費上限（點數）
  };
  generalNotes?: string[];  // 一般性提醒
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
    notes: {
      '餐飲': '統一集團品牌（星巴克等）可達7%',
      '超商': '統一集團（7-11、全家等）可達7%',
    },
    limits: {
      '餐飲': 500,     // 統一集團加碼每月上限500點
      '超商': 500,     // 統一集團加碼每月上限500點
    },
    generalNotes: ['每月登入中信APP領券享加碼', '踩點5個品牌享最高7%'],
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
    notes: {
      '餐飲': '日式品牌（壽司郎、摩斯等）需JCB卡登錄可達10%',
      '外送': '需VISA卡登錄，限量10,000名',
      '網購': '蝦皮等需VISA卡登錄或透過ShopBack',
      '美妝': '需事先登錄活動',
      '旅遊': 'Hotels.com等訂房平台最高16%',
    },
    limits: {
      '外送': 100,     // 每月上限100點
      '餐飲': 200,     // 日式品牌活動期間總上限200點
      '網購': 100,     // 每月上限100點
    },
    generalNotes: ['部分回饋需事先登錄', 'VISA/JCB卡別回饋不同'],
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
    notes: {
      '餐飲': '需切換：天天刷/樂滿刷方案',
      '超商': '需切換：天天刷方案（需綁定台新Pay）',
      '交通': '需切換：天天刷方案',
      '百貨': '需切換：大筆刷方案',
      '網購': '需切換：數趣刷方案',
      '海外消費': '需切換：玩旅刷方案',
      '旅遊': '需切換：玩旅刷方案',
    },
    generalNotes: ['每日可切換一次方案', '同時只有一個方案享高回饋', '活動期間：2025/9/1-2025/12/31'],
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
    notes: {
      '餐飲': '需選擇：UP選方案（百大特店）',
      '超商': '需選擇：UP選方案（百大特店）',
      '網購': '需選擇：UP選方案（百大特店）',
      '百貨': '需選擇：UP選方案（百大特店）',
      '交通': '需選擇：UP選方案（百大特店）',
      '旅遊': '需選擇：UP選方案（百大特店）',
      '海外消費': '需選擇：UP選方案（百大特店）',
    },
    limits: {
      '餐飲': 5000,    // UP選每月歸戶上限5000點
      '超商': 5000,
      '網購': 5000,
      '百貨': 5000,
      '交通': 5000,
      '旅遊': 5000,
      '海外消費': 5000,
    },
    generalNotes: ['每月最後一日的方案計算整月回饋', '需申辦帳單e化+自動扣繳享基礎1%', '消費上限：每月5,000點'],
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
    notes: {
      '餐飲': '需切換：樂饗購方案',
      '百貨': '需切換：樂饗購方案',
      '外送': '需切換：樂饗購方案',
      '網購': '需切換：玩數位方案',
      '超商': '需切換：好食券方案',
      '交通': '需切換：趣旅行方案',
      '旅遊': '需切換：趣旅行方案',
      '海外消費': '需切換：趣旅行方案',
    },
    generalNotes: ['每日可切換一次權益方案', '無回饋上限', '活動期間：2025/7/1-2025/12/31'],
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