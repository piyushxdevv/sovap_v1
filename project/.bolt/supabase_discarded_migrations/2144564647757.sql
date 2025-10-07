-- =============================================
-- EXTENSION
-- =============================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- SAFE CLEANUP (DROP TRIGGERS, FUNCTIONS, POLICIES IF EXIST)
-- =============================================
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_admin_content_updated_at ON admin_content;
DROP TRIGGER IF EXISTS update_notes_updated_at ON notes;
DROP TRIGGER IF EXISTS update_lab_sessions_updated_at ON lab_sessions;

DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop RLS Policies
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Anyone can insert users" ON users;

DROP POLICY IF EXISTS "Anyone can read published content" ON admin_content;
DROP POLICY IF EXISTS "Admins can manage all content" ON admin_content;
DROP POLICY IF EXISTS "Teachers can manage their content" ON admin_content;

DROP POLICY IF EXISTS "Anyone can read notes" ON notes;
DROP POLICY IF EXISTS "Admins can manage notes" ON notes;
DROP POLICY IF EXISTS "Admins can insert notes" ON notes;

DROP POLICY IF EXISTS "Allow authenticated users to read lab_sessions" ON lab_sessions;

-- =============================================
-- TABLES
-- =============================================

-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  password_hash text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'student', 'teacher')),
  level text NOT NULL DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  completed_assessment boolean DEFAULT false,
  course_progress jsonb DEFAULT '{}',
  certificates text[] DEFAULT '{}',
  bio text,
  specialization text,
  experience_years text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ADMIN CONTENT TABLE (courses, modules, labs, etc.)
CREATE TABLE IF NOT EXISTS admin_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  content text,
  content_type text NOT NULL CHECK (content_type IN ('course', 'module', 'lab', 'video', 'note')),
  category text NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  video_url text,
  pdf_url text,
  admin_id uuid REFERENCES users(id) ON DELETE CASCADE,
  is_published boolean DEFAULT false,
  estimated_hours integer DEFAULT 0,
  enrollment_count integer DEFAULT 0,
  rating numeric DEFAULT 0.0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- NOTES TABLE
CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  module_id text NOT NULL,
  course_id text NOT NULL,
  pdf_url text NOT NULL,
  admin_id uuid REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- LAB SESSIONS TABLE
CREATE TABLE IF NOT EXISTS lab_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_name text NOT NULL,
  lab_topic text,
  instructor text,
  updated_at timestamptz DEFAULT now()
);

-- =============================================
-- TRIGGER FUNCTION TO UPDATE `updated_at`
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- TRIGGERS
-- =============================================
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_content_updated_at
BEFORE UPDATE ON admin_content
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notes_updated_at
BEFORE UPDATE ON notes
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lab_sessions_updated_at
BEFORE UPDATE ON lab_sessions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- =============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_sessions ENABLE ROW LEVEL SECURITY;

-- =============================================
-- POLICIES
-- =============================================

-- USERS
CREATE POLICY "Users can read own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Anyone can insert users" ON users FOR INSERT WITH CHECK (true);

-- ADMIN CONTENT
CREATE POLICY "Anyone can read published content"
  ON admin_content FOR SELECT
  USING (is_published = true OR admin_id = auth.uid());

CREATE POLICY "Admins can manage all content"
  ON admin_content FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Teachers can manage their content"
  ON admin_content FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'teacher'
    ) AND admin_id = auth.uid()
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'teacher'
    ) AND admin_id = auth.uid()
  );

-- NOTES
CREATE POLICY "Anyone can read notes" ON notes FOR SELECT USING (true);
CREATE POLICY "Admins can manage notes" ON notes FOR ALL USING (admin_id = auth.uid());
CREATE POLICY "Admins can insert notes" ON notes FOR INSERT WITH CHECK (admin_id = auth.uid());

-- LAB SESSIONS
CREATE POLICY "Allow authenticated users to read lab_sessions" ON lab_sessions FOR SELECT USING (auth.role() = 'authenticated');

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_admin_content_admin_id ON admin_content(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_content_published ON admin_content(is_published);
CREATE INDEX IF NOT EXISTS idx_admin_content_category ON admin_content(category);
CREATE INDEX IF NOT EXISTS idx_notes_course_id ON notes(course_id);
CREATE INDEX IF NOT EXISTS idx_notes_module_id ON notes(module_id);

-- =============================================
-- SAFE USER INSERTS (Admin & Teacher)
-- =============================================
INSERT INTO users (email, name, password_hash, role, level)
SELECT 'vninamdar03@gmail.com', 'Admin User',
       '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
       'admin', 'advanced'
WHERE NOT EXISTS (
  SELECT 1 FROM users WHERE email = 'vninamdar03@gmail.com'
);

INSERT INTO users (email, name, password_hash, role, level)
SELECT 'shdixit10@gmail.com', 'Teacher Shubham Dixit',
       '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
       'teacher', 'intermediate'
WHERE NOT EXISTS (
  SELECT 1 FROM users WHERE email = 'shdixit10@gmail.com'
);
