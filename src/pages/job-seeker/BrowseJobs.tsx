import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Briefcase, Bookmark, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, Badge, Button, Modal, Textarea } from '../../components/ui';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import type { Job, JobCategory, Resume } from '../../types';

interface JobWithRecruiter extends Job {
  recruiters?: {
    id: string;
    company_name: string;
    company_logo?: string;
    location?: string;
  };
}

export const BrowseJobs: React.FC = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobWithRecruiter[]>([]);
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [applyModal, setApplyModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobWithRecruiter | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [selectedResume, setSelectedResume] = useState('');
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchResumes();
  }, [user]);

  useEffect(() => {
    fetchJobs();
  }, [searchQuery, locationFilter, typeFilter, categoryFilter, page]);

  const fetchCategories = async () => {
    const { data } = await supabase.from('job_categories').select('*');
    setCategories(data || []);
  };

  const fetchResumes = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', user.id)
      .order('uploaded_at', { ascending: false });
    setResumes(data || []);
  };

  const fetchJobs = async () => {
    try {
      let query = supabase
        .from('jobs')
        .select(`
          *,
          recruiters (
            id, company_name, company_logo, location
          )
        `, { count: 'exact' })
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }
      if (locationFilter) {
        query = query.ilike('location', `%${locationFilter}%`);
      }
      if (typeFilter) {
        query = query.eq('job_type', typeFilter);
      }
      if (categoryFilter) {
        query = query.eq('category', categoryFilter);
      }

      const from = (page - 1) * 12;
      const to = from + 11;

      const { data, count } = await query.range(from, to);

      setJobs(data || []);
      setTotalPages(Math.ceil(((count || 0) + 11) / 12));
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!selectedJob || !user) return;

    setApplying(true);
    try {
      // Check if already applied
      const { data: existing } = await supabase
        .from('applications')
        .select('id')
        .eq('job_id', selectedJob.id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        alert('You have already applied for this job');
        return;
      }

      await supabase.from('applications').insert({
        job_id: selectedJob.id,
        user_id: user.id,
        resume_id: selectedResume || null,
        cover_letter: coverLetter,
        status: 'pending',
      });

      setApplyModal(false);
      setCoverLetter('');
      setSelectedResume('');
      alert('Application submitted successfully!');
    } catch (error) {
      console.error('Error applying:', error);
      alert('Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  const handleSaveJob = async (jobId: string) => {
    if (!user) return;

    try {
      const { data: existing } = await supabase
        .from('saved_jobs')
        .select('id')
        .eq('job_id', jobId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        await supabase.from('saved_jobs').delete().eq('id', existing.id);
      } else {
        await supabase.from('saved_jobs').insert({
          job_id: jobId,
          user_id: user.id,
        });
      }
    } catch (error) {
      console.error('Error saving job:', error);
    }
  };

  const openApplyModal = (job: JobWithRecruiter) => {
    setSelectedJob(job);
    setApplyModal(true);
  };

  const jobTypes = [
    { value: '', label: 'All Types' },
    { value: 'full-time', label: 'Full Time' },
    { value: 'part-time', label: 'Part Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' },
    { value: 'remote', label: 'Remote' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Browse Jobs</h1>
          <p className="text-gray-600 dark:text-gray-400">Find your next career opportunity</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Location..."
                value={locationFilter}
                onChange={(e) => {
                  setLocationFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {jobTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => {
                setCategoryFilter('');
                setPage(1);
              }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                categoryFilter === ''
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setCategoryFilter(cat.name);
                  setPage(1);
                }}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  categoryFilter === cat.name
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Jobs Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : jobs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            No jobs found matching your criteria
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card hover className="h-full flex flex-col">
                <CardContent className="p-6 flex-1 flex flex-col">
                  {/* Company */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                      {job.recruiters?.company_logo ? (
                        <img
                          src={job.recruiters.company_logo}
                          alt={job.recruiters.company_name}
                          className="w-full h-full rounded-xl object-cover"
                        />
                      ) : (
                        <Briefcase className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{job.recruiters?.company_name}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {job.location}
                      </p>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {job.title}
                  </h3>

                  {/* Badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="primary" size="sm">
                      {job.job_type}
                    </Badge>
                    {job.category && (
                      <Badge variant="info" size="sm">
                        {job.category}
                      </Badge>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 flex-1">
                    {job.description}
                  </p>

                  {/* Salary */}
                  {job.salary_min && job.salary_max && (
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-4">
                      {job.currency} {job.salary_min.toLocaleString()} -{' '}
                      {job.salary_max.toLocaleString()}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 mt-auto">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => openApplyModal(job)}
                      className="flex-1"
                    >
                      Apply Now
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSaveJob(job.id)}
                    >
                      <Bookmark className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Apply Modal */}
      <Modal isOpen={applyModal} onClose={() => setApplyModal(false)} title="Apply for Job" size="lg">
        {selectedJob && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">
                {selectedJob.title}
              </h4>
              <p className="text-sm text-gray-500">{selectedJob.recruiters?.company_name}</p>
            </div>

            {resumes.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Select Resume
                </label>
                <select
                  value={selectedResume}
                  onChange={(e) => setSelectedResume(e.target.value)}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a resume</option>
                  {resumes.map((resume) => (
                    <option key={resume.id} value={resume.id}>
                      {resume.file_name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <Textarea
              label="Cover Letter (Optional)"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Tell the employer why you're a good fit for this role..."
              rows={5}
            />

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setApplyModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleApply} loading={applying} className="flex-1">
                Submit Application
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
