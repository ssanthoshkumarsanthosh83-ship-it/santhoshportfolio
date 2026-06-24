import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, MapPin, Calendar, Briefcase } from 'lucide-react';
import { Card, CardContent, Button, Badge, Modal, Input, Textarea, Select } from '../../components/ui';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import type { Job } from '../../types';

export const MyJobs: React.FC = () => {
  const { recruiterProfile } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    job_type: 'full-time' as Job['job_type'],
    salary_min: '',
    salary_max: '',
    category: '',
    skills: '',
  });

  useEffect(() => {
    if (recruiterProfile) {
      fetchJobs();
    }
  }, [recruiterProfile]);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('recruiter_id', recruiterProfile?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingJob(null);
    setFormData({
      title: '',
      description: '',
      requirements: '',
      location: '',
      job_type: 'full-time',
      salary_min: '',
      salary_max: '',
      category: '',
      skills: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (job: Job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      description: job.description,
      requirements: job.requirements || '',
      location: job.location,
      job_type: job.job_type,
      salary_min: job.salary_min?.toString() || '',
      salary_max: job.salary_max?.toString() || '',
      category: job.category || '',
      skills: job.skills?.join(', ') || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recruiterProfile) return;

    setSaving(true);
    try {
      const jobData = {
        title: formData.title,
        description: formData.description,
        requirements: formData.requirements,
        location: formData.location,
        job_type: formData.job_type,
        salary_min: formData.salary_min ? parseFloat(formData.salary_min) : null,
        salary_max: formData.salary_max ? parseFloat(formData.salary_max) : null,
        category: formData.category,
        skills: formData.skills.split(',').map((s) => s.trim()).filter(Boolean),
        status: 'pending' as const,
      };

      if (editingJob) {
        await supabase
          .from('jobs')
          .update({ ...jobData, updated_at: new Date().toISOString() })
          .eq('id', editingJob.id);
      } else {
        await supabase.from('jobs').insert({
          ...jobData,
          recruiter_id: recruiterProfile.id,
        });
      }

      setModalOpen(false);
      fetchJobs();
    } catch (error) {
      console.error('Error saving job:', error);
      alert('Failed to save job');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    try {
      await supabase.from('jobs').delete().eq('id', jobId);
      fetchJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success">Approved</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending Approval</Badge>;
      case 'rejected':
        return <Badge variant="danger">Rejected</Badge>;
      case 'closed':
        return <Badge variant="info">Closed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const jobTypeOptions = [
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My Job Posts</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your job listings</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={openCreateModal}>
          Post New Job
        </Button>
      </div>

      {/* Jobs List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : jobs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No jobs posted yet</p>
            <Button onClick={openCreateModal}>Post Your First Job</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {jobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                            {job.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mt-1">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(job.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        {getStatusBadge(job.status)}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        <Badge variant="primary" size="sm">
                          {job.job_type}
                        </Badge>
                        {job.category && (
                          <Badge variant="info" size="sm">
                            {job.category}
                          </Badge>
                        )}
                        {job.salary_min && job.salary_max && (
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-3">
                        {job.description}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEditModal(job)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(job.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingJob ? 'Edit Job' : 'Post New Job'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Job Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., Senior Software Engineer"
            required
          />
          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe the job role and responsibilities..."
            required
            rows={4}
          />
          <Textarea
            label="Requirements"
            value={formData.requirements}
            onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
            placeholder="List the requirements and qualifications..."
            rows={3}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g., San Francisco, CA"
              required
            />
            <Select
              label="Job Type"
              value={formData.job_type}
              onChange={(e) => setFormData({ ...formData, job_type: e.target.value as Job['job_type'] })}
              options={jobTypeOptions}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Salary Min"
              type="number"
              value={formData.salary_min}
              onChange={(e) => setFormData({ ...formData, salary_min: e.target.value })}
              placeholder="e.g., 80000"
            />
            <Input
              label="Salary Max"
              type="number"
              value={formData.salary_max}
              onChange={(e) => setFormData({ ...formData, salary_max: e.target.value })}
              placeholder="e.g., 120000"
            />
          </div>
          <Input
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="e.g., Software Development"
          />
          <Input
            label="Skills (comma-separated)"
            value={formData.skills}
            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
            placeholder="e.g., JavaScript, React, Node.js"
          />
          <div className="flex gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setModalOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" loading={saving} className="flex-1">
              {editingJob ? 'Update Job' : 'Post Job'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
