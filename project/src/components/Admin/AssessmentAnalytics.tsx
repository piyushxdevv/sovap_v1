import React, { useState, useEffect } from 'react';
import { BarChart3, Users, TrendingUp, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

// Types removed for JavaScript conversion

export const AssessmentAnalytics = () => {
  const [responses, setResponses] = useState([]);
  const [questionAnalytics, setQuestionAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  useEffect(() => {
    loadAssessmentData();
  }, []);

  useEffect(() => {
    // Realtime updates for assessment responses and related user data changes
    const channel = supabase
      .channel('assessment-analytics')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'assessment_responses' }, () => {
        loadAssessmentData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => {
        // User name/level changes should reflect in recent responses
        loadAssessmentData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadAssessmentData = async () => {
    try {
      setLoading(true);
      
      // Load all assessment responses with user data
      const { data: responsesData, error: responsesError } = await supabase
        .from('assessment_responses')
        .select(`
          *,
          user:users(name, email, level)
        `)
        .order('created_at', { ascending: false });

      if (responsesError) throw responsesError;
      setResponses(responsesData || []);

      // Process question analytics
      const analytics = processQuestionAnalytics(responsesData || []);
      setQuestionAnalytics(analytics);
      
    } catch (error) {
      console.error('Failed to load assessment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processQuestionAnalytics = (responses) => {
    const questionMap = new Map<string, {
      responses: any[];
      question_text: string;
    }>();

    // Group responses by question
    responses.forEach(response => {
      if (!questionMap.has(response.question_id)) {
        questionMap.set(response.question_id, {
          responses: [],
          question_text: `Question ${response.question_id}`
        });
      }
      questionMap.get(response.question_id)!.responses.push(response);
    });

    // Calculate analytics for each question
    return Array.from(questionMap.entries()).map(([questionId, data]) => {
      const questionResponses = data.responses;
      const totalResponses = questionResponses.length;
      const correctResponses = questionResponses.filter(r => r.is_correct).length;
      const averageConfidence = questionResponses.reduce((sum, r) => sum + r.confidence_level, 0) / totalResponses;
      
      // Calculate difficulty rating (lower success rate = higher difficulty)
      const successRate = correctResponses / totalResponses;
      const difficultyRating = Math.round((1 - successRate) * 5);

      // Find common wrong answers
      const wrongAnswers = questionResponses.filter(r => !r.is_correct);
      const answerCounts = new Map<number, number>();
      wrongAnswers.forEach(r => {
        answerCounts.set(r.selected_answer, (answerCounts.get(r.selected_answer) || 0) + 1);
      });
      
      const commonWrongAnswers = Array.from(answerCounts.entries())
        .map(([answer, count]) => ({ answer, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

      return {
        question_id: questionId,
        question_text: data.question_text,
        total_responses: totalResponses,
        correct_responses: correctResponses,
        average_confidence: averageConfidence,
        difficulty_rating: difficultyRating,
        common_wrong_answers: commonWrongAnswers
      };
    }).sort((a, b) => b.total_responses - a.total_responses);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 4) return 'text-green-600 bg-green-100';
    if (confidence >= 3) return 'text-blue-600 bg-blue-100';
    if (confidence >= 2) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty >= 4) return 'text-red-600 bg-red-100';
    if (difficulty >= 3) return 'text-orange-600 bg-orange-100';
    if (difficulty >= 2) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
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
            Assessment Analytics
          </h1>
          <p className="text-slate-300">Analyze student performance and confidence levels</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm font-medium">Total Responses</p>
                <p className="text-3xl font-bold text-white">{responses.length}</p>
              </div>
              <BarChart3 className="h-12 w-12 text-blue-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm border border-green-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-300 text-sm font-medium">Avg Accuracy</p>
                <p className="text-3xl font-bold text-white">
                  {responses.length > 0 ? Math.round((responses.filter(r => r.is_correct).length / responses.length) * 100) : 0}%
                </p>
              </div>
              <CheckCircle className="h-12 w-12 text-green-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm font-medium">Avg Confidence</p>
                <p className="text-3xl font-bold text-white">
                  {responses.length > 0 ? (responses.reduce((sum, r) => sum + r.confidence_level, 0) / responses.length).toFixed(1) : '0.0'}
                </p>
              </div>
              <TrendingUp className="h-12 w-12 text-purple-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-300 text-sm font-medium">Unique Students</p>
                <p className="text-3xl font-bold text-white">
                  {new Set(responses.map(r => r.user_id)).size}
                </p>
              </div>
              <Users className="h-12 w-12 text-orange-400" />
            </div>
          </div>
        </div>

        {/* Question Analytics */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Question Performance Analysis</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">Question</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">Responses</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">Accuracy</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">Avg Confidence</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">Difficulty</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {questionAnalytics.map((question) => (
                  <tr key={question.question_id} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                    <td className="py-4 px-4">
                      <div className="text-white font-medium">Question {question.question_id}</div>
                      <div className="text-slate-400 text-sm">{question.question_text}</div>
                    </td>
                    <td className="py-4 px-4 text-white">{question.total_responses}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-white">
                          {Math.round((question.correct_responses / question.total_responses) * 100)}%
                        </span>
                        {question.correct_responses / question.total_responses >= 0.7 ? (
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-400" />
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(question.average_confidence)}`}>
                        {question.average_confidence.toFixed(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty_rating)}`}>
                        {question.difficulty_rating}/5
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => setSelectedQuestion(question.question_id)}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Responses */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Recent Student Responses</h2>
          
          <div className="space-y-4">
            {responses.slice(0, 10).map((response) => (
              <div key={response.id} className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="text-white font-medium">{response.user?.name || 'Unknown User'}</div>
                      <div className="text-slate-400 text-sm">{response.user?.email}</div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        response.user?.level === 'advanced' ? 'bg-red-500/20 text-red-400' :
                        response.user?.level === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {response.user?.level}
                      </span>
                    </div>
                    <div className="text-slate-300 text-sm">
                      Question {response.question_id} • Answer: {response.selected_answer} • 
                      Time: {response.time_taken_seconds}s
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(response.confidence_level)}`}>
                      Confidence: {response.confidence_level}/5
                    </span>
                    {response.is_correct ? (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-400" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};