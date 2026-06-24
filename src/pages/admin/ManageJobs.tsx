import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, CheckCircle, XCircle, Trash2, Briefcase, MapPin, Calendar } from 'lucide-react';
import { Card, CardContent, Button, Badge, Modal } from '../../components/ui';
import { supabase } from '../../lib/supabase';
import type { Job } from '../../types';

interface JobWithCompany extends Job {
  recruiters?: {
    company_name: string;
    company_logo?: string;
  };
}

export const ManageJobs: React.FC = () => {
  const [jobs, setJobs] = useState<JobWithCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobWithCompany | null>(null);

  useEffect(() => {
    fetchJobs();
  }, [statusFilter, searchQuery]);

  const fetchJobs = async () => {
    try {
      let query = supabase
        .from('jobs')
        .select(`
          *,
          recruiters (
            company_name,
            company_logo
          )
        `)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (jobId: string) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ status: 'approved', updated_at: new Date().toISOString() })
        .eq('id', jobId);

      if (error) throw error;
      fetchJobs();
    } catch (error) {
      console.error('Error approving job:', error);
    }
  };

  const handleReject = async (jobId: string) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ status: 'rejected', updated_at: new Date().toISOString() })
        .eq('id', jobId);

      if (error) throw error;
      fetchJobs();
    } catch (error) {
      console.error('Error rejecting job:', error);
    }
  };

  const handleDelete = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    try {
      const { error } = await supabase.from('jobs').delete().eq('id', jobId);

      if (error) throw error;
      fetchJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  const viewJob = (job: JobWithCompany) => {
    setSelectedJob(job);
    setViewModalOpen(true);
  };

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'closed', label: 'Closed' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success">Approved</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'rejected':
        return <Badge variant="danger">Rejected</Badge>;
      case 'closed':
        return <Badge variant="info">Closed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Manage Jobs</h1>
          <p className="text-gray-600 dark:text-gray-400">Review, approve, and manage job listings</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
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
            No jobs found
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
              <Card hover onClick={() => viewJob(job)}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
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
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {job.recruiters?.company_name}
                        </p>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          {job.title}
                        </h3>
                      </div>
                    </div>
                    {getStatusBadge(job.status)}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(job.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="primary" size="sm">
                      {job.job_type}
                    </Badge>
                    {job.category && (
                      <Badge variant="info" size="sm">
                        {job.category}
                      </Badge>
                    )}
                  </div>

                  {job.status === 'pending' && (
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleApprove(job.id)}
                        icon={<CheckCircle className="w-4 h-4" />}
                        className="flex-1"
                      >
                        Approve
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleReject(job.id)}
                        icon={<XCircle className="w-4 h-4" />}
                        className="flex-1"
                      >
                        Reject
                      </Button>
                    </div>
                  )}

                  {(job.status === 'approved' || job.status === 'rejected') && (
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(job.id)}
                        icon={<Trash2 className="w-4 h-4" />}
                        className="w-full"
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* View Job Modal */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Job Details"
        size="lg"
      >
        {selectedJob && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                {selectedJob.recruiters?.company_logo ? (
                  <img
                    src={selectedJob.recruiters.company_logo}
                    alt={selectedJob.recruiters.company_name}
                    className="w-full h-full rounded-xl object-cover"
                  />
                ) : (
                  <Briefcase className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
                  {selectedJob.title}
                </h3>
                <p className="text-gray-500">{selectedJob.recruiters?.company_name}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Location</p>
                <p className="text-gray-900 dark:text-gray-100">{selectedJob.location}</p>
              </div>
              <div>
                <p className="text-gray-500">Job Type</p>
                <p className="text-gray-900 dark:text-gray-100">{selectedJob.job_type}</p>
              </div>
              <div>
                <p className="text-gray-500">Salary</p>
                <p className="text-gray-900 dark:text-gray-100">
                  {selectedJob.salary_min && selectedJob.salary_max
                    ? `${selectedJob.currency} ${selectedJob.salary_min.toLocaleString()} - ${selectedJob.salary_max.toLocaleString()}`
                    : 'Not specified'}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Vacancies</p>
                <p className="text-gray-900 dark:text-gray-100">{selectedJob.vacancies || 1}</p>
              </div>
            </div>

            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Description</p>
              <p className="text-gray-900 dark:text-gray-100 text-sm">
                {selectedJob.description}
              </p>
            </div>

            {selectedJob.requirements && (
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Requirements</p>
                <p className="text-gray-900 dark:text-gray-100 text-sm">
                  {selectedJob.requirements}
                </p>
              </div>
            )}

            {selectedJob.skills && selectedJob.skills.length > 0 && (
              <div>
                <p className="text-gray-500 text-sm font-medium mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.skills.map((skill) => (
                    <Badge key={skill} variant="primary" size="sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              {selectedJob.status === 'pending' && (
                <>
                  <Button
                    variant="primary"
                    onClick={() => {
                      handleApprove(selectedJob.id);
                      setViewModalOpen(false);
                    }}
                    className="flex-1"
                  >
                    Approve Job
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      handleReject(selectedJob.id);
                      setViewModalOpen(false);
                    }}
                    className="flex-1"
                  >
                    Reject Job
                  </Button>
                </>
              )}
              <Button variant="outline" onClick={() => setViewModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
