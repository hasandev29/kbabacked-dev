import jwt from 'jsonwebtoken';
import { Role } from '../models/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'kba';

export const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.exp * 1000 < Date.now()) {
      return res.status(401).json({ message: 'Token has expired.' });
    }

    req.user = decoded; 
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const authorizeRole = (requiredRole) => async (req, res, next) => {
  try {
    const userRole = await Role.findByPk(req.user.role_id);

    if (!userRole) {
      return res.status(404).json({ message: 'Role not found.' });
    }

    if (userRole.name !== requiredRole) {
      return res.status(403).json({ message: 'Access denied. Insufficient role.' });
    }

    next();

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error checking role.', error: err.message });
  }
};
