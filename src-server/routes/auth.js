import express from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { auth } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'eduprojects_secret', {
    expiresIn: '30d',
  });
};

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', [
  body('firstName')
    .notEmpty().withMessage('First name is required')
    .isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters')
    .trim(),
  body('lastName')
    .notEmpty().withMessage('Last name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2 and 50 characters')
    .trim(),
  body('collegeId')
    .notEmpty().withMessage('College ID is required')
    .isLength({ min: 3, max: 20 }).withMessage('College ID must be between 3 and 20 characters')
    .trim(),
  body('email')
    .isEmail().withMessage('Please include a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role')
    .isIn(['student', 'faculty']).withMessage('Role must be student or faculty'),
  body('department')
    .notEmpty().withMessage('Department is required'),
  body('designation')
    .if(body('role').equals('faculty'))
    .notEmpty().withMessage('Designation is required for faculty'),
  body('year')
    .if(body('role').equals('student'))
    .notEmpty().withMessage('Year is required for students')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { firstName, lastName, collegeId, email, password, role, department, designation, year } = req.body;

    // Check if user exists
    let user = await User.findOne({
      $or: [{ email }, { collegeId }]
    });

    if (user) {
      return res.status(400).json({ 
        message: 'User already exists with this email or college ID' 
      });
    }

    // Create new user
    user = new User({
      firstName,
      lastName,
      collegeId,
      email,
      password,
      role,
      department,
      designation: role === 'faculty' ? designation : undefined,
      year: role === 'student' ? year : undefined
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        collegeId: user.collegeId,
        email: user.email,
        role: user.role,
        department: user.department,
        designation: user.designation,
        year: user.year
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('email')
    .isEmail().withMessage('Please include a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        collegeId: user.collegeId,
        email: user.email,
        role: user.role,
        department: user.department,
        designation: user.designation,
        year: user.year
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    res.json({ 
      user: req.user 
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;