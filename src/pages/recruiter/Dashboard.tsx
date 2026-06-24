import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase,
  FileText,
  Plus,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { Card, CardContent, Badge, Button } from '../../components/ui';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

export const RecruiterDashboard: React.FC = () => {
  const { user, recruiterProfile } = useAuth();
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    pendingApplications: 0,
    shortlisted: 0,
  });
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [recentApplicants, setRecentApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (recruiterProfile) {
      fetchDashboardData();
    }
  }, [recruiterProfile]);

  const fetchDashboardData = async () => {
    try {
      // Fetch job stats
      const { count: activeJobsCount } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .eq('recruiter_id', recruiterProfile?.id)
        .eq('status', 'approved');

      // Fetch applications stats
      const { data: jobsData } = await supabase
        .from('jobs')
        .select('id')
        .eq('recruiter_id', recruiterProfile?.id);

      const jobIds = jobsData?.map((j) => j.id) || [];

      let totalApps = 0;
      let pendingApps = 0;
      let shortlisted = 0;

      if (jobIds.length > 0) {
        const { count } = await supabase
          .from('applications')
          .select('*', { count: 'exact', head: true })
          .in('job_id', jobIds);
        totalApps = count || 0;

        const { count: pendingCount } = await supabase
          .from('applications')
          .select('*', { count: 'exact', head: true })
          .in('job_id', jobIds)
          .eq('status', 'pending');
        pendingApps = pendingCount || 0;

        const { count: shortlistedCount } = await supabase
          .from('applications')
          .select('*', { count: 'exact', head: true })
          .in('job_id', jobIds)
          .eq('status', 'shortlisted');
        shortlisted = shortlistedCount || 0;
      }

      setStats({
        activeJobs: activeJobsCount || 0,
        totalApplications: totalApps,
        pendingApplications: pendingApps,
        shortlisted: shortlisted,
      });

      // Fetch recent jobs
      const { data: jobs } = await supabase
        .from('jobs')
        .select('*')
        .eq('recruiter_id', recruiterProfile?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentJobs(jobs || []);

      // Fetch recent applicants
      if (jobIds.length > 0) {
        const { data: applicants } = await supabase
          .from('applications')
          .select(`
            *,
            jobs ( title ),
            profiles ( full_name, email )
          `)
          .in('job_id', jobIds)
          .order('applied_at', { ascending: false })
          .limit(5);

        setRecentApplicants(applicants || []);
      }
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
      title: 'Active Jobs',
      value: stats.activeJobs,
      icon: Briefcase,
      color: 'bg-blue-500',
      link: '/my-jobs',
    },
    {
      title: 'Total Applications',
      value: stats.totalApplications,
      icon: FileText,
      color: 'bg-green-500',
      link: '/applicants',
    },
    {
      title: 'Pending Review',
      value: stats.pendingApplications,
      icon: Clock,
      color: 'bg-yellow-500',
      link: '/applicants',
    },
    {
      title: 'Shortlisted',
      value: stats.shortlisted,
      icon: CheckCircle,
      color: 'bg-purple-500',
      link: '/applicants',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <Card className="bg-gradient-to-r from-green-500 to-green-600 border-none">
        <CardContent className="p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">
            Welcome, {user?.full_name?.split(' ')[0]}!
          </h2>
          <p className="text-green-100 mb-4">
            Manage your job posts and find the best candidates for your company.
          </p>
          <Link to="/my-jobs">
            <Button variant="secondary">
              <Plus className="w-4 h-4 mr-1" />
              Post New Job
            </Button>
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

      {/* Recent Jobs and Applicants */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Jobs */}
        <Card>
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">My Job Posts</h3>
            <Link to="/my-jobs" className="text-sm text-blue-600 hover:underline">
              View All
            </Link>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {recentJobs.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">No jobs posted yet</div>
            ) : (
              recentJobs.map((job) => (
                <div key={job.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{job.title}</p>
                      <p className="text-sm text-gray-500">{job.location}</p>
                    </div>
                    <Badge
                      variant={
                        job.status === 'approved'
                          ? 'success'
                          : job.status === 'pending'
                          ? 'warning'
                          : 'danger'
                      }
                    >
                      {job.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Recent Applicants */}
        <Card>
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Recent Applicants</h3>
            <Link to="/applicants" className="text-sm text-blue-600 hover:underline">
              View All
            </Link>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {recentApplicants.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">No applicants yet</div>
            ) : (
              recentApplicants.map((app) => (
                <div key={app.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {app.profiles?.full_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Applied for {app.jobs?.title}
                      </p>
                    </div>
                    <Badge
                      variant={
                        app.status === 'shortlisted'
                          ? 'success'
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
