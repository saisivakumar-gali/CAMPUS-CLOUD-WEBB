import express from 'express';
import { auth } from '../middleware/auth.js';
import { handleUploadErrors, upload } from '../middleware/upload.js';

const router = express.Router();

// @route   POST /api/upload/document
// @desc    Upload project document
// @access  Private
router.post('/document', auth, upload.single('document'), handleUploadErrors, (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    res.json({
      message: 'File uploaded successfully',
      file: {
        filename: req.file.filename,
        path: `/uploads/${getUploadSubfolder(req.file.fieldname)}/${req.file.filename}`,
        originalname: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'File upload failed' });
  }
});

// @route   POST /api/upload/final-docs
// @desc    Upload multiple final documents
// @access  Private
router.post('/final-docs', auth, upload.fields([
  { name: 'report', maxCount: 1 },
  { name: 'presentation', maxCount: 1 },
  { name: 'code', maxCount: 1 },
  { name: 'images', maxCount: 1 }
]), handleUploadErrors, (req, res) => {
  try {
    const files = req.files;
    const uploadedFiles = {};

    // Helper function to get upload subfolder
    const getUploadSubfolder = (fieldname) => {
      const folders = {
        'report': 'documents',
        'presentation': 'presentations',
        'code': 'code',
        'images': 'images'
      };
      return folders[fieldname] || 'documents';
    };

    if (files.report) {
      uploadedFiles.report = {
        filename: files.report[0].filename,
        path: `/uploads/${getUploadSubfolder('report')}/${files.report[0].filename}`,
        originalname: files.report[0].originalname,
        size: files.report[0].size
      };
    }

    if (files.presentation) {
      uploadedFiles.presentation = {
        filename: files.presentation[0].filename,
        path: `/uploads/${getUploadSubfolder('presentation')}/${files.presentation[0].filename}`,
        originalname: files.presentation[0].originalname,
        size: files.presentation[0].size
      };
    }

    if (files.code) {
      uploadedFiles.code = {
        filename: files.code[0].filename,
        path: `/uploads/${getUploadSubfolder('code')}/${files.code[0].filename}`,
        originalname: files.code[0].originalname,
        size: files.code[0].size
      };
    }

    if (files.images) {
      uploadedFiles.images = {
        filename: files.images[0].filename,
        path: `/uploads/${getUploadSubfolder('images')}/${files.images[0].filename}`,
        originalname: files.images[0].originalname,
        size: files.images[0].size
      };
    }

    res.json({
      message: 'Files uploaded successfully',
      files: uploadedFiles
    });
  } catch (error) {
    console.error('Final docs upload error:', error);
    res.status(500).json({ message: 'File upload failed' });
  }
});

// Helper function to determine upload subfolder
function getUploadSubfolder(fieldname) {
  const folders = {
    'report': 'documents',
    'presentation': 'presentations', 
    'code': 'code',
    'images': 'images',
    'document': 'documents'
  };
  return folders[fieldname] || 'documents';
}

export default router;