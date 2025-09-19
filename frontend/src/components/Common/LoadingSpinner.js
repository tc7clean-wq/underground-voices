import React from 'react';

const LoadingSpinner = ({
  size = 'medium',
  color = 'blue',
  message = 'Loading...',
  fullScreen = false,
  overlay = false
}) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12',
    xlarge: 'h-16 w-16'
  };

  const colorClasses = {
    blue: 'border-blue-500',
    gray: 'border-gray-500',
    white: 'border-white',
    green: 'border-green-500',
    red: 'border-red-500'
  };

  const spinnerClass = `${sizeClasses[size]} ${colorClasses[color]} border-2 border-t-transparent rounded-full animate-spin`;

  const content = (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className={spinnerClass}></div>
      {message && (
        <p className="text-sm text-secondary font-medium">
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="midnight-theme fixed inset-0 flex items-center justify-center z-50" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #334155 100%)' }}>
        {content}
      </div>
    );
  }

  if (overlay) {
    return (
      <div className="absolute inset-0 bg-white bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 flex items-center justify-center z-40">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-8">
      {content}
    </div>
  );
};

export default LoadingSpinner;