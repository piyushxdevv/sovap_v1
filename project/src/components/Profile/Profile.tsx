import React from 'react';
import { User, Award, BookOpen, Target, Clock, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Profile: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const achievements = [
    { id: 1, title: 'First Steps', description: 'Completed your first assessment', icon: Target, earned: user.completedAssessment },
    { id: 2, title: 'Knowledge Seeker', description: 'Completed 3 course modules', icon: BookOpen, earned: false },
    { id: 3, title: 'Lab Expert', description: 'Completed 5 hands-on labs', icon: Star, earned: false },
    { id: 4, title: 'Security Pro', description: 'Earned your first certificate', icon: Award, earned: user.certificates.length > 0 },
  ];

  const skillProgress = [
    { skill: 'Web Application Security', progress: 65, color: 'bg-blue-500' },
    { skill: 'Network Security', progress: 30, color: 'bg-green-500' },
    { skill: 'Cryptography', progress: 45, color: 'bg-purple-500' },
    { skill: 'Incident Response', progress: 20, color: 'bg-red-500' },
    { skill: 'Penetration Testing', progress: 35, color: 'bg-yellow-500' },
  ];

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile</h1>

        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
              <User className="h-12 w-12 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              <div className="mt-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  user.level === 'advanced' ? 'bg-red-100 text-red-800' :
                  user.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {user.level.charAt(0).toUpperCase() + user.level.slice(1)} Level
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-cyan-600">85%</div>
              <div className="text-gray-600">Overall Progress</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Skills Progress */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Skill Progress</h3>
            <div className="space-y-4">
              {skillProgress.map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>{skill.skill}</span>
                    <span>{skill.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`${skill.color} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${skill.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Learning Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <BookOpen className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">3</div>
                <div className="text-gray-600 text-sm">Modules Completed</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Target className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">2</div>
                <div className="text-gray-600 text-sm">Labs Completed</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Clock className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">24</div>
                <div className="text-gray-600 text-sm">Hours Studied</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Award className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{user.certificates.length}</div>
                <div className="text-gray-600 text-sm">Certificates</div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => {
              const Icon = achievement.icon;
              return (
                <div key={achievement.id} className={`p-4 rounded-lg border-2 ${
                  achievement.earned 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      achievement.earned 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-bold ${
                        achievement.earned ? 'text-green-800' : 'text-gray-500'
                      }`}>
                        {achievement.title}
                      </h4>
                      <p className={`text-sm ${
                        achievement.earned ? 'text-green-700' : 'text-gray-400'
                      }`}>
                        {achievement.description}
                      </p>
                    </div>
                    {achievement.earned && (
                      <Award className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="flex-1 text-gray-900">Completed Assessment Test</span>
              <span className="text-gray-500 text-sm">2 hours ago</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="flex-1 text-gray-900">Started OWASP Top 10 Course</span>
              <span className="text-gray-500 text-sm">1 day ago</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="flex-1 text-gray-900">Joined CyberSec Academy</span>
              <span className="text-gray-500 text-sm">3 days ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};