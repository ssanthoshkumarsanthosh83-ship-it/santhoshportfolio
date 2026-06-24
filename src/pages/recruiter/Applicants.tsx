import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, FileText, Calendar, Download, CheckCircle, XCircle, Eye } from 'lucide-react';
import { Card, CardContent, Button, Badge, Select, Modal } from '../../components/ui';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import type { Application } from '../../types';

interface ApplicationWithDetails extends Application {
  profiles: {
    id: string;
    full_name: string;
    email: string;
    avatar_url?: string;
  };
  jobs: {
    id: string;
    title: string;
  };
  resumes: {
    id: string;
    file_name: string;
    file_url: string;
  } | null;
}

export const Applicants: React.FC = () => {
  const { recruiterProfile } = useAuth();
  const [applications, setApplications] = useState<ApplicationWithDetails[]>([]);
  const [jobs, setJobs] = useState<{ id: string; title: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [jobFilter, setJobFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewModal, setViewModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState<ApplicationWithDetails | null>(null);

  useEffect(() => {
    if (recruiterProfile) {
      fetchJobs();
      fetchApplications();
    }
  }, [recruiterProfile, jobFilter, statusFilter]);

  const fetchJobs = async () => {
    const { data } = await supabase
      .from('jobs')
      .select('id, title')
      .eq('recruiter_id', recruiterProfile?.id);
    setJobs(data || []);
  };

  const fetchApplications = async () => {
    try {
      // First get all job IDs for this recruiter
      const { data: recruiterJobs } = await supabase
        .from('jobs')
        .select('id')
        .eq('recruiter_id', recruiterProfile?.id);

      const jobIds = recruiterJobs?.map((j) => j.id) || [];
      if (jobIds.length === 0) {
        setApplications([]);
        setLoading(false);
        return;
      }

      let query = supabase
        .from('applications')
        .select(`
          *,
          profiles ( id, full_name, email, avatar_url ),
          jobs ( id, title ),
          resumes ( id, file_name, file_url )
        `)
        .in('job_id', jobIds)
        .order('applied_at', { ascending: false });

      if (jobFilter) {
        query = query.eq('job_id', jobFilter);
      }
      if (statusFilter) {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId: string, newStatus: string) => {
    try {
      await supabase
        .from('applications')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', applicationId);

      fetchApplications();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const openViewModal = (app: ApplicationWithDetails) => {
    setSelectedApp(app);
    setViewModal(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'reviewing':
        return <Badge variant="info">Under Review</Badge>;
      case 'shortlisted':
        return <Badge variant="success">Shortlisted</Badge>;
      case 'rejected':
        return <Badge variant="danger">Rejected</Badge>;
      case 'hired':
        return <Badge variant="success">Hired</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const filterOptions = [
    { value: '', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'reviewing', label: 'Under Review' },
    { value: 'shortlisted', label: 'Shortlisted' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'hired', label: 'Hired' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Applicants</h1>
          <p className="text-gray-600 dark:text-gray-400">Review and manage job applications</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Select
              value={jobFilter}
              onChange={(e) => setJobFilter(e.target.value)}
              options={[
                { value: '', label: 'All Jobs' },
                ...jobs.map((j) => ({ value: j.id, label: j.title })),
              ]}
              className="md:w-1/2"
            />
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={filterOptions}
              className="md:w-1/3"
            />
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : applications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No applications found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map((app, index) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Applicant Info */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                        {app.profiles?.avatar_url ? (
                          <img
                            src={app.profiles.avatar_url}
                            alt={app.profiles.full_name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">
                          {app.profiles?.full_name}
                        </h3>
                        <p className="text-sm text-gray-500">{app.profiles?.email}</p>
                        <p className="text-sm text-blue-600 mt-1">
                          Applied for: {app.jobs?.title}
                        </p>
                      </div>
                    </div>

                    {/* Status & Date */}
                    <div className="text-center md:text-right">
                      {getStatusBadge(app.status)}
                      <p className="text-xs text-gray-500 mt-2">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        {new Date(app.applied_at).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => openViewModal(app)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      {app.resumes && (
                        <a href={app.resumes.file_url} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </a>
                      )}
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleStatusUpdate(app.id, 'shortlisted')}
                        icon={<CheckCircle className="w-4 h-4" />}
                      >
                        Shortlist
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleStatusUpdate(app.id, 'rejected')}
                        icon={<XCircle className="w-4 h-4" />}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* View Modal */}
      <Modal
        isOpen={viewModal}
        onClose={() => setViewModal(false)}
        title="Application Details"
        size="lg"
      >
        {selectedApp && (
          <div className="space-y-6">
            {/* Applicant Info */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                {selectedApp.profiles?.avatar_url ? (
                  <img
                    src={selectedApp.profiles.avatar_url}
                    alt={selectedApp.profiles.full_name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {selectedApp.profiles?.full_name}
                </h3>
                <p className="text-gray-500">{selectedApp.profiles?.email}</p>
              </div>
            </div>

            {/* Job Applied */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-500">Applied for</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {selectedApp.jobs?.title}
              </p>
            </div>

            {/* Cover Letter */}
            {selectedApp.cover_letter && (
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Cover Letter
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm whitespace-pre-wrap">
                  {selectedApp.cover_letter}
                </p>
              </div>
            )}

            {/* Resume */}
            {selectedApp.resumes && (
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-gray-400" />
                  <span className="text-gray-900 dark:text-gray-100">
                    {selectedApp.resumes.file_name}
                  </span>
                </div>
                <a href={selectedApp.resumes.file_url} target="_blank" rel="noopener noreferrer">
                  <Button variant="primary" size="sm">
                    Download Resume
                  </Button>
                </a>
              </div>
            )}

            {/* Status & Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-500">Update Status:</span>
              {['pending', 'reviewing', 'shortlisted', 'rejected', 'hired'].map((status) => (
                <Button
                  key={status}
                  variant={selectedApp.status === status ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => {
                    handleStatusUpdate(selectedApp.id, status);
                    setSelectedApp({ ...selectedApp, status } as ApplicationWithDetails);
                  }}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
