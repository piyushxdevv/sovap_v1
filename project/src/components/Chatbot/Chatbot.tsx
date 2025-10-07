import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, User } from 'lucide-react';
import { aiService } from '../../services/aiService';
import { learnerMemoryService } from '../../services/learnerMemoryService';
import { ragDocsService } from '../../services/ragDocsService';
import { useAuth } from '../../context/AuthContext';

export interface ChatMessage {
  id: string;
  message: string;
  isUser: boolean;
  timestamp: Date | string;
}

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      message:
        "Hello! I'm your advanced cybersecurity AI assistant powered by Gemini. I can help you with detailed questions about security concepts, OWASP Top 10, penetration testing, and more. What would you like to explore?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    const messageText = newMessage.trim();
    if (!messageText) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: messageText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    // Clear the input immediately for UX, but keep messageText for processing
    setNewMessage('');
    setIsTyping(true);

    try {
      // Retrieve user memory (if available)
  const memory = user?.id ? await learnerMemoryService.getContext(user.id, 8) : '';

      // Retrieve relevant docs via RAG
      let docs = '';
      try {
  docs = await ragDocsService.retrieveContext(messageText, 4);
      } catch (e) {
        console.warn('RAG docs retrieval failed:', e);
      }

      // Compose AI prompt
      const composedPrompt = `${memory ? `User context:\n${memory}\n\n` : ''}${
        docs ? `Relevant docs:\n${docs}\n\n` : ''
      }Question: ${messageText}`;

      // Get AI response
  const response = await aiService.chat(composedPrompt, 'You are a helpful cybersecurity tutor.');

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error: any) {
      console.error('Error generating response:', error);
      // Show a helpful message to the user; include sanitized error message for debugging
      const safeMsg = typeof error?.message === 'string' ? error.message : 'Unknown error from AI service.';
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: `There was an issue connecting to Gemini. ${safeMsg}. Please ensure your API key is correctly set as VITE_GEMINI_API_KEY.`,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col z-50">
      {/* Header */}
      <div className="bg-orange-600 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bot className="h-6 w-6" />
          <div>
            <h3 className="font-bold">CyberSec AI Assistant (Gemini)</h3>
            <p className="text-xs text-orange-100">Ask me anything about cybersecurity</p>
          </div>
        </div>
        <button onClick={onClose} className="text-orange-100 hover:text-white">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.isUser
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
              }`}
            >
              <div className="flex items-start space-x-2">
                {!message.isUser && <Bot className="h-4 w-4 mt-0.5 text-orange-600 dark:text-orange-400" />}
                <div className="flex-1">
                  <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.isUser ? 'text-orange-100' : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {(() => {
                      try {
                        return (
                          (message.timestamp instanceof Date
                            ? message.timestamp
                            : new Date(message.timestamp)
                          ).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        );
                      } catch {
                        return '';
                      }
                    })()}
                  </p>
                </div>
                {message.isUser && <User className="h-4 w-4 mt-0.5 text-orange-100" />}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <Bot className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                <div>
                  <div className="flex space-x-1 mb-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                      style={{ animationDelay: '0.2s' }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                      style={{ animationDelay: '0.4s' }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500">Processing...</div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex space-x-2">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about cybersecurity..."
            className="flex-1 resize-none border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            rows={2}
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isTyping}
            className="bg-orange-600 text-white p-2 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
