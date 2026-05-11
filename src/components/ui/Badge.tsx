import React, { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = ''
}) => {
  const variants = {
    default: 'bg-dark-600 text-slate-300',
    primary: 'bg-purple-500/20 text-purple-300',
    success: 'bg-emerald-500/20 text-emerald-300',
    warning: 'bg-amber-500/20 text-amber-300',
    danger: 'bg-red-500/20 text-red-300',
    info: 'bg-cyan-500/20 text-cyan-300'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  };

  return (
    <span className={`inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;