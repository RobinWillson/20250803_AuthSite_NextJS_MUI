# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack authentication application with React frontend and Node.js backend. The project implements email/password authentication and Google OAuth integration with JWT tokens.

## Architecture

**Frontend (client-nextjs/):**
- **Tech Stack:** Next.js 15.4.5, React 18, Material-UI 7, TailwindCSS 3, TypeScript
- **Key Libraries:** @react-oauth/google, axios, react-hot-toast
- **Structure:** App Router with context-based auth state management and route protection
- **Features:** Admin dashboard, user profile management, password recovery, email verification

**Backend (server/):**
- **Tech Stack:** Node.js, Express 5, MongoDB with Mongoose
- **Auth:** JWT tokens, bcrypt for passwords, Passport.js with Google OAuth
- **Structure:** Controller-based API with middleware for auth/admin protection

## Development Commands

### Frontend (Next.js)
```bash
cd client-nextjs
npm run dev        # Start development server (localhost:3000)
npm run build      # Build for production  
npm run lint       # Run ESLint
npm start          # Start production server
```

### Server (Backend)
```bash
cd server
npm start          # Start server (localhost:5000)
```

## Authentication Flow

1. **Frontend Auth Service:** Full integration with backend API (`client-nextjs/src/services/authService.ts`)
2. **Backend API:** Complete implementation at `/api/auth/*` routes with email verification and password reset
3. **Protected Routes:** `ProtectedRoute` component and `AuthContext` for state management
4. **Admin Routes:** `AdminRoute` component for admin-only pages with proper role checking
5. **Email Verification:** Complete flow with token-based verification and auto-login
6. **Password Recovery:** Forgot password and reset password functionality

## Key Components Structure

- **AuthContext:** Global auth state management (`client-nextjs/src/context/AuthContext.tsx`)
- **Route Protection:** `ProtectedRoute` and `AdminRoute` components for access control
- **Admin Dashboard:** Full user management interface at `/admin`
- **User Profile:** Profile management page at `/profile` 
- **Password Recovery:** Forgot/reset password pages with email integration
- **Material-UI Theme:** Custom theme configuration in `client-nextjs/src/theme.ts`

## Database Models

- **User Model:** Email, password (hashed), name, googleId, isAdmin flag, email verification, password reset tokens
- **Admin Detection:** Hardcoded email `robinheck101@gmail.com` gets admin privileges

## Environment Setup

Backend requires `.env` file with:
- `GOOGLE_CLIENT_ID`
- `JWT_SECRET` 
- `MONGODB_URI`
- `PORT` (optional, defaults to 5000)

## Testing

No test framework currently configured. Check for test scripts in package.json before adding tests.

## Important Notes

- Complete full-stack authentication system with TypeScript
- MongoDB connection required for backend functionality
- Google OAuth requires proper client ID configuration
- JWT tokens stored in localStorage on frontend
- Email verification and password recovery fully implemented
- Admin dashboard with user management capabilities