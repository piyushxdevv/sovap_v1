/*
  # Teacher Database Schema

  1. New Tables
    - `courses`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `category` (text)
      - `difficulty` (enum: beginner, intermediate, advanced)
      - `thumbnail_url` (text, optional)
      - `estimated_hours` (integer)
      - `teacher_id` (uuid, foreign key to users)
      - `is_published` (boolean, default false)
      - `enrollment_count` (integer, default 0)
      - `rating` (decimal, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `course_modules`
      - `id` (uuid, primary key)
      - `course_id` (uuid, foreign key to courses)
      - `title` (text)
      - `description` (text)
      - `content` (text)
      - `module_order` (integer)
      - `video_url` (text, optional)
      - `pdf_url` (text, optional)
      - `quiz_questions` (jsonb)
      - `estimated_minutes` (integer)
      - `is_published` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `course_enrollments`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `course_id` (uuid, foreign key to courses)
      - `enrolled_at` (timestamp)
      - `completed_at` (timestamp, optional)
      - `progress_percentage` (integer, default 0)

    - `user_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `course_id` (uuid, foreign key to courses)
      - `module_id` (uuid, foreign key to course_modules)
      - `completed` (boolean, default false)
      - `completion_date` (timestamp, optional)
      - `quiz_score` (integer, default 0)
      - `time_spent_minutes` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `teacher_analytics`
      - `id` (uuid, primary key)
      - `teacher_id` (uuid, foreign key to users)
      - `course_id` (uuid, foreign key to courses)
      - `total_enrollments` (integer, default 0)
      - `active_students` (integer, default 0)
      - `completion_rate` (decimal, default 0)
      - `average_rating` (decimal, default 0)
      - `revenue` (decimal, default 0)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for teachers to manage their own content
    - Add policies for students to access enrolled courses
    - Add policies for admins to manage all content

  3. Indexes
    - Performance indexes on foreign keys and commonly queried fields
    - Composite indexes for complex queries

  4. Functions
    - Update triggers for timestamps
    - Functions to calculate progress and analytics
*/

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  thumbnail_url text,
  estimated_hours integer NOT NULL DEFAULT 0,
  teacher_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_published boolean DEFAULT false,
  enrollment_count integer DEFAULT 0,
  rating decimal(3,2) DEFAULT 0.0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create course_modules table
CREATE TABLE IF NOT EXISTS course_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  content text NOT NULL,
  module_order integer NOT NULL,
  video_url text,
  pdf_url text,
  quiz_questions jsonb DEFAULT '[]'::jsonb,
  estimated_minutes integer DEFAULT 0,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create course_enrollments table
CREATE TABLE IF NOT EXISTS course_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  progress_percentage integer DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  UNIQUE(user_id, course_id)
);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  module_id uuid NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
  completed boolean DEFAULT false,
  completion_date timestamptz,
  quiz_score integer DEFAULT 0 CHECK (quiz_score >= 0 AND quiz_score <= 100),
  time_spent_minutes integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, course_id, module_id)
);

-- Create teacher_analytics table
CREATE TABLE IF NOT EXISTS teacher_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  total_enrollments integer DEFAULT 0,
  active_students integer DEFAULT 0,
  completion_rate decimal(5,2) DEFAULT 0.0,
  average_rating decimal(3,2) DEFAULT 0.0,
  revenue decimal(10,2) DEFAULT 0.0,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(teacher_id, course_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_courses_teacher_id ON courses(teacher_id);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_difficulty ON courses(difficulty);
CREATE INDEX IF NOT EXISTS idx_courses_published ON courses(is_published);

CREATE INDEX IF NOT EXISTS idx_course_modules_course_id ON course_modules(course_id);
CREATE INDEX IF NOT EXISTS idx_course_modules_order ON course_modules(course_id, module_order);

CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON course_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON course_enrollments(course_id);

CREATE INDEX IF NOT EXISTS idx_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_course_id ON user_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_progress_module_id ON user_progress(module_id);

CREATE INDEX IF NOT EXISTS idx_analytics_teacher_id ON teacher_analytics(teacher_id);

-- Enable Row Level Security
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for courses
CREATE POLICY "Anyone can read published courses"
  ON courses
  FOR SELECT
  TO public
  USING (is_published = true);

CREATE POLICY "Teachers can manage their own courses"
  ON courses
  FOR ALL
  TO authenticated
  USING (teacher_id::text = uid()::text)
  WITH CHECK (teacher_id::text = uid()::text);

CREATE POLICY "Admins can manage all courses"
  ON courses
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = uid() AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = uid() AND users.role = 'admin'
    )
  );

-- RLS Policies for course_modules
CREATE POLICY "Anyone can read published modules"
  ON course_modules
  FOR SELECT
  TO public
  USING (
    is_published = true AND 
    EXISTS (
      SELECT 1 FROM courses 
      WHERE courses.id = course_modules.course_id AND courses.is_published = true
    )
  );

CREATE POLICY "Teachers can manage modules of their courses"
  ON course_modules
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courses 
      WHERE courses.id = course_modules.course_id AND courses.teacher_id = uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM courses 
      WHERE courses.id = course_modules.course_id AND courses.teacher_id = uid()
    )
  );

CREATE POLICY "Admins can manage all modules"
  ON course_modules
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = uid() AND users.role = 'admin'
    )
  );

-- RLS Policies for course_enrollments
CREATE POLICY "Users can manage their own enrollments"
  ON course_enrollments
  FOR ALL
  TO authenticated
  USING (user_id = uid())
  WITH CHECK (user_id = uid());

