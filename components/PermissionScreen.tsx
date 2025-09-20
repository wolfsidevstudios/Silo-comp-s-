
import React from 'react';
import CompassIcon from './icons/CompassIcon';

interface PermissionScreenProps {
  onRequest: () => void;
}

const PermissionScreen: React.FC<PermissionScreenProps> = ({ onRequest }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <h1 className="text-4xl font-bold text-white tracking-widest">GEO-COMPASS</h1>
      <p className="mt-4 max-w-md text-cyan-400">
        To discover the world around you, we need access to your device's orientation and location.
      </p>
      <button
        onClick={onRequest}
        className="mt-8 flex items-center justify-center gap-3 bg-cyan-500 hover:bg-cyan-400 text-gray-900 font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-[0_0_15px_rgba(0,255,255,0.5)]"
      >
        <CompassIcon />
        Activate Compass
      </button>
      <p className="mt-8 text-xs text-gray-500">
        Your data is used only for this session and is not stored.
      </p>
    </div>
  );
};

export default PermissionScreen;
