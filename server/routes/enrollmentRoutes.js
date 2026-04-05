const express = require('express');
const router = express.Router();
const {
  getMyEnrollments,
  getEnrollmentDetails,
  updateProgress,
  submitTask,
  getDashboardStats,
  checkCanStartCourse
} = require('../controllers/enrollmentController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getMyEnrollments);
router.get('/stats', protect, getDashboardStats);
router.get('/can-start/:courseId', protect, checkCanStartCourse);
router.get('/:courseSlug', protect, getEnrollmentDetails);
router.post('/progress', protect, updateProgress);
router.post('/task', protect, submitTask);

module.exports = router;
