import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Course } from '@/types';
import { Progress } from '@/components/ui/progress';
import { Clock, Users, Star, TrendingUp, Play } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  showProgress?: boolean;
  variant?: 'default' | 'compact';
}

export const CourseCard = ({ course, showProgress = false, variant = 'default' }: CourseCardProps) => {
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

  if (variant === 'compact') {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="group relative bg-[#1a1a1a] rounded-xl overflow-hidden border border-white/5 hover:border-purple-500/30 transition-all"
      >
        <Link to={`/courses/${course.slug}`}>
          <div className="relative h-32 overflow-hidden">
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${gradient} opacity-20`} />
            {showProgress && course.progress !== undefined && (
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60">
                <Progress value={course.progress} className="h-1" />
              </div>
            )}
          </div>
          <div className="p-3">
            <h3 className="font-semibold text-white text-sm line-clamp-2">{course.title}</h3>
            <p className="text-xs text-gray-400 mt-1">Ksh {(course.price ?? 0).toLocaleString()}</p>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group relative bg-[#1a1a1a] rounded-2xl overflow-hidden border border-white/5 hover:border-purple-500/30 transition-all duration-300"
    >
      <Link to={`/courses/${course.slug}`}>
        <div className="relative h-48 overflow-hidden">
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${gradient} opacity-20`} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent" />
          
          {course.isEnrolled && (
            <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <Play className="w-3 h-3" />
              Enrolled
            </div>
          )}
          
          {course.originalPrice && course.originalPrice > course.price && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {Math.round((1 - course.price / course.originalPrice) * 100)}% OFF
            </div>
          )}

          <div className="absolute bottom-3 left-3 right-3">
            <span className={`text-xs font-medium px-2 py-1 rounded-full bg-gradient-to-r ${gradient} text-white`}>
              {course.category?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') ?? 'Course'}
            </span>
          </div>
        </div>

        <div className="p-5">
          <h3 className="font-bold text-white text-lg line-clamp-2 group-hover:text-purple-400 transition-colors">
            {course.title}
          </h3>
          
          <p className="text-gray-400 text-sm mt-2 line-clamp-2">
            {course.shortDescription || course.description}
          </p>

          {course.earningsPotential && (
            <div className="flex items-center gap-1 mt-3 text-green-400 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>{course.earningsPotential}</span>
            </div>
          )}

          <div className="flex items-center gap-4 mt-4 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{course.duration ?? 0} mins</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{(course.enrolledCount ?? 0).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400" />
              <span>{(course.rating?.average ?? 0).toFixed(1)}</span>
            </div>
          </div>

          {showProgress && course.progress !== undefined && (
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Progress</span>
                <span className="text-purple-400">{course.progress}%</span>
              </div>
              <Progress value={course.progress} className="h-2" />
            </div>
          )}

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white">Ksh {(course.price ?? 0).toLocaleString()}</span>
              {course.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  Ksh {course.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${
              course.level === 'beginner' ? 'bg-green-500/20 text-green-400' :
              course.level === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              {course.level ? course.level.charAt(0).toUpperCase() + course.level.slice(1) : 'Beginner'}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
