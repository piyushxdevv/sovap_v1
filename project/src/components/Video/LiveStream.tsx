import React, { useState, useEffect } from 'react';
import { Users, MessageCircle, Send, Mic, MicOff, Video, VideoOff } from 'lucide-react';
import { VideoPlayer } from './VideoPlayer';

interface LiveStreamProps {
  streamId: string;
  title: string;
  instructor: string;
  onJoin?: () => void;
  onLeave?: () => void;
}

interface ChatMessage {
  id: string;
  user: string;
  message: string;
  timestamp: Date;
  isInstructor?: boolean;
}

export const LiveStream: React.FC<LiveStreamProps> = ({ 
  streamId, 
  title, 
  instructor, 
  onJoin, 
  onLeave 
}) => {
  const [isJoined, setIsJoined] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isMicOn, setIsMicOn] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [showChat, setShowChat] = useState(true);

  // Simulate live stream data
  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount(prev => prev + Math.floor(Math.random() * 3) - 1);
      
      // Simulate instructor messages
      if (Math.random() < 0.1) {
        const instructorMessages = [
          "Great question! Let me demonstrate this vulnerability.",
          "Remember to always validate input in your applications.",
          "This is a common attack vector we see in the wild.",
          "Make sure you're following along in your lab environment.",
          "Any questions about this SQL injection technique?"
        ];
        
        const randomMessage = instructorMessages[Math.floor(Math.random() * instructorMessages.length)];
        setChatMessages(prev => [...prev, {
          id: Date.now().toString(),
          user: instructor,
          message: randomMessage,
          timestamp: new Date(),
          isInstructor: true
        }]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [instructor]);

  const handleJoinStream = () => {
    setIsJoined(true);
    setViewerCount(prev => prev + 1);
    if (onJoin) onJoin();
  };

  const handleLeaveStream = () => {
    setIsJoined(false);
    setViewerCount(prev => prev - 1);
    if (onLeave) onLeave();
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    setChatMessages(prev => [...prev, {
      id: Date.now().toString(),
      user: 'You',
      message: newMessage,
      timestamp: new Date(),
      isInstructor: false
    }]);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  if (!isJoined) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative">
          <div className="aspect-video bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="h-10 w-10" />
              </div>
              <h2 className="text-2xl font-bold mb-2">{title}</h2>
              <p className="text-slate-300 mb-4">Live Cybersecurity Training Session</p>
              <div className="flex items-center justify-center space-x-4 text-sm text-slate-400 mb-6">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span>LIVE</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{viewerCount} viewers</span>
                </div>
                <div>
                  <span>Instructor: {instructor}</span>
                </div>
              </div>
              <button
                onClick={handleJoinStream}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Join Live Stream
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-0">
        {/* Video Stream */}
        <div className={`${showChat ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
          <VideoPlayer
            videoUrl="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            title={title}
            isLive={true}
          />
          
          {/* Stream Controls */}
          <div className="bg-gray-50 p-4 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">LIVE</span>
                  <span>•</span>
                  <Users className="h-4 w-4" />
                  <span>{viewerCount} viewers</span>
                </div>
                <div className="text-sm text-gray-600">
                  Instructor: <span className="font-medium">{instructor}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMicOn(!isMicOn)}
                  className={`p-2 rounded-lg transition-colors ${
                    isMicOn ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {isMicOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => setIsCameraOn(!isCameraOn)}
                  className={`p-2 rounded-lg transition-colors ${
                    isCameraOn ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {isCameraOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => setShowChat(!showChat)}
                  className="flex items-center space-x-1 px-3 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Chat</span>
                </button>
                <button
                  onClick={handleLeaveStream}
                  className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Leave
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Live Chat */}
        {showChat && (
          <div className="lg:col-span-1 bg-gray-50 border-l flex flex-col h-96 lg:h-auto">
            <div className="bg-gray-100 p-3 border-b">
              <h3 className="font-medium text-gray-900">Live Chat</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {chatMessages.map((message) => (
                <div key={message.id} className="text-sm">
                  <div className="flex items-start space-x-2">
                    <div className={`font-medium ${
                      message.isInstructor ? 'text-red-600' : 'text-gray-900'
                    }`}>
                      {message.user}
                      {message.isInstructor && (
                        <span className="ml-1 text-xs bg-red-100 text-red-600 px-1 rounded">
                          Instructor
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                  <div className="text-gray-700 mt-1">{message.message}</div>
                </div>
              ))}
            </div>
            
            <div className="p-3 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="p-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};