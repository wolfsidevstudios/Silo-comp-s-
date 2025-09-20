import { Coordinates, DirectionCountries } from '../types';

/**
 * This service is deprecated. The Gemini API call has been removed.
 * Country data is now managed within the App component.
 */
export const getCountriesInDirections = async (
  _coords: Coordinates
): Promise<DirectionCountries> => {
  // This function is no longer called by the application.
  console.error("getCountriesInDirections is deprecated and should not be used.");
  return {
    north: '',
    south: '',
    east: '',
    west: '',
  };
};