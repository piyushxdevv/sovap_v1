import React, { useState } from 'react';
import { Play, Clock, User, Search, Filter, BookOpen } from 'lucide-react';
import { VideoPlayer } from './VideoPlayer';

interface Video {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  thumbnail: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  views: number;
  uploadDate: string;
  videoUrl: string;
}

const videoLibrary: Video[] = [
  {
    id: '1',
    title: 'SQL Injection Explained',
    description: 'Complete guide to SQL injection attacks, prevention, and real-world examples.',
    instructor: 'PwnFunction',
    duration: '12:45',
    thumbnail: 'https://img.youtube.com/vi/ciNHn38EyRc/maxresdefault.jpg',
    category: 'OWASP Top 10',
    difficulty: 'beginner',
    views: 125000,
    uploadDate: '2023-08-15',
    videoUrl: 'https://www.youtube.com/watch?v=ciNHn38EyRc'
  },
  {
    id: '2',
    title: 'Cross-Site Scripting (XSS) Explained',
    description: 'Understanding XSS vulnerabilities, types, and prevention techniques.',
    instructor: 'PortSwigger Web Security',
    duration: '18:32',
    thumbnail: 'https://img.youtube.com/vi/EoaDgUgS6QA/maxresdefault.jpg',
    category: 'OWASP Top 10',
    difficulty: 'intermediate',
    views: 89000,
    uploadDate: '2023-07-22',
    videoUrl: 'https://www.youtube.com/watch?v=EoaDgUgS6QA'
  },
  {
    id: '3',
    title: 'Broken Access Control - OWASP Top 10',
    description: 'Learn about access control vulnerabilities and how to prevent them.',
    instructor: 'The Cyber Mentor',
    duration: '25:18',
    thumbnail: 'https://img.youtube.com/vi/2O4ZdTGkBtI/maxresdefault.jpg',
    category: 'OWASP Top 10',
    difficulty: 'intermediate',
    views: 156000,
    uploadDate: '2023-09-10',
    videoUrl: 'https://www.youtube.com/watch?v=2O4ZdTGkBtI'
  },
  {
    id: '4',
    title: 'Cryptography Explained - Hash Functions',
    description: 'Understanding cryptographic failures and secure implementation practices.',
    instructor: 'Computerphile',
    duration: '14:27',
    thumbnail: 'https://img.youtube.com/vi/b4b8ktEV4Bg/maxresdefault.jpg',
    category: 'Cryptography',
    difficulty: 'advanced',
    views: 234000,
    uploadDate: '2023-06-18',
    videoUrl: 'https://www.youtube.com/watch?v=b4b8ktEV4Bg'
  },
  {
    id: '5',
    title: 'Security Misconfigurations - Common Mistakes',
    description: 'Identifying and preventing common security misconfigurations in applications.',
    instructor: 'OWASP Foundation',
    duration: '16:42',
    thumbnail: 'https://img.youtube.com/vi/rloqMGcPMkI/maxresdefault.jpg',
    category: 'OWASP Top 10',
    difficulty: 'beginner',
    views: 78000,
    uploadDate: '2023-05-30',
    videoUrl: 'https://www.youtube.com/watch?v=rloqMGcPMkI'
  },
  {
    id: '6',
    title: 'Penetration Testing Full Course',
    description: 'Complete penetration testing methodology and practical demonstrations.',
    instructor: 'NetworkChuck',
    duration: '45:23',
    thumbnail: 'https://img.youtube.com/vi/3Kq1MIfTWCE/maxresdefault.jpg',
    category: 'Penetration Testing',
    difficulty: 'advanced',
    views: 567000,
    uploadDate: '2023-04-12',
    videoUrl: 'https://www.youtube.com/watch?v=3Kq1MIfTWCE'
  },
  {
    id: '7',
    title: 'Burp Suite Tutorial for Beginners',
    description: 'Complete guide to using Burp Suite for web application security testing.',
    instructor: 'InsiderPhD',
    duration: '28:15',
    thumbnail: 'https://img.youtube.com/vi/G3hpAeoZ4ek/maxresdefault.jpg',
    category: 'Tools',
    difficulty: 'beginner',
    views: 189000,
    uploadDate: '2023-03-25',
    videoUrl: 'https://www.youtube.com/watch?v=G3hpAeoZ4ek'
  },
  {
    id: '8',
    title: 'CSRF Attacks Explained',
    description: 'Understanding Cross-Site Request Forgery attacks and prevention methods.',
    instructor: 'LiveOverflow',
    duration: '19:08',
    thumbnail: 'https://img.youtube.com/vi/vRBihr41JTo/maxresdefault.jpg',
    category: 'OWASP Top 10',
    difficulty: 'intermediate',
    views: 145000,
    uploadDate: '2023-02-14',
    videoUrl: 'https://www.youtube.com/watch?v=vRBihr41JTo'
  },
  {
    id: '9',
    title: 'Ethical Hacking Full Course',
    description: 'Complete ethical hacking course covering all major security concepts.',
    instructor: 'freeCodeCamp.org',
    duration: '15:32:18',
    thumbnail: 'https://img.youtube.com/vi/fNzpcB7ODxQ/maxresdefault.jpg',
    category: 'Ethical Hacking',
    difficulty: 'advanced',
    views: 1200000,
    uploadDate: '2023-01-20',
    videoUrl: 'https://www.youtube.com/watch?v=fNzpcB7ODxQ'
  },
  {
    id: '10',
    title: 'Web Application Security Testing',
    description: 'Practical guide to testing web applications for security vulnerabilities.',
    instructor: 'Null Byte',
    duration: '22:47',
    thumbnail: 'https://img.youtube.com/vi/2_lswM1S264/maxresdefault.jpg',
    category: 'Web Security',
    difficulty: 'intermediate',
    views: 98000,
    uploadDate: '2023-11-08',
    videoUrl: 'https://www.youtube.com/watch?v=2_lswM1S264'
  }
];

