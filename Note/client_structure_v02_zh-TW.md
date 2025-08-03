# 客戶端結構文件

## 總覽
這是一個基於 React 的前端應用程式，使用 Vite 建置，具備以下功能：
- JWT 驗證流程
- 基於角色的路由保護
- Google OAuth 整合
- 使用 Tailwind CSS 的響應式 UI

## 檔案結構
```
client/
├── public/               # 靜態資源
│   └── vite.svg
├── src/                  # 應用程式原始碼
│   ├── assets/           # 靜態資源
│   ├── components/       # 可重複使用的 UI 元件
│   │   ├── AdminRoute.jsx
│   │   ├── Input.jsx
│   │   ├── MainLayout.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/          # 狀態管理
│   │   └── AuthContext.jsx
│   ├── hooks/            # 自定義鉤子 (Hooks)
│   │   └── useAuth.jsx
│   ├── pages/            # 路由頁面元件
│   │   ├── AdminPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── ForgotPasswordPage.jsx
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── RegisterPage.jsx
│   │   └── ResetPasswordPage.jsx
│   ├── services/         # API 服務
│   │   ├── authService.js
│   │   └── userService.js
│   ├── App.jsx           # 主要應用程式
│   ├── index.css         # 全域樣式
│   └── main.jsx          # 進入點
├── .gitignore            # 忽略的檔案
├── package.json          # 依賴套件
├── postcss.config.js     # PostCSS 設定
├── tailwind.config.js    # Tailwind 設定
└── vite.config.js        # Vite 設定
```

## 核心設定
### [`vite.config.js`](client/vite.config.js)
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
```

### `tailwind.config.js`
```javascript
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

## 驗證流程
### `AuthContext.jsx`
管理驗證狀態，包含：
- 將權杖 (Token) 持久化儲存在 localStorage
- 自動化的會話 (Session) 驗證
- 登入/登出方法
- 驗證狀態檢查

### `useAuth.jsx`
提供以下存取權限的自定義鉤子：
- 當前使用者資料
- 驗證狀態
- 登入/登出函式

## 路由系統
### `App.jsx`
```jsx
<Routes>
  <Route path="/" element={isAuthenticated ? <DashboardPage /> : <HomePage />} />
  <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} />
  <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
  <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
</Routes>
```

## API 服務
### `authService.js`
處理驗證相關操作：
- 登入/註冊
- 密碼重設
- 權杖驗證

### `userService.js`
管理使用者相關操作：
- 個人資料獲取
- 使用者資訊更新
- 管理員專屬操作

## 依賴套件
### `package.json`
```json
"dependencies": {
  "axios": "^1.10.0",
  "react": "^19.1.0",
  "react-dom": "^19.1.0",
  "react-router-dom": "^7.6.3",
  "@react-oauth/google": "^0.12.2"
},
"devDependencies": {
  "vite": "^7.0.0",
  "tailwindcss": "^4.1.11"
}
```

## 安全性功能
- 將 JWT 權杖儲存在 HttpOnly cookies 中
- 受保護的路由元件
- 管理員專屬的存取控制
- 環境變數管理 (VITE_GOOGLE_CLIENT_ID)