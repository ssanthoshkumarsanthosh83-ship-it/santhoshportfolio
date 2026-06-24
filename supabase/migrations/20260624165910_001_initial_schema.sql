-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'job_seeker', 'recruiter')),
    phone VARCHAR(20),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Recruiters/Companies table
CREATE TABLE recruiters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    company_description TEXT,
    company_logo TEXT,
    company_website VARCHAR(500),
    industry VARCHAR(100),
    company_size VARCHAR(50),
    founded_year INTEGER,
    location VARCHAR(255),
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Jobs table
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recruiter_id UUID REFERENCES recruiters(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    responsibilities TEXT,
    location VARCHAR(255) NOT NULL,
    job_type VARCHAR(50) NOT NULL CHECK (job_type IN ('full-time', 'part-time', 'contract', 'internship', 'remote')),
    salary_min DECIMAL(12, 2),
    salary_max DECIMAL(12, 2),
    currency VARCHAR(10) DEFAULT 'USD',
    category VARCHAR(100),
    skills TEXT[],
    experience_level VARCHAR(50),
    education_required VARCHAR(100),
    vacancies INTEGER DEFAULT 1,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'closed')),
    deadline DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Job Seeker Profiles
CREATE TABLE job_seeker_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    headline VARCHAR(255),
    summary TEXT,
    skills TEXT[],
    experience_years INTEGER DEFAULT 0,
    education JSONB,
    work_experience JSONB,
    certifications JSONB,
    languages JSONB,
    location VARCHAR(255),
    open_to_remote BOOLEAN DEFAULT TRUE,
    job_types TEXT[] DEFAULT ARRAY['full-time'],
    expected_salary_min DECIMAL(12, 2),
    expected_salary_max DECIMAL(12, 2),
    availability VARCHAR(50) DEFAULT 'immediately',
    linkedin_url VARCHAR(500),
    portfolio_url VARCHAR(500),
    github_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Resumes table
CREATE TABLE resumes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    file_name VARCHAR(255),
    file_url TEXT NOT NULL,
    file_size INTEGER,
    is_primary BOOLEAN DEFAULT FALSE,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Applications table
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    resume_id UUID REFERENCES resumes(id) ON DELETE SET NULL,
    cover_letter TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'shortlisted', 'rejected', 'hired', 'withdrawn')),
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    notes TEXT,
    UNIQUE(job_id, user_id)
);

-- Saved Jobs
CREATE TABLE saved_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    saved_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(job_id, user_id)
);

