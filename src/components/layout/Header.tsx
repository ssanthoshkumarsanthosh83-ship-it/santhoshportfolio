import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Search, Menu, Sun, Moon, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  sidebarCollapsed: boolean;
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ sidebarCollapsed, onMenuClick }) => {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (darkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  const getPageTitle = () => {
    const path = window.location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    return path.split('/').pop()?.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) || 'Dashboard';
  };

  return (
    <header
      className={`fixed top-0 right-0 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 lg:px-6 z-30 transition-all duration-300`}
      style={{ left: sidebarCollapsed ? 80 : 256 }}
    >
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>

        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {getPageTitle()}
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-9 pr-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
        </div>

        {/* Dark Mode Toggle */}
        <motion.button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-yellow-500" />
          ) : (
            <Moon className="w-5 h-5 text-gray-600" />
          )}
        </motion.button>

        {/* Notifications */}
        <motion.button
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </motion.button>

        {/* User Menu */}
        <div className="relative">
          <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.full_name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-4 h-4 text-white" />
              )}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {user?.full_name}
              </p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
