import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = path.join(__dirname, '../uploads/documents');
    
    if (file.fieldname === 'presentation') {
      uploadPath = path.join(__dirname, '../uploads/presentations');
    } else if (file.fieldname === 'code') {
      uploadPath = path.join(__dirname, '../uploads/code');
    } else if (file.fieldname === 'images') {
      uploadPath = path.join(__dirname, '../uploads/images');
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = {
    'report': ['.pdf', '.doc', '.docx'],
    'presentation': ['.ppt', '.pptx', '.pdf'],
    'code': ['.zip', '.rar', '.7z'],
    'images': ['.jpg', '.jpeg', '.png', '.gif']
  };

  const fileExtension = path.extname(file.originalname).toLowerCase();
  const fieldAllowedTypes = allowedTypes[file.fieldname] || [];

  if (fieldAllowedTypes.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type for ${file.fieldname}. Allowed types: ${fieldAllowedTypes.join(', ')}`), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// Error handling middleware for multer
const handleUploadErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 50MB.' });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ message: 'Too many files.' });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ message: 'Unexpected field.' });
    }
  } else if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
};

export { handleUploadErrors, upload };
