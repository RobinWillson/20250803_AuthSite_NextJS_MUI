/**
 * 這份腳本請在 Terminal 下執行
 * node server/test/mongodb_user_clear.js
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

// 由於使用 ES Modules，需要手動設定 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 載入位於 server 目錄根部的 .env 檔案
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// 建立 readline 介面用於使用者確認
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 要清除的集合名稱
const COLLECTION_TO_CLEAR = 'users';

async function main() {
  const uri = process.env.MONGODB_CONNECTION_STRING;
  if (!uri) {
    console.error('❌ MONGODB_CONNECTION_STRING not found in environment variables.');
    console.error('Ensure you have a .env file in the /server directory with MONGODB_CONNECTION_STRING defined.');
    process.exit(1);
  }

  // 安全確認提示
  console.warn(`\n🚨 警告：此腳本將永久刪除 "${COLLECTION_TO_CLEAR}" 集合中的所有文件。`);
  console.warn(`   此操作無法復原！`);
  console.warn(`   目標資料庫: ${uri.replace(/:([^:]+)@/, ':****@')}`); // 隱藏密碼

  rl.question(`\n> 您確定要繼續嗎？ (請輸入 'yes' 以確認): `, async (answer) => {
    if (answer.toLowerCase() !== 'yes') {
      console.log('\n操作已由使用者取消。');
      rl.close();
      process.exit(0);
    }

    console.log('\n正在連接到 MongoDB...');
    try {
      await mongoose.connect(uri);
      console.log('✅ 成功連接到 MongoDB。');

      const db = mongoose.connection.db;
      const collection = db.collection(COLLECTION_TO_CLEAR);

      console.log(`\n正在清除 "${COLLECTION_TO_CLEAR}" 集合中的所有文件...`);

      const deleteResult = await collection.deleteMany({});
      console.log(`✅ 操作完成！成功刪除 ${deleteResult.deletedCount} 份文件。`);

    } catch (error) {
      console.error('❌ 操作過程中發生錯誤:', error);
    } finally {
      await mongoose.disconnect();
      console.log('\n資料庫連線已關閉。');
      rl.close();
    }
  });
}

main();