import React, { useState, useEffect } from 'react';
import { Users, BookOpen, BarChart3, Eye, Crown, GraduationCap, TrendingUp } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { supabase } from '../../lib/supabase';
import type { User } from '../../types';

type Role = 'student' | 'teacher' | 'admin';
type View = 'overview' | 'users' | 'courses' | 'analytics';

interface DashboardStats {
  users: { teachers: number; students: number; total: number };
  courses: { total: number; published: number; draft: number };
  enrollments: { total: number; thisMonth: number };
}

interface CourseItem {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  is_published: boolean;
  enrollment_count: number;
  teacher?: { id: string; name: string } | null;
}

export const AdminDashboard = () => {
  const [activeView, setActiveView] = useState<View>('overview');
  const [users, setUsers] = useState<(User & { role?: Role; created_at?: string | Date; level?: 'beginner' | 'intermediate' | 'advanced' })[]>([]);
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    // Realtime updates for users, courses, and enrollments
    const channel = supabase
      .channel('admin-dashboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => {
        loadDashboardData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'courses' }, () => {
        loadDashboardData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'course_enrollments' }, () => {
        loadDashboardData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadDashboardData = async (): Promise<void> => {
    try {
      setLoading(true);
      const [usersData, coursesData, statsData] = await Promise.all<[
        ReturnType<typeof adminService.getAllUsers>,
        ReturnType<typeof adminService.getAllCourses>,
        ReturnType<typeof adminService.getDashboardStats>
      ]>([
        adminService.getAllUsers(),
        adminService.getAllCourses(),
        adminService.getDashboardStats()
      ]);
      
      setUsers(usersData as unknown as (User & { role?: Role; created_at?: string | Date; level?: 'beginner' | 'intermediate' | 'advanced' })[]);
      setCourses(coursesData as unknown as CourseItem[]);
      setStats(statsData as unknown as DashboardStats);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: Role) => {
    try {
      await adminService.updateUserRole(userId, newRole);
      setUsers(users.map(u => (u.id === userId ? { ...u, role: newRole } : u)));
    } catch (error) {
      console.error('Failed to update user role:', error);
    }
  };

  const handleCourseStatusToggle = async (courseId: string, isPublished: boolean) => {
    try {
      await adminService.updateCourseStatus(courseId, isPublished);
      setCourses(courses.map(c => (c.id === courseId ? { ...c, is_published: isPublished } : c)));
    } catch (error) {
      console.error('Failed to update course status:', error);
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-2">
            Admin Dashboard
          </h1>
          <p className="text-slate-300">Manage users, courses, and platform analytics</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-slate-800/50 p-1 rounded-2xl backdrop-blur-sm border border-slate-700">
          {([
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'courses', label: 'Courses', icon: BookOpen },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp }
          ] as { id: View; label: string; icon: React.ComponentType<{ className?: string }> }[]).map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-200 ${
                  activeView === tab.id
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Overview */}
        {activeView === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-300 text-sm font-medium">Total Students</p>
                    <p className="text-3xl font-bold text-white">{stats?.users?.students || 0}</p>
                  </div>
                  <GraduationCap className="h-12 w-12 text-blue-400" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm border border-green-500/30 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-300 text-sm font-medium">Total Teachers</p>
                    <p className="text-3xl font-bold text-white">{stats?.users?.teachers || 0}</p>
                  </div>
                  <Users className="h-12 w-12 text-green-400" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-300 text-sm font-medium">Published Courses</p>
                    <p className="text-3xl font-bold text-white">{stats?.courses?.published || 0}</p>
                  </div>
                  <BookOpen className="h-12 w-12 text-purple-400" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-500/30 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-300 text-sm font-medium">Total Enrollments</p>
                    <p className="text-3xl font-bold text-white">{stats?.enrollments?.total || 0}</p>
                  </div>
                  <TrendingUp className="h-12 w-12 text-orange-400" />
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {users.slice(0, 5).map((user) => (
                  <div key={user.id} className="flex items-center space-x-4 p-4 bg-slate-700/30 rounded-xl">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' :
                      user.role === 'teacher' ? 'bg-green-500/20 text-green-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {user.role === 'admin' ? <Crown className="h-5 w-5" /> :
                       user.role === 'teacher' ? <Users className="h-5 w-5" /> :
                       <GraduationCap className="h-5 w-5" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{user.name}</p>
                      <p className="text-slate-400 text-sm">Joined as {user.role}</p>
                    </div>
                    <div className="text-slate-400 text-sm">
                      {new Date(user.created_at ?? Date.now()).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users Management */}
        {activeView === 'users' && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">User Management</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-slate-300 font-medium">User</th>
                    <th className="text-left py-3 px-4 text-slate-300 font-medium">Role</th>
                    <th className="text-left py-3 px-4 text-slate-300 font-medium">Level</th>
                    <th className="text-left py-3 px-4 text-slate-300 font-medium">Joined</th>
                    <th className="text-left py-3 px-4 text-slate-300 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                            user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' :
                            user.role === 'teacher' ? 'bg-green-500/20 text-green-400' :
                            'bg-blue-500/20 text-blue-400'
                          }`}>
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-white font-medium">{user.name}</p>
                            <p className="text-slate-400 text-sm">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value as any)}
                          className="bg-slate-700 text-white rounded-lg px-3 py-1 text-sm border border-slate-600"
                        >
                          <option value="student">Student</option>
                          <option value="teacher">Teacher</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.level === 'advanced' ? 'bg-red-500/20 text-red-400' :
                          user.level === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {user.level}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-300 text-sm">
                        {new Date(user.created_at ?? Date.now()).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        <button className="text-blue-400 hover:text-blue-300 transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Courses Management */}
        {activeView === 'courses' && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Course Management</h2>
            <div className="grid gap-6">
              {courses.map((course) => (
                <div key={course.id} className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                      <p className="text-slate-300 mb-4">{course.description}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-slate-400">
                          Teacher: {course.teacher?.name || 'Unknown'}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          course.difficulty === 'advanced' ? 'bg-red-500/20 text-red-400' :
                          course.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {course.difficulty}
                        </span>
                        <span className="text-slate-400">
                          {course.enrollment_count} enrolled
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleCourseStatusToggle(course.id, !course.is_published)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          course.is_published
                            ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                            : 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                        }`}
                      >
                        {course.is_published ? 'Published' : 'Draft'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics */}
        {activeView === 'analytics' && (
          <div className="space-y-8">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Platform Analytics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-700/30 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">User Growth</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">This Month</span>
                      <span className="text-green-400 font-medium">+{stats?.enrollments?.thisMonth || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Users</span>
                      <span className="text-white font-medium">{stats?.users?.total || 0}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-700/30 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Course Statistics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Published</span>
                      <span className="text-green-400 font-medium">{stats?.courses?.published || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Draft</span>
                      <span className="text-yellow-400 font-medium">{stats?.courses?.draft || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};