import { supabase } from '../lib/supabase';

class CourseService {
  // Course Management
  async createCourse(courseData: any) {
    try {
      console.log('Creating course with data:', courseData);
      
      const { data, error } = await supabase
        .from('courses')
        .insert([{
          title: courseData.title,
          description: courseData.description,
          category: courseData.category,
          difficulty: courseData.difficulty,
          estimated_hours: courseData.estimated_hours || 0,
          teacher_id: courseData.teacher_id,
          is_published: courseData.is_published || false,
          enrollment_count: 0,
          rating: 0
        }])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Failed to create course: ${error.message}`);
      }
      
      console.log('Course created successfully:', data);
      return data;
    } catch (error) {
      console.error('Create course error:', error);
      throw error;
    }
  }

  async updateCourse(id, updates) {
    try {
      const { data, error } = await supabase
        .from('courses')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(`Failed to update course: ${error.message}`);
      return data;
    } catch (error) {
      console.error('Update course error:', error);
      throw error;
    }
  }

  async deleteCourse(id: string) {
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);

      if (error) throw new Error(`Failed to delete course: ${error.message}`);
      return true;
    } catch (error) {
      console.error('Delete course error:', error);
      throw error;
    }
  }

  async getCoursesByTeacher(teacherId) {
    try {
      // First get courses without join to avoid relationship issues
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .eq('teacher_id', teacherId)
        .order('created_at', { ascending: false });

      if (coursesError) {
        console.error('Courses query error:', coursesError);
        throw new Error(`Failed to fetch teacher courses: ${coursesError.message}`);
      }

      // Get teacher info separately
      const { data: teacherData, error: teacherError } = await supabase
        .from('users')
        .select('name, email, profile_image')
        .eq('id', teacherId)
        .single();

      if (teacherError) {
        console.error('Teacher query error:', teacherError);
        // Continue without teacher data if needed
      }

      // Combine the data
      const coursesWithTeacher = coursesData?.map(course => ({
        ...course,
        teacher: teacherData || null
      })) || [];

      return coursesWithTeacher;
    } catch (error) {
      console.error('Get teacher courses error:', error);
      throw error;
    }
  }

  async getAllCourses() {
    try {
      // Simplified query without join to avoid relationship issues
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw new Error(`Failed to fetch courses: ${error.message}`);
      return data;
    } catch (error) {
      console.error('Get all courses error:', error);
      throw error;
    }
  }

  // Module Management
  async createModule(moduleData) {
    try {
      const { data, error } = await supabase
        .from('course_modules')
        .insert([moduleData])
        .select()
        .single();

      if (error) throw new Error(`Failed to create module: ${error.message}`);
      return data;
    } catch (error) {
      console.error('Create module error:', error);
      throw error;
    }
  }

  async updateModule(id, updates) {
    try {
      const { data, error } = await supabase
        .from('course_modules')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(`Failed to update module: ${error.message}`);
      return data;
    } catch (error) {
      console.error('Update module error:', error);
      throw error;
    }
  }

  async getModulesByCourse(courseId) {
    try {
      const { data, error } = await supabase
        .from('course_modules')
        .select('*')
        .eq('course_id', courseId)
        .eq('is_published', true)
        .order('module_order', { ascending: true });

      if (error) throw new Error(`Failed to fetch modules: ${error.message}`);
      return data;
    } catch (error) {
      console.error('Get modules error:', error);
      throw error;
    }
  }

  // Progress Tracking
  async updateProgress(progressData) {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .upsert([progressData])
        .select()
        .single();

      if (error) throw new Error(`Failed to update progress: ${error.message}`);
      return data;
    } catch (error) {
      console.error('Update progress error:', error);
      throw error;
    }
  }

  async getUserProgress(userId, courseId) {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('course_id', courseId);

      if (error) throw new Error(`Failed to fetch user progress: ${error.message}`);
      return data;
    } catch (error) {
      console.error('Get user progress error:', error);
      throw error;
    }
  }

  // Enrollment Management
  async enrollInCourse(userId, courseId) {
    try {
      const { data, error } = await supabase
        .from('course_enrollments')
        .insert([{ user_id: userId, course_id: courseId }])
        .select()
        .single();

      if (error) throw new Error(`Failed to enroll in course: ${error.message}`);
      return data;
    } catch (error) {
      console.error('Enroll in course error:', error);
      throw error;
    }
  }

  async getUserEnrollments(userId) {
    try {
      const { data, error } = await supabase
        .from('course_enrollments')
        .select(`
          *,
          course:courses(
            *,
            teacher:users(name, profile_image)
          )
        `)
        .eq('user_id', userId)
        .order('enrolled_at', { ascending: false });

      if (error) throw new Error(`Failed to fetch enrollments: ${error.message}`);
      return data;
    } catch (error) {
      console.error('Get user enrollments error:', error);
      throw error;
    }
  }

  // File Upload
  async uploadFile(file, folder = 'courses') {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('uploads')
        .upload(filePath, file);

      if (error) throw new Error(`Failed to upload file: ${error.message}`);

      const { data: { publicUrl } } = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Upload file error:', error);
      throw error;
    }
  }
}

export const courseService = new CourseService();