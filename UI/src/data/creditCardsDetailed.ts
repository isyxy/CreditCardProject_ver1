// src/data/creditCardsDetailed.ts
// 詳細的信用卡回饋資料（從 credit-card-rewards-data.js 轉換）
import { CreditCard } from '../types';

// 定義沒有 id 和 isActive 的卡片型別（用於初始化）
export interface AvailableCreditCardDetailed {
  bankName: string;
  cardName: string;
  logo: any;
  cashback: {
    [category: string]: number;
  };
  notes?: {
    [category: string]: string;
  };
  limits?: {
    [category: string]: number;
  };
  generalNotes?: string[];

  // 詳細資訊
  cardType?: string;
  rewardType?: string;
  rewardValue?: number;
  baseRewards?: any;
  specialRewards?: any;
  maxRewardScenarios?: any;
  exclusions?: string[];
}

/**
 * 詳細的信用卡資料庫
 * 包含完整的回饋規則、限制條件和注意事項
 */
export const availableCreditCardsDetailed: AvailableCreditCardDetailed[] = [
  // ========================================
  // 中國信託 OPENPOINT 聯名卡
  // ========================================
  {
    bankName: '中國信託',
    cardName: 'OPENPOINT 聯名卡',
    logo: require('../../assets/banks/中信LOGO.png'),
    cardType: '聯名卡',
    rewardType: 'OPENPOINT',
    rewardValue: 1, // 1點 = NT$1

    // 簡化的回饋率（用於快速比較）
    cashback: {
      '餐飲': 3,        // 統一集團基礎 3%（可達 7%）
      '超商': 3,        // 統一集團基礎 3%（可達 7%）
      '購物': 3,        // 統一集團基礎 3%
      '海外消費': 3,    // 國外實體店
      '一般消費': 1,    // 國內一般消費
    },

    notes: {
      '餐飲': '統一集團品牌（星巴克等）基礎3%，踩點5品牌可達7%',
      '超商': '統一集團（7-11、康是美等）基礎3%，踩點5品牌可達7%',
      '購物': '統一集團（家樂福、Yahoo購物等）基礎3%',
      '海外消費': '國外實體店3%，指定國家可達11%',
    },

    limits: {
      '餐飲': 500,     // 統一集團加碼每月上限500點
      '超商': 500,     // 統一集團加碼每月上限500點
      '購物': 500,
    },

    generalNotes: [
      'OPENPOINT 1點 = NT$1',
      '統一集團最高7%：需每月登入APP領券 + 消費5個不同品牌',
      '國外實體店最高11%：指定國家（日韓泰越菲）',
      '統一集團加碼每月上限500點',
      '踩點任務每月上限500點',
    ],

    // 基礎回饋規則
    baseRewards: {
      domestic: {
        name: '國內一般消費',
        rate: 1,
        unit: '%',
        limit: null,
        limitType: null,
      },
      foreignOnline: {
        name: '國外一般消費',
        rate: 2,
        unit: '%',
        limit: null,
        limitType: null,
      },
      foreignInStore: {
        name: '國外實體商店消費',
        rate: 3,
        unit: '%',
        limit: null,
        limitType: null,
      },
    },

    // 特殊回饋規則
    specialRewards: {
      unified: {
        name: '統一企業集團消費',
        rate: 3,
        unit: '%',
        limit: 500,
        limitType: 'monthly',
        description: '基礎1% + 統一集團加碼2%',
        brands: [
          '統一超商', '康是美', '康是美網購eShop', '夢時代購物中心',
          '統一時代百貨', 'DREAM PLAZA', 'UNIKCY', '玲廊滿藝',
          'BEING sport', 'BEING spa', 'BEING fit', '星巴克',
          '21Plus', '21風味館', 'Mister Donut', 'COLD STONE',
          'Semeur聖娜', '家樂福', 'Mia C\'bon', 'Yahoo購物',
          '博客來', '聖德科斯', '統一生機', '統一精工速邁樂加油站',
          'foodomo', '鮮拾網', 'DUSKIN', '黑貓宅急便',
          'ibon售票系統', '統一渡假村', '台北W飯店', '台北時代寓所',
        ],
      },
      unifiedBrandBonus: {
        name: '統一企業集團踩點任務',
        rate: 4,
        unit: '%',
        limit: 500,
        limitType: 'monthly',
        description: '每月登入中信APP領券 + 消費不同品牌',
        conditions: [
          '每月登入中信銀行APP領優惠券',
          '消費2個品牌：+1%',
          '消費3個品牌：+2%',
          '消費4個品牌：+3%',
          '消費5個以上品牌：+4%',
        ],
      },
    },

    // 最高回饋情境
    maxRewardScenarios: {
      unified: {
        name: '統一企業集團最高回饋',
        totalRate: 7,
        breakdown: '1%(基礎) + 2%(統一加碼) + 4%(踩點5品牌)',
        conditions: [
          '每月登入中信APP領券',
          '消費5個以上不同統一集團品牌',
          '統一集團加碼每月上限500點',
          '踩點任務每月上限500點',
        ],
      },
      foreign: {
        name: '國外實體店最高回饋',
        totalRate: 11,
        breakdown: '3%(國外實體) + 8%(指定國家加碼)',
        countries: ['日本', '韓國', '泰國', '越南', '菲律賓'],
        limit: 500,
        limitType: 'monthly',
        conditions: [
          '每月登入中信APP領券',
          '於指定國家實體商店消費',
        ],
      },
    },

    // 排除項目
    exclusions: [
      '年費、利息、預借現金、違約金',
      '基金、賭博、數位貨幣',
      '學費、稅款、公用事業費',
      '儲值卡、儲值金',
      'eTag相關費用',
      '繳費平台交易',
    ],
  },

  // ========================================
  // 中國信託 LINE Pay 卡
  // ========================================
  {
    bankName: '中國信託',
    cardName: 'LINE Pay 卡',
    logo: require('../../assets/banks/中信LOGO.png'),
    cardType: '聯名卡',
    rewardType: 'LINE POINTS',
    rewardValue: 1, // 1點 = NT$1

    // 簡化的回饋率
    cashback: {
      '餐飲': 10,       // 日式品牌需JCB卡登錄
      '外送': 5,        // Uber Eats等需VISA登錄
      '網購': 5,        // 蝦皮等需VISA登錄
      '美妝': 7,        // 需登錄
      '旅遊': 10,       // 旅遊訂房
      '海外消費': 2.8,  // 國外實體店
      '一般消費': 1,    // 基礎消費
    },

    notes: {
      '餐飲': '日式品牌（壽司郎、摩斯等）需JCB卡登錄可達10%',
      '外送': '需VISA卡登錄，限量10,000名',
      '網購': '蝦皮等需VISA卡登錄或透過ShopBack',
      '美妝': '屈臣氏週五/雅詩蘭黛等品牌官網，需事先登錄',
      '旅遊': 'Hotels.com等訂房平台最高16%（需優惠代碼）',
      '海外消費': '國外實體店2.8%，美日韓泰可達5%',
    },

    limits: {
      '餐飲': 200,     // 日式品牌活動期間總上限200點
      '外送': 100,     // 每月上限100點
      '網購': 100,     // 每月上限100點
      '美妝': 150,     // 每月上限150點
      '旅遊': 1800,    // 單筆上限1800點
    },

    generalNotes: [
      'LINE POINTS 1點 = NT$1',
      '部分回饋需事先登錄',
      'VISA/JCB卡別回饋不同',
      'Hotels.com需輸入代碼CTBCLP16享16%',
      '實際回饋以銀行公告為準',
    ],

    // 基礎回饋規則
    baseRewards: {
      domestic: {
        name: '國內外一般消費',
        rate: 1,
        unit: '%',
        limit: null,
        limitType: null,
      },
      foreignInStore: {
        name: '國外實體商店消費',
        rate: 2.8,
        unit: '%',
        limit: null,
        limitType: null,
        breakdown: '一般1% + 國外實體加碼1.8%',
        conditions: [
          '須為面對面交易',
          '實體卡/Apple Pay/Google Pay/Samsung Pay',
          '不含網路交易、條碼支付、第三方支付',
        ],
        period: '2025/7/1-2025/12/31',
      },
    },

    // 特殊回饋規則
    specialRewards: {
      delivery: {
        name: '外送平台',
        rate: 5,
        unit: '%',
        limit: 100,
        limitType: 'monthly',
        description: 'Uber Eats/星巴克等，需VISA卡登錄',
        brands: ['Uber Eats', 'foodpanda', '星巴克'],
        conditions: ['VISA卡', '需事先登錄', '每月限量10,000名'],
      },
      japanese: {
        name: '日式餐飲/購物',
        rate: 10,
        unit: '%',
        limit: 200,
        limitType: 'activity',
        description: '壽司郎/摩斯/藏壽司/唐吉訶德/UNIQLO/GU/宜得利等，需JCB卡登錄',
        brands: [
          '壽司郎', '摩斯漢堡', '藏壽司', '客美多咖啡',
          '唐吉訶德', 'UNIQLO', 'GU', '宜得利', '台灣虎航',
        ],
        conditions: ['JCB卡', '需事先登錄', '每月限量5,000名'],
      },
      shopping: {
        name: '網購平台',
        rate: 5,
        unit: '%',
        limit: 100,
        limitType: 'monthly',
        description: '蝦皮等需VISA卡登錄；PChome等透過ShopBack 3%',
        brands: ['蝦皮購物', 'PChome 24h', 'Yahoo購物', 'pinkoi'],
        conditions: ['VISA卡需登錄或透過ShopBack'],
      },
      beauty: {
        name: '美妝保養',
        rate: 7,
        unit: '%',
        limit: 150,
        limitType: 'monthly',
        description: '屈臣氏週五/雅詩蘭黛等品牌官網6%',
        brands: ['屈臣氏', 'POYA寶雅', '雅詩蘭黛', 'LA MER', 'MAC', '資生堂'],
        conditions: ['屈臣氏限週五', '部分品牌限官網', 'LINE Pay支付'],
      },
      travel: {
        name: '旅遊訂房',
        rate: 10,
        unit: '%',
        limit: 1800,
        limitType: 'perTransaction',
        description: 'Hotels.com 16%(需代碼)/Klook 10%',
        brands: ['Hotels.com', 'Klook', '易遊網', 'KKday'],
        conditions: [
          'Hotels.com需輸入代碼CTBCLP16享16%',
          'Klook需輸入優惠代碼',
          '部分有每月名額限制',
        ],
      },
    },

    // 最高回饋情境
    maxRewardScenarios: {
      hotelBooking: {
        name: '訂房最高回饋',
        totalRate: 16,
        platform: 'Hotels.com',
        conditions: [
          '輸入優惠代碼CTBCLP16',
          '單筆回饋上限1,800點',
          '每月限額400組',
        ],
      },
      foreignJapanese: {
        name: '美日韓泰實體店',
        totalRate: 5,
        breakdown: '國外實體2.8% + 加碼2.2%',
        limit: 450,
        limitType: 'activity',
        countries: ['美國', '日本', '韓國', '泰國'],
        conditions: ['需登錄', '限量名額'],
        period: '2025/10/1-2025/12/31',
      },
    },

    // 排除項目
    exclusions: [
      '全聯福利中心',
      '便利商店(7-11/全家/萊爾富/OK)',
      '電信費用',
      '儲值卡、儲值金(含自動儲值)',
      'eTag儲值與智慧停車',
      '年費、利息、預借現金',
      '基金、虛擬貨幣',
      '學費、稅款、公用事業費',
      '繳費平台交易',
      '部分歐洲地區實體店消費',
    ],
  },

  // ========================================
  // 台新銀行 Richart卡
  // ========================================
  {
    bankName: '台新銀行',
    cardName: 'Richart卡',
    logo: require('../../assets/banks/台新LOGO.png'),
    cardType: '數位簽帳卡',
    rewardType: 'Richart點數',
    rewardValue: 0.3, // 1點 = NT$0.3（推算）

    // 簡化的回饋率（以天天刷方案為主）
    cashback: {
      '餐飲': 3.3,      // 天天刷/樂滿刷方案
      '超商': 3.3,      // 天天刷方案（需台新Pay）
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

    generalNotes: [
      '每日可切換一次方案',
      '同時只有一個方案享高回饋',
      '活動期間：2025/9/1-2025/12/31',
      '回饋無上限',
      '實際回饋以銀行公告為準',
    ],

    // 排除項目
    exclusions: [
      '代繳學費、稅款、停車費、罰單等公用事業費',
      '國內外投資理財商品申購及手續費',
      '銀行各項手續費及利息',
      '保險商品之費用',
      '儲值、繳費、稅費、紅利兌換',
      '公益捐款(含街口等第三方支付綁定信用卡之公益捐款)',
      '預借現金、以信用卡繳交之循環信用利息',
    ],
  },

  // ========================================
  // 玉山銀行 Unicard
  // ========================================
  {
    bankName: '玉山銀行',
    cardName: 'Unicard',
    logo: require('../../assets/banks/玉山LOGO.png'),
    cardType: '數位卡',
    rewardType: 'U POINT',
    rewardValue: 1, // 1點 = NT$1

    // 簡化的回饋率（以UP選方案為主）
    cashback: {
      '餐飲': 4.5,      // UP選百大特店 3.5% + 基礎 1%
      '超商': 4.5,      // UP選百大特店
      '網購': 4.5,      // UP選百大特店
      '百貨': 4.5,      // UP選百大特店
      '交通': 4.5,      // UP選百大特店
      '旅遊': 4.5,      // UP選百大特店
      '海外消費': 4.5,  // UP選百大特店
      '一般消費': 1,    // 基礎消費（帳單e化+自動扣繳）
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

    generalNotes: [
      'U POINT 1點 = NT$1',
      '每月最後一日的方案計算整月回饋',
      '需申辦帳單e化+自動扣繳享基礎1%',
      '消費上限：每月5,000點',
      '實際回饋以銀行公告為準',
    ],

    // 排除項目
    exclusions: [
      '預借現金、分期手續費、循環信用利息、年費、違約金',
      '基金、保險、投資型商品',
      '繳稅、學費、政府規費',
      '公共事業費用(水電瓦斯等)',
      '電信費、有線電視費、網路費',
      '儲值、購買禮券、票券',
      '銀行各項手續費',
    ],
  },

  // ========================================
  // 國泰世華 CUBE卡
  // ========================================
  {
    bankName: '國泰世華',
    cardName: 'CUBE卡',
    logo: require('../../assets/banks/國泰LOGO.png'),
    cardType: '數位卡',
    rewardType: '小樹點',
    rewardValue: 1, // 1點 = NT$1

    // 簡化的回饋率
    cashback: {
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

    generalNotes: [
      '小樹點 1點 = NT$1',
      '每日可切換一次權益方案',
      '無回饋上限',
      '活動期間：2025/7/1-2025/12/31',
      '以簽單特店名稱為準，非發票名稱',
      '實際回饋以銀行公告為準',
    ],

    // 排除項目
    exclusions: [
      '分期付款(自2024/2/1起僅享0.3%)',
      '百貨內店中櫃(UNIQLO、GU、ZARA等)',
      '機上免稅商品、貴賓室',
      '航空哩程兌換費用',
      '旅行社購買之航空機票',
      '設於百貨/飯店/商場內門市(部分優惠)',
      '大全聯',
      '嬰幼兒奶粉及藥品(童樂匯)',
    ],
  },
];

/**
 * 推薦演算法（與簡化版相同）
 */
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

/**
 * 商家類別映射（與簡化版相同）
 */
export const categoryMapping: { [key: string]: string[] } = {
  '咖啡廳': ['餐飲', '一般消費'],
  '餐廳': ['餐飲', '一般消費'],
  '超商': ['超商', '一般消費'],
  '速食': ['餐飲', '一般消費'],
  '購物': ['購物', '百貨', '網購', '一般消費'],
  '夜市': ['假日消費', '一般消費'],
  '其他': ['一般消費'],
};
