import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { LoginForm } from './components/Auth/LoginForm';
import { RegisterForm } from './components/Auth/RegisterForm';
import { Dashboard } from './components/Dashboard/Dashboard';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { TeacherDashboard } from './components/Teacher/TeacherDashboard';
import { AssessmentTest } from './components/Assessment/AssessmentTest';
import { CourseList } from './components/Courses/CourseList';
import { CourseDetail } from './components/Courses/CourseDetail';
import { AssessmentAnalytics } from './components/Admin/AssessmentAnalytics';
import { LabsList } from './components/Labs/LabsList';
import { LabViewer } from './components/Labs/LabViewer';
import { Certificates } from './components/Certificates/Certificates';
import { Profile } from './components/Profile/Profile';
import { Chatbot } from './components/Chatbot/Chatbot';
import { VideoLibrary } from './components/Video/VideoLibrary';
import { TechnicalQuestions } from './components/TechnicalInterview/TechnicalQuestions';
import { NotesTab } from './components/Notes/NotesTab';

const AppContent = () => {
  const { user, isAdmin, isTeacher, isStudent } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedLabId, setSelectedLabId] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);

  // Show auth forms if user is not logged in
  if (!user) {
    return isLoginMode ? (
      <LoginForm onToggleMode={() => setIsLoginMode(false)} />
    ) : (
      <RegisterForm onToggleMode={() => setIsLoginMode(true)} />
    );
  }

  const renderContent = () => {
    // Handle course detail view
    if (activeTab === 'courses' && selectedCourseId) {
      return (
        <CourseDetail
          courseId={selectedCourseId}
          onBack={() => setSelectedCourseId(null)}
        />
      );
    }

    // Handle lab viewer
    if (activeTab === 'labs' && selectedLabId) {
      return (
        <LabViewer
          labId={selectedLabId}
          onBack={() => setSelectedLabId(null)}
        />
      );
    }

    // Handle main tabs
    switch (activeTab) {
      // Admin routes
      case 'analytics':
        return isAdmin() ? <AssessmentAnalytics /> : <Dashboard />;
      
      // Teacher routes  
      case 'my-courses':
      case 'create-course':
      case 'students':
        return isTeacher() ? <TeacherDashboard /> : <Dashboard />;
      
      case 'dashboard':
        return <Dashboard />;
      case 'assessment':
        return isAdmin() ? <AssessmentAnalytics /> : <AssessmentTest />;
      case 'courses':
        return <CourseList onCourseSelect={setSelectedCourseId} />;
      case 'videos':
        return <VideoLibrary />;
      case 'labs':
        return <LabsList onLabSelect={setSelectedLabId} />;
      case 'technical':
        return <TechnicalQuestions />;
      case 'certificates':
        return <Certificates />;
      case 'notes':
        return <NotesTab />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header onChatToggle={() => setIsChatOpen(!isChatOpen)} />
      <div className="flex">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1">
          {renderContent()}
        </main>
      </div>
      <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;