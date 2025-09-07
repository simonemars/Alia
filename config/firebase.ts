import Constants from 'expo-constants';

// Check if we're running in Expo Go (where Firebase native modules aren't available)
const isExpoGo = Constants.appOwnership === 'expo';

let app = null;
let db = null;

if (!isExpoGo) {
  // Only import Firebase when not in Expo Go
  try {
    const firebase = require('@react-native-firebase/app');
    require('@react-native-firebase/firestore');

    // Get Firebase config from environment variables
    const firebaseConfig = {
      apiKey: Constants.expoConfig?.extra?.firebaseApiKey,
      authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain,
      projectId: Constants.expoConfig?.extra?.firebaseProjectId,
      storageBucket: Constants.expoConfig?.extra?.firebaseStorageBucket,
      messagingSenderId: Constants.expoConfig?.extra?.firebaseMessagingSenderId,
      appId: Constants.expoConfig?.extra?.firebaseAppId,
    };

    // Initialize Firebase if it hasn't been initialized yet
    try {
      app = firebase.app();
    } catch (error) {
      app = firebase.initializeApp(firebaseConfig);
    }

    // Initialize Firestore
    db = firebase.firestore();

    // Connect to Firestore emulator in development
    if (__DEV__) {
      try {
        db.useEmulator('localhost', 8080);
        console.log('Connected to Firestore emulator');
      } catch (error) {
        console.warn('Failed to connect to Firestore emulator:', error);
      }
    }
  } catch (error) {
    console.warn('Firebase not available:', error.message);
  }
} else {
  console.log('Running in Expo Go - Firebase features disabled');
}

export { db };
export default app;