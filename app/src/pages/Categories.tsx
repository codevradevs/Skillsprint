import { motion } from 'framer-motion';
import { useCategories } from '@/hooks/useCourses';
import { CategoryCard } from '@/components/CategoryCard';
import { Loader2 } from 'lucide-react';

export const Categories = () => {
  const { categories, loading } = useCategories();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Browse by Category
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explore our wide range of courses across 14 different categories. 
            Find the perfect skill to boost your income and career.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {Object.entries(categories).map(([key, category]) => (
              <motion.div key={key} variants={itemVariants}>
                <CategoryCard categoryKey={key} category={category} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Featured Categories Section */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Most Popular</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { key: 'tech-development', name: 'Tech & Development', desc: 'Build websites, apps, and software skills' },
                { key: 'freelancing', name: 'Freelancing', desc: 'Start earning on Fiverr, Upwork & more' },
                { key: 'ecommerce', name: 'E-commerce', desc: 'Build your online business empire' }
              ].map((cat) => (
                <div
                  key={cat.key}
                  className="bg-[#1a1a1a] rounded-xl p-6 border border-white/5 hover:border-purple-500/30 transition-all"
                >
                  <h3 className="text-lg font-semibold text-white mb-2">{cat.name}</h3>
                  <p className="text-gray-400 text-sm">{cat.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
