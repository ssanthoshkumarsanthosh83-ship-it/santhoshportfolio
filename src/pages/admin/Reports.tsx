import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  Briefcase,
  FileText,
} from 'lucide-react';
import { Card, CardContent } from '../../components/ui';
import { supabase } from '../../lib/supabase';

interface ReportStats {
  usersByRole: { role: string; count: number }[];
  jobsByStatus: { status: string; count: number }[];
  applicationsByStatus: { status: string; count: number }[];
  jobsByCategory: { category: string; count: number }[];
  monthlyTrends: { month: string; jobs: number; applications: number }[];
}

export const Reports: React.FC = () => {
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      // Users by role
      const { data: usersData } = await supabase
        .from('profiles')
        .select('role');

      const usersByRole = usersData?.reduce((acc: any[], user) => {
        const existing = acc.find((item) => item.role === user.role);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ role: user.role, count: 1 });
        }
        return acc;
      }, []) || [];

      // Jobs by status
      const { data: jobsData } = await supabase
        .from('jobs')
        .select('status');

      const jobsByStatus = jobsData?.reduce((acc: any[], job) => {
        const existing = acc.find((item) => item.status === job.status);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ status: job.status, count: 1 });
        }
        return acc;
      }, []) || [];

      // Applications by status
      const { data: applicationsData } = await supabase
        .from('applications')
        .select('status');

      const applicationsByStatus = applicationsData?.reduce((acc: any[], app) => {
        const existing = acc.find((item) => item.status === app.status);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ status: app.status, count: 1 });
        }
        return acc;
      }, []) || [];

      // Jobs by category
      const { data: jobsByCat } = await supabase
        .from('jobs')
        .select('category');

      const jobsByCategory = jobsByCat?.reduce((acc: any[], job) => {
        if (!job.category) return acc;
        const existing = acc.find((item) => item.category === job.category);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ category: job.category, count: 1 });
        }
        return acc;
      }, []) || [];

      // Sample monthly trends (simplified)
      const monthlyTrends = [
        { month: 'Jan', jobs: 45, applications: 120 },
        { month: 'Feb', jobs: 52, applications: 145 },
        { month: 'Mar', jobs: 68, applications: 180 },
        { month: 'Apr', jobs: 75, applications: 210 },
        { month: 'May', jobs: 82, applications: 245 },
        { month: 'Jun', jobs: 90, applications: 280 },
      ];

      setStats({
        usersByRole,
        jobsByStatus,
        applicationsByStatus,
        jobsByCategory,
        monthlyTrends,
      });
    } catch (error) {
      console.error('Error fetching report data:', error);
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

  const StatBar: React.FC<{ label: string; count: number; total: number; color: string }> = ({
    label,
    count,
    total,
    color,
  }) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;

    return (
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{count}</span>
        </div>
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8 }}
            className={`h-full rounded-full ${color}`}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Reports & Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400">Platform statistics and insights</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'Total Users',
            value: stats?.usersByRole.reduce((sum, item) => sum + item.count, 0) || 0,
            icon: Users,
            color: 'bg-blue-500',
          },
          {
            title: 'Total Jobs',
            value: stats?.jobsByStatus.reduce((sum, item) => sum + item.count, 0) || 0,
            icon: Briefcase,
            color: 'bg-green-500',
          },
          {
            title: 'Total Applications',
            value: stats?.applicationsByStatus.reduce((sum, item) => sum + item.count, 0) || 0,
            icon: FileText,
            color: 'bg-purple-500',
          },
          {
            title: 'Approval Rate',
            value: `${
              stats?.jobsByStatus.length
                ? Math.round(
                    ((stats?.jobsByStatus.find((j) => j.status === 'approved')?.count || 0) /
                      stats?.jobsByStatus.reduce((sum, item) => sum + item.count, 0)) *
                      100
                  ) || 0
                : 0
            }%`,
            icon: TrendingUp,
            color: 'bg-orange-500',
          },
        ].map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${item.color}`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {item.value}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Detailed Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users Distribution */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
              User Distribution
            </h3>
            {stats?.usersByRole.map((item) => (
              <StatBar
                key={item.role}
                label={item.role.charAt(0).toUpperCase() + item.role.slice(1).replace('_', ' ')}
                count={item.count}
                total={stats?.usersByRole.reduce((sum, i) => sum + i.count, 0) || 1}
                color={
                  item.role === 'admin'
                    ? 'bg-red-500'
                    : item.role === 'recruiter'
                    ? 'bg-blue-500'
                    : 'bg-green-500'
                }
              />
            ))}
          </CardContent>
        </Card>

        {/* Jobs by Status */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
              Jobs by Status
            </h3>
            {stats?.jobsByStatus.map((item) => (
              <StatBar
                key={item.status}
                label={item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                count={item.count}
                total={stats?.jobsByStatus.reduce((sum, i) => sum + i.count, 0) || 1}
                color={
                  item.status === 'approved'
                    ? 'bg-green-500'
                    : item.status === 'pending'
                    ? 'bg-yellow-500'
                    : item.status === 'rejected'
                    ? 'bg-red-500'
                    : 'bg-gray-500'
                }
              />
            ))}
          </CardContent>
        </Card>

        {/* Applications by Status */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
              Applications by Status
            </h3>
            {stats?.applicationsByStatus.map((item) => (
              <StatBar
                key={item.status}
                label={item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                count={item.count}
                total={stats?.applicationsByStatus.reduce((sum, i) => sum + i.count, 0) || 1}
                color={
                  item.status === 'hired'
                    ? 'bg-green-500'
                    : item.status === 'shortlisted'
                    ? 'bg-blue-500'
                    : item.status === 'rejected'
                    ? 'bg-red-500'
                    : 'bg-yellow-500'
                }
              />
            ))}
          </CardContent>
        </Card>

        {/* Jobs by Category */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
              Jobs by Category
            </h3>
            {stats?.jobsByCategory.slice(0, 5).map((item, index) => (
              <StatBar
                key={item.category}
                label={item.category}
                count={item.count}
                total={stats?.jobsByCategory.reduce((sum, i) => sum + i.count, 0) || 1}
                color={`bg-${['blue', 'green', 'purple', 'orange', 'pink'][index % 5]}-500`}
              />
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
            Monthly Trends
          </h3>
          <div className="overflow-x-auto">
            <div className="flex gap-4 min-w-[600px]">
              {stats?.monthlyTrends.map((item, index) => (
                <motion.div
                  key={item.month}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex-1 text-center"
                >
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    {item.month}
                  </div>
                  <div className="flex flex-col gap-2">
                    <div
                      className="bg-blue-500 rounded-t"
                      style={{ height: `${(item.jobs / 100) * 100}px` }}
                    />
                    <div
                      className="bg-green-500 rounded-b"
                      style={{ height: `${(item.applications / 300) * 100}px` }}
                    />
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    <div className="text-blue-500">{item.jobs} jobs</div>
                    <div className="text-green-500">{item.applications} apps</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center gap-6 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-blue-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Jobs Posted</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Applications</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
