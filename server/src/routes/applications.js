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

// Save or update grades for an application
router.post('/:id/grades', requireAuth, async (req, res) => {
  try {
    const { id: applicationId } = req.params;
    const userId = req.user.id;
    const { resume_grade, video_grade, cover_letter_grade } = req.body;

    // Check if at least one grade is provided
    if (resume_grade === undefined && video_grade === undefined && cover_letter_grade === undefined) {
      return res.status(400).json({ 
        error: 'At least one grade field is required' 
      });
    }
    
    // Prepare data for upsert
    const gradeData = {};
    
    // Validate and process each grade
    if (resume_grade !== undefined) {
      if (resume_grade !== null) {
        const value = parseInt(resume_grade);
        if (isNaN(value) || value < 1 || value > 10) {
          return res.status(400).json({ error: 'Resume grade must be between 1 and 10' });
        }
        gradeData.resume = value.toString();
      } else {
        gradeData.resume = null;
      }
    }
    
    if (video_grade !== undefined) {
      if (video_grade !== null) {
        const value = parseInt(video_grade);
        if (isNaN(value) || value < 1 || value > 10) {
          return res.status(400).json({ error: 'Video grade must be between 1 and 10' });
        }
        gradeData.video = value.toString();
      } else {
        gradeData.video = null;
      }
    }
    
    if (cover_letter_grade !== undefined) {
      if (cover_letter_grade !== null) {
        const value = parseInt(cover_letter_grade);
        if (isNaN(value) || value < 1 || value > 10) {
          return res.status(400).json({ error: 'Cover letter grade must be between 1 and 10' });
        }
        gradeData.cover_letter = value.toString();
      } else {
        gradeData.cover_letter = null;
      }
    }

    // Check if a grade already exists for this user and application
    const existingGrade = await prisma.grade.findFirst({
      where: {
        applicant: applicationId,
        user: userId
      }
    });

    let grade;
    if (existingGrade) {
      // Update existing grade
      grade = await prisma.grade.update({
        where: { id: existingGrade.id },
        data: gradeData,
      });
    } else {
      // Create new grade with the provided data
      grade = await prisma.grade.create({
        data: {
          ...gradeData,
          applicant: applicationId,
          user: userId,
        },
      });
    }
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

// Get most recent grades for an application and user
router.get('/:id/grades/latest', requireAuth, async (req, res) => {
  try {
    const { id: applicationId } = req.params;
    const userId = req.user.id;

    // Find the most recent grade for this application and user
    const latestGrade = await prisma.grade.findFirst({
      where: {
        applicant: applicationId,
        user: userId
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        resume: true,
        video: true,
        cover_letter: true,
        createdAt: true
      }
    });

    if (!latestGrade) {
      return res.status(404).json({ error: 'No grades found for this application and user' });
    }

    res.json(latestGrade);
  } catch (error) {
    console.error('Error fetching latest grades:', error);
    res.status(500).json({ 
      error: 'Failed to fetch latest grades',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get average grades for an application
router.get('/:id/grades/average', requireAuth, async (req, res) => {
  try {
    const { id: applicationId } = req.params;

    // Get all grades for this application
    const grades = await prisma.grade.findMany({
      where: {
        applicant: applicationId
      },
      select: {
        resume: true,
        video: true,
        cover_letter: true
      }
    });

    if (grades.length === 0) {
      return res.status(404).json({ 
        error: 'No grades found for this application',
        averages: {
          resume: 0,
          video: 0,
          cover_letter: 0,
          total: 0,
          count: 0
        }
      });
    }

    // Calculate averages
    const totals = grades.reduce((acc, grade) => ({
      resume: acc.resume + parseFloat(grade.resume || 0),
      video: acc.video + parseFloat(grade.video || 0),
      cover_letter: acc.cover_letter + parseFloat(grade.cover_letter || 0),
      count: acc.count + 1
    }), { resume: 0, video: 0, cover_letter: 0, count: 0 });

    const averages = {
      resume: parseFloat((totals.resume / totals.count).toFixed(2)),
      video: parseFloat((totals.video / totals.count).toFixed(2)),
      cover_letter: parseFloat((totals.cover_letter / totals.count).toFixed(2)),
      total: parseFloat(((totals.resume + totals.video + totals.cover_letter) / (totals.count * 3)).toFixed(2)),
      count: totals.count
    };

    res.json(averages);
  } catch (error) {
    console.error('Error calculating average grades:', error);
    res.status(500).json({ 
      error: 'Failed to calculate average grades',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router; 