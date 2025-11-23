/**
 * 信用卡通路回饋比較分析
 * 根據不同消費通路，列出各卡的回饋率
 */

const merchantRewardsComparison = {
  // ========================================
  // 網購平台
  // ========================================
  "蝦皮購物": [
    { card: "滙豐 Live+", rate: 4.88, conditions: "無上限" },
    { card: "玉山 Unicard", rate: 4.5, conditions: "UP選，上限NT$111,111" },
    { card: "玉山 UBear", rate: 3, conditions: "網購，上限NT$7,500" },
    { card: "台新 Richart", rate: 3.3, conditions: "數趣刷，上限NT$300,000" },
    { card: "國泰 CUBE", rate: 3, conditions: "玩數位" }
  ],
  
  "momo購物網": [
    { card: "滙豐 Live+", rate: 4.88, conditions: "無上限" },
    { card: "玉山 Unicard", rate: 4.5, conditions: "UP選，上限NT$111,111" },
    { card: "玉山 UBear", rate: 3, conditions: "網購，上限NT$7,500" },
    { card: "台新 Richart", rate: 3.3, conditions: "數趣刷，上限NT$300,000" },
    { card: "國泰 CUBE", rate: 3, conditions: "玩數位" }
  ],
  
  "PChome 24h": [
    { card: "滙豐 Live+", rate: 4.88, conditions: "無上限" },
    { card: "玉山 UBear", rate: 3, conditions: "網購，上限NT$7,500" },
    { card: "台新 Richart", rate: 3.3, conditions: "數趣刷，上限NT$300,000" },
    { card: "國泰 CUBE", rate: 3, conditions: "玩數位" }
  ],
  
  // ========================================
  // 外送平台
  // ========================================
  "Uber Eats": [
    { card: "永豐 DAWHO", rate: 5, conditions: "大戶+扣繳+e化，上限NT$6,000" },
    { card: "中信 LINE Pay", rate: 5, conditions: "VISA卡登錄，上限NT$2,000" },
    { card: "台新 Richart", rate: 3.3, conditions: "好饗刷，上限NT$300,000" },
    { card: "國泰 CUBE", rate: 3, conditions: "樂饗購" },
    { card: "玉山 Unicard", rate: 4.5, conditions: "UP選，上限NT$111,111" }
  ],
  
  "foodpanda": [
    { card: "永豐 DAWHO", rate: 5, conditions: "大戶+扣繳+e化，上限NT$6,000" },
    { card: "台新 Richart", rate: 3.3, conditions: "好饗刷，上限NT$300,000" },
    { card: "國泰 CUBE", rate: 3, conditions: "樂饗購" },
    { card: "玉山 Unicard", rate: 4.5, conditions: "UP選，上限NT$111,111" },
    { card: "玉山 UBear", rate: 3, conditions: "網購，上限NT$7,500" }
  ],
  
  // ========================================
  // 超商
  // ========================================
  "7-11": [
    { card: "國泰 CUBE", rate: 2, conditions: "集精選" },
    { card: "台新 Richart", rate: 3.3, conditions: "天天刷(需台新Pay)，上限NT$300,000" }
  ],
  
  "全家": [
    { card: "國泰 CUBE", rate: 2, conditions: "集精選" },
    { card: "台新 Richart", rate: 3.3, conditions: "天天刷(需台新Pay)，上限NT$300,000" }
  ],
  
  // ========================================
  // 百貨公司
  // ========================================
  "新光三越": [
    { card: "滙豐 Live+", rate: 4.88, conditions: "無上限" },
    { card: "玉山 Unicard", rate: 4.5, conditions: "UP選，上限NT$111,111" },
    { card: "台新 Richart", rate: 3.3, conditions: "大筆刷，上限NT$300,000" },
    { card: "國泰 CUBE", rate: 3, conditions: "樂饗購" }
  ],
  
  "遠東SOGO": [
    { card: "滙豐 Live+", rate: 4.88, conditions: "無上限" },
    { card: "台新 Richart", rate: 3.3, conditions: "大筆刷，上限NT$300,000" },
    { card: "國泰 CUBE", rate: 3, conditions: "樂饗購" }
  ],
  
  // ========================================
  // 超市量販
  // ========================================
  "家樂福": [
    { card: "永豐 Green", rate: 5, conditions: "e化+扣繳，上限NT$7,500" },
    { card: "中信 LINE Pay", rate: 5, conditions: "VISA卡登錄，上限NT$2,000" },
    { card: "玉山 Unicard", rate: 4.5, conditions: "UP選，上限NT$111,111" },
    { card: "台新 Richart", rate: 3.3, conditions: "天天刷，上限NT$300,000" },
    { card: "國泰 CUBE", rate: 2, conditions: "集精選" }
  ],
  
  "全聯": [
    { card: "國泰 CUBE", rate: 2, conditions: "集精選" }
  ],
  
  // ========================================
  // 加油
  // ========================================
  "中油直營": [
    { card: "中信 OPENPOINT", rate: 12, conditions: "週四人工島+實體卡，上限NT$12,500" },
    { card: "中信 LINE Pay", rate: 5, conditions: "自助加油" },
    { card: "台新 Richart", rate: 3.3, conditions: "好饗刷，上限NT$300,000" },
    { card: "國泰 CUBE", rate: 2, conditions: "集精選" },
    { card: "玉山 Unicard", rate: 4.5, conditions: "UP選，上限NT$111,111" }
  ],
  
  // ========================================
  // 串流平台
  // ========================================
  "Netflix": [
    { card: "玉山 UBear", rate: 10, conditions: "原平台付款，上限NT$1,000" },
    { card: "永豐 DAWHO", rate: 7, conditions: "大戶+扣繳+e化(國外)，上限NT$6,000" },
    { card: "國泰 CUBE", rate: 3, conditions: "玩數位" }
  ],
  
  "Spotify": [
    { card: "永豐 DAWHO", rate: 7, conditions: "大戶+扣繳+e化(國外)，上限NT$6,000" },
    { card: "國泰 CUBE", rate: 3, conditions: "玩數位" }
  ],
  
  "Disney+": [
    { card: "玉山 UBear", rate: 10, conditions: "原平台付款，上限NT$1,000" },
    { card: "永豐 DAWHO", rate: 7, conditions: "大戶+扣繳+e化(國外)，上限NT$6,000" },
    { card: "國泰 CUBE", rate: 3, conditions: "玩數位" }
  ],
  
  // ========================================
  // 旅遊訂房
  // ========================================
  "Klook": [
    { card: "永豐 DAWHO", rate: 7, conditions: "大戶+扣繳+e化，上限NT$6,000" },
    { card: "台新 Richart", rate: 3.3, conditions: "玩旅刷，上限NT$300,000" },
    { card: "國泰 CUBE", rate: 3, conditions: "趣旅行" },
    { card: "玉山 Unicard", rate: 4.5, conditions: "UP選，上限NT$111,111" }
  ],
  
  "Agoda": [
    { card: "永豐 DAWHO", rate: 7, conditions: "大戶+扣繳+e化，上限NT$6,000" },
    { card: "台新 Richart", rate: 3.3, conditions: "玩旅刷，上限NT$300,000" },
    { card: "國泰 CUBE", rate: 3, conditions: "趣旅行" },
    { card: "玉山 Unicard", rate: 4.5, conditions: "UP選，上限NT$111,111" }
  ],
  
  // ========================================
  // 航空公司
  // ========================================
  "中華航空": [
    { card: "台新 Richart", rate: 3.3, conditions: "玩旅刷，上限NT$300,000" },
    { card: "國泰 CUBE", rate: 3, conditions: "趣旅行" },
    { card: "玉山 Unicard", rate: 4.5, conditions: "UP選，上限NT$111,111" }
  ],
  
  "長榮航空": [
    { card: "台新 Richart", rate: 3.3, conditions: "玩旅刷，上限NT$300,000" },
    { card: "國泰 CUBE", rate: 3, conditions: "趣旅行" },
    { card: "玉山 Unicard", rate: 4.5, conditions: "UP選，上限NT$111,111" }
  ],
  
  // ========================================
  // 海外消費
  // ========================================
  "日本實體店": [
    { card: "星展 eco", rate: 9.8, conditions: "豐盛客戶，上限NT$37,500+21,053" },
    { card: "中信 OPENPOINT", rate: 11, conditions: "指定國家+登入APP，上限NT$500/月" },
    { card: "富邦 J", rate: 6, conditions: "登錄限量，上限NT$33,333/季" },
    { card: "滙豐 Live+", rate: 5.88, conditions: "餐飲，上限NT$20,000" },
    { card: "中信 LINE Pay", rate: 5, conditions: "登錄限量，上限NT$20,455(活動期間)" }
  ],
  
  "韓國實體店": [
    { card: "永豐 DAWAY", rate: 22.5, conditions: "單筆滿₩190,000，上限NT$20,000" },
    { card: "中信 OPENPOINT", rate: 11, conditions: "指定國家+登入APP，上限NT$500/月" },
    { card: "富邦 J", rate: 6, conditions: "登錄限量，上限NT$33,333/季" },
    { card: "中信 LINE Pay", rate: 5, conditions: "登錄限量，上限NT$20,455(活動期間)" }
  ],
  
  // ========================================
  // 行動支付
  // ========================================
  "LINE Pay": [
    { card: "玉山 Unicard", rate: 4.5, conditions: "UP選，上限NT$111,111" },
    { card: "玉山 UBear", rate: 3, conditions: "網購，上限NT$7,500" },
    { card: "永豐 DAWAY", rate: 2, conditions: "設定扣繳，上限NT$20,000" },
    { card: "國泰 CUBE", rate: 2, conditions: "來支付(需綁國際行動支付)" }
  ],
  
  // ========================================
  // 特殊通路
  // ========================================
  "統一企業集團": [
    { card: "中信 OPENPOINT", rate: 7, conditions: "基礎3% + 踩點5品牌4%，各上限500點/月" }
  ],
  
  "健身房": [
    { card: "永豐 SPORT", rate: 6, conditions: "上限NT$5,000" }
  ],
  
  "Tesla充電": [
    { card: "星展 eco", rate: 10, conditions: "綁APP繳費，上限NT$3,409" },
    { card: "永豐 DAWHO", rate: 7, conditions: "大戶+扣繳+e化，上限NT$6,000" }
  ],
  
  "日本交通卡": [
    { card: "富邦 J", rate: 10, conditions: "Apple Pay儲值，單筆滿NT$2,000，上限NT$2,857" }
  ]
};

