
import React from 'react';

interface LoadingIndicatorProps {
  message: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="w-20 h-20 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-6 text-xl text-white tracking-wider animate-pulse">{message}</p>
    </div>
  );
};

export default LoadingIndicator;
