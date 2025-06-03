import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prismaClient.js';
import config from '../config.js';

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, fullName, graduationClass } = req.body;
    
    // Validate required fields
    if (!email || !password || !fullName || !graduationClass) {
      return res.status(400).json({ error: 'Email, password, and full name are required' });
    }
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email. Sign in instead.' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        graduationClass,
      }
    });
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      config.jwtSecret,
    );
    
    // Return user info (without password) and token
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json({
      message: 'User created successfully',
      user: userWithoutPassword,
      token
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      config.jwtSecret,
    );
    
    // Return user info (without password) and token
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Verify token (for checking if user is still authenticated)
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
    
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router; 