import React from 'react';
import { Award, Download, Star, Calendar, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Certificates: React.FC = () => {
  const { user } = useAuth();

  const availableCertificates = [
    {
      id: 'owasp-top-10',
      title: 'OWASP Top 10 Security Risks',
      description: 'Complete understanding of the most critical web application security risks',
      requirements: [
        'Complete all 10 OWASP modules',
        'Pass module tests with 80% or higher',
        'Complete at least 5 hands-on labs',
        'Pass final certification exam'
      ],
      progress: 30,
      earned: false,
      estimatedHours: 20
    },
    {
      id: 'web-app-security',
      title: 'Web Application Security Fundamentals',
      description: 'Comprehensive knowledge of web application security principles and practices',
      requirements: [
        'Complete assessment test',
        'Finish penetration testing modules',
        'Complete secure coding practices',
        'Demonstrate practical skills'
      ],
      progress: 15,
      earned: false,
      estimatedHours: 30
    },
    {
      id: 'ethical-hacking',
      title: 'Certified Ethical Hacker (Prep)',
      description: 'Preparation for ethical hacking certification with hands-on experience',
      requirements: [
        'Complete advanced security modules',
        'Master penetration testing tools',
        'Complete capstone project',
        'Pass comprehensive exam'
      ],
      progress: 5,
      earned: false,
      estimatedHours: 50
    }
  ];

  const earnedCertificates = user?.certificates || [];

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Certificates</h1>
          <p className="text-gray-600">
            Earn industry-recognized certificates by completing courses and demonstrating your cybersecurity skills
          </p>
        </div>

        {/* Earned Certificates */}
        {earnedCertificates.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Certificates</h2>
            <div className="grid gap-6">
              {earnedCertificates.map((certificateId) => {
                const certificate = availableCertificates.find(c => c.id === certificateId);
                if (!certificate) return null;
                
                return (
                  <div key={certificate.id} className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="bg-green-100 p-3 rounded-lg">
                          <Award className="h-8 w-8 text-green-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-green-800">{certificate.title}</h3>
                          <p className="text-green-700">{certificate.description}</p>
                          <div className="flex items-center space-x-2 mt-2 text-sm text-green-600">
                            <Calendar className="h-4 w-4" />
                            <span>Earned on March 15, 2024</span>
                          </div>
                        </div>
                      </div>
                      <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                        <Download className="h-4 w-4" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Available Certificates */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Certificates</h2>
          <div className="grid gap-6">
            {availableCertificates.map((certificate) => {
              const isEarned = earnedCertificates.includes(certificate.id);
              
              return (
                <div key={certificate.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-lg ${isEarned ? 'bg-green-100' : 'bg-gray-100'}`}>
                          <Award className={`h-8 w-8 ${isEarned ? 'text-green-600' : 'text-gray-400'}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">{certificate.title}</h3>
                            {isEarned && <CheckCircle className="h-5 w-5 text-green-500" />}
                          </div>
                          <p className="text-gray-600 mb-4">{certificate.description}</p>
                          
                          <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4" />
                              <span>Professional Level</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>~{certificate.estimatedHours} hours</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {!isEarned && (
                        <div className="text-right">
                          <div className="text-2xl font-bold text-cyan-600">{certificate.progress}%</div>
                          <div className="text-gray-600 text-sm">Complete</div>
                        </div>
                      )}
                    </div>

                    {/* Progress Bar */}
                    {!isEarned && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{certificate.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-cyan-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${certificate.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Requirements */}
                    <div className="border-t pt-4">
                      <h4 className="font-medium text-gray-900 mb-3">Requirements</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {certificate.requirements.map((requirement, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm">
                            <div className="h-2 w-2 bg-gray-300 rounded-full"></div>
                            <span className="text-gray-700">{requirement}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-6">
                      {isEarned ? (
                        <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
                          <Download className="h-4 w-4" />
                          <span>Download Certificate</span>
                        </button>
                      ) : (
                        <button className="w-full bg-cyan-600 text-white py-3 rounded-lg hover:bg-cyan-700 transition-colors">
                          Continue Learning
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Certificate Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-blue-900 mb-2">About Our Certificates</h3>
          <div className="text-blue-800 space-y-2">
            <p>• Industry-recognized certificates that validate your cybersecurity skills</p>
            <p>• Digital certificates with verification codes for employer validation</p>
            <p>• Continuing education credits for professional development</p>
            <p>• LinkedIn integration to showcase your achievements</p>
            <p>• Regular updates to match current industry standards</p>
          </div>
        </div>
      </div>
    </div>
  );
};