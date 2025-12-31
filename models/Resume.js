const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  originalContent: {
    type: String,
    required: true
  },
  improvedContent: {
    type: String
  },
  improvements: [{
    section: String,
    original: String,
    improved: String,
    reason: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  aiAnalysis: {
    overallScore: {
      type: Number,
      min: 0,
      max: 100
    },
    strengths: [String],
    weaknesses: [String],
    suggestions: [String],
    keywordOptimization: [String]
  },
  status: {
    type: String,
    enum: ['draft', 'analyzing', 'completed', 'error'],
    default: 'draft'
  },
  jobDescription: {
    type: String,
    trim: true
  },
  targetRole: {
    type: String,
    trim: true
  },
  industry: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for better query performance
resumeSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Resume', resumeSchema);