import React from 'react';
import { BookOpen, Target, Trophy, Clock, TrendingUp, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { LiveStream } from '../Video/LiveStream';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    {
      icon: BookOpen,
      label: 'Courses Completed',
      value: '2',
      color: 'bg-blue-500'
    },
    {
      icon: Target,
      label: 'Assessment Score',
      value: user?.completedAssessment ? '85%' : 'Not Taken',
      color: 'bg-green-500'
    },
    {
      icon: Trophy,
      label: 'Certificates Earned',
      value: user?.certificates.length || '0',
      color: 'bg-yellow-500'
    },
    {
      icon: Clock,
      label: 'Study Time',
      value: '24 hours',
      color: 'bg-purple-500'
    }
  ];

  const recentActivity = [
    { action: 'Completed Live Lab: SQL Injection', time: '2 hours ago', type: 'completion' },
    { action: 'Started Live Lab: Broken Access Control', time: '1 day ago', type: 'start' },
    { action: 'Passed Assessment Test', time: '3 days ago', type: 'achievement' },
    { action: 'Earned Certificate: OWASP Top 10', time: '1 week ago', type: 'certificate' }
  ];

  return (
    <div className="p-6 space-y-8 bg-gray-900 dark:bg-gray-900 light:bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white dark:text-white light:text-gray-900">Welcome back, {user?.name}!</h1>
          <p className="text-gray-300 dark:text-gray-300 light:text-gray-600 mt-2">Continue your cybersecurity learning journey</p>
        </div>
        <div className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2 rounded-lg">
          <Shield className="h-5 w-5" />
          <span className="font-medium">Level: {user?.level}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white dark:bg-gray-800 light:bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 dark:text-gray-300 light:text-gray-600 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-white dark:text-white light:text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Progress */}
        <div className="bg-white dark:bg-gray-800 light:bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-white dark:text-white light:text-gray-900 mb-4">Current Progress</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-300 dark:text-gray-300 light:text-gray-600 mb-1">
                <span>OWASP Top 10 Course</span>
                <span>3/10 modules</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 light:bg-gray-200 rounded-full h-2">
                <div className="bg-orange-600 h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm text-gray-300 dark:text-gray-300 light:text-gray-600 mb-1">
                <span>Live Security Labs</span>
                <span>2/6 completed</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 light:bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '33%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm text-gray-300 dark:text-gray-300 light:text-gray-600 mb-1">
                <span>Skill Assessment</span>
                <span>{user?.completedAssessment ? 'Completed' : 'Pending'}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 light:bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-600 h-2 rounded-full" style={{ width: user?.completedAssessment ? '100%' : '0%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 light:bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-white dark:text-white light:text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'completion' ? 'bg-green-500' :
                  activity.type === 'start' ? 'bg-blue-500' :
                  activity.type === 'achievement' ? 'bg-purple-500' :
                  'bg-yellow-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm text-white dark:text-white light:text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-400 light:text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 light:bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-white dark:text-white light:text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-500 to-red-600 text-white p-4 rounded-lg hover:from-orange-600 hover:to-red-700 transition-all">
            <Target className="h-5 w-5" />
            <span>Take Assessment</span>
          </button>
          <button className="flex items-center justify-center space-x-2 bg-gradient-to-r from-gray-700 to-gray-800 text-white p-4 rounded-lg hover:from-gray-800 hover:to-gray-900 transition-all">
            <BookOpen className="h-5 w-5" />
            <span>Continue Course</span>
          </button>
          <button className="flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white p-4 rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all">
            <TrendingUp className="h-5 w-5" />
            <span>View Progress</span>
          </button>
        </div>
      </div>

      {/* Live Stream Section */}
      <div>
        <h2 className="text-2xl font-bold text-white dark:text-white light:text-gray-900 mb-6">Live Training Sessions</h2>
        <LiveStream
          streamId="live-owasp-session"
          title="Live OWASP Top 10 Deep Dive"
          instructor="Dr. Sarah Chen"
          onJoin={() => console.log('Joined live stream')}
          onLeave={() => console.log('Left live stream')}
        />
      </div>
    </div>
  );
};