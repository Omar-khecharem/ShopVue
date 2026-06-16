import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import env from '../config/env.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new Error('Not authorized, no token'));
    }

    const decoded = jwt.verify(token, env.jwtSecret);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return next(new Error('User belonging to this token no longer exists'));
    }

    next();
  } catch (err) {
    next(err);
  }
};
