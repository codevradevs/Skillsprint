export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  subscriptionStatus: 'free' | 'active' | 'expired';
  skillStreak: {
    current: number;
    longest: number;
    lastActivity: string | null;
  };
  badges: Array<{
    name: string;
    earnedAt: string;
  }>;
  enrolledCourses: Array<{
    course: Course;
    progress: number;
    enrolledAt: string;
  }>;
}

export interface Lesson {
  _id: string;
  title: string;
  description?: string;
  videoUrl?: string;
  content?: string;
  duration?: number;
  order: number;
  resources?: Array<{
    name: string;
    url: string;
    type: string;
  }>;
  isPreview: boolean;
}

export interface Module {
  _id: string;
  title: string;
  description?: string;
  order: number;
  lessons: Lesson[];
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  submissionType: 'file' | 'link' | 'text' | 'none';
  instructions?: string;
}

export interface Course {
  _id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  image: string;
  price: number;
  originalPrice?: number;
  tier: 'free' | 'standard' | 'premium';
  taskPrice?: number;
  certPrice?: number;
  prerequisiteSlug?: string;
  dripDays?: number;
  category: string;
  subcategory?: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  modules: Module[];
  tasks: Task[];
  whatYouWillLearn: string[];
  requirements: string[];
  targetAudience: string[];
  instructor?: {
    name: string;
    bio?: string;
    avatar?: string;
  };
  rating: {
    average: number;
    count: number;
  };
  enrolledCount: number;
  isPublished: boolean;
  isFeatured: boolean;
  tags: string[];
  earningsPotential?: string;
  isEnrolled?: boolean;
  progress?: number;
  createdAt: string;
}

export interface Enrollment {
  _id: string;
  user: string;
  course: Course;
  progress: number;
  completedLessons: Array<{
    lessonId: string;
    completedAt: string;
  }>;
  completedTasks: Array<{
    taskId: string;
    submission: string;
    submittedAt: string;
    reviewed: boolean;
    feedback?: string;
  }>;
  enrolledAt: string;
  completedAt?: string;
  certificateIssued: boolean;
  certificateUrl?: string;
}

export interface Payment {
  _id: string;
  user: string;
  course?: Course;
  paymentType: 'course' | 'subscription';
  phone: string;
  amount: number;
  status: 'pending' | 'success' | 'failed' | 'cancelled';
  mpesaReceipt?: string;
  checkoutRequestID: string;
  createdAt: string;
}

export interface Category {
  name: string;
  icon: string;
  count: number;
}

export interface DashboardStats {
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  totalLessonsCompleted: number;
  skillStreak: {
    current: number;
    longest: number;
    lastActivity: string | null;
  };
  badges: Array<{
    name: string;
    earnedAt: string;
  }>;
  subscriptionStatus: string;
  subscriptionExpiry?: string;
  activeSubscriptionCourses: number;
  activeCourseLimit: number;
}
