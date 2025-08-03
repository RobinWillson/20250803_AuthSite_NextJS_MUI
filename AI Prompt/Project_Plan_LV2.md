# Membership Website with Authentication System - Project Plan

## 1. Project Structure
```plaintext
20250625_AUTHSITE_KODU/
├── client/    # React frontend (Not started)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   ├── hooks/
│   │   └── utils/
├── server/    # Node.js backend (Authentication complete)
│   ├── src/
│   │   ├── controllers/
│   │   │   └── authController.js
│   │   ├── middleware/
│   │   │   └── authMiddleware.js
│   │   ├── models/
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   └── authRoutes.js
│   │   └── utils/
│   │       ├── passport.js
│   │       └── tokenUtils.js
│   ├── .env      # Environment variables (local)
│   ├── index.js  # Main server entry point
│   └── package.json
```
## 2. Component Breakdown

### Frontend Components
1. **Layout Components**
   - MainLayout (with beautiful background)
   - AuthLayout
   - AdminLayout

2. **Authentication Components**
   - LoginButtons (Google, Email)
   - SignUpForm
   - LoginForm
   - AuthGuard (protected routes)

3. **Admin Components**
   - UserList
   - UserItem
   - DeleteUserButton

4. **Pages**
   - HomePage
   - SignUpPage
   - LoginPage
   - WelcomePage
   - AdminPage

## 3. Authentication Flow
1. **Google Authentication**
   - Implement Google OAuth2
   - Check if user exists in database
   - Auto-register if new user
   - Generate JWT token
   - Redirect to welcome page

2. **Email Authentication**
   - Email/password validation
   - Secure password storage
   - JWT token generation
   - Session management

## 4. Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  email: String,
  password: String (hashed),
  googleId: String (optional),
  name: String,
  isAdmin: Boolean,
  userLevel : String,
  createdAt: Date,
  updatedAt: Date
}
```

## 5. API Endpoints

### Authentication
- POST /api/auth/google
- POST /api/auth/login
- POST /api/auth/register
- POST /api/auth/logout

### User Management
- GET /api/users (admin only)
- DELETE /api/users/:id (admin only)
- GET /api/users/me (current user)

## 6. Implementation Phases

### Phase 1: Initial Setup
1. Create project structure
2. Set up React with Vite
   `npm create vite@latest ./client -- --template react`
   `cd client ; npm install`
3. Configure Tailwind CSS and Material UI
   `cd client`
   `npm install -D tailwindcss postcss autoprefixer` 
4. Set up Express server
   `cd server`
   `npm init -y`
   `npm install express mongoose dotenv cors`
5. Set up MongoDB connection

### Phase 2: Authentication
1. Implement Google OAuth
   `npm install passport passport-google-oauth20 jsonwebtoken dotenv bcrypt cors`
2. Create email registration
3. Implement login system
4. Set up JWT authentication
5. Create protected routes

### Phase 3: Frontend Development
1. Design and implement main layout
2. Create authentication pages
3. Build welcome page
4. Implement responsive design
5. Add loading states and error handling

### Phase 4: Admin Features
1. Create admin dashboard
2. Implement user list
3. Add user deletion functionality
4. Add admin authorization

### Phase 5: Testing & Refinement
1. Unit testing
2. Integration testing
3. UI/UX improvements
4. Performance optimization
5. Security audit

## 7. Testing Strategy

### Frontend Testing
- Unit tests for components
- Integration tests for authentication flow
- E2E tests for critical paths
- Responsive design testing

### Backend Testing
- API endpoint testing
- Authentication middleware tests
- Database operations testing
- Error handling tests

## 8. Security Considerations
1. Implement rate limiting
2. Add CORS protection
3. Secure password hashing
4. JWT token management
5. Input validation
6. XSS protection
7. CSRF protection

## 9. Development Tools
- Node.js & npm
- React 18+
- Material UI
- Tailwind CSS
- MongoDB
- Express.js
- Jest for testing
- ESLint & Prettier

## 10. Additional Features (Future)
1. Password reset functionality
2. Email verification
3. User profile management
4. Activity logging
5. Enhanced admin analytics

## Getting Started
1. Clone repository
2. Install dependencies
3. Set up environment variables
4. Start development server
5. Access application at localhost:3000