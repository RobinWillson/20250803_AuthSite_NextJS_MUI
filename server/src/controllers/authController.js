import User from '../models/User.js';
import bcrypt from 'bcrypt';
import validator from 'validator';
import asyncHandler from 'express-async-handler';
import { OAuth2Client } from 'google-auth-library';
import { generateToken } from '../utils/tokenUtils.js';

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
  const newUser = new User({
    email,
    password: hashedPassword,
    name,
    isAdmin,
  });

  await newUser.save();

  const token = generateToken(newUser);
  res.status(201).json({ token, message: 'User registered successfully' });
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
  // Securely check if user exists and has a password (i.e., not a Google-only user)
  if (!user || !user.password) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid credentials');
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