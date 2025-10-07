import React, { useState, useEffect } from 'react';
import { FileText, Download, Search, Filter, Plus, Upload } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { Note } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

export const NotesTab: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    loadNotes();
  }, []);

  useEffect(() => {
    filterNotes();
  }, [notes, searchTerm, selectedCourse]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllNotes();
      setNotes(data);
    } catch (error) {
      console.error('Failed to load notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterNotes = () => {
    let filtered = notes;

    if (searchTerm) {
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCourse !== 'all') {
      filtered = filtered.filter(note => note.course_id === selectedCourse);
    }

    setFilteredNotes(filtered);
  };

  const handleDownload = (note: Note) => {
    window.open(note.pdf_url, '_blank');
  };

  const courses = [...new Set(notes.map(note => note.course_id))];

  if (showUploadForm && isAdmin()) {
    return (
      <NoteUploadForm
        onSave={(newNote) => {
          setNotes([newNote, ...notes]);
          setShowUploadForm(false);
        }}
        onCancel={() => setShowUploadForm(false)}
      />
    );
  }

  return (
    <div className="p-6 bg-gray-900 dark:bg-gray-900 light:bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white dark:text-white light:text-gray-900">Study Notes</h1>
            <p className="text-gray-300 dark:text-gray-300 light:text-gray-600">
              Access comprehensive PDF notes for all cybersecurity modules
            </p>
          </div>
          {isAdmin() && (
            <button
              onClick={() => setShowUploadForm(true)}
              className="flex items-center space-x-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Upload Note</span>
            </button>
          )}
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 light:bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white light:border-gray-300 light:bg-white light:text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white light:border-gray-300 light:bg-white light:text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All Courses</option>
                {courses.map(courseId => (
                  <option key={courseId} value={courseId}>
                    {courseId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Notes Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-400 dark:text-gray-400 light:text-gray-600">Loading notes...</p>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white dark:text-white light:text-gray-900 mb-2">No notes found</h3>
            <p className="text-gray-300 dark:text-gray-300 light:text-gray-600">
              {searchTerm || selectedCourse !== 'all' 
                ? 'Try adjusting your search criteria.' 
                : 'Notes will appear here once they are uploaded by instructors.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <div key={note.id} className="bg-white dark:bg-gray-800 light:bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <FileText className="h-5 w-5 text-orange-500" />
                        <h3 className="font-bold text-white dark:text-white light:text-gray-900 line-clamp-1">
                          {note.title}
                        </h3>
                      </div>
                      <p className="text-gray-300 dark:text-gray-300 light:text-gray-600 text-sm mb-3 line-clamp-2">
                        {note.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-400 dark:text-gray-400 light:text-gray-500 mb-4">
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                      {note.course_id.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    <span>{new Date(note.created_at).toLocaleDateString()}</span>
                  </div>

                  <button
                    onClick={() => handleDownload(note)}
                    className="w-full flex items-center justify-center space-x-2 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 light:bg-blue-50 border border-blue-200 dark:border-blue-800 light:border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-blue-900 dark:text-blue-300 light:text-blue-900 mb-2">About Study Notes</h3>
          <div className="text-blue-800 dark:text-blue-200 light:text-blue-800 space-y-2">
            <p>• Comprehensive PDF notes covering all course modules and topics</p>
            <p>• Created by expert instructors with real-world experience</p>
            <p>• Perfect for offline study and exam preparation</p>
            <p>• Regularly updated with the latest cybersecurity information</p>
            <p>• Organized by course and difficulty level for easy navigation</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Note Upload Form Component (Admin Only)
interface NoteUploadFormProps {
  onSave: (note: Note) => void;
  onCancel: () => void;
}

const NoteUploadForm: React.FC<NoteUploadFormProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    module_id: '',
    course_id: ''
  });
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
    } else {
      alert('Please select a PDF file');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pdfFile) {
      alert('Please select a PDF file');
      return;
    }

    try {
      setUploading(true);
      
      // Upload PDF file
      const pdfUrl = await adminService.uploadFile(pdfFile, 'notes');
      
      // Create note record
      const newNote = await adminService.createNote({
        ...formData,
        pdf_url: pdfUrl,
        admin_id: user!.id
      });
      
      onSave(newNote);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload note');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-900 dark:bg-gray-900 light:bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white dark:text-white light:text-gray-900">Upload Study Note</h1>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-white dark:text-gray-400 dark:hover:text-white light:text-gray-600 light:hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 light:bg-white rounded-lg shadow-md p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 light:text-gray-700 mb-2">
              Note Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white light:border-gray-300 light:bg-white light:text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="e.g., SQL Injection Prevention Guide"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 light:text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white light:border-gray-300 light:bg-white light:text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Brief description of the note content"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 light:text-gray-700 mb-2">
                Course ID
              </label>
              <input
                type="text"
                value={formData.course_id}
                onChange={(e) => setFormData(prev => ({ ...prev, course_id: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white light:border-gray-300 light:bg-white light:text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., owasp-top-10"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 light:text-gray-700 mb-2">
                Module ID
              </label>
              <input
                type="text"
                value={formData.module_id}
                onChange={(e) => setFormData(prev => ({ ...prev, module_id: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white light:border-gray-300 light:bg-white light:text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., module-1"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 light:text-gray-700 mb-2">
              PDF File
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white light:border-gray-300 light:bg-white light:text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
            {pdfFile && (
              <p className="text-sm text-green-600 mt-1">Selected: {pdfFile.name}</p>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 light:border-gray-300 text-gray-700 dark:text-gray-300 light:text-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 light:hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  <span>Upload Note</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};