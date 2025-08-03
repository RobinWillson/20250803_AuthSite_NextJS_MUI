import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

// 由於使用 ES Modules，需要手動設定 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// 載入位於 server 目錄根部的 .env 檔案
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function main() {
  const uri = process.env.MONGODB_CONNECTION_STRING;
  if (!uri) {
    console.error('❌ MONGODB_CONNECTION_STRING not found in environment variables.');
    console.error('Ensure you have a .env file in the /server directory with MONGODB_CONNECTION_STRING defined.');
    process.exit(1);
  }

  console.log('Connecting to MongoDB...');
  try {
    await mongoose.connect(uri);
    console.log('✅ Successfully connected to MongoDB.');
    console.log('========================================');
    console.log('Fetching data from the database...');
    console.log('========================================\n');

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    if (collections.length === 0) {
      console.log('No collections found in the database.');
    }

    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      // 忽略 system collections
      if (collectionName.startsWith('system.')) continue;

      console.log(`\n--- Collection: ${collectionName} ---`);
      const collection = db.collection(collectionName);
      const documents = await collection.find({}).toArray();

      if (documents.length === 0) {
        console.log('  -> No documents in this collection.');
      } else {
        console.log(`  -> Found ${documents.length} document(s):`);
        // 使用 JSON.stringify 進行格式化輸出，可以將 ObjectId 等 BSON 類型轉換為可讀的字串
        console.log(JSON.stringify(documents, null, 2));
      }
    }

  } catch (error) {
    console.error('❌ Error during database operation:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Connection closed.');
  }
}

main();

