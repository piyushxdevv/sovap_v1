import React, { useState, useEffect, useRef } from 'react';
import { Building2, Clock, Star, ChevronRight, Lightbulb, CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react';
import { technicalQuestions, TechnicalQuestion } from '../../data/technicalQuestions';

export const TechnicalQuestions: React.FC = () => {
  const [selectedQuestion, setSelectedQuestion] = useState<TechnicalQuestion | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [filterCompany, setFilterCompany] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  // Camera/Microphone preview state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [isRequestingMedia, setIsRequestingMedia] = useState(false);
  const [mediaError, setMediaError] = useState<string | null>(null);

  const stopMedia = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
  };

  const startMedia = async () => {
    if (isRequestingMedia || mediaStream) return;
    setIsRequestingMedia(true);
    setMediaError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setMediaStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        try {
          await videoRef.current.play();
        } catch {
          // ignore autoplay rejection; user can press play
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Permission denied or no devices found';
      setMediaError(message);
    } finally {
      setIsRequestingMedia(false);
    }
  };

  // Start/stop camera when entering/leaving a question view
  useEffect(() => {
    if (selectedQuestion) {
      startMedia();
    } else {
      stopMedia();
    }
    return () => {
      stopMedia();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedQuestion]);

  // Timer functionality
  useEffect(() => {
    if (isTimerActive && timeLeft && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setIsTimerActive(false);
      alert('Time is up! You can still continue working on the solution.');
    }
  }, [timeLeft, isTimerActive]);

  const startTimer = (minutes: number) => {
    setTimeLeft(minutes * 60);
    setIsTimerActive(true);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'junior': return 'bg-green-100 text-green-800 border-green-200';
      case 'mid': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'senior': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'principal': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCompanyLogo = (company: string) => {
    const logos: Record<string, string> = {
      'Google': '🔍',
      'Microsoft': '🪟',
      'Amazon': '📦',
      'Meta (Facebook)': '👥',
      'Apple': '🍎',
      'Netflix': '🎬'
    };
    return logos[company] || '🏢';
  };

  const companies = [...new Set(technicalQuestions.map(q => q.company))];
  const difficulties = ['junior', 'mid', 'senior', 'principal'];
  const categories = [...new Set(technicalQuestions.map(q => q.category))];

  const filteredQuestions = technicalQuestions.filter(question => {
    return (filterCompany === 'all' || question.company === filterCompany) &&
           (filterDifficulty === 'all' || question.difficulty === filterDifficulty) &&
           (filterCategory === 'all' || question.category === filterCategory);
  });

  const handleQuestionSelect = (question: TechnicalQuestion) => {
    setSelectedQuestion(question);
    setShowSolution(false);
    setShowHints(false);
    setCurrentHintIndex(0);
    setUserAnswer('');
    setTimeLeft(null);
    setIsTimerActive(false);
  };

  const handleShowNextHint = () => {
    if (currentHintIndex < selectedQuestion!.hints.length - 1) {
      setCurrentHintIndex(currentHintIndex + 1);
    }
  };

  if (selectedQuestion) {
    return (
      <div className="p-6 bg-gray-900 dark:bg-gray-900 light:bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setSelectedQuestion(null)}
              className="flex items-center space-x-2 text-gray-400 hover:text-white dark:text-gray-400 dark:hover:text-white light:text-gray-600 light:hover:text-gray-900 transition-colors"
            >
              <span>← Back to Questions</span>
            </button>
            
            {timeLeft !== null && (
              <div className="flex items-center space-x-2 text-lg font-medium">
                <Clock className="h-5 w-5 text-orange-500" />
                <span className={timeLeft < 300 ? 'text-red-400' : 'text-white dark:text-white light:text-gray-900'}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            )}
          </div>

          {/* Question Info */}
          <div className="bg-white dark:bg-gray-800 light:bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="text-3xl">{getCompanyLogo(selectedQuestion.company)}</div>
                <div>
                  <h1 className="text-2xl font-bold text-white dark:text-white light:text-gray-900">{selectedQuestion.company}</h1>
                  <p className="text-gray-300 dark:text-gray-300 light:text-gray-600">{selectedQuestion.position}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full border text-sm font-medium ${getDifficultyColor(selectedQuestion.difficulty)}`}>
                  {selectedQuestion.difficulty.toUpperCase()}
                </span>
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                  {selectedQuestion.category}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-400 dark:text-gray-400 light:text-gray-500 mb-4">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{selectedQuestion.timeLimit} minutes</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4" />
                <span>{selectedQuestion.tags.join(', ')}</span>
              </div>
            </div>

            {!isTimerActive && timeLeft === null && (
              <button
                onClick={() => startTimer(selectedQuestion.timeLimit)}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Start Timer ({selectedQuestion.timeLimit} min)
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Question and Answer Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Question */}
              <div className="bg-white dark:bg-gray-800 light:bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-white dark:text-white light:text-gray-900 mb-4">Question</h2>
                <div className="prose max-w-none text-gray-300 dark:text-gray-300 light:text-gray-700">
                  <pre className="whitespace-pre-wrap font-sans">{selectedQuestion.question}</pre>
                </div>
              </div>

              {/* User Answer Area */}
              <div className="bg-white dark:bg-gray-800 light:bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-white dark:text-white light:text-gray-900 mb-4">Your Solution</h3>
                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Write your solution here..."
                  className="w-full h-64 p-4 border border-gray-600 dark:border-gray-600 light:border-gray-300 rounded-lg bg-gray-900 dark:bg-gray-900 light:bg-white text-white dark:text-white light:text-gray-900 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-400 dark:text-gray-400 light:text-gray-500">
                    {userAnswer.length} characters
                  </div>
                  <button
                    onClick={() => setShowSolution(!showSolution)}
                    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    {showSolution ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span>{showSolution ? 'Hide Solution' : 'Show Solution'}</span>
                  </button>
                </div>
              </div>

              {/* Solution */}
              {showSolution && (
                <div className="bg-green-50 dark:bg-green-900/20 light:bg-green-50 border border-green-200 dark:border-green-800 light:border-green-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-green-800 dark:text-green-300 light:text-green-800 mb-4">Official Solution</h3>
                  <div className="prose max-w-none text-green-700 dark:text-green-200 light:text-green-700">
                    <div dangerouslySetInnerHTML={{ 
                      __html: selectedQuestion.solution
                        .replace(/\n/g, '<br/>')
                        .replace(/```([^`]+)```/g, '<pre class="bg-gray-800 text-green-300 p-4 rounded mt-4 mb-4 overflow-x-auto"><code>$1</code></pre>')
                        .replace(/`([^`]+)`/g, '<code class="bg-gray-800 text-green-300 px-1 rounded">$1</code>')
                        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
                    }} />
                  </div>
                  
                  <div className="mt-6 p-4 bg-green-100 dark:bg-green-800/30 light:bg-green-100 rounded-lg">
                    <h4 className="font-bold text-green-800 dark:text-green-300 light:text-green-800 mb-2">Explanation</h4>
                    <p className="text-green-700 dark:text-green-200 light:text-green-700">{selectedQuestion.explanation}</p>
                  </div>

                  {selectedQuestion.followUpQuestions && (
                    <div className="mt-4">
                      <h4 className="font-bold text-green-800 dark:text-green-300 light:text-green-800 mb-2">Follow-up Questions</h4>
                      <ul className="list-disc list-inside text-green-700 dark:text-green-200 light:text-green-700">
                        {selectedQuestion.followUpQuestions.map((question, index) => (
                          <li key={index}>{question}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Hints Sidebar */}
            <div className="space-y-6">
              {/* Camera & Mic Preview */}
              <div className="bg-white dark:bg-gray-800 light:bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white dark:text-white light:text-gray-900">Camera & Microphone</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={startMedia}
                      disabled={isRequestingMedia || !!mediaStream}
                      className={`px-3 py-1 rounded-lg text-sm ${mediaStream ? 'bg-gray-600 text-white cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                    >
                      {isRequestingMedia ? 'Starting…' : mediaStream ? 'Active' : 'Start'}
                    </button>
                    <button
                      onClick={stopMedia}
                      disabled={!mediaStream}
                      className={`px-3 py-1 rounded-lg text-sm ${mediaStream ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-gray-600 text-white cursor-not-allowed'}`}
                    >
                      Stop
                    </button>
                  </div>
                </div>

                {mediaError && (
                  <div className="mb-3 text-sm text-red-400">
                    {mediaError}. Please allow camera and microphone permissions in your browser and ensure no other app is using them.
                  </div>
                )}

                <div className="aspect-video bg-black rounded-lg overflow-hidden border border-gray-700 flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="mt-2 text-xs text-gray-400 dark:text-gray-400 light:text-gray-500">
                  Preview shows your camera. Microphone is enabled for realism; audio is not recorded.
                </p>
              </div>
              {/* Hints */}
              <div className="bg-white dark:bg-gray-800 light:bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white dark:text-white light:text-gray-900">Hints</h3>
                  <button
                    onClick={() => setShowHints(!showHints)}
                    className="text-orange-500 hover:text-orange-600 transition-colors"
                  >
                    <Lightbulb className="h-5 w-5" />
                  </button>
                </div>

                {showHints ? (
                  <div className="space-y-3">
                    {selectedQuestion.hints.slice(0, currentHintIndex + 1).map((hint, index) => (
                      <div key={index} className="p-3 bg-yellow-50 dark:bg-yellow-900/20 light:bg-yellow-50 border border-yellow-200 dark:border-yellow-800 light:border-yellow-200 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <Lightbulb className="h-4 w-4 text-yellow-600 dark:text-yellow-400 light:text-yellow-600 mt-0.5" />
                          <p className="text-yellow-800 dark:text-yellow-200 light:text-yellow-800 text-sm">{hint}</p>
                        </div>
                      </div>
                    ))}
                    
                    {currentHintIndex < selectedQuestion.hints.length - 1 && (
                      <button
                        onClick={handleShowNextHint}
                        className="w-full bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                      >
                        Show Next Hint ({currentHintIndex + 2}/{selectedQuestion.hints.length})
                      </button>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-400 dark:text-gray-400 light:text-gray-500 text-sm">
                    Click the lightbulb to reveal hints when you need help.
                  </p>
                )}
              </div>

              {/* Progress */}
              <div className="bg-white dark:bg-gray-800 light:bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-white dark:text-white light:text-gray-900 mb-4">Progress</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    {userAnswer.length > 0 ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <div className="h-5 w-5 border-2 border-gray-400 rounded-full"></div>
                    )}
                    <span className="text-gray-300 dark:text-gray-300 light:text-gray-700">Started writing solution</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {showHints ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <div className="h-5 w-5 border-2 border-gray-400 rounded-full"></div>
                    )}
                    <span className="text-gray-300 dark:text-gray-300 light:text-gray-700">Used hints</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {showSolution ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <div className="h-5 w-5 border-2 border-gray-400 rounded-full"></div>
                    )}
                    <span className="text-gray-300 dark:text-gray-300 light:text-gray-700">Viewed solution</span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="bg-white dark:bg-gray-800 light:bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-white dark:text-white light:text-gray-900 mb-4">Related Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedQuestion.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-700 dark:bg-gray-700 light:bg-gray-200 text-gray-300 dark:text-gray-300 light:text-gray-700 px-2 py-1 rounded text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 dark:bg-gray-900 light:bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white dark:text-white light:text-gray-900 mb-4">Technical Interview Questions</h1>
          <p className="text-gray-300 dark:text-gray-300 light:text-gray-600">
            Practice with real cybersecurity interview questions from top tech companies
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 light:bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-white dark:text-white light:text-gray-700 mb-2">Company</label>
              <select
                value={filterCompany}
                onChange={(e) => setFilterCompany(e.target.value)}
                className="w-full px-3 py-2 border border-gray-600 dark:border-gray-600 light:border-gray-300 rounded-lg bg-gray-900 dark:bg-gray-900 light:bg-white text-white dark:text-white light:text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All Companies</option>
                {companies.map(company => (
                  <option key={company} value={company}>{company}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white dark:text-white light:text-gray-700 mb-2">Difficulty</label>
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-600 dark:border-gray-600 light:border-gray-300 rounded-lg bg-gray-900 dark:bg-gray-900 light:bg-white text-white dark:text-white light:text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All Levels</option>
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white dark:text-white light:text-gray-700 mb-2">Category</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-600 dark:border-gray-600 light:border-gray-300 rounded-lg bg-gray-900 dark:bg-gray-900 light:bg-white text-white dark:text-white light:text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Questions Grid */}
        <div className="grid gap-6">
          {filteredQuestions.map((question) => (
            <div
              key={question.id}
              onClick={() => handleQuestionSelect(question)}
              className="bg-white dark:bg-gray-800 light:bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-orange-500"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{getCompanyLogo(question.company)}</div>
                  <div>
                    <h3 className="text-xl font-bold text-white dark:text-white light:text-gray-900">{question.company}</h3>
                    <p className="text-gray-300 dark:text-gray-300 light:text-gray-600">{question.position}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full border text-sm font-medium ${getDifficultyColor(question.difficulty)}`}>
                    {question.difficulty.toUpperCase()}
                  </span>
                  <ChevronRight className="h-5 w-5 text-gray-400 dark:text-gray-400 light:text-gray-400" />
                </div>
              </div>

              <div className="mb-4">
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium mr-3">
                  {question.category}
                </span>
                <span className="text-gray-400 dark:text-gray-400 light:text-gray-500 text-sm">
                  {question.timeLimit} minutes
                </span>
              </div>

              <p className="text-gray-300 dark:text-gray-300 light:text-gray-700 mb-4 line-clamp-3">
                {question.question.substring(0, 200)}...
              </p>

              <div className="flex flex-wrap gap-2">
                {question.tags.slice(0, 4).map((tag, index) => (
                  <span key={index} className="bg-gray-700 dark:bg-gray-700 light:bg-gray-200 text-gray-300 dark:text-gray-300 light:text-gray-700 px-2 py-1 rounded text-xs">
                    {tag}
                  </span>
                ))}
                {question.tags.length > 4 && (
                  <span className="text-gray-400 dark:text-gray-400 light:text-gray-500 text-xs">
                    +{question.tags.length - 4} more
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredQuestions.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="h-16 w-16 text-gray-400 dark:text-gray-400 light:text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white dark:text-white light:text-gray-900 mb-2">No questions found</h3>
            <p className="text-gray-300 dark:text-gray-300 light:text-gray-600">Try adjusting your filters to see more questions.</p>
          </div>
        )}
      </div>
    </div>
  );
};