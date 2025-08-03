import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authMiddleware = async (req, res, next) => {
  let token;

  // Check for token in Authorization header (e.g., "Bearer <token>")
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from the header
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using the secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by the ID from the token payload
      // Exclude the password field for security
      req.user = await User.findById(decoded.userId).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Authorization failed, user not found.' });
      }

      return next(); // Proceed to the next middleware or route handler
    } catch (error) {
      return res.status(401).json({ message: 'Authorization failed, token is invalid.' });
    }
  }

  return res.status(401).json({ message: 'Authorization failed, no token provided.' });
};