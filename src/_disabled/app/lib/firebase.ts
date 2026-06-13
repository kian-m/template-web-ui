import { getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyD-8muV6sZpGSSy5RGk2OQ6SV4x8fe9l2U',
  authDomain: 'auth.debark.ai',
  projectId: 'debark-459822.firebasestorage.app',
  storageBucket: '31993349672',
  messagingSenderId: '1:31993349672:web:e2785b20ef4ba3c87d571d',
  appId: 'G-K3TYB44LP7',
};

// Initialize Firebase only if it hasn't been initialized
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

export { auth };
