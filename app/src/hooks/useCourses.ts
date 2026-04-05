import { useState, useEffect, useCallback } from 'react';
import { courseAPI } from '@/services/api';
import type { Course, Category } from '@/types';

export const useCourses = (params?: { category?: string; level?: string; search?: string }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const category = params?.category;
  const level = params?.level;
  const search = params?.search;

  const fetchCourses = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const response = await courseAPI.getAll({ category, level, search, page });
      setCourses(response.data.data);
      setPagination(response.data.pagination);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  }, [category, level, search]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return { courses, loading, error, pagination, refetch: fetchCourses };
};

export const useCourse = (slug: string) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await courseAPI.getBySlug(slug);
        setCourse(response.data.data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch course');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCourse();
    }
  }, [slug]);

  return { course, loading, error };
};

export const useFeaturedCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await courseAPI.getFeatured();
        setCourses(response.data.data);
      } catch (error) {
        console.error('Failed to fetch featured courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return { courses, loading };
};

export const useCategories = () => {
  const [categories, setCategories] = useState<Record<string, Category>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await courseAPI.getCategories();
        setCategories(response.data.data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading };
};
