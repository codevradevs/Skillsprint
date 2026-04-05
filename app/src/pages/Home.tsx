import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useFeaturedCourses } from '@/hooks/useCourses';
import { useCategories } from '@/hooks/useCourses';
import { CourseCard } from '@/components/CourseCard';
import { CategoryCard } from '@/components/CategoryCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Target, TrendingUp, Play, Users, Award } from 'lucide-react';

export const Home = () => {
  const navigate = useNavigate();
  const { courses: featuredCourses, loading: coursesLoading } = useFeaturedCourses();
  const { categories, loading: categoriesLoading } = useCategories();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-8"
            >
              <Zap className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-300">Learn Skills. Make Money.</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Master Skills That{' '}
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Pay Real Money
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
              Short, practical courses designed for Kenyans. No theory, just results. 
              Start earning within days, not months.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate('/courses')}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-6 text-lg rounded-xl"
              >
                Explore Courses
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/register')}
                className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Free
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-8 mt-12 text-gray-400">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>10,000+ Students</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                <span>100+ Courses</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <span>85% Success Rate</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <Zap className="w-6 h-6" />,
                title: 'Learn Fast',
                description: '15-60 minute lessons. No fluff, just actionable skills you can use immediately.',
                gradient: 'from-yellow-500 to-orange-500'
              },
              {
                icon: <Target className="w-6 h-6" />,
                title: 'Real Tasks',
                description: 'Every course includes hands-on tasks. Build your portfolio while you learn.',
                gradient: 'from-purple-500 to-pink-500'
              },
              {
                icon: <TrendingUp className="w-6 h-6" />,
                title: 'Make Money',
                description: 'Courses designed with earning potential in mind. Start your side hustle today.',
                gradient: 'from-green-500 to-emerald-500'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative p-8 bg-[#1a1a1a] rounded-2xl border border-white/5 hover:border-purple-500/30 transition-all">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-4`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Browse Categories</h2>
              <p className="text-gray-400">Find the perfect skill for your goals</p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate('/categories')}
              className="hidden sm:flex border-white/20 text-white hover:bg-white/10"
            >
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {!categoriesLoading && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4"
            >
              {Object.entries(categories).slice(0, 7).map(([key, category]) => (
                <motion.div key={key} variants={itemVariants}>
                  <CategoryCard categoryKey={key} category={category} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Featured Courses</h2>
              <p className="text-gray-400">Handpicked courses to get you started</p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate('/courses')}
              className="hidden sm:flex border-white/20 text-white hover:bg-white/10"
            >
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {!coursesLoading && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {featuredCourses.map((course) => (
                <motion.div key={course._id} variants={itemVariants}>
                  <CourseCard course={course} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900 to-blue-900 p-12 lg:p-20"
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
            
            <div className="relative text-center max-w-2xl mx-auto">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Ready to Start Your Journey?
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                Join thousands of Kenyans learning skills that pay. Your first course is waiting.
              </p>
              <Button
                size="lg"
                onClick={() => navigate('/register')}
                className="bg-white text-purple-900 hover:bg-gray-100 px-8 py-6 text-lg rounded-xl"
              >
                Get Started for Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
