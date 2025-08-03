import express from 'express';
import { googleSignIn, registerUser, loginUser, logoutUser } from '../controllers/authController.js';

const router = express.Router();

// Google Sign-In (token-based from client)
router.post('/google', googleSignIn);

// Email registration
router.post('/register', registerUser);

// Email login
router.post('/login', loginUser);

// Logout
router.post('/logout', logoutUser);

export default router;