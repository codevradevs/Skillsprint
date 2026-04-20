import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { enrollmentAPI } from '@/services/api';
import { CourseCard } from '@/components/CourseCard';
import { PaymentModal } from '@/components/PaymentModal';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import type { DashboardStats, Enrollment } from '@/types';
import {
  BookOpen,
  Trophy,
  Flame,
  Award,
  Crown,
  ArrowRight,
  Zap,
  CheckCircle
} from 'lucide-react';

export const Dashboard = () => {
  const { user, fetchUser } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [, setLoading] = useState(true);
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, enrollRes] = await Promise.all([
          enrollmentAPI.getStats(),
          enrollmentAPI.getMyEnrollments()
        ]);
        setStats(statsRes.data.data);
        setEnrollments(enrollRes.data.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const completedEnrollments = enrollments.filter(e => e.progress === 100 && e.course);
  const inProgressCourses = user?.enrolledCourses?.filter(e => e.course && e.progress > 0 && e.progress < 100) || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Welcome back, {user?.name?.split(' ')[0]}!</h1>
              <p className="text-gray-400">Keep up the momentum. You're doing great!</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { icon: <BookOpen className="w-5 h-5" />, label: 'Courses', value: stats?.totalCourses || 0, color: 'from-blue-500 to-cyan-500' },
            { icon: <Trophy className="w-5 h-5" />, label: 'Completed', value: stats?.completedCourses || 0, color: 'from-green-500 to-emerald-500' },
            { icon: <Flame className="w-5 h-5" />, label: 'Day Streak', value: stats?.skillStreak?.current || 0, color: 'from-orange-500 to-red-500' },
            { icon: <Award className="w-5 h-5" />, label: 'Badges', value: stats?.badges?.length || 0, color: 'from-purple-500 to-pink-500' }
          ].map((stat, index) => (
            <motion.div key={index} variants={itemVariants} className="bg-[#1a1a1a] rounded-xl p-4 border border-white/5">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-3`}>
                {stat.icon}
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Subscription Banner */}
        {user?.subscriptionStatus === 'active' && stats && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 p-5 bg-[#1a1a1a] rounded-xl border border-purple-500/20">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <Crown className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-white font-semibold text-sm">Premium Active</p>
                  {stats.subscriptionExpiry && (
                    <p className="text-gray-400 text-xs">Renews {new Date(stats.subscriptionExpiry).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-white text-sm font-semibold">{stats.activeSubscriptionCourses} / {stats.activeCourseLimit} active slots used</p>
                  <p className="text-gray-400 text-xs">Complete a course to free up a slot</p>
                </div>
                <div className="w-24 bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      stats.activeSubscriptionCourses >= stats.activeCourseLimit ? 'bg-red-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${(stats.activeSubscriptionCourses / stats.activeCourseLimit) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {user?.subscriptionStatus !== 'active' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-xl border border-purple-500/20"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <Crown className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Upgrade to Premium</h3>
                  <p className="text-gray-400 text-sm">Get unlimited access to all 100+ courses</p>
                  <p className="text-yellow-400 text-sm font-semibold mt-0.5">Ksh 500 / month</p>
                </div>
              </div>
              <Button
                onClick={() => setShowUpgrade(true)}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
              >
                Upgrade Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Continue Learning */}
        {inProgressCourses.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Continue Learning</h2>
              <Link to="/courses" className="text-purple-400 text-sm hover:text-purple-300">View all</Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {inProgressCourses.slice(0, 3).map((enrollment) => (
                <Link
                  key={enrollment.course._id}
                  to={`/courses/${enrollment.course.slug}`}
                  className="bg-[#1a1a1a] rounded-xl p-4 border border-white/5 hover:border-purple-500/30 transition-all"
                >
                  <div className="flex gap-4">
                    <img src={enrollment.course.image} alt={enrollment.course.title} className="w-20 h-20 rounded-lg object-cover" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-white line-clamp-2">{enrollment.course.title}</h3>
                      <div className="mt-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">Progress</span>
                          <span className="text-purple-400">{enrollment.progress}%</span>
                        </div>
                        <Progress value={enrollment.progress} className="h-2" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {/* My Courses */}
        {user?.enrolledCourses && user.enrolledCourses.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">My Courses</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {user.enrolledCourses.filter(e => e.course).slice(0, 6).map((enrollment) => (
                <CourseCard
                  key={enrollment.course._id}
                  course={{ ...enrollment.course, progress: enrollment.progress, isEnrolled: true }}
                  showProgress
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {(!user?.enrolledCourses || user.enrolledCourses.length === 0) && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-purple-500/10 flex items-center justify-center">
              <Zap className="w-10 h-10 text-purple-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Start Your Journey</h2>
            <p className="text-gray-400 mb-6">You haven't enrolled in any courses yet. Let's change that!</p>
            <Link to="/courses">
              <Button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                Browse Courses
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        )}

        {/* Achievements */}
        {completedEnrollments.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-xl font-bold text-white mb-4">Your Achievements</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedEnrollments.map((enrollment) => (
                <Link
                  key={enrollment._id}
                  to={`/learn/${enrollment.course.slug}`}
                  className="flex items-center gap-4 p-4 bg-[#1a1a1a] rounded-xl border border-green-500/20 hover:border-green-500/40 transition-all"
                >
                  <img src={enrollment.course.image} alt={enrollment.course.title} className="w-16 h-16 rounded-lg object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-sm line-clamp-2">{enrollment.course.title}</h3>
                    <div className="flex items-center gap-1 mt-1 text-green-400 text-xs">
                      <CheckCircle className="w-3 h-3" />
                      <span>Completed</span>
                    </div>
                    {enrollment.certificateIssued && (
                      <div className="flex items-center gap-1 mt-1 text-yellow-400 text-xs">
                        <Trophy className="w-3 h-3" />
                        <span>Certificate earned</span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Upgrade Modal */}
      <PaymentModal
        isOpen={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        amount={500}
        courseTitle="Premium Subscription"
        paymentType="subscription"
        onSuccess={() => {
          setShowUpgrade(false);
          fetchUser();
        }}
      />
    </div>
  );
};
