import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const login = async (email, password, role = 'student') => {
    try {
      const credentials = { email, password, role };
      const loggedInUser = await authService.login(credentials);
      setUser(loggedInUser);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (email, password, name, role = 'student', bio, specialization) => {
    try {
      const userData = { email, password, name, role, bio, specialization };
      const registeredUser = await authService.register(userData);
      setUser(registeredUser);
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateUser = (updates) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('cyberSecUser', JSON.stringify(updatedUser));
    }
  };

  const isAdmin = () => authService.isAdmin();
  const isTeacher = () => authService.isTeacher();
  const isStudent = () => authService.isStudent();

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, isAdmin, isTeacher, isStudent }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (undefined === context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
