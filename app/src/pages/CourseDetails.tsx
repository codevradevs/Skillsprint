import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCourse } from '@/hooks/useCourses';
import { useAuthStore } from '@/store/authStore';
import { PaymentModal } from '@/components/PaymentModal';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Clock,
  Users,
  Star,
  TrendingUp,
  Play,
  CheckCircle,
  Lock,
  BookOpen,
  Award,
  ArrowLeft,
  Crown,
  Zap,
  Calendar
} from 'lucide-react';

export const CourseDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { course, loading } = useCourse(slug || '');
  const { isAuthenticated } = useAuthStore();
  const [showPayment, setShowPayment] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Course Not Found</h1>
          <p className="text-gray-400 mb-4">The course you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/courses')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Button>
        </div>
      </div>
    );
  }

  const totalLessons = course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0);
  const totalDuration = course.modules.reduce((acc, mod) => 
    acc + mod.lessons.reduce((sum, lesson) => sum + (lesson.duration || 0), 0), 0
  );

  const categoryColors: Record<string, string> = {
    'tech-development': 'from-blue-500 to-cyan-500',
    'cybersecurity': 'from-green-500 to-emerald-500',
    'mobile-android': 'from-purple-500 to-pink-500',
    'design-creative': 'from-pink-500 to-rose-500',
    'video-content': 'from-red-500 to-orange-500',
    'freelancing': 'from-amber-500 to-yellow-500',
    'ecommerce': 'from-orange-500 to-amber-500',
    'digital-marketing': 'from-indigo-500 to-purple-500',
    'social-media': 'from-violet-500 to-purple-500',
    'productivity-mindset': 'from-teal-500 to-cyan-500',
    'finance-money': 'from-green-500 to-lime-500',
    'career-survival': 'from-blue-500 to-indigo-500',
    'ai-automation': 'from-fuchsia-500 to-purple-500',
    'local-skills': 'from-red-500 to-pink-500'
  };

  const gradient = categoryColors[course.category] || 'from-purple-500 to-blue-500';

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Section */}
      <div className="relative">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10`} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Button
            variant="ghost"
            onClick={() => navigate('/courses')}
            className="mb-6 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Button>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${gradient} text-white mb-4`}>
                  {course.category?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </span>

                {/* Tier badge */}
                {course.tier === 'premium' && (
                  <span className="inline-flex items-center gap-1 ml-2 px-3 py-1 rounded-full text-sm font-medium bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 mb-4">
                    <Crown className="w-3 h-3" /> Premium Course — Direct Purchase Only
                  </span>
                )}
                {course.tier === 'free' && (
                  <span className="inline-flex items-center gap-1 ml-2 px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 border border-green-500/40 text-green-400 mb-4">
                    <Zap className="w-3 h-3" /> Free Preview
                  </span>
                )}

                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">{course.title}</h1>
                
                <p className="text-gray-400 text-lg mb-6">{course.description}</p>

                {course.earningsPotential && (
                  <div className="flex items-center gap-2 mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 font-medium">{course.earningsPotential}</span>
                  </div>
                )}

                {/* Prerequisite warning */}
                {course.prerequisiteSlug && (
                  <div className="flex items-center gap-2 mb-4 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                    <Lock className="w-5 h-5 text-orange-400" />
                    <span className="text-orange-400 text-sm">Prerequisite: Complete <a href={`/courses/${course.prerequisiteSlug}`} className="underline font-semibold">{course.prerequisiteSlug}</a> first</span>
                  </div>
                )}

                {/* Drip schedule notice */}
                {course.dripDays && course.dripDays > 0 && (
                  <div className="flex items-center gap-2 mb-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    <span className="text-blue-400 text-sm">Content drips every {course.dripDays} day(s) — one module at a time to maximise learning</span>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-6 mb-8 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <span className="text-white font-medium">{course.rating.average.toFixed(1)}</span>
                    <span>({course.rating.count} reviews)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span>{course.enrolledCount.toLocaleString()} students</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span>{totalDuration} mins total</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    <span>{totalLessons} lessons</span>
                  </div>
                </div>

                {/* What You'll Learn */}
                {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 && (
                  <div className="bg-[#1a1a1a] rounded-xl p-6 mb-8">
                    <h2 className="text-xl font-bold text-white mb-4">What You'll Learn</h2>
                    <div className="grid md:grid-cols-2 gap-3">
                      {course.whatYouWillLearn.map((item, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-300">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Course Content */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-white mb-4">Course Content</h2>
                  <div className="bg-[#1a1a1a] rounded-xl overflow-hidden">
                    <Accordion type="single" collapsible className="w-full">
                      {course.modules.map((module, moduleIndex) => (
                        <AccordionItem key={module._id} value={module._id} className="border-white/5">
                          <AccordionTrigger className="px-6 py-4 hover:bg-white/5 text-white">
                            <div className="flex items-center gap-4 text-left">
                              <span className="text-purple-400 font-medium">Module {moduleIndex + 1}</span>
                              <span>{module.title}</span>
                              <span className="text-gray-500 text-sm">({module.lessons.length} lessons)</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-6 pb-4">
                            <div className="space-y-2">
                              {module.lessons.map((lesson, lessonIndex) => (
                                <div
                                  key={lesson._id}
                                  className="flex items-center justify-between p-3 bg-[#0a0a0a] rounded-lg"
                                >
                                  <div className="flex items-center gap-3">
                                    {course.isEnrolled ? (
                                      <Play className="w-4 h-4 text-purple-400" />
                                    ) : (
                                      <Lock className="w-4 h-4 text-gray-500" />
                                    )}
                                    <span className="text-gray-300">{lessonIndex + 1}. {lesson.title}</span>
                                  </div>
                                  {lesson.duration && (
                                    <span className="text-gray-500 text-sm">{lesson.duration} min</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </div>

                {/* Requirements */}
                {course.requirements && course.requirements.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-white mb-4">Requirements</h2>
                    <ul className="space-y-2">
                      {course.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-300">
                          <span className="text-purple-400 mt-1">•</span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-24 bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden">
                <div className="relative h-48">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${gradient} opacity-20`} />
                </div>

                <div className="p-6">
                  {course.isEnrolled ? (
                    <>
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-400">Your Progress</span>
                          <span className="text-purple-400">{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>
                      <Button
                        onClick={() => navigate(`/learn/${course.slug}`)}
                        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-6"
                      >
                        <Play className="w-5 h-5 mr-2" />
                        {course.progress === 0 ? 'Start Learning' : 'Continue Learning'}
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="flex items-baseline gap-3 mb-4">
                        <span className="text-3xl font-bold text-white">Ksh {course.price.toLocaleString()}</span>
                        {course.originalPrice && (
                          <span className="text-lg text-gray-500 line-through">
                            Ksh {course.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>

                      {isAuthenticated ? (
                        <Button
                          onClick={() => setShowPayment(true)}
                          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-6"
                        >
                          <Award className="w-5 h-5 mr-2" />
                          Unlock Course
                        </Button>
                      ) : (
                        <Button
                          onClick={() => navigate('/login', { state: { from: `/courses/${course.slug}` } })}
                          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-6"
                        >
                          Sign in to Enroll
                        </Button>
                      )}

                      <p className="text-center text-gray-500 text-sm mt-4">
                        One-time payment • Lifetime access
                      </p>
                    </>
                  )}

                  <div className="mt-6 pt-6 border-t border-white/5">
                    <h3 className="font-semibold text-white mb-3">This course includes:</h3>
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li className="flex items-center gap-2">
                        <Play className="w-4 h-4" />
                        {totalDuration} minutes on-demand video
                      </li>
                      <li className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        {totalLessons} lessons
                      </li>
                      <li className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-yellow-400" />
                        {course.certPrice && course.certPrice > 0
                          ? <span>Certificate <span className="text-yellow-400">— Ksh {course.certPrice}</span></span>
                          : 'Certificate of completion'}
                      </li>
                      {course.taskPrice && course.taskPrice > 0 && (
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-purple-400" />
                          <span>Task unlock <span className="text-purple-400">— Ksh {course.taskPrice}</span></span>
                        </li>
                      )}
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Lifetime access
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        courseId={course._id}
        amount={course.price}
        courseTitle={course.title}
        onSuccess={() => navigate(`/learn/${course.slug}`)}
      />
    </div>
  );
};
