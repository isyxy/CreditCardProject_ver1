// import-credit-cards.js - 根據實際 MD 格式修正

const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

const MONGODB_URI = 'mongodb://localhost:27017/creditCardDB';

// ===== Schema 定義 =====
function getCreditCardModel() {
  if (mongoose.models.CreditCard) {
    return mongoose.models.CreditCard;
  }

  const CreditCardSchema = new mongoose.Schema({
    cardName: { type: String, required: true, unique: true },
    fileName: String,
    rawContent: { type: String, required: true },
    issuer: String,
    tags: [String],
    benefits: [{
      category: String,
      rewardRate: String,
      merchants: [String],
      conditions: [String],
      cap: String,
      period: String
    }],
    activityPeriod: {
      start: String,
      end: String,
      note: String
    },
    exclusions: [String],
    parsedData: mongoose.Schema.Types.Mixed,
    fileHash: String,
    sourceType: { type: String, default: 'markdown' },
    importedAt: { type: Date, default: Date.now },
    lastModified: Date
  }, { 
    timestamps: true,
    collection: 'creditCards' 
  });

  CreditCardSchema.index({ cardName: 1 });
  CreditCardSchema.index({ issuer: 1 });
  CreditCardSchema.index({ tags: 1 });

  return mongoose.model('CreditCard', CreditCardSchema);
}

// ===== 解析卡片名稱 - 支援所有格式 =====
function extractCardName(line) {
  const trimmed = line.trim();
  
  // 匹配 <<< 卡片名稱 >>> 格式（可能前面有 ### 或 **）
  const match = trimmed.match(/<<<\s*(.+?)\s*>>>/);
  if (match) {
    return match[1].trim();
  }
  
  return null;
}

// ===== 解析 Markdown 內容 =====
function parseMarkdownContent(mdContent) {
  const lines = mdContent.split('\n');
  const sections = [];
  let currentSection = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const cardName = extractCardName(line);
    
    if (cardName) {
      // 找到新的卡片標題
      if (currentSection) {
        sections.push(currentSection);
      }
      
      currentSection = {
        cardName: cardName,
        content: [],
        rawLines: [line]
      };
    } else if (currentSection) {
      // 累積當前卡片的內容
      currentSection.rawLines.push(line);
      const trimmed = line.trim();
      if (trimmed) {
        currentSection.content.push(trimmed);
      }
    }
  }
  
  // 加入最後一個 section
  if (currentSection) {
    sections.push(currentSection);
  }
  
  return sections;
}

// ===== 提取銀行 =====
function extractIssuer(cardName) {
  const bankMap = {
    '台新': ['台新', 'Richart'],
    '永豐': ['永豐', 'DAWHO', 'DAWAY'],
    '玉山': ['玉山', 'Pi', 'U Bear', 'Unicard', '熊本熊'],
    '國泰世華': ['國泰世華', 'CUBE'],
    '匯豐': ['匯豐', '滙豐', '匯鑽', 'Live+'],
    '聯邦': ['聯邦', 'LINE Bank', '吉鶴']
  };
  
  for (const [bank, keywords] of Object.entries(bankMap)) {
    if (keywords.some(k => cardName.includes(k))) {
      return bank;
    }
  }
  
  return '未知';
}

// ===== 提取標籤 =====
function extractTags(content) {
  const tags = new Set();
  const text = content.join(' ').toLowerCase();
  
  const tagMap = {
    '網購': ['momo', 'pchome', '蝦皮', '淘寶', '酷澎', '網購'],
    '影音': ['netflix', 'disney+', 'spotify', 'kkbox', 'youtube', '影音'],
    'AI工具': ['chatgpt', 'claude', 'gemini', 'cursor', 'notion'],
    '遊戲': ['steam', 'playstation', 'nintendo', 'xbox', '遊戲'],
    '超市': ['全聯', '家樂福', 'lopia', '超市'],
    '便利商店': ['7-eleven', '全家', 'lawson', '便利商店'],
    '餐廳': ['uber eats', 'foodpanda', '餐廳', '美食'],
    '百貨': ['sogo', '新光三越', '遠東', '微風', '百貨'],
    '交通': ['加油', '中油', 'uber', '高鐵', '交通'],
    '旅遊': ['kkday', 'klook', 'agoda', 'booking', '旅遊'],
    '日本': ['日本', '迪士尼', '環球影城', 'suica'],
    '藥妝': ['康是美', '屈臣氏', '藥妝'],
    '親子': ['親子', '童樂匯', '嬰幼童'],
    '行動支付': ['line pay', 'apple pay', 'google pay'],
    '保險': ['保費', '保險'],
    '生活': ['ikea', 'hola', 'uniqlo', 'daiso']
  };
  
  for (const [tag, keywords] of Object.entries(tagMap)) {
    if (keywords.some(k => text.includes(k))) {
      tags.add(tag);
    }
  }
  
  return Array.from(tags);
}

