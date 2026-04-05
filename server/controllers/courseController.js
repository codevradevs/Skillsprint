const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

const getAllCourses = async (req, res) => {
  try {
    const { category, level, search, page = 1, limit = 12 } = req.query;
    
    let query = { isPublished: true };
    
    if (category) query.category = category;
    if (level) query.level = level;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const courses = await Course.find(query)
      .select('title slug image price originalPrice category level rating duration enrolledCount earningsPotential shortDescription')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Course.countDocuments(query);

    res.json({
      success: true,
      data: courses,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(count / limit),
        total: count
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCourseBySlug = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug });
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    let isEnrolled = false;
    let progress = 0;
    
    if (req.user) {
      const enrollment = await Enrollment.findOne({
        user: req.user._id,
        course: course._id
      });
      if (enrollment) {
        isEnrolled = true;
        progress = enrollment.progress;
      }
    }

    res.json({
      success: true,
      data: { ...course.toObject(), isEnrolled, progress }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFeaturedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isFeatured: true, isPublished: true })
      .select('title slug image price originalPrice category level rating duration enrolledCount earningsPotential shortDescription isFeatured')
      .limit(6);

    res.json({
      success: true,
      data: courses
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Course.distinct('category', { isPublished: true });
    
    const categoryData = {
      'tech-development': { name: 'Tech & Development', icon: '💻', count: 0 },
      'cybersecurity': { name: 'Cybersecurity', icon: '🔐', count: 0 },
      'mobile-android': { name: 'Mobile & Android', icon: '📱', count: 0 },
      'design-creative': { name: 'Design & Creative', icon: '🎨', count: 0 },
      'video-content': { name: 'Video & Content', icon: '🎬', count: 0 },
      'freelancing': { name: 'Freelancing', icon: '💼', count: 0 },
      'ecommerce': { name: 'E-commerce', icon: '🛒', count: 0 },
      'digital-marketing': { name: 'Digital Marketing', icon: '📈', count: 0 },
      'social-media': { name: 'Social Media', icon: '📱', count: 0 },
      'productivity-mindset': { name: 'Productivity', icon: '🧠', count: 0 },
      'finance-money': { name: 'Finance', icon: '💰', count: 0 },
      'career-survival': { name: 'Career', icon: '🎯', count: 0 },
      'ai-automation': { name: 'AI & Automation', icon: '🤖', count: 0 },
      'local-skills': { name: 'Local Skills', icon: '🇰🇪', count: 0 }
    };

    for (const cat of categories) {
      const count = await Course.countDocuments({ category: cat, isPublished: true });
      if (categoryData[cat]) {
        categoryData[cat].count = count;
      }
    }

    res.json({
      success: true,
      data: categoryData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json({
      success: true,
      data: course
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllCourses,
  getCourseBySlug,
  getFeaturedCourses,
  getCategories,
  createCourse,
  updateCourse,
  deleteCourse
};
