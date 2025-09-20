import React from 'react';

interface LoadingIndicatorProps {
  message: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-2 border-cyan-500/20 rounded-full"></div>
        <div className="absolute inset-2 border-2 border-cyan-500/30 rounded-full animate-spin" style={{ animationDuration: '4s' }}></div>
        <div className="absolute inset-4 border-t-2 border-t-cyan-400 border-transparent rounded-full animate-spin" style={{ animationDuration: '1s' }}></div>
      </div>
      <p className="mt-8 text-xl text-white tracking-wider animate-pulse">{message}</p>
    </div>
  );
};

export default LoadingIndicator;