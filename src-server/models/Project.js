import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  category: {
    type: String,
    enum: ['Hardware', 'Software', 'Research'],
    required: true
  },
  branch: {
    type: String,
    enum: ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'ARTS', 'SCIENCE', 'BUSINESS'],
    required: true
  },
  shortOverview: {
    type: String,
    required: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  facultyGuide: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  teamMembers: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    studentId: {
      type: String,
      required: true,
      trim: true,
      uppercase: true
    }
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },
  facultyRemarks: {
    type: String,
    default: '',
    maxlength: 1000
  },
  finalDocuments: {
    report: {
      filename: String,
      path: String,
      originalname: String,
      size: Number,
      uploadedAt: Date
    },
    presentation: {
      filename: String,
      path: String,
      originalname: String,
      size: Number,
      uploadedAt: Date
    },
    code: {
      filename: String,
      path: String,
      originalname: String,
      size: Number,
      uploadedAt: Date
    },
    images: {
      filename: String,
      path: String,
      originalname: String,
      size: Number,
      uploadedAt: Date
    }
  },
  approvedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for better query performance
projectSchema.index({ status: 1, branch: 1 });
projectSchema.index({ submittedBy: 1 });
projectSchema.index({ facultyGuide: 1 });
projectSchema.index({ 
  title: 'text', 
  description: 'text', 
  shortOverview: 'text',
  'teamMembers.name': 'text'
});

// Virtual for formatted created date
projectSchema.virtual('formattedCreatedAt').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

export default mongoose.model('Project', projectSchema);