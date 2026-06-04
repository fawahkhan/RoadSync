import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// @desc    Protect routes — verify JWT token and attach user to request
export const protect = async (req, res, next) => {
  try {
    // 1. Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized. No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    // 2. Verify token — throws if expired or tampered
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Get user from database (confirms user still exists)
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User no longer exists' });
    }

    // 4. Attach user to request — every downstream controller can access req.user
    req.user = user;
    next();

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired. Please log in again.' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(401).json({ message: 'Not authorized' });
  }
};

// @desc    Restrict to admin role only
export const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};
