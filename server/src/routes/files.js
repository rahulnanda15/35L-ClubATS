import express from 'express';
import { getFileStream, validateFileAccess } from '../services/driveService.js';

const router = express.Router();

// Debug endpoint to test file access
router.get('/:fileId/debug', async (req, res) => {
  try {
    const { fileId } = req.params;
    console.log(`Testing file access for: ${fileId}`);
    
    const isAccessible = await validateFileAccess(fileId);
    console.log(`File accessible: ${isAccessible}`);
    
    res.json({
      fileId,
      accessible: isAccessible,
      message: isAccessible ? 'File is accessible' : 'File not accessible'
    });
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Test endpoint that bypasses validation
router.get('/:fileId/test', async (req, res) => {
  try {
    const { fileId } = req.params;
    console.log(`Attempting direct file stream for: ${fileId}`);
    
    const fileStream = await getFileStream(fileId);
    
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    
    fileStream.pipe(res);
    
  } catch (error) {
    console.error('Direct stream error:', error);
    res.status(500).json({ error: error.message });
  }
});

// View image files (CORS-friendly proxy)
router.get('/:fileId/image', async (req, res) => {
  try {
    const { fileId } = req.params;
    
    const isAccessible = await validateFileAccess(fileId);
    if (!isAccessible) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    const fileStream = await getFileStream(fileId);
    
    res.setHeader('Content-Type', 'image/jpeg'); // Default to JPEG
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    
    fileStream.pipe(res);
    
  } catch (error) {
    console.error('Error serving image:', error);
    res.status(500).json({ error: 'Failed to serve image' });
  }
});

// View PDF files
router.get('/:fileId/pdf', async (req, res) => {
  try {
    const { fileId } = req.params;
    
    const isAccessible = await validateFileAccess(fileId);
    if (!isAccessible) {
      return res.status(404).json({ error: 'PDF not found' });
    }
    
    const fileStream = await getFileStream(fileId);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline'); // View in browser
    res.setHeader('Cache-Control', 'public, max-age=3600');
    
    fileStream.pipe(res);
    
  } catch (error) {
    console.error('Error serving PDF:', error);
    res.status(500).json({ error: 'Failed to serve PDF' });
  }
});

export default router; 