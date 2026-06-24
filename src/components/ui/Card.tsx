import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  onClick,
}) => {
  const Component = hover ? motion.div : 'div';
  const hoverProps = hover
    ? {
        whileHover: { y: -4, scale: 1.02 },
        transition: { duration: 0.2 },
      }
    : {};

  return (
    <Component
      className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      onClick={onClick}
      {...hoverProps}
    >
      {children}
    </Component>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`px-6 py-4 border-b border-gray-200 dark:border-gray-700 ${className}`}>
    {children}
  </div>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`px-6 py-4 border-t border-gray-200 dark:border-gray-700 ${className}`}>
    {children}
  </div>
);
