# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack authentication application with React frontend and Node.js backend. The project implements email/password authentication and Google OAuth integration with JWT tokens.

## Architecture

**Frontend (client/):**
- **Tech Stack:** React 19, Vite, Material-UI 7, TailwindCSS 4, React Router 7
- **Key Libraries:** @react-oauth/google, axios, react-hot-toast
- **Structure:** Context-based auth state management with protected routes

**Backend (server/):**
- **Tech Stack:** Node.js, Express 5, MongoDB with Mongoose
- **Auth:** JWT tokens, bcrypt for passwords, Passport.js with Google OAuth
- **Structure:** Controller-based API with middleware for auth/admin protection

## Development Commands

### Client (Frontend)
```bash
cd client
npm run dev        # Start development server (localhost:5173)
npm run build      # Build for production  
npm run lint       # Run ESLint
npm run preview    # Preview production build
```

### Server (Backend)
```bash
cd server
npm start          # Start server (localhost:5000)
```

## Authentication Flow

1. **Client Auth Service:** Currently uses mock data (`client/src/services/authService.js`) - replace with real API calls to backend
2. **Backend API:** Full implementation at `/api/auth/*` routes
3. **Protected Routes:** Use `ProtectedRoute` component and `AuthContext` for state management
4. **Admin Routes:** Use `AdminRoute` component for admin-only pages

## Key Components Structure

- **AuthContext:** Global auth state management (`client/src/context/AuthContext.jsx`)
- **Protected Layout:** Shared layout with Header, Sidebar, Footer for authenticated pages
- **Route Protection:** Nested route structure with `ProtectedRoute` wrapper
- **Material-UI Theme:** Custom theme configuration in `client/src/theme.js`

## Database Models

- **User Model:** Email, password (hashed), name, googleId, isAdmin flag
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

- Frontend auth service is currently mocked - integrate with backend API
- MongoDB connection required for backend functionality
- Google OAuth requires proper client ID configuration
- JWT tokens stored in localStorage on frontend