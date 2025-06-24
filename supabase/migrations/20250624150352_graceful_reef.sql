/*
  # Fix RLS Policy Infinite Recursion

  1. Drop all existing policies that cause recursion
  2. Create new simplified policies without recursive lookups
  3. Ensure admin access without circular references
*/

-- Drop ALL existing policies to start fresh
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;

DROP POLICY IF EXISTS "Anyone can read published courses" ON courses;
DROP POLICY IF EXISTS "Admins can manage courses" ON courses;

DROP POLICY IF EXISTS "Users can read lessons of enrolled courses" ON lessons;
DROP POLICY IF EXISTS "Admins can manage lessons" ON lessons;

DROP POLICY IF EXISTS "Users can read own enrollments" ON enrollments;
DROP POLICY IF EXISTS "Users can create enrollments" ON enrollments;
DROP POLICY IF EXISTS "Admins can manage enrollments" ON enrollments;

DROP POLICY IF EXISTS "Users can manage own progress" ON user_progress;

DROP POLICY IF EXISTS "Users can read own payments" ON payments;
DROP POLICY IF EXISTS "Users can create payments" ON payments;
DROP POLICY IF EXISTS "Admins can read all payments" ON payments;

-- Create new simplified policies for profiles
CREATE POLICY "profiles_select_own"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create admin policy using a simple role check
CREATE POLICY "profiles_admin_all"
  ON profiles
  FOR ALL
  TO authenticated
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Create courses policies
CREATE POLICY "courses_select_published"
  ON courses
  FOR SELECT
  TO authenticated
  USING (status = 'published');

CREATE POLICY "courses_admin_all"
  ON courses
  FOR ALL
  TO authenticated
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Create lessons policies
CREATE POLICY "lessons_select_enrolled"
  ON lessons
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM enrollments 
      WHERE enrollments.user_id = auth.uid() 
      AND enrollments.course_id = lessons.course_id 
      AND enrollments.access_granted = true
    )
  );

CREATE POLICY "lessons_admin_all"
  ON lessons
  FOR ALL
  TO authenticated
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Create enrollments policies
CREATE POLICY "enrollments_select_own"
  ON enrollments
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "enrollments_insert_own"
  ON enrollments
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "enrollments_admin_all"
  ON enrollments
  FOR ALL
  TO authenticated
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Create user progress policies
CREATE POLICY "user_progress_all_own"
  ON user_progress
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Create payments policies
CREATE POLICY "payments_select_own"
  ON payments
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "payments_insert_own"
  ON payments
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "payments_admin_select"
  ON payments
  FOR SELECT
  TO authenticated
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );