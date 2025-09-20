export enum AppState {
  REQUESTING_PERMISSION,
  LOADING_LOCATION,
  READY,
  ERROR,
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface DirectionCountries {
  north: string;
  south: string;
  east: string;
  west: string;
}