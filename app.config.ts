import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Alia',
  slug: 'alia',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    backgroundColor: '#030259'
  },
  assetBundlePatterns: [
    '**/*'
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.yourcompany.alia'
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/icon.png',
      backgroundColor: '#ffffff'
    },
    package: 'com.yourcompany.alia'
  },
  web: {
    favicon: './assets/images/favicon.png'
  },
  plugins: [
    "expo-font",
    "expo-router",
    "expo-secure-store",
    [
      "expo-build-properties",
      {
        "ios": {
          "useFrameworks": "static"
        }
      }
    ]
  ],
  scheme: 'alia',
  extra: {
    // Add your Firebase config here
    firebaseApiKey: process.env.FIREBASE_API_KEY,
    firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
    firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
    firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    firebaseAppId: process.env.FIREBASE_APP_ID,
    // Add email link authentication settings
    firebaseActionCodeSettings: {
      url: 'https://alia-65f2e.firebaseapp.com/finishSignIn',
      handleCodeInApp: true,
      iOS: {
        bundleId: 'com.yourcompany.alia'
      },
      dynamicLinkDomain: process.env.FIREBASE_DYNAMIC_LINKS_DOMAIN
    }
  },
}); 