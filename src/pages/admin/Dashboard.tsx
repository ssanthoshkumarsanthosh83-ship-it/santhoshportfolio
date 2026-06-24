import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Briefcase,
  FileText,
  TrendingUp,
  UserPlus,
  Building2,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Card, CardContent, Badge } from '../../components/ui';
import { supabase } from '../../lib/supabase';
import type { DashboardStats } from '../../types';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch user counts
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const { count: totalRecruiters } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'recruiter');

      const { count: totalJobSeekers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'job_seeker');

      // Fetch job counts
      const { count: totalJobs } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true });

      const { count: jobsPending } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      const { count: jobsApproved } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved');

      // Fetch application counts
      const { count: totalApplications } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true });

      const { count: applicationsPending } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      const { count: applicationsShortlisted } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'shortlisted');

      // Fetch recent jobs
      const { data: jobs } = await supabase
        .from('jobs')
        .select(`
          id, title, status, created_at,
          recruiters ( company_name )
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch recent users
      const { data: users } = await supabase
        .from('profiles')
        .select('id, full_name, email, role, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      setStats({
        total_users: totalUsers || 0,
        total_recruiters: totalRecruiters || 0,
        total_job_seekers: totalJobSeekers || 0,
        total_jobs: totalJobs || 0,
        total_applications: totalApplications || 0,
        jobs_pending: jobsPending || 0,
        jobs_approved: jobsApproved || 0,
        applications_pending: applicationsPending || 0,
        applications_shortlisted: applicationsShortlisted || 0,
      });

      setRecentJobs(jobs || []);
      setRecentUsers(users || []);
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
      title: 'Total Users',
      value: stats?.total_users || 0,
      icon: Users,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50 dark:bg-blue-900/20',
      change: '+12%',
      changeType: 'up',
    },
    {
      title: 'Total Jobs',
      value: stats?.total_jobs || 0,
      icon: Briefcase,
      color: 'bg-green-500',
      lightColor: 'bg-green-50 dark:bg-green-900/20',
      change: '+8%',
      changeType: 'up',
    },
    {
      title: 'Applications',
      value: stats?.total_applications || 0,
      icon: FileText,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-50 dark:bg-purple-900/20',
      change: '+24%',
      changeType: 'up',
    },
    {
      title: 'Recruiters',
      value: stats?.total_recruiters || 0,
      icon: Building2,
      color: 'bg-orange-500',
      lightColor: 'bg-orange-50 dark:bg-orange-900/20',
      change: '+5%',
      changeType: 'up',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card hover>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.lightColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
                  </div>
                  <span className={`flex items-center gap-1 text-sm font-medium ${
                    stat.changeType === 'up' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {stat.changeType === 'up' ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {stat.value.toLocaleString()}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{stat.title}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-yellow-100 dark:bg-yellow-900/20">
                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {stats?.jobs_pending || 0}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Jobs Pending Approval</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/20">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {stats?.jobs_approved || 0}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Approved Jobs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/20">
                <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {stats?.applications_shortlisted || 0}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Shortlisted Candidates</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Jobs */}
        <Card>
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Recent Jobs</h3>
            <Badge variant="info">{recentJobs.length} new</Badge>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {recentJobs.map((job) => (
              <div key={job.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{job.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {job.recruiters?.company_name || 'Unknown Company'}
                  </p>
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
            ))}
            {recentJobs.length === 0 && (
              <div className="px-6 py-8 text-center text-gray-500">No recent jobs</div>
            )}
          </div>
        </Card>

        {/* Recent Users */}
        <Card>
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Recent Users</h3>
            <Badge variant="info">{recentUsers.length} new</Badge>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {recentUsers.map((user) => (
              <div key={user.id} className="px-6 py-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-gray-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-gray-100">{user.full_name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                </div>
                <Badge
                  variant={
                    user.role === 'admin'
                      ? 'danger'
                      : user.role === 'recruiter'
                      ? 'info'
                      : 'primary'
                  }
                >
                  {user.role}
                </Badge>
              </div>
            ))}
            {recentUsers.length === 0 && (
              <div className="px-6 py-8 text-center text-gray-500">No recent users</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
