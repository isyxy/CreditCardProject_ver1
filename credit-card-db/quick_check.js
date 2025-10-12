const mongoose = require('mongoose');

async function check() {
  await mongoose.connect('mongodb://localhost:27017/creditCardDB');
  const db = mongoose.connection.db;
  const card = await db.collection('creditCards').findOne({cardName:'滙豐匯鑽卡'});
  
  console.log('卡名:', card.cardName);
  console.log('回饋項目數:', card.benefits?.length || 0);
  
  if (card.benefits) {
    card.benefits.forEach((b, i) => {
      console.log(`\n[${i+1}] ${b.category}`);
      console.log('  回饋率:', b.rewardRate);
      console.log('  商家:', b.merchants?.slice(0, 3));
      console.log('  上限:', b.cap);
    });
  }
  
  await mongoose.connection.close();
}

check();