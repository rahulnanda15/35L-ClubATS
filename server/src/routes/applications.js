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

// Get current user's ID
router.get('/current-user/id', (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    res.json({ userId: req.user.id });
  } catch (error) {
    console.error('Error getting user ID:', error);
    res.status(500).json({ error: 'Failed to get user ID' });
  }
});

// Save grades for an application
router.post('/:id/grades', requireAuth, async (req, res) => {
  let applicationId, userId;
  
  try {
    applicationId = req.params.id;
    const { resume_grade, video_grade, cover_letter_grade } = req.body;
    userId = req.user.id; // From auth middleware
    
    // Validate required fields
    if (!resume_grade || !video_grade || !cover_letter_grade) {
      return res.status(400).json({ error: 'All grade fields are required' });
    }
    
    // Validate grade values (1-10)
    const grades = { resume_grade, video_grade, cover_letter_grade };
    for (const [key, value] of Object.entries(grades)) {
      const numValue = parseInt(value);
      if (isNaN(numValue) || numValue < 1 || numValue > 10) {
        return res.status(400).json({ error: `${key} must be a number between 1 and 10` });
      }
    }
    
    // Check if application exists
    const application = await prisma.application.findUnique({
      where: { id: applicationId }
    });
    
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    
    // Create grade record - matching the current schema
    const grade = await prisma.grade.create({
      data: {
        resume: resume_grade.toString(),
        video: video_grade.toString(),
        cover_letter: cover_letter_grade.toString(),
        applicant: applicationId,
        user: userId
      }
    });
    
    // Get application and user details for the response
    const [applicationDetails, userDetails] = await Promise.all([
      prisma.application.findUnique({
        where: { id: applicationId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true
        }
      }),
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          fullName: true,
          email: true
        }
      })
    ]);
    
    res.status(201).json({
      message: 'Grades saved successfully',
      grade: {
        id: grade.id,
        resume_grade: grade.resume,
        video_grade: grade.video,
        cover_letter_grade: grade.cover_letter,
        createdAt: grade.createdAt,
        application: applicationDetails,
        user: userDetails
      }
    });
    
  } catch (error) {
    console.error('Error saving grades:', {
      message: error.message,
      stack: error.stack,
      applicationId,
      userId,
      grades: req.body
    });
    
    // Return more detailed error information
    res.status(500).json({ 
      error: 'Failed to save grades',
      details: {
        message: error.message,
        ...(process.env.NODE_ENV === 'development' && {
          stack: error.stack,
          code: error.code,
          meta: error.meta
        })
      }
    });
  }
});

export default router; 