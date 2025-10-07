import React, { useState } from 'react';
import { Shield, Eye, EyeOff, GraduationCap, Users, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface LoginFormProps {
  onToggleMode: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onToggleMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'teacher' | 'student'>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await (login as (email: string, password: string, role: 'admin' | 'teacher' | 'student') => Promise<boolean>)(email, password, role);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-lg w-full space-y-8 animate-fade-in">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Shield className="h-20 w-20 text-orange-500 animate-pulse" />
              <div className="absolute inset-0 h-20 w-20 text-orange-500 animate-ping opacity-20">
                <Shield className="h-full w-full" />
              </div>
            </div>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-3">
            Career Connect - Full Career Development Platform
          </h2>
          <p className="text-xl text-slate-300">Gain the skills and knowledge to succeed in your career</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 space-y-6 border border-white/20">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 animate-scale-in">
              <p className="text-red-200 text-sm text-center">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-slate-200 mb-3">
                Select Your Role
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`group p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                    role === 'student' 
                      ? 'border-blue-400 bg-blue-500/20 text-blue-300 shadow-lg shadow-blue-500/25' 
                      : 'border-slate-600 hover:border-slate-500 text-slate-400 hover:text-slate-300'
                  }`}
                >
                  <GraduationCap className="h-8 w-8 mx-auto mb-2 group-hover:animate-bounce" />
                  <div className="text-sm font-medium">Student</div>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('teacher')}
                  className={`group p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                    role === 'teacher' 
                      ? 'border-green-400 bg-green-500/20 text-green-300 shadow-lg shadow-green-500/25' 
                      : 'border-slate-600 hover:border-slate-500 text-slate-400 hover:text-slate-300'
                  }`}
                >
                  <Users className="h-8 w-8 mx-auto mb-2 group-hover:animate-bounce" />
                  <div className="text-sm font-medium">Teacher</div>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`group p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                    role === 'admin' 
                      ? 'border-purple-400 bg-purple-500/20 text-purple-300 shadow-lg shadow-purple-500/25' 
                      : 'border-slate-600 hover:border-slate-500 text-slate-400 hover:text-slate-300'
                  }`}
                >
                  <Settings className="h-8 w-8 mx-auto mb-2 group-hover:animate-bounce" />
                  <div className="text-sm font-medium">Admin</div>
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-200 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-4 bg-slate-800/50 border border-slate-600 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-200 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-4 pr-12 bg-slate-800/50 border border-slate-600 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-300 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-medium rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="text-center">
            <button
              type="button"
              onClick={onToggleMode}
              className="text-orange-400 hover:text-orange-300 text-sm font-medium transition-colors duration-300 hover:underline"
            >
              Don't have an account? Sign up
            </button>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-slate-200 mb-4 text-center">Demo Credentials</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3">
              <div className="text-blue-300 font-medium mb-1">Student</div>
              <div className="text-slate-400">student@demo.com</div>
              <div className="text-slate-400">password</div>
            </div>
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3">
              <div className="text-green-300 font-medium mb-1">Teacher</div>
              <div className="text-slate-400">teacher@demo.com</div>
              <div className="text-slate-400">password</div>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-3">
              <div className="text-purple-300 font-medium mb-1">Admin</div>
              <div className="text-slate-400">admin@demo.com</div>
              <div className="text-slate-400">password</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};