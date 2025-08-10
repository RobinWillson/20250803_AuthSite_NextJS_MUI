import asyncHandler from 'express-async-handler';
import validator from 'validator';
import User from '../models/User.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit) || 10; // Default to 10 users per page
  const page = Number(req.query.page) || 1;
  const search = req.query.search || '';
  const keyword = search
    ? {
      $or: [
        { name: { $regex: search, $options: 'i' } }, // Case-insensitive search
        { email: { $regex: search, $options: 'i' } },
      ],
    }
    : {};

  const count = await User.countDocuments({ ...keyword });
  const users = await User.find({ ...keyword })
    .select('-password')
    .limit(limit)
    .skip(limit * (page - 1));

  // Return paginated data
  res.json({ users, page, totalPages: Math.ceil(count / limit) });
});

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private/Admin
const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  if (req.user._id.toString() === req.params.id) {
    res.status(400);
    throw new Error('Admins cannot change their own role.');
  }

  const user = await User.findById(req.params.id);

  if (user) {
    user.role = role || user.role;
    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  if (req.user._id.toString() === req.params.id) {
    res.status(400);
    throw new Error('Admins cannot delete their own account.');
  }

  const user = await User.findById(req.params.id);

  if (user) {
    await user.deleteOne();
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  const user = req.user;

  if (!name || !email) {
    res.status(400);
    throw new Error('Name and email are required');
  }

  if (!validator.isEmail(email)) {
    res.status(400);
    throw new Error('Invalid email format');
  }

  // Check if email is already taken by another user
  if (email.toLowerCase() !== user.email.toLowerCase()) {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(400);
      throw new Error('Email is already in use');
    }
  }

  // Update user
  user.name = name;
  if (email.toLowerCase() !== user.email.toLowerCase()) {
    user.email = email.toLowerCase();
    // If email changed, set emailVerified to false
    user.emailVerified = false;
  }
  
  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    isAdmin: updatedUser.isAdmin,
    emailVerified: updatedUser.emailVerified,
  });
});

export {
  getAllUsers,
  updateUserRole,
  deleteUser,
  updateProfile,
};