// ===== 簡化的回饋解析 =====
function parseBenefits(content) {
  const benefits = [];
  const exclusions = [];
  const lines = content.join('\n');
  
  // 提取活動期間
  const periodMatch = lines.match(/活動期間[：:]\s*(.+?)(?=\n|\*)/);
  const activityPeriod = periodMatch ? periodMatch[1].trim() : null;
  
  // 提取回饋類型
  const rewardMatch = lines.match(/回饋類型[：:]\s*(.+?)(?=\n|\*)/);
  const rewardType = rewardMatch ? rewardMatch[1].trim() : '';
  
  // 簡單提取：找所有包含「回饋」的行作為 benefit
  const benefitLines = lines.split('\n').filter(l => 
    l.includes('%') || l.includes('回饋') || l.includes('折')
  );
  
  if (benefitLines.length > 0) {
    benefits.push({
      category: '綜合回饋',
      rewardRate: rewardType,
      merchants: [],
      conditions: [],
      cap: '',
      period: activityPeriod || ''
    });
  }
  
  // 提取排除項目
  const exclusionMatch = lines.match(/排除項目[：:]([\s\S]*?)(?=\n\n|---|\*\*\*|$)/);
  if (exclusionMatch) {
    const exclusionText = exclusionMatch[1];
    const items = exclusionText.split('\n').filter(l => l.trim().startsWith('*'));
    items.forEach(item => {
      const clean = item.replace(/^\s*\*+\s*/, '').trim();
      if (clean) exclusions.push(clean);
    });
  }
  
  return {
    benefits,
    activityPeriod: activityPeriod ? { note: activityPeriod } : null,
    exclusions
  };
}

// ===== 匯入單一檔案 =====
async function importMarkdownFile(filePath) {
  try {
    const mdContent = await fs.readFile(filePath, 'utf-8');
    const fileName = path.basename(filePath);
    const sections = parseMarkdownContent(mdContent);
    const cards = [];
    
    console.log(`\n📄 ${fileName}`);
    console.log(`   找到 ${sections.length} 張卡片`);
    
    if (sections.length === 0) {
      console.log(`   ⚠️ 警告：未找到卡片標記`);
      return [];
    }
    
    for (const section of sections) {
      const cardName = section.cardName;
      const rawContent = section.rawLines.join('\n');
      const issuer = extractIssuer(cardName);
      const tags = extractTags(section.content);
      const benefitInfo = parseBenefits(section.content);
      
      cards.push({
        cardName: cardName,
        fileName: fileName,
        rawContent: rawContent,
        issuer: issuer,
        tags: tags,
        benefits: benefitInfo.benefits,
        activityPeriod: benefitInfo.activityPeriod,
        exclusions: benefitInfo.exclusions,
        parsedData: { content: section.content },
        fileHash: crypto.createHash('md5').update(mdContent).digest('hex'),
        lastModified: new Date()
      });
      
      console.log(`   ✅ ${cardName} (${issuer})`);
    }
    
    return cards;
    
  } catch (error) {
    console.error(`   ❌ 錯誤: ${error.message}`);
    return [];
  }
}

// ===== 主要匯入函數 =====
async function importAllCards(cardsFolder = './cards') {
  try {
    console.log('🔌 連接 MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ 已連接\n');
    
    const CreditCard = getCreditCardModel();
    
    const files = await fs.readdir(cardsFolder);
    const mdFiles = files.filter(f => f.endsWith('.md'));
    
    console.log(`📂 找到 ${mdFiles.length} 個檔案`);
    console.log('='.repeat(60));
    
    let totalImported = 0;
    
    for (const file of mdFiles) {
      const filePath = path.join(cardsFolder, file);
      const cards = await importMarkdownFile(filePath);
      
      for (const card of cards) {
        await CreditCard.findOneAndUpdate(
          { cardName: card.cardName },
          card,
          { upsert: true, new: true }
        );
        totalImported++;
      }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log(`🎉 完成！共匯入 ${totalImported} 張卡片`);
    
    const dbTotal = await CreditCard.countDocuments();
    console.log(`📊 資料庫現有 ${dbTotal} 張卡片\n`);
    
    await mongoose.connection.close();
    console.log('✅ 已關閉連線');
    
  } catch (error) {
    console.error('❌ 失敗:', error);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
}

// ===== 執行 =====
if (require.main === module) {
  const cardsFolder = process.argv[2] || './cards';
  
  console.log('\n🚀 開始匯入信用卡資料\n');
  
  importAllCards(cardsFolder)
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = {
  getCreditCardModel,
  importAllCards
};