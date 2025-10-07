// ===== 步驟一：測試 MongoDB 連線 =====

const mongoose = require('mongoose');

// 測試連線函數
async function testConnection() {

  // 方式 A: 本地 MongoDB（預設）
  const localUri = 'mongodb://localhost:27017/creditCardDB';
  
  
  try {
    console.log('🔄 正在連接 MongoDB...');
    await mongoose.connect(localUri);
    console.log('✅ MongoDB 連線成功！');
    console.log('📍 連接位址:', mongoose.connection.host);
    console.log('📂 資料庫名稱:', mongoose.connection.name);
    
    // 測試寫入
    const testData = {
      test: 'Hello MongoDB',
      timestamp: new Date()
    };
    
    const TestModel = mongoose.model('Test', new mongoose.Schema({
      test: String,
      timestamp: Date
    }));
    
    await TestModel.create(testData);
    console.log('✅ 測試資料寫入成功！');
    
    // 測試讀取
    const result = await TestModel.findOne({ test: 'Hello MongoDB' });
    console.log('✅ 測試資料讀取成功！', result);
    
    // 清理測試資料
    await TestModel.deleteMany({});
    console.log('✅ 測試資料已清理');
    
    await mongoose.connection.close();
    console.log('✅ 連線已關閉');
    
    return true;
    
  } catch (error) {
    console.error('❌ 連線失敗:', error.message);
    console.error('\n💡 可能的原因：');
    console.error('1. MongoDB 服務未啟動');
    console.error('2. 連線字串錯誤');
    console.error('3. 防火牆阻擋連線');
    console.error('4. 帳號密碼錯誤（如果有設定的話）');
    return false;
  }
}

// ===== 統一的 Schema 定義（避免重複） =====

function getCreditCardModel() {
  // 檢查 Model 是否已經存在
  if (mongoose.models.CreditCard) {
    return mongoose.models.CreditCard;
  }
  
  // 定義 Schema
  const CreditCardSchema = new mongoose.Schema({
    cardName: { type: String, required: true, unique: true },
    fileName: String,
    rawContent: { type: String, required: true },
    parsedData: mongoose.Schema.Types.Mixed,
    issuer: String,
    tags: [String],
    fileHash: String,
    sourceType: {
      type: String,
      enum: ['markdown', 'json', 'manual'],
      default: 'markdown'
    },
    importedAt: { type: Date, default: Date.now },
    lastModified: Date
  }, { 
    timestamps: true,
    collection: 'creditCards' 
  });
  
  // 建立索引
  CreditCardSchema.index({ cardName: 1 });
  CreditCardSchema.index({ issuer: 1 });
  CreditCardSchema.index({ tags: 1 });
  
  return mongoose.model('CreditCard', CreditCardSchema);
}

// ===== 步驟二：建立信用卡資料庫結構 =====

async function setupDatabase() {
  const uri = 'mongodb://localhost:27017/creditCardDB';
  
  try {
    await mongoose.connect(uri);
    console.log('✅ 已連接到 MongoDB');
    
    const CreditCard = getCreditCardModel();
    
    console.log('✅ Schema 已建立');
    console.log('✅ 索引已建立');
    
    // 檢查現有資料
    const count = await CreditCard.countDocuments();
    console.log(`📊 目前資料庫中有 ${count} 張信用卡`);
    
    if (count > 0) {
      const cards = await CreditCard.find({}).select('cardName issuer');
      console.log('\n現有卡片：');
      cards.forEach(card => {
        console.log(`  - ${card.cardName} (${card.issuer || '未知銀行'})`);
      });
    }
    
    await mongoose.connection.close();
    console.log('\n✅ 資料庫設定完成！');
    
  } catch (error) {
    console.error('❌ 設定失敗:', error.message);
    throw error;
  }
}

// ===== 步驟三：插入第一筆測試資料 =====