// ========================================
// 通路分類索引
// ========================================
const categoryIndex = {
  "網購": ["蝦皮購物", "momo購物網", "PChome 24h", "淘寶", "博客來"],
  "外送": ["Uber Eats", "foodpanda"],
  "超商": ["7-11", "全家", "萊爾富", "OK"],
  "百貨": ["新光三越", "遠東SOGO", "微風", "台北101"],
  "超市": ["家樂福", "全聯", "愛買", "大潤發"],
  "加油": ["中油", "台亞", "全國加油"],
  "串流": ["Netflix", "Spotify", "Disney+", "YouTube Premium"],
  "旅遊": ["Klook", "Agoda", "Hotels.com", "KKday"],
  "航空": ["中華航空", "長榮航空", "星宇", "虎航"],
  "海外": ["日本", "韓國", "泰國", "歐美"],
  "行動支付": ["LINE Pay", "街口支付", "全支付", "悠遊付"]
};

// ========================================
// 最佳回饋卡推薦（依消費習慣）
// ========================================
const bestCardsByProfile = {
  "網購族": {
    推薦: ["滙豐 Live+", "玉山 Unicard (UP選)"],
    原因: "網購平台4.88%-4.5%高回饋"
  },
  
  "外食族": {
    推薦: ["永豐 DAWHO", "滙豐 Live+"],
    原因: "餐飲外送5%-4.88%高回饋"
  },
  
  "日韓旅遊愛好者": {
    推薦: ["永豐 DAWAY(韓)", "富邦 J(日韓)", "中信 OPENPOINT"],
    原因: "日韓實體店最高22.5%回饋"
  },
  
  "百貨購物族": {
    推薦: ["滙豐 Live+", "玉山 Unicard (UP選)"],
    原因: "百貨公司4.88%-4.5%回饋"
  },
  
  "統一集團愛用者": {
    推薦: ["中信 OPENPOINT"],
    原因: "統一集團最高7%回饋"
  },
  
  "數位訂閱族": {
    推薦: ["玉山 UBear", "永豐 DAWHO"],
    原因: "Netflix/Disney+等10%-7%回饋"
  },
  
  "超市採買族": {
    推薦: ["永豐 Green", "玉山 Unicard"],
    原因: "超市量販5%-4.5%回饋"
  },
  
  "通勤族": {
    推薦: ["台新 Richart", "國泰 CUBE"],
    原因: "交通加油3.3%-3%回饋"
  }
};

// 匯出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    merchantRewardsComparison,
    categoryIndex,
    bestCardsByProfile
  };
}

if (typeof window !== 'undefined') {
  window.merchantRewardsComparison = merchantRewardsComparison;
  window.categoryIndex = categoryIndex;
  window.bestCardsByProfile = bestCardsByProfile;
}
