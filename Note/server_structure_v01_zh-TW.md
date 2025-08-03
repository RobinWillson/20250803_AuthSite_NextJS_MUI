# 伺服器結構與功能分析

## 總覽
此伺服器是一個基於 Express 的驗證服務，具備以下功能：
- 使用者驗證（註冊、登入、登出）
- Google OAuth 2.0 整合
- 基於 JWT (JSON Web Token) 的權杖驗證機制
- 使用 MongoDB 儲存資料
- 提供 RESTful API 端點

## 檔案結構
```
server/
├── .env
├── index.js
├── package-lock.json
├── package.json
└── src/
    ├── controllers/
    │   ├── authController.js
    │   └── userController.js
    ├── middleware/
    │   ├── adminMiddleware.js
    │   └── authMiddleware.js
    ├── models/
    │   └── User.js
    ├── routes/
    │   ├── authRoutes.js
    │   └── userRoutes.js
    └── utils/
        ├── db.js
        ├── passport.js
        └── tokenUtils.js
```

## 核心功能

### 1. 核心設定 ([`index.js`](server/index.js))
- 使用 `dotenv` 初始化環境變數
- 設定 Express 中介軟體 (middleware)：
  ```javascript
  app.use(cors());
  app.use(express.json());
  app.use(passport.initialize());
  ```
- 設定路由處理器：
  ```javascript
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  ```
- 資料庫連線與伺服器啟動：
  ```javascript
  const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 伺服器正在 ${PORT} 埠口運行`);
    });
  };
  ```

### 2. 環境變數設定 ([`.env`](server/.env))
```env
# MongoDB 連線
MONGODB_CONNECTION_STRING=mongodb+srv://user:pass@cluster0.fteh7.mongodb.net/AuthBasic

# 伺服器設定
PORT=5000

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret

# JWT 設定
JWT_SECRET=your-jwt-secret
SESSION_SECRET=your-session-secret
```

### 3. 驗證系統
- **Passport 設定** (`passport.js`):
  ```javascript
  const GoogleStrategy = require('passport-google-oauth20').Strategy;
  
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback'
  }, (accessToken, refreshToken, profile, done) => {
    // 處理使用者驗證
  }));
  ```
  
- **JWT 權杖處理** (`tokenUtils.js`):
  ```javascript
  const jwt = require('jsonwebtoken');
  
  const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: '30d', // 權杖有效期為 30 天
    });
  };
  ```

### 4. 資料模型 (`User.js`)
```javascript
const userSchema = new mongoose.Schema({
  name: { type: String, required: true }, // 姓名
  email: { type: String, required: true, unique: true }, // 電子郵件 (唯一)
  password: { type: String }, // 密碼 (Google 登入的使用者可能沒有)
  isAdmin: { type: Boolean, default: false }, // 是否為管理員
  googleId: { type: String }, // Google 使用者 ID
}, { timestamps: true }); // 自動新增 createdAt 和 updatedAt 時間戳
```

### 5. 路由處理器
- **驗證路由** (`authRoutes.js`):
  ```javascript
  router.post('/register', authController.register); // 註冊
  router.post('/login', authController.login); // 登入
  router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] })); // Google 登入
  router.get('/google/callback', authController.googleAuth); // Google 登入回呼
  ```
  
- **使用者管理路由** (`userRoutes.js`):
  ```javascript
  router.get('/profile', authMiddleware, userController.getProfile); // 取得個人資料
  router.put('/profile', authMiddleware, userController.updateProfile); // 更新個人資料
  ```

### 6. 中介軟體 (Middleware)
- **驗證中介軟體** (`authMiddleware.js`):
  ```javascript
  const jwt = require('jsonwebtoken');
  
  const protect = async (req, res, next) => {
    let token;
    // 檢查請求標頭中是否包含 Bearer Token
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // 驗證權杖
      // 從資料庫中找出使用者，並附加到請求物件上
      req.user = await User.findById(decoded.id).select('-password');
    }
    next(); // 繼續下一個處理
  };
  ```

## 依賴套件 (來自 `package.json`)
```json
{
  "dependencies": {
    "bcrypt": "^6.0.0", // 密碼加密
    "cors": "^2.8.5", // 處理跨來源資源共用
    "dotenv": "^16.5.0", // 管理環境變數
    "express": "^5.1.0", // Web 框架
    "express-async-handler": "^1.2.0", // 簡化非同步錯誤處理
    "jsonwebtoken": "^9.0.2", // 產生與驗證 JWT
    "mongoose": "^8.16.0", // MongoDB 物件模型工具
    "passport": "^0.7.0", // 驗證中介軟體
    "passport-google-oauth20": "^2.0.0", // Google OAuth 策略
    "validator": "^13.15.15" // 資料驗證工具
  }
}
```

## 安全性功能
1. 使用 bcrypt 進行密碼雜湊
2. JWT 權杖驗證
3. 保護環境變數
4. CORS 設定
5. 安全的 Google OAuth 2.0 驗證流程

## 啟動方式
```bash
npm start
```