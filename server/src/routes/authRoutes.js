import express from 'express';
import { googleSignIn, registerUser, loginUser, logoutUser, verifyEmail, resendVerificationEmail, forgotPassword, resetPassword } from '../controllers/authController.js';

const router = express.Router();

// Google Sign-In (token-based from client)
router.post('/google', googleSignIn);

// Email registration
router.post('/register', registerUser);

// Email login
router.post('/login', loginUser);

// Logout
router.post('/logout', logoutUser);

// Email verification
router.get('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerificationEmail);

// Password reset
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;