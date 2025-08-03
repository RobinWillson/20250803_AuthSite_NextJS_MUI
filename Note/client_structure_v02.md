# Client Structure Documentation

## Overview
React-based frontend application built with Vite, featuring:
- JWT authentication flow
- Role-based route protection
- Google OAuth integration
- Responsive UI with Tailwind CSS

## File Structure
```
client/
├── public/               # Static assets
│   └── vite.svg
├── src/                  # Application source
│   ├── assets/           # Static assets
│   ├── components/       # Reusable UI components
│   │   ├── AdminRoute.jsx
│   │   ├── Input.jsx
│   │   ├── MainLayout.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/          # State management
│   │   └── AuthContext.jsx
│   ├── hooks/            # Custom hooks
│   │   └── useAuth.jsx
│   ├── pages/            # Route components
│   │   ├── AdminPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── ForgotPasswordPage.jsx
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── RegisterPage.jsx
│   │   └── ResetPasswordPage.jsx
│   ├── services/         # API services
│   │   ├── authService.js
│   │   └── userService.js
│   ├── App.jsx           # Main application
│   ├── index.css         # Global styles
│   └── main.jsx          # Entry point
├── .gitignore            # Ignored files
├── package.json          # Dependencies
├── postcss.config.js     # PostCSS config
├── tailwind.config.js    # Tailwind config
└── vite.config.js        # Vite config
```

## Core Configuration
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

### [`tailwind.config.js`](client/tailwind.config.js)
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

## Authentication Flow
### [`AuthContext.jsx`](client/src/context/AuthContext.jsx)
Manages authentication state with:
- Token persistence in localStorage
- Automatic session verification
- Login/logout methods
- Authentication status checks

### [`useAuth.jsx`](client/src/hooks/useAuth.jsx)
Custom hook providing access to:
- Current user data
- Authentication status
- Login/logout functions

## Routing System
### [`App.jsx`](client/src/App.jsx)
```jsx
<Routes>
  <Route path="/" element={isAuthenticated ? <DashboardPage /> : <HomePage />} />
  <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} />
  <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
  <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
</Routes>
```

## API Services
### [`authService.js`](client/src/services/authService.js)
Handles authentication operations:
- Login/registration
- Password reset
- Token verification

### [`userService.js`](client/src/services/userService.js)
Manages user-related operations:
- Profile data fetching
- User information updates
- Admin-specific operations

## Dependencies
### [`package.json`](client/package.json)
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

## Security Features
- JWT token storage in HttpOnly cookies
- Protected route components
- Admin-specific access control
- Environment variable management (VITE_GOOGLE_CLIENT_ID)