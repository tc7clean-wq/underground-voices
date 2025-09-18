import React from 'react';
import { useToast } from '../../contexts/ToastContext';

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  const getToastStyles = (type) => {
    const baseStyles = 'relative overflow-hidden rounded-lg p-4 shadow-lg transform transition-all duration-300 ease-in-out animate-slide-in-right';

    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-500 text-white border-l-4 border-green-600`;
      case 'error':
        return `${baseStyles} bg-red-500 text-white border-l-4 border-red-600`;
      case 'warning':
        return `${baseStyles} bg-yellow-500 text-white border-l-4 border-yellow-600`;
      case 'info':
        return `${baseStyles} bg-blue-500 text-white border-l-4 border-blue-600`;
      default:
        return `${baseStyles} bg-gray-500 text-white border-l-4 border-gray-600`;
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'info':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={getToastStyles(toast.type)}
          style={{ animationDelay: '0.1s' }}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-3">
              {getIcon(toast.type)}
            </div>
            <div className="flex-1 text-sm font-medium">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-3 flex-shrink-0 rounded-full p-1 hover:bg-white hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-colors duration-200"
              aria-label="Close notification"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress bar for auto-dismiss */}
          {toast.duration > 0 && (
            <div className="absolute bottom-0 left-0 h-1 bg-white bg-opacity-30 w-full">
              <div
                className="h-full bg-white bg-opacity-70 transition-all linear"
                style={{
                  animation: `shrink ${toast.duration}ms linear forwards`,
                  width: '100%'
                }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;