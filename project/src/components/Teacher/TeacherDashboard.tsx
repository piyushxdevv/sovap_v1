import React, { useState, useEffect } from 'react';
import { BookOpen, Users, PlusCircle, BarChart, Edit, Trash2, Eye, Upload } from 'lucide-react';
import { courseService } from '../../services/courseService';
import { Course, CourseModule } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

export const TeacherDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState('overview');
  const [courses, setCourses] = useState<Course[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadTeacherCourses();
    }
  }, [user]);

  const loadTeacherCourses = async () => {
    try {
      setLoading(true);
      const data = await courseService.getCoursesByTeacher(user!.id);
      setCourses(data);
    } catch (error) {
      console.error('Failed to load courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await courseService.deleteCourse(courseId);
        setCourses(courses.filter(c => c.id !== courseId));
      } catch (error) {
        console.error('Failed to delete course:', error);
      }
    }
  };

  const handleTogglePublish = async (course: Course) => {
    try {
      const updated = await courseService.updateCourse(course.id, {
        is_published: !course.is_published
      });
      setCourses(courses.map(c => c.id === course.id ? updated : c));
    } catch (error) {
      console.error('Failed to update course:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-2">
              Teacher Dashboard
            </h1>
            <p className="text-slate-300">Create and manage your cybersecurity courses</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <PlusCircle className="h-5 w-5" />
            <span>Create Course</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm border border-green-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-300 text-sm font-medium">My Courses</p>
                <p className="text-3xl font-bold text-white">{courses.length}</p>
              </div>
              <BookOpen className="h-12 w-12 text-green-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm font-medium">Published</p>
                <p className="text-3xl font-bold text-white">{courses.filter(c => c.is_published).length}</p>
              </div>
              <Eye className="h-12 w-12 text-blue-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm font-medium">Total Students</p>
                <p className="text-3xl font-bold text-white">{courses.reduce((sum, c) => sum + c.enrollment_count, 0)}</p>
              </div>
              <Users className="h-12 w-12 text-purple-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-300 text-sm font-medium">Avg Rating</p>
                <p className="text-3xl font-bold text-white">
                  {courses.length > 0 ? (courses.reduce((sum, c) => sum + c.rating, 0) / courses.length).toFixed(1) : '0.0'}
                </p>
              </div>
              <BarChart className="h-12 w-12 text-orange-400" />
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6">My Courses</h2>
          
          {courses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No courses yet</h3>
              <p className="text-slate-400 mb-6">Start creating your first cybersecurity course to share with students.</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-blue-600 transition-all duration-200"
              >
                Create Your First Course
              </button>
            </div>
          ) : (
            <div className="grid gap-6">
              {courses.map((course) => (
                <div key={course.id} className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30 hover:border-slate-500/50 transition-all duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-white">{course.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          course.difficulty === 'advanced' ? 'bg-red-500/20 text-red-400' :
                          course.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {course.difficulty}
                        </span>
                        {course.is_published ? (
                          <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-medium">
                            Published
                          </span>
                        ) : (
                          <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-medium">
                            Draft
                          </span>
                        )}
                      </div>
                      <p className="text-slate-300 mb-4">{course.description}</p>
                      <div className="flex items-center space-x-6 text-sm text-slate-400">
                        <span>{course.enrollment_count} students enrolled</span>
                        <span>⭐ {course.rating.toFixed(1)} rating</span>
                        <span>{course.estimated_hours}h estimated</span>
                        <span>Created {new Date(course.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-6">
                      <button
                        onClick={() => handleTogglePublish(course)}
                        className={`p-2 rounded-lg transition-colors ${
                          course.is_published
                            ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                            : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                        }`}
                        title={course.is_published ? 'Unpublish' : 'Publish'}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setEditingCourse(course)}
                        className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(course.id)}
                        className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Course Modal */}
      {(showCreateForm || editingCourse) && (
        <CourseForm
          course={editingCourse}
          onSave={(savedCourse) => {
            if (editingCourse) {
              setCourses(courses.map(c => c.id === savedCourse.id ? savedCourse : c));
            } else {
              setCourses([savedCourse, ...courses]);
            }
            setShowCreateForm(false);
            setEditingCourse(null);
          }}
          onCancel={() => {
            setShowCreateForm(false);
            setEditingCourse(null);
          }}
        />
      )}
    </div>
  );
};

// Course Form Component
interface CourseFormProps {
  course?: Course | null;
  onSave: (course: Course) => void;
  onCancel: () => void;
}

const CourseForm: React.FC<CourseFormProps> = ({ course, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: course?.title || '',
    description: course?.description || '',
    category: course?.category || '',
    difficulty: course?.difficulty || 'beginner',
    estimated_hours: course?.estimated_hours || 0,
    is_published: course?.is_published || false
  });
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('User not found. Please log in again.');
      return;
    }
    
    try {
      setSaving(true);
      
      if (course) {
        // Update existing course
        const updated = await courseService.updateCourse(course.id, formData);
        onSave(updated);
      } else {
        // Create new course
        console.log('Creating course with teacher_id:', user.id);
        const newCourse = await courseService.createCourse({
          ...formData,
          teacher_id: user!.id,
        });
        onSave(newCourse);
      }
    } catch (error) {
      console.error('Save failed:', error);
      alert(`Failed to save course: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {course ? 'Edit Course' : 'Create New Course'}
          </h2>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Course Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g., Advanced Web Application Security"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Describe what students will learn in this course"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Category
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g., Web Security, Network Security"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Difficulty
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as any }))}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Estimated Hours
            </label>
            <input
              type="number"
              value={formData.estimated_hours}
              onChange={(e) => setFormData(prev => ({ ...prev, estimated_hours: parseInt(e.target.value) || 0 }))}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="How many hours will this course take?"
              min="0"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_published"
              checked={formData.is_published}
              onChange={(e) => setFormData(prev => ({ ...prev, is_published: e.target.checked }))}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-slate-600 rounded bg-slate-700"
            />
            <label htmlFor="is_published" className="ml-2 block text-sm text-slate-300">
              Publish course immediately
            </label>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-slate-600 text-slate-300 rounded-xl hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl hover:from-green-600 hover:to-blue-600 disabled:opacity-50 transition-all duration-200"
            >
              {saving ? 'Saving...' : course ? 'Update Course' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};