/**
 * 信用卡資料庫總覽
 * 統計所有已收錄的卡片資訊
 */

const cardDatabase Summary = {
  totalCards: 13,
  lastUpdated: "2025-11-23",
  
  cards: [
    {
      id: "ctbc-openpoint",
      name: "中國信託 OPENPOINT 聯名卡",
      highlights: ["速邁樂週四12%", "統一集團最高7%", "日韓泰越菲11%"],
      bestFor: ["統一集團消費", "週四加油"]
    },
    {
      id: "ctbc-linepay",
      name: "中國信託 LINE Pay 信用卡",
      highlights: ["日式10%", "屈臣氏週五7%", "NPC加油5%"],
      bestFor: ["日式餐飲", "藥妝購物"]
    },
    {
      id: "taishin-richart",
      name: "台新 Richart 卡",
      highlights: ["台新Pay 3.8%", "7大方案切換", "無上限"],
      bestFor: ["台新Pay用戶", "彈性需求"]
    },
    {
      id: "esun-unicard",
      name: "玉山 Unicard",
      highlights: ["UP選4.5%", "百大特店", "月底方案計算"],
      bestFor: ["百大特店消費", "高消費族群"]
    },
    {
      id: "cathay-cube",
      name: "國泰世華 CUBE 卡",
      highlights: ["每日切換", "無上限", "慶生月10%"],
      bestFor: ["數位生活", "百貨旅遊"]
    },
    {
      id: "hsbc-live-plus",
      name: "滙豐 Live+ 卡",
      highlights: ["餐飲購物娛樂4.88%", "亞洲餐飲5.88%", "無複雜條件"],
      bestFor: ["餐飲族", "百貨購物"]
    },
    {
      id: "sinopac-dawho",
      name: "永豐 DAWHO 卡",
      highlights: ["數位生活7%", "生活娛樂6%", "外送5%"],
      bestFor: ["數位訂閱", "大戶用戶"]
    },
    {
      id: "sinopac-daway",
      name: "永豐 DAWAY 卡",
      highlights: ["韓國最高22.5%", "單筆滿₩190,000再+10%"],
      bestFor: ["韓國旅遊"]
    },
    {
      id: "sinopac-sport",
      name: "永豐 SPORT 卡",
      highlights: ["健身6%", "APP達標+1%"],
      bestFor: ["健身族群"]
    },
    {
      id: "sinopac-green",
      name: "永豐 Green 卡",
      highlights: ["綠色生活5%", "超市量販", "影城"],
      bestFor: ["環保生活", "超市採買"]
    },
    {
      id: "fubon-j",
      name: "富邦 J 卡",
      highlights: ["日本交通卡10%", "日韓泰實體6%"],
      bestFor: ["日韓泰旅遊"]
    },
    {
      id: "dbs-eco",
      name: "星展 eco永續卡",
      highlights: ["永續品牌10%", "海外最高9.8%", "Tesla/Gogoro"],
      bestFor: ["永續環保", "電動車主"]
    },
    {
      id: "esun-ubear",
      name: "玉山 UBear 卡",
      highlights: ["串流10%", "網購3%"],
      bestFor: ["串流訂閱", "網購族"]
    }
  ],
  
  // 按回饋率排行
  topRewards: {
    "最高回饋": [
      { card: "永豐 DAWAY", rate: "22.5%", condition: "韓國單筆滿₩190,000" },
      { card: "中信 OPENPOINT", rate: "12%", condition: "速邁樂週四人工島" },
      { card: "中信 OPENPOINT", rate: "11%", condition: "日韓泰越菲實體店" },
      { card: "玉山 UBear", rate: "10%", condition: "Netflix/Disney+串流" },
      { card: "中信 LINE Pay", rate: "10%", condition: "日式餐飲購物(JCB)" },
      { card: "富邦 J", rate: "10%", condition: "日本交通卡儲值" },
      { card: "星展 eco", rate: "10%", condition: "Tesla/Gogoro永續品牌" }
    ],
    
    "無腦高回饋": [
      { card: "滙豐 Live+", rate: "4.88%", condition: "全球餐飲購物娛樂" },
      { card: "玉山 Unicard", rate: "4.5%", condition: "UP選百大特店" },
      { card: "台新 Richart", rate: "3.8%", condition: "台新Pay通路" }
    ]
  },
  
  // 按使用情境分類
  byScenario: {
    "網購族": ["滙豐 Live+", "玉山 Unicard", "台新 Richart"],
    "外食族": ["滙豐 Live+", "永豐 DAWHO", "中信 LINE Pay"],
    "日韓旅遊": ["永豐 DAWAY", "富邦 J", "中信 OPENPOINT"],
    "百貨購物": ["滙豐 Live+", "玉山 Unicard", "國泰 CUBE"],
    "統一集團": ["中信 OPENPOINT"],
    "數位訂閱": ["玉山 UBear", "永豐 DAWHO", "國泰 CUBE"],
    "超市採買": ["永豐 Green", "玉山 Unicard", "國泰 CUBE"],
    "加油": ["中信 OPENPOINT", "中信 LINE Pay", "台新 Richart"],
    "健身運動": ["永豐 SPORT"],
    "永續環保": ["星展 eco"]
  },
  
  // 回饋類型分類
  byRewardType: {
    "現金回饋": [
      "滙豐 Live+", "永豐 DAWHO", "永豐 DAWAY", 
      "永豐 SPORT", "永豐 Green", "星展 eco", "玉山 UBear"
    ],
    "點數回饋": [
      "中信 OPENPOINT", "中信 LINE Pay", "台新 Richart",
      "玉山 Unicard", "國泰 CUBE"
    ],
    "雙回饋": [
      "富邦 J" // J Cash或LINE POINTS
    ]
  },
  
  // 特殊條件需求
  specialRequirements: {
    "需登錄": [
      "中信 LINE Pay", "富邦 J", "永豐 DAWAY", "中信 OPENPOINT"
    ],
    "需等級/資產": [
      "永豐 DAWHO", "星展 eco"
    ],
    "需APP使用": [
      "中信 OPENPOINT", "永豐 SPORT", "台新 Richart"
    ],
    "需綁定數位帳戶": [
      "台新 Richart", "永豐 DAWHO", "玉山 Unicard", "國泰 CUBE"
    ],
    "需自動扣繳": [
      "玉山 Unicard", "永豐系列", "滙豐 Live+"
    ]
  },
  
  // 建議卡片組合
  recommendedCombos: [
    {
      profile: "全方位消費者",
      cards: ["滙豐 Live+", "玉山 Unicard", "中信 OPENPOINT"],
      reason: "涵蓋餐飲(4.88%)、百貨(4.5%)、統一集團(7%)"
    },
    {
      profile: "日韓旅遊愛好者",
      cards: ["永豐 DAWAY", "富邦 J", "中信 OPENPOINT"],
      reason: "韓國最高22.5%、日本交通10%、日韓泰實體11%"
    },
    {
      profile: "數位生活族",
      cards: ["玉山 UBear", "永豐 DAWHO", "國泰 CUBE"],
      reason: "串流10%、數位服務7%、數位通路3%"
    },
    {
      profile: "統一集團愛用者",
      cards: ["中信 OPENPOINT", "台新 Richart"],
      reason: "統一集團7%、超商3.3%"
    },
    {
      profile: "百貨購物族",
      cards: ["滙豐 Live+", "玉山 Unicard", "台新 Richart"],
      reason: "百貨4.88-4.5%、無需複雜條件"
    }
  ],
  
  // 資料完整度
  dataCompleteness: {
    complete: 13,
    partial: 0,
    pending: 0
  },
  
  notes: [
    "所有卡片資料已完整收錄",
    "回饋率以官網公告為準",
    "部分優惠有時間限制",
    "建議依個人消費習慣選卡"
  ]
};

// 匯出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = cardDatabaseSummary;
}

if (typeof window !== 'undefined') {
  window.cardDatabaseSummary = cardDatabaseSummary;
}
