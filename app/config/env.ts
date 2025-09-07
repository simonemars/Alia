import Constants from 'expo-constants';

// Get the environment variables from Expo's manifest
const getEnvVars = () => {
  const manifest = Constants.manifest?.extra || {};
  return {
    googleMapsApiKey: manifest.GOOGLE_MAPS_API_KEY,
    supabaseUrl: manifest.SUPABASE_URL,
    supabaseAnonKey: manifest.SUPABASE_ANON_KEY,
    apiBaseUrl: manifest.API_BASE_URL || 'http://localhost:3000/api',
    enableAnalytics: manifest.ENABLE_ANALYTICS === 'true',
    enableCrashReporting: manifest.ENABLE_CRASH_REPORTING === 'true',
  };
};

const env = getEnvVars();
export default env;

// Type definitions for environment variables
export type EnvVars = ReturnType<typeof getEnvVars>;

// Validation function
export const validateEnv = () => {
  const vars = getEnvVars();
  if (!vars.googleMapsApiKey) {
    throw new Error('GOOGLE_MAPS_API_KEY is required');
  }
  if (!vars.supabaseUrl) {
    throw new Error('SUPABASE_URL is required');
  }
  if (!vars.supabaseAnonKey) {
    throw new Error('SUPABASE_ANON_KEY is required');
  }
}; 