import React from 'react';
import { FlaskRound as Flask, Clock, User, CheckCircle, ArrowRight } from 'lucide-react';
import { labs } from '../../data/labs';

interface LabsListProps {
  onLabSelect: (labId: string) => void;
}

export const LabsList: React.FC<LabsListProps> = ({ onLabSelect }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Cybersecurity Labs</h1>
          <p className="text-gray-600">
            Hands-on practice with real-world cybersecurity scenarios and tools
          </p>
        </div>

        <div className="grid gap-6">
          {labs.map((lab) => (
            <div key={lab.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Flask className="h-6 w-6 text-cyan-600" />
                      <h2 className="text-xl font-bold text-gray-900">{lab.title}</h2>
                      {lab.completed && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                    <p className="text-gray-600 mb-4">{lab.description}</p>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(lab.difficulty)}`}>
                          {lab.difficulty.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{lab.estimatedTime}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>Individual</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h3 className="font-medium text-gray-900 mb-2">Tools Required:</h3>
                      <div className="flex flex-wrap gap-2">
                        {lab.tools.map((tool, index) => (
                          <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => onLabSelect(lab.id)}
                    className="flex items-center space-x-2 px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors ml-6"
                  >
                    <span>{lab.completed ? 'Review Lab' : 'Start Lab'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

                {/* Progress indicator for completed labs */}
                {lab.completed && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2 text-green-800">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Lab completed successfully!</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Lab Statistics */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Your Lab Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-600">{labs.filter(lab => lab.completed).length}</div>
              <div className="text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{labs.length - labs.filter(lab => lab.completed).length}</div>
              <div className="text-gray-600">Remaining</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{Math.round((labs.filter(lab => lab.completed).length / labs.length) * 100)}%</div>
              <div className="text-gray-600">Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">~{labs.length * 60}</div>
              <div className="text-gray-600">Total Minutes</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};