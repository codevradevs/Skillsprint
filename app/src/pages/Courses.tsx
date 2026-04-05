import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCourses, useCategories } from '@/hooks/useCourses';
import { CourseCard } from '@/components/CourseCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, X } from 'lucide-react';

export const Courses = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const categoryParam = searchParams.get('category') || undefined;
  const levelParam = searchParams.get('level') || undefined;

  const { courses, loading, pagination, refetch } = useCourses({
    category: categoryParam,
    level: levelParam,
    search: searchQuery || undefined
  });

  const { categories } = useCategories();

  const handleCategoryChange = (value: string) => {
    if (value === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', value);
    }
    setSearchParams(searchParams);
  };

  const handleLevelChange = (value: string) => {
    if (value === 'all') {
      searchParams.delete('level');
    } else {
      searchParams.set('level', value);
    }
    setSearchParams(searchParams);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
    setSearchQuery('');
  };

  const hasFilters = categoryParam || levelParam || searchQuery;

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">All Courses</h1>
          <p className="text-gray-400">Browse our collection of 100+ practical skills courses</p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#1a1a1a] border-white/10 text-white placeholder:text-gray-500"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 p-4 bg-[#1a1a1a] rounded-xl border border-white/10"
            >
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Category</label>
                  <Select value={categoryParam || 'all'} onValueChange={handleCategoryChange}>
                    <SelectTrigger className="bg-[#0a0a0a] border-white/10 text-white">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a1a] border-white/10">
                      <SelectItem value="all">All Categories</SelectItem>
                      {Object.entries(categories).map(([key, cat]) => (
                        <SelectItem key={key} value={key}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Level</label>
                  <Select value={levelParam || 'all'} onValueChange={handleLevelChange}>
                    <SelectTrigger className="bg-[#0a0a0a] border-white/10 text-white">
                      <SelectValue placeholder="All Levels" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a1a] border-white/10">
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>
          )}

          {hasFilters && (
            <div className="flex items-center gap-2 mt-4">
              <span className="text-sm text-gray-400">Active filters:</span>
              {categoryParam && (
                <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm flex items-center gap-1">
                  {categories[categoryParam]?.name}
                  <button onClick={() => { searchParams.delete('category'); setSearchParams(searchParams); }}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {levelParam && (
                <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm flex items-center gap-1">
                  {levelParam.charAt(0).toUpperCase() + levelParam.slice(1)}
                  <button onClick={() => { searchParams.delete('level'); setSearchParams(searchParams); }}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm flex items-center gap-1">
                  "{searchQuery}"
                  <button onClick={() => setSearchQuery('')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button onClick={clearFilters} className="text-sm text-purple-400 hover:text-purple-300">
                Clear all
              </button>
            </div>
          )}
        </motion.div>

        {/* Course Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-[#1a1a1a] rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        ) : courses.length > 0 ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {courses.map((course, index) => (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <CourseCard course={course} />
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {[...Array(pagination.pages)].map((_, i) => (
                  <Button
                    key={i}
                    variant={pagination.page === i + 1 ? 'default' : 'outline'}
                    onClick={() => refetch(i + 1)}
                    className={pagination.page === i + 1 
                      ? 'bg-purple-500 text-white' 
                      : 'border-white/20 text-white hover:bg-white/10'
                    }
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-800 flex items-center justify-center">
              <Search className="w-10 h-10 text-gray-500" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">No courses found</h2>
            <p className="text-gray-400">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>
    </div>
  );
};
