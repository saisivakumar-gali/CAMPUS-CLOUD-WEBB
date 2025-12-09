import express from 'express';
import { body, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import { auth, requireRole } from '../middleware/auth.js';
import Project from '../models/Project.js';
import User from '../models/User.js';

const router = express.Router();

// @route   POST /api/projects
// @desc    Create a new project
// @access  Private (Student)

router.post('/', [
  auth,
  requireRole(['student']),
  body('title')
    .notEmpty().withMessage('Project title is required')
    .isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
  body('category')
    .isIn(['Hardware', 'Software', 'Research']).withMessage('Invalid category'),
  body('branch')
    .notEmpty().withMessage('Branch is required'),
  body('shortOverview')
    .notEmpty().withMessage('Short overview is required')
    .isLength({ max: 200 }).withMessage('Short overview must be less than 200 characters'),
  body('description')
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 50, max: 2000 }).withMessage('Description must be between 50 and 2000 characters'),
  body('facultyGuide')
    .notEmpty().withMessage('Faculty guide is required'),
  body('teamMembers')
    .isArray({ min: 1, max: 4 }).withMessage('Must have between 1 and 4 team members')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('🔴 PROJECT VALIDATION ERRORS:', errors.array()); // ADDED ERROR LOGGING
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const {
      title,
      category,
      branch,
      shortOverview,
      description,
      facultyGuide,
      teamMembers
    } = req.body;

    // Validate facultyGuide ObjectId
    if (!mongoose.Types.ObjectId.isValid(facultyGuide)) {
      return res.status(400).json({ message: 'Invalid faculty guide ID format' });
    }

    // Check if faculty guide exists and is actually faculty
    const guide = await User.findById(facultyGuide);
    if (!guide || guide.role !== 'faculty') {
      return res.status(400).json({ message: 'Invalid faculty guide' });
    }

    // Validate team members for duplicates - MAKE THIS OPTIONAL
    if (teamMembers && teamMembers.length > 0) {
      const studentIds = teamMembers.map(member => member.studentId?.toUpperCase() || '');
      const uniqueIds = new Set(studentIds.filter(id => id !== ''));
      if (uniqueIds.size !== studentIds.filter(id => id !== '').length) {
        return res.status(400).json({ message: 'Duplicate student IDs found in team members' });
      }

      // Validate student ID format - MAKE THIS OPTIONAL FOR EMPTY FIELDS
      for (const member of teamMembers) {
        if (member.studentId && member.studentId.trim() !== '' && !/^[A-Z0-9]{3,20}$/.test(member.studentId)) {
          return res.status(400).json({ 
            message: `Invalid student ID format: ${member.studentId}. Must be 3-20 alphanumeric characters.` 
          });
        }
      }
    }

    const project = new Project({
      title,
      category,
      branch,
      shortOverview,
      description,
      facultyGuide,
      submittedBy: req.user._id,
      teamMembers: teamMembers || [{ name: '', studentId: '' }],
      status: 'pending'
    });

    await project.save();
    
    // Populate the saved project
    await project.populate('facultyGuide', 'firstName lastName designation department');
    await project.populate('submittedBy', 'firstName lastName collegeId department');

    res.status(201).json({
      message: 'Project submitted successfully',
      project
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Server error while creating project' });
  }
});

// @route   GET /api/projects
// @desc    Get projects based on user role
// @access  Private

// @route   GET /api/projects
// @desc    Get projects based on user role
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    console.log('🟢 GET /api/projects ROUTE REACHED - User:', req.user?._id, req.user?.role); // ADD THIS LINE
    
    const { status, branch, category, page = 1, limit = 10 } = req.query;
    
    let query = {};

    // Faculty sees projects where they are guide
    if (req.user.role === 'faculty') {
      query.facultyGuide = req.user._id;
    } 
    // Student sees their own projects
    else if (req.user.role === 'student') {
      query.submittedBy = req.user._id;
    }

    console.log('🟢 Query built:', query); // ADD THIS LINE

    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    }

    // Filter by branch
    if (branch && branch !== 'all') {
      query.branch = branch;
    }

    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }

    const projects = await Project.find(query)
      .populate('facultyGuide', 'firstName lastName designation department')
      .populate('submittedBy', 'firstName lastName collegeId department')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Project.countDocuments(query);

    console.log('🟢 Sending response with', projects.length, 'projects'); // ADD THIS LINE

    res.json({
      projects,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('❌ Get projects error:', error);
    res.status(500).json({ message: 'Server error while fetching projects' });
  }
});

