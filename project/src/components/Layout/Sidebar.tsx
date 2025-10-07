import React from 'react';
import { Home, BookOpen, FlaskRound as Flask, Trophy, User, BarChart, Video, Building2, FileText, Settings, Users, PlusCircle, BarChart3 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar = ({ activeTab, onTabChange }) => {
  const { isAdmin, isTeacher, isStudent } = useAuth();

  // Admin menu items
  const adminMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'assessment', label: 'Assessment Analytics', icon: BarChart },
    { id: 'courses', label: 'All Courses', icon: BookOpen },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  // Teacher menu items
  const teacherMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'my-courses', label: 'My Courses', icon: BookOpen },
    { id: 'create-course', label: 'Create Course', icon: PlusCircle },
    { id: 'students', label: 'My Students', icon: Users },
    { id: 'notes', label: 'Study Notes', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  // Student menu items
  const studentMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'notes', label: 'Study Notes', icon: FileText },
    { id: 'videos', label: 'Video Library', icon: Video },
    { id: 'assessment', label: 'Assessment Test', icon: BarChart },
    { id: 'labs', label: 'Labs', icon: Flask },
    { id: 'technical', label: 'Jobs', icon: Building2 },
    { id: 'certificates', label: 'Certificates', icon: Trophy },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  // Get menu items based on role
  const getMenuItems = () => {
    if (isAdmin()) return adminMenuItems;
    if (isTeacher()) return teacherMenuItems;
    return studentMenuItems;
  };

  const menuItems = getMenuItems();

  return (
    <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white w-72 min-h-screen p-6 border-r border-slate-700 shadow-2xl">
      {/* Role Badge */}
      <div className="mb-8">
        <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
          isAdmin() ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
          isTeacher() ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
          'bg-blue-500/20 text-blue-300 border border-blue-500/30'
        }`}>
          {isAdmin() ? (
            <>
              <Settings className="h-4 w-4 mr-2" />
              Administrator
            </>
          ) : isTeacher() ? (
            <>
              <Users className="h-4 w-4 mr-2" />
              Teacher
            </>
          ) : (
            <>
              <User className="h-4 w-4 mr-2" />
              Student
            </>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg transform scale-105'
                  : 'hover:bg-slate-700/50 text-slate-300 hover:text-white hover:transform hover:scale-105'
              }`}
            >
              <Icon className={`h-5 w-5 transition-transform duration-200 ${
                activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'
              }`} />
              <span className="font-medium">{item.label}</span>
              {activeTab === item.id && (
                <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Stats */}
      <div className="mt-8 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
        <h3 className="text-sm font-medium text-slate-400 mb-3">Quick Stats</h3>
        <div className="space-y-2">
          {isStudent() && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Courses</span>
                <span className="text-white font-medium">3</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Progress</span>
                <span className="text-green-400 font-medium">65%</span>
              </div>
            </>
          )}
          {isTeacher() && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">My Courses</span>
                <span className="text-white font-medium">5</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Students</span>
                <span className="text-green-400 font-medium">127</span>
              </div>
            </>
          )}
          {isAdmin() && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Total Users</span>
                <span className="text-white font-medium">1,234</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Active Courses</span>
                <span className="text-green-400 font-medium">45</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};