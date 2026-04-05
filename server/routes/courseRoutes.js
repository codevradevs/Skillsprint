const express = require('express');
const router = express.Router();
const {
  getAllCourses,
  getCourseBySlug,
  getFeaturedCourses,
  getCategories,
  createCourse,
  updateCourse,
  deleteCourse
} = require('../controllers/courseController');
const { protect, adminOnly, optionalAuth } = require('../middleware/authMiddleware');

router.get('/', getAllCourses);
router.get('/featured', getFeaturedCourses);
router.get('/categories', getCategories);
router.get('/:slug', optionalAuth, getCourseBySlug);
router.post('/', protect, adminOnly, createCourse);
router.put('/:id', protect, adminOnly, updateCourse);
router.delete('/:id', protect, adminOnly, deleteCourse);

module.exports = router;
