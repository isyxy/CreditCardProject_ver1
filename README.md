# 信用卡回饋資料庫 - 完整版

## 📚 資料庫概覽

已完整收錄 **13張信用卡** 的回饋規則：

### 中國信託系列
1. **OPENPOINT 聯名卡** - 統一集團最強
2. **LINE Pay 信用卡** - 日式餐飲購物優惠

### 台新銀行
3. **Richart 卡** - 7大方案彈性切換

### 玉山銀行
4. **Unicard** - 百大特店全包
5. **UBear 卡** - 串流訂閱專用

### 國泰世華
6. **CUBE 卡** - 數位生活首選

### 滙豐銀行
7. **Live+ 卡** - 餐飲購物娛樂無腦高回饋

### 永豐銀行
8. **DAWHO 卡** - 數位生活神卡
9. **DAWAY 卡** - 韓國消費之王
10. **SPORT 卡** - 健身族群專屬
11. **Green 卡** - 環保生活

### 富邦銀行
12. **J 卡** - 日韓泰旅遊必備

### 星展銀行
13. **eco永續卡** - 電動車主首選

---

## 🏆 回饋率排行榜

### Top 10 最高回饋
| 排名 | 卡片 | 回饋率 | 通路/條件 |
|------|------|--------|----------|
| 1 | 永豐 DAWAY | 22.5% | 韓國指定店家，單筆滿₩190,000 |
| 2 | 中信 OPENPOINT | 12% | 速邁樂加油站週四人工島 |
| 3 | 中信 OPENPOINT | 11% | 日韓泰越菲實體店 |
| 4 | 玉山 UBear | 10% | Netflix/Disney+/PS/Nintendo |
| 5 | 中信 LINE Pay | 10% | 壽司郎/摩斯/唐吉訶德/UNIQLO |
| 6 | 富邦 J | 10% | 日本Suica/PASMO/ICOCA儲值 |
| 7 | 星展 eco | 10% | Tesla充電/Gogoro電池 |
| 8 | 國泰 CUBE | 10% | 慶生月/童樂匯指定通路 |
| 9 | 中信 OPENPOINT | 7% | 統一企業集團（踩點5品牌） |
| 10 | 永豐 DAWHO | 7% | 數位生活（國外消費認列） |

### 無腦高回饋（無複雜條件）
| 卡片 | 回饋率 | 適用通路 |
|------|--------|----------|
| 滙豐 Live+ | 4.88% | 全球餐飲/購物/娛樂 |
| 玉山 Unicard (UP選) | 4.5% | 百大全部特店 |
| 台新 Richart (Pay著刷) | 3.8% | 台新Pay 11萬家通路 |

---

## 🎯 依消費情境推薦

### 網購族
```
推薦: 滙豐 Live+ (4.88%) / 玉山 Unicard (4.5%)
理由: 蝦皮、momo、PChome 都有高回饋
```

### 外食族
```
推薦: 滙豐 Live+ (4.88%) / 永豐 DAWHO (5-7%)
理由: 餐飲外送平台高回饋
```

### 日韓旅遊
```
推薦: 永豐 DAWAY (韓22.5%) / 富邦 J (日韓6%)
理由: 日韓實體店最高回饋
```

### 百貨購物
```
推薦: 滙豐 Live+ (4.88%) / 玉山 Unicard (4.5%)
理由: 百貨公司無上限高回饋
```

### 統一集團
```
推薦: 中信 OPENPOINT (7%)
理由: 統一集團專屬最高回饋
```

### 數位訂閱
```
推薦: 玉山 UBear (10%) / 永豐 DAWHO (7%)
理由: Netflix、Spotify等串流最優
```

### 超市採買
```
推薦: 永豐 Green (5%) / 玉山 Unicard (4.5%)
理由: 家樂福、全聯高回饋
```

### 加油
```
推薦: 中信 OPENPOINT (12%) / 中信 LINE Pay (5%)
理由: 速邁樂週四12%、NPC自助5%
```

---

## 📁 檔案結構

```
/mnt/user-data/outputs/
├── credit-card-rewards-data.js      # 完整資料庫（主檔案）
├── card-comparison-analysis.js      # 通路比較分析
├── card-database-summary.js         # 資料庫總覽
└── credit-card-calculator.jsx       # React試算器範例
```

---

## 💡 使用方式

### 方式1：直接查詢
```javascript
// Node.js
const cardData = require('./credit-card-rewards-data.js');
const openpointCard = cardData.cards.find(c => c.id === 'ctbc-openpoint');

// 瀏覽器
const linepayCard = creditCardRewardsData.cards.find(c => c.id === 'ctbc-linepay');
```

### 方式2：通路比較
```javascript
const comparison = require('./card-comparison-analysis.js');

// 查詢蝦皮購物的最佳卡片
const shopeeCards = comparison.merchantRewardsComparison['蝦皮購物'];
// 結果：滙豐 Live+ 4.88% / 玉山 Unicard 4.5% ...
```

### 方式3：情境推薦
```javascript
const summary = require('./card-database-summary.js');

// 查詢網購族推薦
const onlineShoppers = summary.byScenario['網購族'];
// 結果：['滙豐 Live+', '玉山 Unicard', '台新 Richart']
```

---

## ⚠️ 重要提醒

1. **回饋率隨時變動**
   - 本資料庫收錄時間：2025/11/23
   - 實際回饋以各銀行公告為準

2. **注意特殊條件**
   - 部分卡片需登錄（中信 LINE Pay、富邦 J）
   - 部分需等級資格（永豐 DAWHO、星展 eco）
   - 部分需綁定數位帳戶

3. **上限限制**
   - 留意每月/每季/每年回饋上限
   - 計算實際回饋時需考慮上限

4. **排除項目**
   - 每張卡都有排除項目
   - 超商、繳費、儲值等常見排除

---

## 🚀 接下來可以做的事

### 1. 建立試算工具
```javascript
// 輸入消費金額，計算各卡回饋
function calculateBestCard(spending) {
  // 根據 credit-card-rewards-data.js 計算
  // 回傳最佳卡片組合
}
```

### 2. 製作比較表格
```javascript
// 製作 HTML/React 比較表
// 可視覺化呈現各卡回饋差異
```

### 3. 個人化推薦
```javascript
// 根據使用者消費習慣
// 推薦最適合的卡片組合
```

---

## 📊 資料品質

- ✅ 所有13張卡已完整收錄
- ✅ 包含基礎回饋、特殊回饋、條件限制
- ✅ 標註活動期間、上限、排除項目
- ✅ 提供使用情境分類
- ✅ 建立通路比較分析

---

## 📞 更新維護

若有以下情況，請更新資料：
1. 銀行公告活動異動
2. 回饋率調整
3. 新增/停止合作通路
4. 上限金額變更

---

**資料庫已完成！可以開始建立試算工具了** 🎉
