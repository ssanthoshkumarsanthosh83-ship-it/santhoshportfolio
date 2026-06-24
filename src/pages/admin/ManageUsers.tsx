import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Edit2, Trash2, User } from 'lucide-react';
import { Card, CardContent, Button, Badge, Input, Select, Modal } from '../../components/ui';
import { supabase } from '../../lib/supabase';
import type { Profile } from '../../types';

export const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    role: 'job_seeker' as Profile['role'],
    phone: '',
  });

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, searchQuery]);

  const fetchUsers = async () => {
    try {
      let query = supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (roleFilter !== 'all') {
        query = query.eq('role', roleFilter);
      }

      if (searchQuery) {
        query = query.or(`full_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: Profile) => {
    setSelectedUser(user);
    setFormData({
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      phone: user.phone || '',
    });
    setEditModalOpen(true);
  };

  const handleDelete = (user: Profile) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedUser) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', selectedUser.id);

      if (error) throw error;

      setEditModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;

    try {
      // Delete from auth.users (cascades to profiles)
      const { error } = await supabase.auth.admin.deleteUser(selectedUser.id);

      if (error) {
        // Fallback: just delete from profiles
        await supabase.from('profiles').delete().eq('id', selectedUser.id);
      }

      setDeleteModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const roleOptions = [
    { value: 'all', label: 'All Roles' },
    { value: 'admin', label: 'Admin' },
    { value: 'recruiter', label: 'Recruiter' },
    { value: 'job_seeker', label: 'Job Seeker' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Manage Users</h1>
          <p className="text-gray-600 dark:text-gray-400">View and manage all platform users</p>
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
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              options={roleOptions}
              className="w-full sm:w-48"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex justify-center">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          {user.avatar_url ? (
                            <img
                              src={user.avatar_url}
                              alt={user.full_name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <User className="w-5 h-5 text-gray-500" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {user.full_name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
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
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {user.phone || '-'}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(user)}
                          icon={<Edit2 className="w-4 h-4" />}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(user)}
                          icon={<Trash2 className="w-4 h-4" />}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Edit Modal */}
      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit User">
        <div className="space-y-4">
          <Input
            label="Full Name"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <Input
            label="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          <Select
            label="Role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value as Profile['role'] })}
            options={[
              { value: 'admin', label: 'Admin' },
              { value: 'recruiter', label: 'Recruiter' },
              { value: 'job_seeker', label: 'Job Seeker' },
            ]}
          />
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => setEditModalOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} className="flex-1">
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete User"
        size="sm"
      >
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Are you sure you want to delete <strong>{selectedUser?.full_name}</strong>? This
            action cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete} className="flex-1">
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
