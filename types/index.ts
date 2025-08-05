export enum PlaceCategory {
  BAR = 'bar',
  CLUB = 'club',
  RESTAURANT = 'restaurant',
  CAFE = 'cafe',
  PARK = 'park',
  GYM = 'gym',
  OTHER = 'other'
}

export enum SportIcon {
  BASKETBALL = 'basketball',
  TENNIS = 'tennis',
  SOCCER = 'soccer',
  RUNNING = 'running',
  YOGA = 'yoga',
  CYCLING = 'cycling',
  SWIMMING = 'swimming',
  GOLF = 'golf',
  VOLLEYBALL = 'volleyball',
  BASEBALL = 'baseball'
}

export type Location = {
  latitude: number;
  longitude: number;
};

export type Rating = {
  average: number;
  count: number;
};

export type UserProfile = {
  id: string;
  name: string;
  age: number;
  bio: string;
  image?: string;
  hobbies: string[];
  sports: string[];
  location: Location;
  rating: Rating;
  lastActive: string;
  createdAt: string;
  updatedAt: string;
};

export type Place = {
  id: string;
  name: string;
  category: PlaceCategory;
  location: Location;
  userCount: number;
  rating: number;
  distance: number;
  image?: string;
  address: string;
  phone?: string;
  website?: string;
  openingHours?: string;
  createdAt: string;
  updatedAt: string;
};

export type Sport = {
  id: string;
  name: string;
  icon: SportIcon;
  interested: number;
  createdAt: string;
  updatedAt: string;
};

export type CheckIn = {
  id: string;
  userId: string;
  otherUserId: string;
  date: string;
  location: Location;
  rating?: number;
  isConfirmed: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AppSettings = {
  searchRadius: number;
  showNotifications: boolean;
  allowLocationSharing: boolean;
  darkMode: boolean;
  language: string;
  measurementUnit: 'metric' | 'imperial';
};

export type ApiError = {
  message: string;
  code: string;
  status?: number;
};

export type ApiResponse<T> = {
  data?: T;
  error?: ApiError;
};