# Server Structure and Functionality Analysis

## Overview
The server is an Express-based authentication service with the following features:
- User authentication (registration, login, logout)
- Google OAuth 2.0 integration
- JWT token-based authentication
- MongoDB data storage
- RESTful API endpoints

## File Structure
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

## Key Functionality

### 1. Core Configuration ([`index.js`](server/index.js))
- Initializes environment variables with `dotenv`
- Configures Express middleware:
  ```javascript
  app.use(cors());
  app.use(express.json());
  app.use(passport.initialize());
  ```
- Sets up route handlers:
  ```javascript
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  ```
- Database connection and server startup:
  ```javascript
  const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  };
  ```

### 2. Environment Configuration ([`.env`](server/.env))
```env
# MongoDB Connection
MONGODB_CONNECTION_STRING=mongodb+srv://user:pass@cluster0.fteh7.mongodb.net/AuthBasic

# Server Configuration
PORT=5000

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret

# JWT Configuration
JWT_SECRET=your-jwt-secret
SESSION_SECRET=your-session-secret
```

### 3. Authentication System
- **Passport Configuration** ([`passport.js`](server/src/utils/passport.js)):
  ```javascript
  const GoogleStrategy = require('passport-google-oauth20').Strategy;
  
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback'
  }, (accessToken, refreshToken, profile, done) => {
    // Handle user authentication
  }));
  ```
  
- **JWT Token Handling** ([`tokenUtils.js`](server/src/utils/tokenUtils.js)):
  ```javascript
  const jwt = require('jsonwebtoken');
  
  const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });
  };
  ```

### 4. Data Models ([`User.js`](server/src/models/User.js))
```javascript
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  isAdmin: { type: Boolean, default: false },
  googleId: { type: String },
}, { timestamps: true });
```

### 5. Route Handlers
- **Authentication Routes** ([`authRoutes.js`](server/src/routes/authRoutes.js)):
  ```javascript
  router.post('/register', authController.register);
  router.post('/login', authController.login);
  router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
  router.get('/google/callback', authController.googleAuth);
  ```
  
- **User Management Routes** ([`userRoutes.js`](server/src/routes/userRoutes.js)):
  ```javascript
  router.get('/profile', authMiddleware, userController.getProfile);
  router.put('/profile', authMiddleware, userController.updateProfile);
  ```

### 6. Middleware
- **Authentication Middleware** ([`authMiddleware.js`](server/src/middleware/authMiddleware.js)):
  ```javascript
  const jwt = require('jsonwebtoken');
  
  const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    }
    next();
  };
  ```

## Dependencies (from [`package.json`](server/package.json))
```json
{
  "dependencies": {
    "bcrypt": "^6.0.0",
    "cors": "^2.8.5",
    "dotenv": "^16.5.0",
    "express": "^5.1.0",
    "express-async-handler": "^1.2.0",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.16.0",
    "passport": "^0.7.0",
    "passport-google-oauth20": "^2.0.0",
    "validator": "^13.15.15"
  }
}
```

## Security Features
1. Password hashing with bcrypt
2. JWT token authentication
3. Environment variable protection
4. CORS configuration
5. Google OAuth 2.0 secure authentication flow

## Startup
```bash
npm install
npm start