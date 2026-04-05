const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number']
  },
  avatar: {
    type: String,
    default: ''
  },
  enrolledCourses: [{
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    progress: {
      type: Number,
      default: 0
    },
    completedLessons: [{
      type: mongoose.Schema.Types.ObjectId
    }],
    enrolledAt: {
      type: Date,
      default: Date.now
    },
    lastAccessed: {
      type: Date,
      default: Date.now
    }
  }],
  subscriptionStatus: {
    type: String,
    enum: ['free', 'active', 'expired'],
    default: 'free'
  },
  subscriptionExpiry: {
    type: Date,
    default: null
  },
  activeCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  skillStreak: {
    current: { type: Number, default: 0 },
    longest: { type: Number, default: 0 },
    lastActivity: { type: Date, default: null }
  },
  badges: [{
    name: String,
    earnedAt: { type: Date, default: Date.now }
  }],
  role: {
    type: String,
    enum: ['student', 'instructor', 'admin'],
    default: 'student'
  }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
