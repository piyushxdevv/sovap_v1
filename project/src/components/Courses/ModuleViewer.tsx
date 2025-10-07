import React, { useState } from 'react';
import { ArrowLeft, Play, FileText, FlaskRound as Flask, CheckCircle, Clock } from 'lucide-react';
import { owaspCourses } from '../../data/owaspCourses';
import { ModuleTest } from './ModuleTest';
import { VideoPlayer } from '../Video/VideoPlayer';
import { learningPathService } from '../../services/learningPathService';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

interface ModuleViewerProps {
  courseId: string;
  moduleId: string;
  onBack: () => void;
}

export const ModuleViewer: React.FC<ModuleViewerProps> = ({ courseId, moduleId, onBack }) => {
  const [activeTab, setActiveTab] = useState<'content' | 'lab' | 'test'>('content');
  const [showTest, setShowTest] = useState(false);
  const { user } = useAuth();

  const course = owaspCourses.find(c => c.id === courseId);
  const module = course?.modules.find(m => m.id === moduleId);

  if (!course || !module) {
    return <div>Module not found</div>;
  }

  const handleTestCompletion = async (score: number) => {
    // Update module completion status
    module.completed = true;
    module.testScore = score;
    setShowTest(false);

    // Persist progress and trigger rebalance
    try {
      if (user?.id) {
        await supabase.from('user_progress').upsert([{ user_id: user.id, course_id: courseId, module_id: moduleId, completed: true, quiz_score: score, source: 'adaptive' }]);
        await learningPathService.rebalance(user.id, courseId);
      }
    } catch (e) {
      console.error('Failed to persist progress or rebalance:', e);
    }
  };

  if (showTest) {
    return (
      <ModuleTest
        moduleId={moduleId}
        moduleTitle={module.title}
        onComplete={handleTestCompletion}
        onBack={() => setShowTest(false)}
      />
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Course</span>
          </button>
          
          {module.completed && (
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Completed</span>
            </div>
          )}
        </div>

        {/* Module Info */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{module.title}</h1>
          <p className="text-gray-600 mb-6">{module.description}</p>
          
          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>~2 hours</span>
            </div>
            <div className="flex items-center space-x-1">
              <FileText className="h-4 w-4" />
              <span>Reading Material</span>
            </div>
            {module.labUrl && (
              <div className="flex items-center space-x-1">
                <Flask className="h-4 w-4" />
                <span>Hands-on Lab</span>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('content')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'content'
                    ? 'border-cyan-500 text-cyan-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Content</span>
                </div>
              </button>
              
              {module.labUrl && (
                <button
                  onClick={() => setActiveTab('lab')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'lab'
                      ? 'border-cyan-500 text-cyan-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Flask className="h-4 w-4" />
                    <span>Lab</span>
                  </div>
                </button>
              )}
              
              <button
                onClick={() => setActiveTab('test')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'test'
                    ? 'border-cyan-500 text-cyan-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Test</span>
                </div>
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'content' && (
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: module.content.replace(/\n/g, '<br/>').replace(/```([^`]+)```/g, '<pre class="bg-gray-100 p-4 rounded"><code>$1</code></pre>').replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>').replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mb-4">$1</h1>').replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mb-3 mt-6">$1</h2>').replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold mb-2 mt-4">$1</h3>').replace(/^\- (.+)$/gm, '<li class="ml-4">$1</li>').replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4">$2</li>') }} />
                
                {module.videoUrl && (
                  <div className="mt-8">
                    <h3 className="font-bold text-gray-900 mb-4">Video Lecture</h3>
                    <VideoPlayer
                      videoUrl="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                      title={`${module.title} - Video Lecture`}
                      onProgress={(progress) => console.log('Video progress:', progress)}
                      onComplete={() => console.log('Video completed')}
                    />
                  </div>
                )}
              </div>
            )}

            {activeTab === 'lab' && module.labUrl && (
              <div className="text-center py-8">
                <Flask className="h-16 w-16 text-cyan-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-4">Hands-on Lab</h3>
                <p className="text-gray-600 mb-6">
                  Practice what you've learned with interactive exercises and real-world scenarios.
                </p>
                <button className="bg-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-cyan-700 transition-colors">
                  Start Lab Environment
                </button>
              </div>
            )}

            {activeTab === 'test' && (
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-4">Module Test</h3>
                <p className="text-gray-600 mb-6">
                  Test your understanding of this module with a focused quiz.
                </p>
                {module.testScore ? (
                  <div className="mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Previous Score: {module.testScore}%
                    </span>
                  </div>
                ) : null}
                <button
                  onClick={() => setShowTest(true)}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  {module.testScore ? 'Retake Test' : 'Take Test'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Complete Module Button */}
        {!module.completed && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900">Ready to complete this module?</h3>
                <p className="text-gray-600">Take the test to mark this module as complete.</p>
              </div>
              <button
                onClick={() => setShowTest(true)}
                className="bg-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-cyan-700 transition-colors"
              >
                Take Module Test
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};