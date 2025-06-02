import express from 'express';
import { getFileStream } from '../services/google/drive.js';

const router = express.Router();



// View image files (CORS-friendly proxy)
router.get('/:fileId/image', async (req, res) => {
  try {
    const { fileId } = req.params;
    
    
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