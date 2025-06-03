import jwt from 'jsonwebtoken';
import prisma from '../prismaClient.js';
import config from '../config.js';

// Middleware to verify JWT token and attach user to request
export const requireAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    // Attach user to request object (without password for security)
    const { password: _, ...userWithoutPassword } = user;
    req.user = userWithoutPassword;
    next();
    
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Middleware to require admin role
export const requireAdmin = async (req, res, next) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}; 