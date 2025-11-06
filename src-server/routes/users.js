import express from 'express';
import { auth } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// @route   GET /api/users/faculty
// @desc    Get all faculty members
// @access  Private
router.get('/faculty', auth, async (req, res) => {
  try {
    const faculty = await User.find({ role: 'faculty' })
      .select('firstName lastName designation department email collegeId')
      .sort({ firstName: 1, lastName: 1 });

    res.json({ faculty });
  } catch (error) {
    console.error('Get faculty error:', error);
    res.status(500).json({ message: 'Server error while fetching faculty' });
  }
});

// @route   GET /api/users/faculty/:department
// @desc    Get faculty by department
// @access  Private
router.get('/faculty/:department', auth, async (req, res) => {
  try {
    const faculty = await User.find({ 
      role: 'faculty', 
      department: req.params.department 
    })
    .select('firstName lastName designation department email collegeId')
    .sort({ firstName: 1 });

    res.json({ faculty });
  } catch (error) {
    console.error('Get faculty by department error:', error);
    res.status(500).json({ message: 'Server error while fetching faculty' });
  }
});

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    
    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      user.email = email;
    }

    await user.save();

    res.json({ 
      message: 'Profile updated successfully', 
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
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error while updating profile' });
  }
});

export default router;