-- Job Categories
CREATE TABLE job_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    type VARCHAR(50),
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Reports/Analytics
CREATE TABLE analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    total_users INTEGER DEFAULT 0,
    total_recruiters INTEGER DEFAULT 0,
    total_job_seekers INTEGER DEFAULT 0,
    total_jobs INTEGER DEFAULT 0,
    total_applications INTEGER DEFAULT 0,
    jobs_posted INTEGER DEFAULT 0,
    applications_received INTEGER DEFAULT 0,
    jobs_approved INTEGER DEFAULT 0,
    UNIQUE(date)
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE recruiters ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_seeker_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT
    TO authenticated USING (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE
    TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT
    TO authenticated WITH CHECK (auth.uid() = id);

-- Admin can view all profiles
CREATE POLICY "profiles_admin_all" ON profiles FOR ALL
    TO authenticated USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- RLS Policies for jobs
CREATE POLICY "jobs_select_approved" ON jobs FOR SELECT
    TO authenticated USING (status = 'approved' OR 
        EXISTS (SELECT 1 FROM recruiters r JOIN profiles p ON r.user_id = p.id WHERE r.id = jobs.recruiter_id AND p.id = auth.uid()) OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "jobs_insert_recruiter" ON jobs FOR INSERT
    TO authenticated WITH CHECK (
        EXISTS (SELECT 1 FROM recruiters r WHERE r.user_id = auth.uid() AND r.id = jobs.recruiter_id)
    );

CREATE POLICY "jobs_update_recruiter_admin" ON jobs FOR UPDATE
    TO authenticated USING (
        EXISTS (SELECT 1 FROM recruiters r WHERE r.user_id = auth.uid() AND r.id = jobs.recruiter_id) OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "jobs_delete_recruiter_admin" ON jobs FOR DELETE
    TO authenticated USING (
        EXISTS (SELECT 1 FROM recruiters r WHERE r.user_id = auth.uid() AND r.id = jobs.recruiter_id) OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- RLS Policies for applications
CREATE POLICY "applications_select_own" ON applications FOR SELECT
    TO authenticated USING (
        user_id = auth.uid() OR 
        EXISTS (SELECT 1 FROM jobs j JOIN recruiters r ON j.recruiter_id = r.id WHERE j.id = applications.job_id AND r.user_id = auth.uid()) OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "applications_insert_seeker" ON applications FOR INSERT
    TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "applications_update_recruiter_admin" ON applications FOR UPDATE
    TO authenticated USING (
        EXISTS (SELECT 1 FROM jobs j JOIN recruiters r ON j.recruiter_id = r.id WHERE j.id = applications.job_id AND r.user_id = auth.uid()) OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- RLS Policies for recruiters
CREATE POLICY "recruiters_select_all" ON recruiters FOR SELECT
    TO authenticated USING (TRUE);

CREATE POLICY "recruiters_insert_own" ON recruiters FOR INSERT
    TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "recruiters_update_own" ON recruiters FOR UPDATE
    TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- RLS Policies for job_seeker_profiles
CREATE POLICY "job_seeker_profiles_select_all" ON job_seeker_profiles FOR SELECT
    TO authenticated USING (TRUE);

CREATE POLICY "job_seeker_profiles_insert_own" ON job_seeker_profiles FOR INSERT
    TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "job_seeker_profiles_update_own" ON job_seeker_profiles FOR UPDATE
    TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- RLS Policies for resumes
CREATE POLICY "resumes_select_own_recruiter" ON resumes FOR SELECT
    TO authenticated USING (
        user_id = auth.uid() OR
        EXISTS (SELECT 1 FROM applications a WHERE a.resume_id = resumes.id AND 
            EXISTS (SELECT 1 FROM jobs j JOIN recruiters r ON j.recruiter_id = r.id WHERE j.id = a.job_id AND r.user_id = auth.uid())) OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "resumes_insert_own" ON resumes FOR INSERT
    TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "resumes_delete_own" ON resumes FOR DELETE
    TO authenticated USING (user_id = auth.uid());

-- RLS Policies for saved_jobs
CREATE POLICY "saved_jobs_own" ON saved_jobs FOR ALL
    TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- RLS Policies for notifications
CREATE POLICY "notifications_own" ON notifications FOR ALL
    TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- RLS Policies for job_categories (public read)
CREATE POLICY "job_categories_read" ON job_categories FOR SELECT
    TO authenticated USING (TRUE);

CREATE POLICY "job_categories_admin" ON job_categories FOR ALL
    TO authenticated USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Insert default job categories
INSERT INTO job_categories (name, description, icon) VALUES
('Software Development', 'Software engineering and development roles', 'code'),
('Data Science', 'Data analysis, ML, and AI roles', 'brain'),
('Design', 'UI/UX, graphic design, and creative roles', 'palette'),
('Marketing', 'Digital marketing, content, and brand roles', 'megaphone'),
('Sales', 'Sales and business development roles', 'trending-up'),
('Finance', 'Accounting, finance, and banking roles', 'dollar-sign'),
('Human Resources', 'HR and recruitment roles', 'users'),
('Operations', 'Operations and project management roles', 'settings'),
('Customer Support', 'Customer service and support roles', 'headphones'),
('Product Management', 'Product management and strategy roles', 'box');

-- Create indexes for better query performance
CREATE INDEX idx_jobs_recruiter_id ON jobs(recruiter_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_category ON jobs(category);
CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_profiles_role ON profiles(role);