import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase,
  FileText,
  Bookmark,
  TrendingUp,
  Clock,
  ChevronRight,
  MapPin,
} from 'lucide-react';
import { Card, CardContent, Badge, Button } from '../../components/ui';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import type { Job } from '../../types';

interface ApplicationWithJob {
  id: string;
  job_id: string;
  status: string;
  applied_at: string;
  jobs: {
    id: string;
    title: string;
    location: string;
    recruiters?: {
      company_name: string;
    };
  } | null;
}

export const JobSeekerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    applications: 0,
    interviews: 0,
    savedJobs: 0,
    pendingApplications: 0,
  });
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [recentApplications, setRecentApplications] = useState<ApplicationWithJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch application stats
      const { count: applicationsCount } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id);

      const { count: pendingCount } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id)
        .eq('status', 'pending');

      const { count: savedJobsCount } = await supabase
        .from('saved_jobs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id);

      setStats({
        applications: applicationsCount || 0,
        interviews: 0,
        savedJobs: savedJobsCount || 0,
        pendingApplications: pendingCount || 0,
      });

      // Fetch recent jobs
      const { data: jobs } = await supabase
        .from('jobs')
        .select(`
          *,
          recruiters (
            company_name,
            company_logo
          )
        `)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentJobs(jobs || []);

      // Fetch recent applications
      const { data: applications } = await supabase
        .from('applications')
        .select(`
          *,
          jobs (
            id, title, location,
            recruiters (
              company_name
            )
          )
        `)
        .eq('user_id', user?.id)
        .order('applied_at', { ascending: false })
        .limit(5);

      setRecentApplications(applications || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Applications',
      value: stats.applications,
      icon: FileText,
      color: 'bg-blue-500',
      link: '/applications',
    },
    {
      title: 'Pending',
      value: stats.pendingApplications,
      icon: Clock,
      color: 'bg-yellow-500',
      link: '/applications',
    },
    {
      title: 'Saved Jobs',
      value: stats.savedJobs,
      icon: Bookmark,
      color: 'bg-purple-500',
      link: '/saved-jobs',
    },
    {
      title: 'Interviews',
      value: stats.interviews,
      icon: TrendingUp,
      color: 'bg-green-500',
      link: '/applications',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 border-none">
        <CardContent className="p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">
            Welcome back, {user?.full_name?.split(' ')[0]}!
          </h2>
          <p className="text-blue-100 mb-4">
            Ready to find your next opportunity? Browse available jobs or check your application status.
          </p>
          <Link to="/jobs">
            <Button variant="secondary">Browse Jobs</Button>
          </Link>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={stat.link}>
              <Card hover>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${stat.color}`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {stat.value}
                      </p>
                      <p className="text-sm text-gray-500">{stat.title}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent Jobs and Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Jobs */}
        <Card>
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Recent Jobs</h3>
            <Link to="/jobs" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {recentJobs.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">No jobs available</div>
            ) : (
              recentJobs.map((job) => (
                <div key={job.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-gray-100">{job.title}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin className="w-3 h-3" />
                        {job.location}
                      </div>
                    </div>
                    <Badge variant="primary">{job.job_type}</Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Recent Applications */}
        <Card>
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">My Applications</h3>
            <Link
              to="/applications"
              className="text-sm text-blue-600 hover:underline flex items-center gap-1"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {recentApplications.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">No applications yet</div>
            ) : (
              recentApplications.map((app) => (
                <div key={app.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {app.jobs?.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {app.jobs?.recruiters?.company_name}
                      </p>
                    </div>
                    <Badge
                      variant={
                        app.status === 'hired'
                          ? 'success'
                          : app.status === 'shortlisted'
                          ? 'info'
                          : app.status === 'rejected'
                          ? 'danger'
                          : 'warning'
                      }
                    >
                      {app.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
