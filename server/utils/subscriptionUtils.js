const User = require('../models/User');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

const ACTIVE_COURSE_LIMIT = 3; // max concurrent active courses on subscription

const checkSubscription = async (userId) => {
  const user = await User.findById(userId).select('subscriptionStatus subscriptionExpiry');
  if (user.subscriptionStatus !== 'active') return false;
  if (user.subscriptionExpiry && new Date() > new Date(user.subscriptionExpiry)) {
    await User.findByIdAndUpdate(userId, { subscriptionStatus: 'expired' });
    return false;
  }
  return true;
};

/**
 * Full access check for a course enrollment.
 * Returns { hasAccess, enrollment, reason }
 */
const checkCourseAccess = async (userId, courseId) => {
  const enrollment = await Enrollment.findOne({ user: userId, course: courseId });
  if (!enrollment) return { hasAccess: false, enrollment: null, reason: 'not_enrolled' };

  if (enrollment.accessType === 'purchased') {
    return { hasAccess: true, enrollment };
  }

  // Subscription access
  const isSubscribed = await checkSubscription(userId);
  if (!isSubscribed) {
    return { hasAccess: false, enrollment, reason: 'subscription_expired' };
  }

  return { hasAccess: true, enrollment };
};

/**
 * Check if a module is unlocked based on drip schedule.
 * moduleIndex 0 is always unlocked.
 * Each subsequent module unlocks after dripDays * moduleIndex days from enrollment.
 */
const isModuleUnlocked = (enrollment, moduleIndex, dripDays) => {
  if (!dripDays || dripDays === 0 || moduleIndex === 0) return true;
  const enrolledAt = new Date(enrollment.enrolledAt);
  const daysElapsed = Math.floor((Date.now() - enrolledAt) / (1000 * 60 * 60 * 24));
  return daysElapsed >= dripDays * moduleIndex;
};

/**
 * Check if prerequisite course is completed.
 */
const checkPrerequisite = async (userId, prerequisiteSlug) => {
  if (!prerequisiteSlug) return { met: true };
  const prereqCourse = await Course.findOne({ slug: prerequisiteSlug }).select('_id title');
  if (!prereqCourse) return { met: true };
  const prereqEnrollment = await Enrollment.findOne({ user: userId, course: prereqCourse._id });
  if (!prereqEnrollment || prereqEnrollment.progress < 100) {
    return { met: false, courseTitle: prereqCourse.title, courseSlug: prerequisiteSlug };
  }
  return { met: true };
};

/**
 * Check if user is within active course limit for subscription users.
 * Active = enrolled via subscription AND progress < 100.
 */
const checkActiveCourseLimit = async (userId, newCourseId) => {
  const user = await User.findById(userId).select('subscriptionStatus activeCourses');
  if (user.subscriptionStatus !== 'active') return { allowed: true };

  // Count active subscription courses (in progress, not completed)
  const activeEnrollments = await Enrollment.find({
    user: userId,
    accessType: 'subscription',
    progress: { $lt: 100 }
  });

  const alreadyActive = activeEnrollments.some(e => e.course.toString() === newCourseId.toString());
  if (alreadyActive) return { allowed: true };

  if (activeEnrollments.length >= ACTIVE_COURSE_LIMIT) {
    return {
      allowed: false,
      reason: `You can only have ${ACTIVE_COURSE_LIMIT} active courses at a time on your subscription. Complete one to unlock another.`,
      activeCount: activeEnrollments.length,
      limit: ACTIVE_COURSE_LIMIT
    };
  }

  return { allowed: true };
};

module.exports = {
  checkSubscription,
  checkCourseAccess,
  isModuleUnlocked,
  checkPrerequisite,
  checkActiveCourseLimit,
  ACTIVE_COURSE_LIMIT
};
