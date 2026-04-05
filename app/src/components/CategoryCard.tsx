import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface CategoryCardProps {
  category: {
    name: string;
    icon: string;
    count: number;
  };
  categoryKey: string;
}

export const CategoryCard = ({ category, categoryKey }: CategoryCardProps) => {
  const categoryGradients: Record<string, string> = {
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

  const gradient = categoryGradients[categoryKey] || 'from-purple-500 to-blue-500';

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link
        to={`/courses?category=${categoryKey}`}
        className="block group"
      >
        <div className="relative bg-[#1a1a1a] rounded-2xl p-6 border border-white/5 hover:border-purple-500/30 transition-all duration-300 overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
          
          <div className="relative z-10">
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
              {category.icon}
            </div>
            
            <h3 className="font-bold text-white text-lg group-hover:text-purple-400 transition-colors">
              {category.name}
            </h3>
            
            <p className="text-gray-400 text-sm mt-1">
              {category.count} {category.count === 1 ? 'course' : 'courses'}
            </p>
          </div>

          <div className={`absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br ${gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity duration-300`} />
        </div>
      </Link>
    </motion.div>
  );
};