CREATE POLICY "Teachers can read enrollments for their courses"
  ON course_enrollments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courses 
      WHERE courses.id = course_enrollments.course_id AND courses.teacher_id = uid()
    )
  );

CREATE POLICY "Admins can manage all enrollments"
  ON course_enrollments
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = uid() AND users.role = 'admin'
    )
  );

-- RLS Policies for user_progress
CREATE POLICY "Users can manage their own progress"
  ON user_progress
  FOR ALL
  TO authenticated
  USING (user_id = uid())
  WITH CHECK (user_id = uid());

CREATE POLICY "Teachers can read progress for their courses"
  ON user_progress
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courses 
      WHERE courses.id = user_progress.course_id AND courses.teacher_id = uid()
    )
  );

CREATE POLICY "Admins can manage all progress"
  ON user_progress
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = uid() AND users.role = 'admin'
    )
  );

-- RLS Policies for teacher_analytics
CREATE POLICY "Teachers can read their own analytics"
  ON teacher_analytics
  FOR SELECT
  TO authenticated
  USING (teacher_id = uid());

CREATE POLICY "Teachers can update their own analytics"
  ON teacher_analytics
  FOR UPDATE
  TO authenticated
  USING (teacher_id = uid())
  WITH CHECK (teacher_id = uid());

CREATE POLICY "Admins can manage all analytics"
  ON teacher_analytics
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = uid() AND users.role = 'admin'
    )
  );

-- Create update triggers for timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_courses_updated_at 
  BEFORE UPDATE ON courses 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_modules_updated_at 
  BEFORE UPDATE ON course_modules 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at 
  BEFORE UPDATE ON user_progress 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teacher_analytics_updated_at 
  BEFORE UPDATE ON teacher_analytics 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update enrollment count
CREATE OR REPLACE FUNCTION update_course_enrollment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE courses 
    SET enrollment_count = enrollment_count + 1 
    WHERE id = NEW.course_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE courses 
    SET enrollment_count = enrollment_count - 1 
    WHERE id = OLD.course_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_enrollment_count_trigger
  AFTER INSERT OR DELETE ON course_enrollments
  FOR EACH ROW EXECUTE FUNCTION update_course_enrollment_count();

-- Function to calculate course progress
CREATE OR REPLACE FUNCTION calculate_course_progress()
RETURNS TRIGGER AS $$
DECLARE
  total_modules integer;
  completed_modules integer;
  progress_percent integer;
BEGIN
  -- Get total modules for the course
  SELECT COUNT(*) INTO total_modules
  FROM course_modules
  WHERE course_id = NEW.course_id AND is_published = true;
  
  -- Get completed modules for the user
  SELECT COUNT(*) INTO completed_modules
  FROM user_progress
  WHERE user_id = NEW.user_id 
    AND course_id = NEW.course_id 
    AND completed = true;
  
  -- Calculate progress percentage
  IF total_modules > 0 THEN
    progress_percent := (completed_modules * 100) / total_modules;
  ELSE
    progress_percent := 0;
  END IF;
  
  -- Update enrollment progress
  UPDATE course_enrollments
  SET progress_percentage = progress_percent,
      completed_at = CASE WHEN progress_percent = 100 THEN now() ELSE NULL END
  WHERE user_id = NEW.user_id AND course_id = NEW.course_id;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER calculate_progress_trigger
  AFTER INSERT OR UPDATE ON user_progress
  FOR EACH ROW EXECUTE FUNCTION calculate_course_progress();

-- Insert sample data for testing
INSERT INTO courses (title, description, category, difficulty, teacher_id, is_published, estimated_hours) VALUES
('Advanced Web Application Security', 'Comprehensive course covering OWASP Top 10 and advanced security concepts', 'Web Security', 'advanced', 
  (SELECT id FROM users WHERE email = 'teacher@demo.com'), true, 25),
('Network Security Fundamentals', 'Learn the basics of network security, firewalls, and intrusion detection', 'Network Security', 'beginner',
  (SELECT id FROM users WHERE email = 'teacher@demo.com'), true, 15),
('Cryptography and Data Protection', 'Understanding encryption, hashing, and secure communication protocols', 'Cryptography', 'intermediate',
  (SELECT id FROM users WHERE email = 'teacher@demo.com'), false, 20)
ON CONFLICT DO NOTHING;

-- Insert sample modules for the first course
DO $$
DECLARE
  course_uuid uuid;
BEGIN
  SELECT id INTO course_uuid FROM courses WHERE title = 'Advanced Web Application Security' LIMIT 1;
  
  IF course_uuid IS NOT NULL THEN
    INSERT INTO course_modules (course_id, title, description, content, module_order, is_published, estimated_minutes) VALUES
    (course_uuid, 'Introduction to Web Security', 'Overview of web application security landscape', 'This module covers the fundamentals of web application security...', 1, true, 60),
    (course_uuid, 'SQL Injection Deep Dive', 'Understanding and preventing SQL injection attacks', 'SQL injection is one of the most common web vulnerabilities...', 2, true, 90),
    (course_uuid, 'Cross-Site Scripting (XSS)', 'Preventing XSS attacks in web applications', 'XSS attacks allow attackers to inject malicious scripts...', 3, true, 75),
    (course_uuid, 'Authentication and Session Management', 'Secure authentication implementation', 'Proper authentication is crucial for web security...', 4, true, 80),
    (course_uuid, 'Security Testing and Code Review', 'Testing methodologies for secure applications', 'Learn how to test applications for security vulnerabilities...', 5, true, 70)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;