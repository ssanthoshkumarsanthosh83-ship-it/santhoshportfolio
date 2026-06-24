import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, MapPin, Calendar, Briefcase } from 'lucide-react';
import { Card, CardContent, Badge, Button } from '../../components/ui';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import type { Application } from '../../types';

interface ExtendedApplication extends Application {
  jobs: {
    id: string;
    title: string;
    location: string;
    job_type: string;
    recruiters: {
      company_name: string;
      company_logo?: string;
    };
  };
}

export const MyApplications: React.FC = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<ExtendedApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user, statusFilter]);

  const fetchApplications = async () => {
    try {
      let query = supabase
        .from('applications')
        .select(`
          *,
          jobs (
            id, title, location, job_type,
            recruiters (
              company_name, company_logo
            )
          )
        `)
        .eq('user_id', user?.id)
        .order('applied_at', { ascending: false });

      if (statusFilter !== 'all') {
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

  const handleWithdraw = async (applicationId: string) => {
    if (!confirm('Are you sure you want to withdraw this application?')) return;

    try {
      await supabase
        .from('applications')
        .update({ status: 'withdrawn', updated_at: new Date().toISOString() })
        .eq('id', applicationId);

      fetchApplications();
    } catch (error) {
      console.error('Error withdrawing application:', error);
    }
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
      case 'withdrawn':
        return <Badge>Withdrawn</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const filterOptions = [
    { value: 'all', label: 'All Applications' },
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My Applications</h1>
          <p className="text-gray-600 dark:text-gray-400">Track and manage your job applications</p>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {filterOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : applications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
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
                    {/* Company Logo */}
                    <div className="w-14 h-14 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                      {app.jobs?.recruiters?.company_logo ? (
                        <img
                          src={app.jobs.recruiters.company_logo}
                          alt={app.jobs.recruiters.company_name}
                          className="w-full h-full rounded-xl object-cover"
                        />
                      ) : (
                        <Briefcase className="w-7 h-7 text-gray-400" />
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                            {app.jobs?.title}
                          </h3>
                          <p className="text-sm text-gray-500">{app.jobs?.recruiters?.company_name}</p>
                        </div>
                        {getStatusBadge(app.status)}
                      </div>

                      <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {app.jobs?.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Applied {new Date(app.applied_at).toLocaleDateString()}
                        </span>
                        <Badge variant="primary" size="sm">
                          {app.jobs?.job_type}
                        </Badge>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {(app.status === 'pending' || app.status === 'reviewing') && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleWithdraw(app.id)}
                        >
                          Withdraw
                        </Button>
                      )}
                      <Button variant="primary" size="sm">
                        View Details
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