async function insertTestCard() {
  const uri = 'mongodb://localhost:27017/creditCardDB';
  
  try {
    await mongoose.connect(uri);
    console.log('✅ 已連接到 MongoDB');
    
    const CreditCard = getCreditCardModel();
    
    // 測試資料
    const testCard = {
      cardName: '測試信用卡',
      fileName: 'test.md',
      rawContent: '### 測試信用卡\n\n這是一張測試用的信用卡',
      parsedData: {
        description: '測試用卡片',
        features: ['測試功能1', '測試功能2']
      },
      issuer: '測試銀行',
      tags: ['測試'],
      sourceType: 'manual'
    };
    
    // 插入資料（如果已存在則更新）
    const result = await CreditCard.findOneAndUpdate(
      { cardName: testCard.cardName },
      testCard,
      { upsert: true, new: true }
    );
    
    console.log('✅ 測試卡片已儲存');
    console.log('卡片資訊:', {
      id: result._id,
      cardName: result.cardName,
      issuer: result.issuer,
      tags: result.tags,
      createdAt: result.createdAt
    });
    
    // 讀取驗證
    const saved = await CreditCard.findOne({ cardName: '測試信用卡' });
    console.log('\n✅ 從資料庫讀取成功！');
    console.log('原始內容:', saved.rawContent);
    
    await mongoose.connection.close();
    console.log('\n✅ 測試完成！資料庫已準備好！');
    
  } catch (error) {
    console.error('❌ 插入失敗:', error.message);
    throw error;
  }
}

// ===== 步驟四：檢視資料庫內容 =====

async function viewDatabase() {
  const uri = 'mongodb://localhost:27017/creditCardDB';
  
  try {
    await mongoose.connect(uri);
    
    const CreditCard = getCreditCardModel();
    
    const count = await CreditCard.countDocuments();
    console.log(`\n📊 資料庫統計`);
    console.log(`總共有 ${count} 張信用卡\n`);
    
    if (count > 0) {
      const cards = await CreditCard.find({});
      
      console.log('📋 卡片清單：\n');
      cards.forEach((card, index) => {
        console.log(`${index + 1}. ${card.cardName}`);
        console.log(`   銀行: ${card.issuer || '未知'}`);
        console.log(`   標籤: ${card.tags?.join(', ') || '無'}`);
        console.log(`   建立時間: ${card.createdAt}`);
        console.log('');
      });
      
      // 依銀行分組統計
      const byIssuer = await CreditCard.aggregate([
        { $group: { _id: '$issuer', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);
      
      console.log('🏦 各銀行卡片數量：');
      byIssuer.forEach(item => {
        console.log(`   ${item._id || '未知'}: ${item.count} 張`);
      });
      
      // 依標籤統計
      const allTags = await CreditCard.aggregate([
        { $unwind: '$tags' },
        { $group: { _id: '$tags', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);
      
      console.log('\n🏷️  熱門標籤：');
      allTags.forEach(item => {
        console.log(`   ${item._id}: ${item.count} 張卡片`);
      });
    }
    
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('❌ 查詢失敗:', error.message);
  }
}

// ===== 主程式：依序執行所有步驟 =====

async function setupStep() {
  console.log('🚀 開始建立 MongoDB 資料庫...\n');
  console.log('='.repeat(50));
  
  // 步驟一：測試連線
  console.log('\n📍 步驟一：測試 MongoDB 連線');
  console.log('-'.repeat(50));
  const connected = await testConnection();
  
  if (!connected) {
    console.log('\n❌ 請先確認 MongoDB 已啟動，然後重新執行此程式');
    return;
  }
  
  // 步驟二：建立資料庫結構
  console.log('\n📍 步驟二：建立資料庫結構');
  console.log('-'.repeat(50));
  await setupDatabase();
  
  // 步驟三：插入測試資料
  console.log('\n📍 步驟三：插入測試資料');
  console.log('-'.repeat(50));
  await insertTestCard();
  
  // 步驟四：檢視資料庫
  console.log('\n📍 步驟四：檢視資料庫內容');
  console.log('-'.repeat(50));
  await viewDatabase();
  
  console.log('\n' + '='.repeat(50));
  console.log('🎉 資料庫建立完成！');
  console.log('\n下一步：');
  console.log('1. 準備您的 MD 檔案');
  console.log('2. 執行匯入程式');
  console.log('3. 開始使用資料庫！');
}

// ===== 執行 =====

if (require.main === module) {
  setupStep()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('\n❌ 發生錯誤:', err);
      process.exit(1);
    });
}

module.exports = {
  testConnection,
  setupDatabase,
  insertTestCard,
  viewDatabase
};