const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  videoUrl: String,
  content: String,
  duration: Number,
  order: {
    type: Number,
    required: true
  },
  resources: [{
    name: String,
    url: String,
    type: String
  }],
  isPreview: {
    type: Boolean,
    default: false
  }
});

const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  order: {
    type: Number,
    required: true
  },
  lessons: [lessonSchema]
});

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  submissionType: {
    type: String,
    enum: ['file', 'link', 'text', 'none'],
    default: 'none'
  },
  instructions: String
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a course title'],
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    required: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  shortDescription: {
    type: String,
    maxlength: 200
  },
  image: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  tier: {
    type: String,
    enum: ['free', 'standard', 'premium'],
    default: 'standard'
    // free     = accessible with free account (preview only)
    // standard = accessible with subscription OR direct purchase
    // premium  = must purchase directly, subscription NOT enough
  },
  taskPrice: {
    type: Number,
    default: 0  // 0 = tasks included, >0 = pay to unlock tasks
  },
  certPrice: {
    type: Number,
    default: 300  // KES to get certificate
  },
  prerequisiteSlug: {
    type: String,
    default: null  // slug of course that must be completed first
  },
  dripDays: {
    type: Number,
    default: 0  // 0 = all modules unlocked immediately, >0 = drip schedule
  },
  category: {
    type: String,
    required: true,
    enum: [
      'tech-development',
      'cybersecurity',
      'mobile-android',
      'design-creative',
      'video-content',
      'freelancing',
      'ecommerce',
      'digital-marketing',
      'social-media',
      'productivity-mindset',
      'finance-money',
      'career-survival',
      'ai-automation',
      'local-skills'
    ]
  },
  subcategory: String,
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  duration: {
    type: Number,
    default: 0
  },
  modules: [moduleSchema],
  tasks: [taskSchema],
  whatYouWillLearn: [String],
  requirements: [String],
  targetAudience: [String],
  instructor: {
    name: String,
    bio: String,
    avatar: String
  },
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  enrolledCount: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  tags: [String],
  earningsPotential: {
    type: String,
    default: ''
  }
}, { timestamps: true });

courseSchema.index({ category: 1, isPublished: 1 });
courseSchema.index({ slug: 1 });

module.exports = mongoose.model('Course', courseSchema);
