// Configuración de Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Configuración de Firebase (debes obtener estos valores de tu consola de Firebase)
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "your-api-key",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "your-project.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "your-project.appspot.com",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.FIREBASE_APP_ID || "your-app-id",
  measurementId: process.env.FIREBASE_MEASUREMENT_ID || "G-XXXXXXXXXX"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
const db = getFirestore(app);

// Inicializar Auth
const auth = getAuth(app);

// Si estamos en desarrollo, conectar al emulador
if (process.env.NODE_ENV === 'development' && process.env.FIRESTORE_EMULATOR_HOST) {
  connectFirestoreEmulator(db, 'localhost', 8080);
}

export { db, auth };
export default app;
