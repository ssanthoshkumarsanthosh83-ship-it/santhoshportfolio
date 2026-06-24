import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bookmark, MapPin, Briefcase, Trash2 } from 'lucide-react';
import { Card, CardContent, Badge, Button } from '../../components/ui';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import type { SavedJob } from '../../types';

interface SavedJobWithDetails extends SavedJob {
  jobs: {
    id: string;
    title: string;
    location: string;
    job_type: string;
    salary_min?: number;
    salary_max?: number;
    recruiters: {
      company_name: string;
      company_logo?: string;
    };
  };
}

export const SavedJobs: React.FC = () => {
  const { user } = useAuth();
  const [savedJobs, setSavedJobs] = useState<SavedJobWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSavedJobs();
    }
  }, [user]);

  const fetchSavedJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_jobs')
        .select(`
          *,
          jobs (
            id, title, location, job_type, salary_min, salary_max,
            recruiters (
              company_name, company_logo
            )
          )
        `)
        .eq('user_id', user?.id)
        .order('saved_at', { ascending: false });

      if (error) throw error;
      setSavedJobs(data || []);
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (savedJobId: string) => {
    try {
      await supabase.from('saved_jobs').delete().eq('id', savedJobId);
      fetchSavedJobs();
    } catch (error) {
      console.error('Error removing saved job:', error);
    }
  };

  const handleApply = async (_jobId: string) => {
    // Navigate to job application
    alert('Apply functionality - navigate to job details');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Saved Jobs</h1>
        <p className="text-gray-600 dark:text-gray-400">Jobs you've bookmarked for later</p>
      </div>

      {/* Saved Jobs List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : savedJobs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Bookmark className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No saved jobs yet</p>
            <Button onClick={() => window.location.href = '/jobs'}>
              Browse Jobs
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {savedJobs.map((saved, index) => (
            <motion.div
              key={saved.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Company Logo */}
                    <div className="w-14 h-14 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                      {saved.jobs?.recruiters?.company_logo ? (
                        <img
                          src={saved.jobs.recruiters.company_logo}
                          alt={saved.jobs.recruiters.company_name}
                          className="w-full h-full rounded-xl object-cover"
                        />
                      ) : (
                        <Briefcase className="w-7 h-7 text-gray-400" />
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        {saved.jobs?.title}
                      </h3>
                      <p className="text-sm text-gray-500">{saved.jobs?.recruiters?.company_name}</p>

                      <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {saved.jobs?.location}
                        </span>
                        <Badge variant="primary" size="sm">
                          {saved.jobs?.job_type}
                        </Badge>
                        {saved.jobs?.salary_min && saved.jobs?.salary_max && (
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            ${saved.jobs.salary_min.toLocaleString()} - ${saved.jobs.salary_max.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleRemove(saved.id)}
                        icon={<Trash2 className="w-4 h-4" />}
                      >
                        Remove
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleApply(saved.jobs?.id)}
                      >
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
