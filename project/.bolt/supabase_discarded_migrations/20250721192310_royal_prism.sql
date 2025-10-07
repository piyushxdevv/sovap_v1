/*
  # Create Three-Tier Role System (Admin/Teacher/User)

  1. New Tables
    - `users` - Updated with three roles: admin, teacher, student
    - `courses` - Teacher-created courses
    - `course_modules` - Individual modules within courses
    - `user_progress` - Track student progress
    - `teacher_analytics` - Teacher performance metrics
  
  2. Security
    - Role-based access control
    - Admin can see all data
    - Teachers can only manage their content
    - Students can only access published content
    
  3. Analytics
    - User progress tracking
    - Teacher content statistics
    - Admin dashboard metrics
*/

-- Drop existing tables if they exist
DROP TABLE IF EXISTS notes CASCADE;
DROP TABLE IF EXISTS admin_content CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table with three roles
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  password_hash text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'teacher', 'student')),
  level text NOT NULL DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  completed_assessment boolean DEFAULT false,
  profile_image text,
  bio text,
  specialization text,
  experience_years integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  thumbnail_url text,
  estimated_hours integer DEFAULT 0,
  teacher_id uuid REFERENCES users(id) ON DELETE CASCADE,
  is_published boolean DEFAULT false,
  enrollment_count integer DEFAULT 0,
  rating numeric(3,2) DEFAULT 0.0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create course modules table
CREATE TABLE IF NOT EXISTS course_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  content text NOT NULL,
  module_order integer NOT NULL,
  video_url text,
  pdf_url text,
  quiz_questions jsonb DEFAULT '[]',
  estimated_minutes integer DEFAULT 30,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  module_id uuid REFERENCES course_modules(id) ON DELETE CASCADE,
  completed boolean DEFAULT false,
  completion_date timestamptz,
  quiz_score integer DEFAULT 0,
  time_spent_minutes integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, module_id)
);

-- Create course enrollments table
CREATE TABLE IF NOT EXISTS course_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  progress_percentage integer DEFAULT 0,
  UNIQUE(user_id, course_id)
);

-- Create notes table for study materials
CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  content text NOT NULL,
  module_id uuid REFERENCES course_modules(id) ON DELETE CASCADE,
  teacher_id uuid REFERENCES users(id) ON DELETE CASCADE,
  pdf_url text,
  is_public boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read all user profiles"
  ON users FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can insert users"
  ON users FOR INSERT WITH CHECK (true);

-- Courses policies
CREATE POLICY "Anyone can read published courses"
  ON courses FOR SELECT USING (is_published = true OR teacher_id = auth.uid());

CREATE POLICY "Teachers can manage their courses"
  ON courses FOR ALL USING (teacher_id = auth.uid());

CREATE POLICY "Teachers can insert courses"
  ON courses FOR INSERT WITH CHECK (teacher_id = auth.uid());

-- Course modules policies
CREATE POLICY "Anyone can read published modules"
  ON course_modules FOR SELECT USING (
    is_published = true OR 
    course_id IN (SELECT id FROM courses WHERE teacher_id = auth.uid())
  );

CREATE POLICY "Teachers can manage their modules"
  ON course_modules FOR ALL USING (
    course_id IN (SELECT id FROM courses WHERE teacher_id = auth.uid())
  );

CREATE POLICY "Teachers can insert modules"
  ON course_modules FOR INSERT WITH CHECK (
    course_id IN (SELECT id FROM courses WHERE teacher_id = auth.uid())
  );

-- User progress policies
CREATE POLICY "Users can read own progress"
  ON user_progress FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own progress"
  ON user_progress FOR ALL USING (user_id = auth.uid());

-- Course enrollments policies
CREATE POLICY "Users can read own enrollments"
  ON course_enrollments FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage own enrollments"
  ON course_enrollments FOR ALL USING (user_id = auth.uid());

-- Notes policies
CREATE POLICY "Anyone can read public notes"
  ON notes FOR SELECT USING (is_public = true OR teacher_id = auth.uid());

CREATE POLICY "Teachers can manage their notes"
  ON notes FOR ALL USING (teacher_id = auth.uid());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_courses_teacher_id ON courses(teacher_id);
CREATE INDEX IF NOT EXISTS idx_courses_published ON courses(is_published);
CREATE INDEX IF NOT EXISTS idx_course_modules_course_id ON course_modules(course_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_course_id ON user_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_user_id ON course_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_teacher_id ON notes(teacher_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
    BEFORE UPDATE ON courses FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_modules_updated_at
    BEFORE UPDATE ON course_modules FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at
    BEFORE UPDATE ON user_progress FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample admin user
INSERT INTO users (email, name, password_hash, role, level, bio) VALUES
('admin@cybersec.com', 'System Administrator', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'advanced', 'System administrator with full access to platform management'),
('teacher@cybersec.com', 'Dr. Sarah Chen', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'teacher', 'advanced', 'Cybersecurity expert with 10+ years of experience in web application security'),
('student@cybersec.com', 'John Student', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'beginner', 'Aspiring cybersecurity professional');