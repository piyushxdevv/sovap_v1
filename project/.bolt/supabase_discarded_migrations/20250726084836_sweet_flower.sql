/*
  # Create Demo Users for Testing

  1. Demo Users
    - Student: student@demo.com / password
    - Teacher: teacher@demo.com / password  
    - Admin: admin@demo.com / password
  2. Security
    - Proper password hashing with bcrypt
    - Correct role assignments
    - Default user settings
*/

-- Create demo users with hashed passwords
-- Password 'password' hashed with bcrypt (rounds=10)
INSERT INTO users (
  id,
  email,
  name,
  password_hash,
  role,
  level,
  completed_assessment,
  bio,
  specialization,
  experience_years
) VALUES 
(
  gen_random_uuid(),
  'student@demo.com',
  'Demo Student',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'student',
  'beginner',
  false,
  'Demo student account for testing',
  '',
  null
),
(
  gen_random_uuid(),
  'teacher@demo.com',
  'Demo Teacher',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'teacher',
  'intermediate',
  true,
  'Demo teacher account for testing',
  'Web Security',
  '3-5'
),
(
  gen_random_uuid(),
  'admin@demo.com',
  'Demo Admin',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'admin',
  'advanced',
  true,
  'Demo admin account for testing',
  'Cybersecurity Management',
  '5+'
)
ON CONFLICT (email) DO NOTHING;