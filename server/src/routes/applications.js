import express from 'express';
import prisma from '../prismaClient.js'; 
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// All routes below require authentication
router.use(requireAuth);

// Get all applications 
router.get('/', async (req, res) => {
  try {
    const applications = await prisma.application.findMany({
      orderBy: { submittedAt: 'desc' }
    });
    res.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// Get single application by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const application = await prisma.application.findUnique({
      where: { id }
    });
    
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    
    res.json(application);
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({ error: 'Failed to fetch application' });
  }
});

export default router; 