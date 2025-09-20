import React, { useState, useEffect, useCallback } from 'react';
import { AppState, Coordinates, DirectionCountries } from './types';
import PermissionScreen from './components/PermissionScreen';
import LoadingIndicator from './components/LoadingIndicator';
import CompassDisplay from './components/CompassDisplay';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.REQUESTING_PERMISSION);
  const [heading, setHeading] = useState<number | null>(null);
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [countries, setCountries] = useState<DirectionCountries>({
    north: 'USA',
    south: 'Mexico',
    east: 'Atlantic',
    west: 'Pacific',
  });
  const [error, setError] = useState<string | null>(null);

  const handleOrientation = (event: DeviceOrientationEvent) => {
    // FIX: Cast event to `any` to access the non-standard `webkitCompassHeading` property for iOS Safari.
    const currentHeading = (event as any).webkitCompassHeading ?? event.alpha;
    if (currentHeading !== null) {
      setHeading(currentHeading);
    }
  };

  const handlePermissionRequest = useCallback(async () => {
    // For iOS 13+
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission !== 'granted') {
          setError('Device orientation permission was denied. The compass cannot function.');
          setAppState(AppState.ERROR);
          return;
        }
      } catch (err) {
        setError('Error requesting device orientation permission.');
        setAppState(AppState.ERROR);
        return;
      }
    }

    window.addEventListener('deviceorientation', handleOrientation);
    
    setAppState(AppState.LOADING_LOCATION);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setAppState(AppState.READY);
      },
      (geoError) => {
        setError(`Geolocation error: ${geoError.message}. Please enable location services.`);
        setAppState(AppState.ERROR);
      },
      { enableHighAccuracy: true }
    );
  }, []);

  useEffect(() => {
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  const handleCountryChange = (direction: 'east' | 'west', value: string) => {
    setCountries(prev => ({ ...prev, [direction]: value }));
  };

  const renderContent = () => {
    switch (appState) {
      case AppState.REQUESTING_PERMISSION:
        return <PermissionScreen onRequest={handlePermissionRequest} />;
      case AppState.LOADING_LOCATION:
        return <LoadingIndicator message="Acquiring satellite lock..." />;
      case AppState.READY:
        return <CompassDisplay heading={heading} countries={countries} onCountryChange={handleCountryChange} />;
      case AppState.ERROR:
        return (
          <div className="flex flex-col items-center justify-center h-full text-center text-red-400">
            <h2 className="text-2xl font-bold">Error</h2>
            <p className="mt-2 max-w-sm">{error}</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <main className="bg-gray-900 text-cyan-300 w-screen h-screen overflow-hidden select-none">
      {renderContent()}
    </main>
  );
};

export default App;