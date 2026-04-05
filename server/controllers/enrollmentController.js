const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');
const {
  checkCourseAccess,
  isModuleUnlocked,
  checkPrerequisite,
  checkActiveCourseLimit
} = require('../utils/subscriptionUtils');

const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user._id })
      .populate('course', 'title slug image category duration modules tier dripDays')
      .sort({ enrolledAt: -1 });
    res.json({ success: true, data: enrollments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEnrollmentDetails = async (req, res) => {
  try {
    const { courseSlug } = req.params;
    const course = await Course.findOne({ slug: courseSlug });
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const { hasAccess, enrollment, reason } = await checkCourseAccess(req.user._id, course._id);

    if (!enrollment) return res.status(404).json({ message: 'Not enrolled in this course' });

    if (!hasAccess) {
      return res.status(403).json({
        message: reason === 'subscription_expired'
          ? 'Your subscription has expired. Renew to continue accessing this course.'
          : 'Access denied'
      });
    }

    // Build drip unlock status for each module
    const moduleUnlockStatus = course.modules.map((mod, index) => ({
      moduleId: mod._id,
      unlocked: isModuleUnlocked(enrollment, index, course.dripDays),
      unlocksOnDay: course.dripDays ? course.dripDays * index : 0
    }));

    const populated = await Enrollment.findById(enrollment._id).populate('course');

    res.json({
      success: true,
      data: populated,
      meta: { moduleUnlockStatus, dripDays: course.dripDays }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProgress = async (req, res) => {
  try {
    const { courseId, lessonId, moduleIndex } = req.body;

    const { hasAccess, enrollment, reason } = await checkCourseAccess(req.user._id, courseId);

    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });
    if (!hasAccess) {
      return res.status(403).json({
        message: reason === 'subscription_expired'
          ? 'Your subscription has expired. Renew to continue.'
          : 'Access denied'
      });
    }

    // Enforce drip — check if the module is unlocked
    const course = await Course.findById(courseId);
    if (course.dripDays && moduleIndex !== undefined) {
      if (!isModuleUnlocked(enrollment, moduleIndex, course.dripDays)) {
        const daysLeft = course.dripDays * moduleIndex - Math.floor((Date.now() - new Date(enrollment.enrolledAt)) / (1000 * 60 * 60 * 24));
        return res.status(403).json({
          message: `This module unlocks in ${daysLeft} day(s). Come back then!`
        });
      }
    }

    const alreadyCompleted = enrollment.completedLessons.some(
      cl => cl.lessonId.toString() === lessonId
    );

    if (!alreadyCompleted) {
      enrollment.completedLessons.push({ lessonId, completedAt: new Date() });

      const totalLessons = course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0);
      enrollment.progress = Math.round((enrollment.completedLessons.length / totalLessons) * 100);

      if (enrollment.progress === 100 && !enrollment.completedAt) {
        enrollment.completedAt = new Date();
        await User.findByIdAndUpdate(req.user._id, {
          $push: { badges: { name: `Completed: ${course.title}`, earnedAt: new Date() } }
        });
      }

      await enrollment.save();

      // Update streak
      const userDoc = await User.findById(req.user._id);
      const last = userDoc.skillStreak.lastActivity;
      const now = new Date();
      const diffDays = last ? Math.floor((now - last) / (1000 * 60 * 60 * 24)) : null;
      let streakUpdate;
      if (diffDays === null || diffDays >= 2) {
        streakUpdate = { 'skillStreak.current': 1, 'skillStreak.lastActivity': now };
      } else if (diffDays === 1) {
        const newStreak = userDoc.skillStreak.current + 1;
        streakUpdate = {
          'skillStreak.current': newStreak,
          'skillStreak.lastActivity': now,
          'skillStreak.longest': Math.max(newStreak, userDoc.skillStreak.longest)
        };
      } else {
        streakUpdate = { 'skillStreak.lastActivity': now };
      }
      await User.findByIdAndUpdate(req.user._id, { $set: streakUpdate });
    }

    res.json({ success: true, data: enrollment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const submitTask = async (req, res) => {
  try {
    const { courseId, taskId, submission } = req.body;

    const { hasAccess, enrollment } = await checkCourseAccess(req.user._id, courseId);
    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });
    if (!hasAccess) return res.status(403).json({ message: 'Access denied' });

    // Check if task requires payment
    const course = await Course.findById(courseId).select('taskPrice title');
    if (course.taskPrice > 0) {
      const Payment = require('../models/Payment');
      const taskPayment = await Payment.findOne({
        user: req.user._id,
        course: courseId,
        paymentType: 'task',
        status: 'success'
      });
      if (!taskPayment) {
        return res.status(402).json({
          message: `Task submission requires a one-time payment of Ksh ${course.taskPrice}`,
          taskPrice: course.taskPrice,
          requiresPayment: true
        });
      }
    }

    const existingTask = enrollment.completedTasks.find(ct => ct.taskId.toString() === taskId);
    if (existingTask) {
      existingTask.submission = submission;
      existingTask.submittedAt = new Date();
    } else {
      enrollment.completedTasks.push({ taskId, submission, submittedAt: new Date() });
    }

    await enrollment.save();
    res.json({ success: true, data: enrollment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user._id });
    const user = await User.findById(req.user._id);

    const activeSubscriptionCourses = enrollments.filter(
      e => e.accessType === 'subscription' && e.progress < 100
    ).length;

    res.json({
      success: true,
      data: {
        totalCourses: enrollments.length,
        completedCourses: enrollments.filter(e => e.progress === 100).length,
        inProgressCourses: enrollments.filter(e => e.progress > 0 && e.progress < 100).length,
        totalLessonsCompleted: enrollments.reduce((acc, e) => acc + e.completedLessons.length, 0),
        skillStreak: user.skillStreak,
        badges: user.badges,
        subscriptionStatus: user.subscriptionStatus,
        subscriptionExpiry: user.subscriptionExpiry,
        activeSubscriptionCourses,
        activeCourseLimit: 3
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Check if user can start a new subscription course (active limit)
const checkCanStartCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const result = await checkActiveCourseLimit(req.user._id, courseId);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMyEnrollments,
  getEnrollmentDetails,
  updateProgress,
  submitTask,
  getDashboardStats,
  checkCanStartCourse
};
