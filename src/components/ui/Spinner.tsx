import React from 'react';
import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <Loader2 className={`animate-spin text-purple-400 ${sizes[size]} ${className}`} />
  );
};

export const LoadingScreen: React.FC = () => (
  <div className="min-h-screen bg-dark-900 flex items-center justify-center">
    <div className="text-center">
      <Spinner size="lg" />
      <p className="mt-4 text-slate-400">Loading...</p>
    </div>
  </div>
);

export const LoadingOverlay: React.FC = () => (
  <div className="absolute inset-0 bg-dark-900/50 flex items-center justify-center z-10">
    <Spinner size="md" />
  </div>
);

export default Spinner;