// @route   GET /api/projects/all-approved
// @desc    Get all approved projects with final documents
// @access  Public
router.get('/all-approved', async (req, res) => {
  try {
    const { branch, category, search, page = 1, limit = 12 } = req.query;
    
    let query = { 
      status: 'completed'
    };

    // Filter by branch
    if (branch && branch !== 'all') {
      query.branch = branch;
    }

    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }

    // Search in title, description, or team members
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { shortOverview: { $regex: search, $options: 'i' } },
        { 'teamMembers.name': { $regex: search, $options: 'i' } },
        // Add search for form-based projects
        { 'finalDetails.basicInfo.projectDomain': { $regex: search, $options: 'i' } },
        { 'finalDetails.basicInfo.teamMembers': { $regex: search, $options: 'i' } },
        { 'finalDetails.technicalDetails.technologiesUsed': { $regex: search, $options: 'i' } }
      ];
    }

    const projects = await Project.find(query)
      .populate('facultyGuide', 'firstName lastName designation department')
      .populate('submittedBy', 'firstName lastName collegeId department')
      .sort({ completedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Project.countDocuments(query);

    res.json({
      projects,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Get approved projects error:', error);
    res.status(500).json({ message: 'Server error while fetching approved projects' });
  }
});

// @route   GET /api/projects/:id
// @desc    Get single project
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid project ID format' });
    }

    const project = await Project.findById(req.params.id)
      .populate('facultyGuide', 'firstName lastName designation department email')
      .populate('submittedBy', 'firstName lastName collegeId email department');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user has access to this project
    if (req.user.role === 'student' && project.submittedBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (req.user.role === 'faculty' && project.facultyGuide._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ project });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Server error while fetching project' });
  }
});

// @route   PUT /api/projects/:id/status
// @desc    Update project status (Approve/Reject)
// @access  Private (Faculty)
router.put('/:id/status', [
  auth,
  requireRole(['faculty']),
  body('status').isIn(['approved', 'rejected']).withMessage('Invalid status'),
  body('remarks').optional().isString().isLength({ max: 1000 }).withMessage('Remarks too long')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid project ID format' });
    }

    const { status, remarks } = req.body;

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if faculty is the guide for this project
    if (project.facultyGuide.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }

    // Check if project is already in the requested status
    if (project.status === status) {
      return res.status(400).json({ message: `Project is already ${status}` });
    }

    project.status = status;
    project.facultyRemarks = remarks || '';

    if (status === 'approved') {
      project.approvedAt = new Date();
    }

    await project.save();
    await project.populate('submittedBy', 'firstName lastName collegeId email');

    res.json({
      message: `Project ${status} successfully`,
      project
    });
  } catch (error) {
    console.error('Update project status error:', error);
    res.status(500).json({ message: 'Server error while updating project status' });
  }
});

// @route   PUT /api/projects/:id/final-upload
// @desc    Upload final documents for approved project
// @access  Private (Student)
router.put('/:id/final-upload', [
  auth,
  requireRole(['student'])
], async (req, res) => {
  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid project ID format' });
    }

    const { report, presentation, code, images } = req.body;

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if student owns this project
    if (project.submittedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }

    // Check if project is approved
    if (project.status !== 'approved') {
      return res.status(400).json({ message: 'Only approved projects can have final documents uploaded' });
    }

    // Validate that at least report is provided
    if (!report || !report.filename || !report.path) {
      return res.status(400).json({ message: 'Final report is required' });
    }

    // Update final documents
    if (report) project.finalDocuments.report = { ...report, uploadedAt: new Date() };
    if (presentation) project.finalDocuments.presentation = { ...presentation, uploadedAt: new Date() };
    if (code) project.finalDocuments.code = { ...code, uploadedAt: new Date() };
    if (images) project.finalDocuments.images = { ...images, uploadedAt: new Date() };

    project.status = 'completed';
    project.completedAt = new Date();

    await project.save();
    await project.populate('facultyGuide submittedBy', 'firstName lastName designation collegeId department');

    res.json({
      message: 'Final documents uploaded successfully',
      project
    });
  } catch (error) {
    console.error('Final upload error:', error);
    res.status(500).json({ message: 'Server error while uploading final documents' });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete a project (only pending projects)
// @access  Private (Student)
router.delete('/:id', [
  auth,
  requireRole(['student'])
], async (req, res) => {
  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid project ID format' });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user owns the project
    if (project.submittedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }

    // Only allow deletion of pending projects
    if (project.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending projects can be deleted' });
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Server error while deleting project' });
  }
});

// @route   PUT /api/projects/:id/final-details
// @desc    Submit final project details (form-based)
// @access  Private (Student)
router.put('/:id/final-details', [
  auth,
  requireRole(['student']),
  body('projectDetails').isObject().withMessage('Project details are required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { projectDetails } = req.body;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid project ID format' });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if student owns this project
    if (project.submittedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }

    // Check if project is approved
    if (project.status !== 'approved') {
      return res.status(400).json({ message: 'Only approved projects can submit final details' });
    }

    // Validate required form fields
    if (!projectDetails?.basicInfo?.projectDomain || 
        !projectDetails?.description?.abstract ||
        !projectDetails?.description?.objectives?.length ||
        !projectDetails?.description?.problemStatement ||
        !projectDetails?.description?.proposedSolution ||
        !projectDetails?.technicalDetails?.finalOutput) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }

    // Update project with form data
    project.finalDetails = {
      ...projectDetails,
      submittedAt: new Date()
    };
    project.status = 'completed';
    project.completedAt = new Date();

    await project.save();
    await project.populate('facultyGuide submittedBy', 'firstName lastName designation collegeId department');

    res.json({
      message: 'Project details submitted successfully',
      project
    });
  } catch (error) {
    console.error('Final details submission error:', error);
    res.status(500).json({ message: 'Server error while submitting project details' });
  }
});

export default router;