export const VideoLibrary: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const categories = ['all', 'OWASP Top 10', 'Cryptography', 'Penetration Testing', 'Tools', 'Ethical Hacking', 'Web Security'];
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

  const filteredVideos = videoLibrary.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || video.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (selectedVideo) {
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => setSelectedVideo(null)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
          >
            <span>← Back to Video Library</span>
          </button>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <VideoPlayer
                videoUrl={selectedVideo.videoUrl}
                title={selectedVideo.title}
                onProgress={(progress) => console.log('Video progress:', progress)}
                onComplete={() => console.log('Video completed')}
              />
              
              <div className="mt-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{selectedVideo.title}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{selectedVideo.instructor}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{selectedVideo.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Play className="h-4 w-4" />
                    <span>{selectedVideo.views.toLocaleString()} views</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(selectedVideo.difficulty)}`}>
                    {selectedVideo.difficulty.toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-700">{selectedVideo.description}</p>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Related Videos</h3>
              <div className="space-y-4">
                {videoLibrary
                  .filter(v => v.id !== selectedVideo.id && v.category === selectedVideo.category)
                  .slice(0, 3)
                  .map(video => (
                    <div
                      key={video.id}
                      onClick={() => setSelectedVideo(video)}
                      className="cursor-pointer group"
                    >
                      <div className="aspect-video bg-gray-200 rounded-lg mb-2 overflow-hidden">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <h4 className="font-medium text-gray-900 text-sm group-hover:text-cyan-600 transition-colors">
                        {video.title}
                      </h4>
                      <p className="text-xs text-gray-600">{video.instructor} • {video.duration}</p>
                    </div>
                  ))}
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
          <h1 className="text-3xl font-bold text-white dark:text-white light:text-gray-900 mb-4">Video Library</h1>
          <p className="text-gray-300 dark:text-gray-300 light:text-gray-600">
            Comprehensive video tutorials covering all aspects of cybersecurity
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 light:bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 light:text-gray-400" />
                <input
                  type="text"
                  placeholder="Search videos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white light:border-gray-300 light:bg-white light:text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
            
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white light:border-gray-300 light:bg-white light:text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white light:border-gray-300 light:bg-white light:text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty === 'all' ? 'All Levels' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map(video => (
            <div
              key={video.id}
              onClick={() => setSelectedVideo(video)}
              className="bg-white dark:bg-gray-800 light:bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group"
            >
              <div className="relative aspect-video bg-gray-200">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="bg-white/90 rounded-full p-3 group-hover:scale-110 transition-transform">
                    <Play className="h-6 w-6 text-gray-900" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                  {video.duration}
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-white dark:text-white light:text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2">
                    {video.title}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(video.difficulty)}`}>
                    {video.difficulty.charAt(0).toUpperCase() + video.difficulty.slice(1)}
                  </span>
                </div>
                
                <p className="text-gray-300 dark:text-gray-300 light:text-gray-600 text-sm mb-3 line-clamp-2">{video.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-400 dark:text-gray-400 light:text-gray-500">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{video.instructor}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{video.views.toLocaleString()} views</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 light:text-gray-400 mb-4">
              <BookOpen className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-white dark:text-white light:text-gray-900 mb-2">No videos found</h3>
            <p className="text-gray-300 dark:text-gray-300 light:text-gray-600">Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};