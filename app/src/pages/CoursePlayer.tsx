import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { enrollmentAPI } from '@/services/api';
import { useCourse } from '@/hooks/useCourses';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import {
  CheckCircle,
  Play,
  ChevronLeft,
  ChevronRight,
  Download,
  Check,
  ArrowLeft,
  Lock
} from 'lucide-react';

export const CoursePlayer = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { course, loading: courseLoading } = useCourse(slug || '');
  const [enrollment, setEnrollment] = useState<any>(null);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [taskSubmission, setTaskSubmission] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
  const [accessError, setAccessError] = useState('');
  const [moduleUnlockStatus, setModuleUnlockStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchEnrollment = async () => {
      if (!slug) return;
      try {
        const response = await enrollmentAPI.getDetails(slug);
        setEnrollment(response.data.data);
        if (response.data.meta?.moduleUnlockStatus) {
          const statusMap: Record<string, boolean> = {};
          response.data.meta.moduleUnlockStatus.forEach((m: any) => {
            statusMap[m.moduleId] = m.unlocked;
          });
          setModuleUnlockStatus(statusMap);
        }
      } catch (error: any) {
        if (error.response?.status === 403) {
          setAccessError(error.response.data.message);
        } else {
          console.error('Failed to fetch enrollment:', error);
        }
      }
    };

    fetchEnrollment();
  }, [slug]);

  if (courseLoading || !course) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!enrollment) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <h1 className="text-2xl font-bold text-white mb-2">
            {accessError ? 'Access Denied' : 'Not Enrolled'}
          </h1>
          <p className="text-gray-400 mb-6">
            {accessError || 'You need to purchase this course to access it.'}
          </p>
          {accessError?.includes('subscription') ? (
            <Button onClick={() => navigate('/dashboard')} className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
              Renew Subscription
            </Button>
          ) : (
            <Button onClick={() => navigate(`/courses/${slug}`)}>
              Go to Course Page
            </Button>
          )}
        </div>
      </div>
    );
  }

  const currentModule = course.modules[currentModuleIndex];
  const currentLesson = currentModule?.lessons[currentLessonIndex];

  const isLessonCompleted = (lessonId: string) => {
    return enrollment.completedLessons.some((cl: any) => cl.lessonId === lessonId);
  };

  const handleLessonComplete = async () => {
    if (!currentLesson) return;
    
    try {
      await enrollmentAPI.updateProgress({
        courseId: course._id,
        lessonId: currentLesson._id,
        moduleIndex: currentModuleIndex
      });
      
      const response = await enrollmentAPI.getDetails(slug || '');
      setEnrollment(response.data.data);
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };

  const handleNextLesson = () => {
    if (currentLessonIndex < currentModule.lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    } else if (currentModuleIndex < course.modules.length - 1) {
      setCurrentModuleIndex(currentModuleIndex + 1);
      setCurrentLessonIndex(0);
    }
  };

  const handlePrevLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    } else if (currentModuleIndex > 0) {
      setCurrentModuleIndex(currentModuleIndex - 1);
      setCurrentLessonIndex(course.modules[currentModuleIndex - 1].lessons.length - 1);
    }
  };

  const handleTaskSubmit = async () => {
    if (!taskSubmission.trim()) return;
    
    try {
      await enrollmentAPI.submitTask({
        courseId: course._id,
        taskId: course.tasks[0]?._id,
        submission: taskSubmission
      });
      
      setTaskSubmission('');
      alert('Task submitted successfully!');
    } catch (error) {
      console.error('Failed to submit task:', error);
    }
  };

  const totalLessons = course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0);
  const completedLessons = enrollment.completedLessons.length;
  const progress = Math.round((completedLessons / totalLessons) * 100);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#1a1a1a] border-b border-white/5">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/courses/${slug}`)}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="hidden sm:block">
              <h1 className="text-white font-medium line-clamp-1">{course.title}</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:block w-48">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">Progress</span>
                <span className="text-purple-400">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSidebar(!showSidebar)}
              className="text-gray-400"
            >
              {showSidebar ? 'Hide' : 'Show'} Content
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Main Content */}
        <div className={`flex-1 transition-all ${showSidebar ? 'lg:mr-80' : ''}`}>
          <AnimatePresence mode="wait">
            {currentLesson && (
              <motion.div
                key={currentLesson._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Video Player */}
                <div className="aspect-video bg-black relative">
                  {currentLesson.videoUrl ? (
                    <video
                      src={currentLesson.videoUrl}
                      controls
                      className="w-full h-full"
                      poster={course.image}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Play className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-500">Video content coming soon</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Lesson Content */}
                <div className="p-6 max-w-4xl mx-auto">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <span className="text-purple-400 text-sm">
                        Module {currentModuleIndex + 1}, Lesson {currentLessonIndex + 1}
                      </span>
                      <h2 className="text-2xl font-bold text-white mt-1">{currentLesson.title}</h2>
                    </div>
                    {!isLessonCompleted(currentLesson._id) && (
                      <Button
                        onClick={handleLessonComplete}
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Mark Complete
                      </Button>
                    )}
                    {isLessonCompleted(currentLesson._id) && (
                      <div className="flex items-center gap-2 text-green-400">
                        <CheckCircle className="w-5 h-5" />
                        <span>Completed</span>
                      </div>
                    )}
                  </div>

                  {currentLesson.content && (
                    <div className="prose prose-invert max-w-none mb-8">
                      <div dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
                    </div>
                  )}

                  {currentLesson.resources && currentLesson.resources.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-white mb-3">Resources</h3>
                      <div className="space-y-2">
                        {currentLesson.resources.map((resource, index) => (
                          <a
                            key={index}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-lg text-gray-300 hover:text-white hover:bg-[#252525] transition-colors"
                          >
                            <Download className="w-5 h-5" />
                            {resource.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Task Section */}
                  {course.tasks && course.tasks.length > 0 && currentModuleIndex === course.modules.length - 1 && currentLessonIndex === currentModule.lessons.length - 1 && (
                    <div className="bg-[#1a1a1a] rounded-xl p-6 mb-8">
                      <h3 className="text-lg font-semibold text-white mb-3">Course Task</h3>
                      <p className="text-gray-400 mb-4">{course.tasks[0].description}</p>
                      <Textarea
                        value={taskSubmission}
                        onChange={(e) => setTaskSubmission(e.target.value)}
                        placeholder="Enter your task submission..."
                        className="bg-[#0a0a0a] border-white/10 text-white mb-4"
                      />
                      <Button onClick={handleTaskSubmit} className="bg-purple-500 text-white">
                        Submit Task
                      </Button>
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <Button
                      variant="outline"
                      onClick={handlePrevLesson}
                      disabled={currentModuleIndex === 0 && currentLessonIndex === 0}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleNextLesson}
                      disabled={currentModuleIndex === course.modules.length - 1 && currentLessonIndex === currentModule.lessons.length - 1}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        {showSidebar && (
          <div className="fixed right-0 top-[57px] bottom-0 w-80 bg-[#1a1a1a] border-l border-white/5 overflow-y-auto hidden lg:block">
            <div className="p-4">
              <h3 className="font-semibold text-white mb-4">Course Content</h3>
              
              {course.modules.map((module, mIndex) => {
                const isUnlocked = moduleUnlockStatus[module._id] !== false;
                return (
                <div key={module._id} className="mb-4">
                  <div className={`text-sm mb-2 flex items-center gap-2 ${
                    isUnlocked ? 'text-purple-400' : 'text-gray-600'
                  }`}>
                    {!isUnlocked && <Lock className="w-3 h-3" />}
                    Module {mIndex + 1}: {module.title}
                    {!isUnlocked && <span className="text-xs text-gray-600 ml-auto">Locked</span>}
                  </div>
                  {isUnlocked && (
                    <div className="space-y-1">
                      {module.lessons.map((lesson, lIndex) => {
                        const isCompleted = isLessonCompleted(lesson._id);
                        const isCurrent = mIndex === currentModuleIndex && lIndex === currentLessonIndex;
                        return (
                          <button
                            key={lesson._id}
                            onClick={() => {
                              setCurrentModuleIndex(mIndex);
                              setCurrentLessonIndex(lIndex);
                            }}
                            className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                              isCurrent ? 'bg-purple-500/20 text-white' : 'text-gray-400 hover:bg-white/5'
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                            ) : (
                              <Play className="w-4 h-4 flex-shrink-0" />
                            )}
                            <span className="text-sm line-clamp-2">{lesson.title}</span>
                            {lesson.duration && (
                              <span className="text-xs text-gray-500 ml-auto">{lesson.duration}m</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  {!isUnlocked && (
                    <div className="p-3 rounded-lg bg-white/5 text-center">
                      <Lock className="w-4 h-4 text-gray-600 mx-auto mb-1" />
                      <p className="text-gray-600 text-xs">Unlocks soon</p>
                    </div>
                  )}
                </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
