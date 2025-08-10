import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
  updateProfile,
} from '../controllers/userController.js';

const router = express.Router();

// GET /api/users/me - Get current user's profile
router.get('/me', authMiddleware, (req, res) => {
  res.json(req.user);
});

// PUT /api/users/profile - Update current user's profile
router.put('/profile', authMiddleware, updateProfile);

// Admin User Management Routes
router.route('/')
  .get(authMiddleware, adminMiddleware, getAllUsers);

router.route('/:id/role')
  .put(authMiddleware, adminMiddleware, updateUserRole);

router.route('/:id')
  .delete(authMiddleware, adminMiddleware, deleteUser);

export default router;