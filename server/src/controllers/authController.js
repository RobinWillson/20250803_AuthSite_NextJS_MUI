import User from '../models/User.js';
import bcrypt from 'bcrypt';
import validator from 'validator';
import asyncHandler from 'express-async-handler';
import { OAuth2Client } from 'google-auth-library';
import { generateToken } from '../utils/tokenUtils.js';
import { generateVerificationToken, sendVerificationEmail, sendPasswordResetEmail } from '../utils/emailService.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Authenticate user with Google token & sign in
// @route   POST /api/auth/google
// @access  Public
export const googleSignIn = asyncHandler(async (req, res) => {
  // The Google ID token can be sent from the client as 'token' or 'credential'.
  // We accept either to make the endpoint more robust.
  const { token, credential } = req.body;
  const idToken = token || credential;

  if (!idToken) {
    res.status(400);
    throw new Error(
      'Google ID token is required. Please send it in the request body as "token" or "credential".'
    );
  }

  const ticket = await client.verifyIdToken({
    idToken: idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const { name, email, sub: googleId } = ticket.getPayload();
  const lowerCaseEmail = email.toLowerCase();

  let user = await User.findOne({ email: lowerCaseEmail });

  if (user) {
    // If user exists but signed up locally, link their Google ID
    if (!user.googleId) {
      user.googleId = googleId;
      await user.save();
    }
  } else {
    // If user does not exist, create a new one
    const isAdmin = lowerCaseEmail === 'robinheck101@gmail.com';
    user = await User.create({
      name,
      email: lowerCaseEmail,
      googleId,
      isAdmin,
    });
  }

  const appToken = generateToken(user);
  res.status(200).json({
    token: appToken,
    message: 'Google Sign-In successful',
  });
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  // Normalize email to lowercase at the beginning
  if (req.body.email) {
    req.body.email = req.body.email.toLowerCase();
  }
  const { email, password, name } = req.body;

  // --- Start Server-Side Validation ---
  if (!email || !password || !name) {
    res.status(400);
    throw new Error('All fields (email, password, name) are required.');
  }

  if (!validator.isEmail(email)) {
    res.status(400);
    throw new Error('Invalid email format. Please provide a valid email.');
  }

  if (password.length < 8) {
    res.status(400);
    throw new Error('Password must be at least 8 characters long.');
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error('Email already in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const isAdmin = email === 'robinheck101@gmail.com';
  
  // Generate email verification token
  const verificationToken = generateVerificationToken();
  const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  
  const newUser = new User({
    email,
    password: hashedPassword,
    name,
    isAdmin,
    emailVerificationToken: verificationToken,
    emailVerificationExpires: verificationExpires,
  });

  await newUser.save();

  // Send verification email
  try {
    await sendVerificationEmail(email, name, verificationToken);
  } catch (emailError) {
    console.error('Failed to send verification email:', emailError);
    // Don't fail registration if email fails, just log it
  }

  // Don't immediately return JWT token - user needs to verify email first
  res.status(201).json({ 
    message: 'User registered successfully. Please check your email to verify your account.',
    emailSent: true 
  });
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  // Normalize email to lowercase at the beginning
  if (req.body.email) {
    req.body.email = req.body.email.toLowerCase();
  }
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }

  const user = await User.findOne({ email });
  
  // Check if user exists
  if (!user) {
    res.status(401);
    throw new Error('Invalid user. Please check your email');
  }

  // Check if user has a password (not Google-only user)
  if (!user.password) {
    res.status(401);
    throw new Error('Invalid credentials. This account uses Google login only');
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid password. Please try again');
  }

  // Check if email is verified
  if (!user.emailVerified) {
    res.status(403);
    throw new Error('Invalid credentials. Email not verified');
  }

  const token = generateToken(user);
  res.json({ token, message: 'Login successful' });
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
export const logoutUser = (req, res) => {
  // For stateless JWT, the client is responsible for clearing the token.
  res.status(200).json({ message: 'Logout successful. Please clear your token on the client side.' });
};

// @desc    Verify email with token
// @route   GET /api/auth/verify-email
// @access  Public
export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.query;

  if (!token) {
    res.status(400);
    throw new Error('Verification token is required');
  }

  const user = await User.findOne({
    emailVerificationToken: token,
    emailVerificationExpires: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired verification token');
  }

  // Update user as verified
  user.emailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  // Generate JWT token for the verified user
  const jwtToken = generateToken(user);

  res.status(200).json({
    message: 'Email verified successfully',
    token: jwtToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      emailVerified: user.emailVerified,
    },
  });
});

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Public
export const resendVerificationEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error('Email is required');
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user.emailVerified) {
    res.status(400);
    throw new Error('Email is already verified');
  }

  // Generate new verification token
  const verificationToken = generateVerificationToken();
  const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  user.emailVerificationToken = verificationToken;
  user.emailVerificationExpires = verificationExpires;
  await user.save();

  // Send verification email
  try {
    await sendVerificationEmail(user.email, user.name, verificationToken);
    res.status(200).json({ message: 'Verification email sent successfully' });
  } catch (emailError) {
    console.error('Failed to send verification email:', emailError);
    res.status(500);
    throw new Error('Failed to send verification email');
  }
});

// @desc    Request password reset
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error('Email is required');
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    // For security, don't reveal if email exists
    res.status(200).json({ message: 'If that email exists, a password reset link has been sent.' });
    return;
  }

  // Generate password reset token
  const resetToken = generateVerificationToken();
  const resetExpires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

  user.passwordResetToken = resetToken;
  user.passwordResetExpires = resetExpires;
  await user.save();

  // Send password reset email
  try {
    await sendPasswordResetEmail(user.email, user.name, resetToken);
    res.status(200).json({ message: 'If that email exists, a password reset link has been sent.' });
  } catch (emailError) {
    console.error('Failed to send password reset email:', emailError);
    // Still return success for security
    res.status(200).json({ message: 'If that email exists, a password reset link has been sent.' });
  }
});

// @desc    Reset password with token
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    res.status(400);
    throw new Error('Token and password are required');
  }

  if (password.length < 8) {
    res.status(400);
    throw new Error('Password must be at least 8 characters long');
  }

  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired password reset token');
  }

  // Update password
  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res.status(200).json({ message: 'Password has been reset successfully' });
});