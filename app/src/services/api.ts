import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

export const authAPI = {
  register: (data: { name: string; email: string; password: string; phone: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data: Partial<{ name: string; phone: string; avatar: string }>) =>
    api.put('/auth/profile', data)
};

export const courseAPI = {
  getAll: (params?: { category?: string; level?: string; search?: string; page?: number; limit?: number }) =>
    api.get('/courses', { params }),
  getBySlug: (slug: string) => api.get(`/courses/${slug}`),
  getFeatured: () => api.get('/courses/featured'),
  getCategories: () => api.get('/courses/categories')
};

export const enrollmentAPI = {
  getMyEnrollments: () => api.get('/enrollments'),
  getStats: () => api.get('/enrollments/stats'),
  getDetails: (courseSlug: string) => api.get(`/enrollments/${courseSlug}`),
  checkCanStart: (courseId: string) => api.get(`/enrollments/can-start/${courseId}`),
  updateProgress: (data: { courseId: string; lessonId: string; moduleIndex?: number }) =>
    api.post('/enrollments/progress', data),
  submitTask: (data: { courseId: string; taskId: string; submission: string }) =>
    api.post('/enrollments/task', data)
};

export const paymentAPI = {
  stkPush: (data: { phone: string; amount: number; courseId?: string; paymentType?: 'course' | 'subscription' | 'task' | 'certificate' }) =>
    api.post('/payments/stk', data),
  testEnroll: (courseId: string) =>
    api.post('/payments/test-enroll', { courseId }),
  testSubscribe: () =>
    api.post('/payments/test-subscribe'),
  checkStatus: (checkoutRequestID: string) =>
    api.get(`/payments/status/${checkoutRequestID}`),
  getHistory: () => api.get('/payments/history')
};
