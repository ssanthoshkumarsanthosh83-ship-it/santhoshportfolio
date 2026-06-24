import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  User,
  Building2,
  BarChart3,
  ClipboardList,
  BookmarkIcon,
  Bell,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import type { UserRole } from '../../types';

interface NavItem {
  path: string;
  label: string;
  icon: React.ElementType;
  roles?: UserRole[];
}

const navItems: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/users', label: 'Manage Users', icon: Users, roles: ['admin'] },
  { path: '/jobs', label: 'Manage Jobs', icon: Briefcase, roles: ['admin'] },
  { path: '/reports', label: 'Reports', icon: BarChart3, roles: ['admin'] },
  { path: '/jobs', label: 'Browse Jobs', icon: Briefcase, roles: ['job_seeker'] },
  { path: '/applications', label: 'My Applications', icon: FileText, roles: ['job_seeker'] },
  { path: '/saved-jobs', label: 'Saved Jobs', icon: BookmarkIcon, roles: ['job_seeker'] },
  { path: '/my-jobs', label: 'My Job Posts', icon: Briefcase, roles: ['recruiter'] },
  { path: '/applicants', label: 'Applicants', icon: ClipboardList, roles: ['recruiter'] },
  { path: '/company-profile', label: 'Company Profile', icon: Building2, roles: ['recruiter'] },
  { path: '/notifications', label: 'Notifications', icon: Bell, roles: ['job_seeker', 'recruiter'] },
  { path: '/profile', label: 'Profile', icon: User, roles: ['job_seeker', 'recruiter'] },
  { path: '/settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const filteredNavItems = navItems.filter(
    (item) => !item.roles || item.roles.includes(user?.role as UserRole)
  );

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'recruiter':
        return 'Recruiter';
      case 'job_seeker':
        return 'Job Seeker';
    }
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 256 }}
      className="fixed left-0 top-0 h-screen bg-gray-900 text-white flex flex-col z-40"
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg">JobPortal</span>
          </motion.div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <ChevronLeft
            className={`w-5 h-5 transition-transform ${collapsed ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.full_name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-5 h-5" />
            )}
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="overflow-hidden"
            >
              <p className="font-medium truncate">{user?.full_name}</p>
              <p className="text-sm text-gray-400 truncate">
                {user?.role && getRoleLabel(user.role as UserRole)}
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-3">
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Sign Out */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-all"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </motion.aside>
  );
};
