import dotenv from 'dotenv';
dotenv.config(); // 必須在最頂部初始化環境變數

import express from 'express';
import cors from 'cors';
import passport from 'passport';
import configurePassport from './src/utils/passport.js';
import authRoutes from './src/routes/authRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import connectDB from './src/utils/db.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Configure passport after environment variables are loaded
configurePassport(passport);

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// 根路由 - 服務狀態檢查
app.get('/', (req, res) => {
  res.send('Authentication service is running');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// 異步連接數據庫並啟動服務器
const startServer = async () => {
  try {
    await connectDB(); // Call the connection function from db.js

    // 啟動Express服務器
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Server failed to start:', error.message);
    process.exit(1); // 退出進程
  }
};

// 啟動服務
startServer();