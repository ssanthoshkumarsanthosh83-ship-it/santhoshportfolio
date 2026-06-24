export type UserRole = 'admin' | 'job_seeker' | 'recruiter';

export type JobStatus = 'pending' | 'approved' | 'rejected' | 'closed';
export type JobType = 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote';
export type ApplicationStatus = 'pending' | 'reviewing' | 'shortlisted' | 'rejected' | 'hired' | 'withdrawn';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface RecruiterProfile {
  id: string;
  user_id: string;
  company_name: string;
  company_description?: string;
  company_logo?: string;
  company_website?: string;
  industry?: string;
  company_size?: string;
  founded_year?: number;
  location?: string;
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface JobSeekerProfile {
  id: string;
  user_id: string;
  headline?: string;
  summary?: string;
  skills?: string[];
  experience_years?: number;
  education?: Education[];
  work_experience?: WorkExperience[];
  certifications?: Certification[];
  languages?: Language[];
  location?: string;
  open_to_remote?: boolean;
  job_types?: string[];
  expected_salary_min?: number;
  expected_salary_max?: number;
  availability?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  github_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  start_date: string;
  end_date?: string;
  grade?: string;
}

export interface WorkExperience {
  company: string;
  title: string;
  location?: string;
  start_date: string;
  end_date?: string;
  description?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface Language {
  name: string;
  proficiency: string;
}

export interface Job {
  id: string;
  recruiter_id: string;
  recruiter?: RecruiterProfile;
  title: string;
  description: string;
  requirements?: string;
  responsibilities?: string;
  location: string;
  job_type: JobType;
  salary_min?: number;
  salary_max?: number;
  currency?: string;
  category?: string;
  skills?: string[];
  experience_level?: string;
  education_required?: string;
  vacancies?: number;
  status: JobStatus;
  deadline?: string;
  created_at: string;
  updated_at: string;
}

export interface Resume {
  id: string;
  user_id: string;
  file_name: string;
  file_url: string;
  file_size?: number;
  is_primary: boolean;
  uploaded_at: string;
}

export interface Application {
  id: string;
  job_id: string;
  job?: Job;
  user_id: string;
  applicant?: Profile;
  resume_id?: string;
  resume?: Resume;
  cover_letter?: string;
  status: ApplicationStatus;
  applied_at: string;
  updated_at: string;
  notes?: string;
}

export interface SavedJob {
  id: string;
  job_id: string;
  job?: Job;
  user_id: string;
  saved_at: string;
}

export interface JobCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message?: string;
  type?: string;
  read: boolean;
  created_at: string;
}

export interface DashboardStats {
  total_users: number;
  total_recruiters: number;
  total_job_seekers: number;
  total_jobs: number;
  total_applications: number;
  jobs_pending: number;
  jobs_approved: number;
  applications_pending: number;
  applications_shortlisted: number;
}

export interface AuthState {
  user: Profile | null;
  recruiterProfile: RecruiterProfile | null;
  jobSeekerProfile: JobSeekerProfile | null;
  loading: boolean;
  error: string | null;
}
