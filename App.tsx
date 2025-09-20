import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  const [isExiting, setIsExiting] = useState(false);
  const nextAppState = useRef<AppState | null>(null);

  const transitionToState = (newState: AppState) => {
    setIsExiting(true);
    nextAppState.current = newState;
  };

  useEffect(() => {
    if (isExiting) {
      const timer = setTimeout(() => {
        if (nextAppState.current !== null) {
          setAppState(nextAppState.current);
        }
        setIsExiting(false);
      }, 500); // Corresponds to the fade-out animation duration
      return () => clearTimeout(timer);
    }
  }, [isExiting]);

  const handleOrientation = (event: DeviceOrientationEvent) => {
    const currentHeading = (event as any).webkitCompassHeading ?? event.alpha;
    if (currentHeading !== null) {
      setHeading(currentHeading);
    }
  };

  const handlePermissionRequest = useCallback(async () => {
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission !== 'granted') {
          setError('Device orientation permission was denied. The compass cannot function.');
          transitionToState(AppState.ERROR);
          return;
        }
      } catch (err) {
        setError('Error requesting device orientation permission.');
        transitionToState(AppState.ERROR);
        return;
      }
    }

    window.addEventListener('deviceorientation', handleOrientation);
    
    transitionToState(AppState.LOADING_LOCATION);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        transitionToState(AppState.READY);
      },
      (geoError) => {
        setError(`Geolocation error: ${geoError.message}. Please enable location services.`);
        transitionToState(AppState.ERROR);
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
    <main className="text-cyan-300 w-screen h-screen overflow-hidden select-none flex items-center justify-center">
      <div className={`w-full h-full ${isExiting ? 'animate-fade-out' : 'animate-fade-in'}`}>
        {renderContent()}
      </div>
    </main>
  );
};

export default App;