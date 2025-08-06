import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  initializeFirestore
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD6BsDCjS5wYEcBk0JpA3IdsWqyC2NnGlE",
  authDomain: "to-do-f2136.firebaseapp.com",
  projectId: "to-do-f2136",
  storageBucket: "to-do-f2136.appspot.com",
  messagingSenderId: "58181323393",
  appId: "1:58181323393:web:4194e97dd20244b5881b80",
  measurementId: "G-RJ2B9FDT9L"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firestore with React Native specific options for stability
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false,
  cacheSizeBytes: 1048576, // Optional cache size
});

// Initialize Firebase Auth with AsyncStorage persistence for React Native/Expo
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { db, auth };
