export const adminMiddleware = (req, res, next) => {
  // Assumes authMiddleware has already run and attached user to req
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden: Admin access required' });
  }
};