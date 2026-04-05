const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  completedLessons: [{
    lessonId: mongoose.Schema.Types.ObjectId,
    completedAt: { type: Date, default: Date.now }
  }],
  completedTasks: [{
    taskId: mongoose.Schema.Types.ObjectId,
    submission: String,
    submittedAt: { type: Date, default: Date.now },
    reviewed: { type: Boolean, default: false },
    feedback: String
  }],
  enrolledAt: {
    type: Date,
    default: Date.now
  },
  accessType: {
    type: String,
    enum: ['purchased', 'subscription'],
    default: 'purchased'
  },
  completedAt: {
    type: Date,
    default: null
  },
  certificateIssued: {
    type: Boolean,
    default: false
  },
  certificateUrl: String
}, { timestamps: true });

enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
