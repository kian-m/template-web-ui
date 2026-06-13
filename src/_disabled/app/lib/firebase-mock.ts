// Mock Firebase Auth for offline mode
import { EventEmitter } from 'events';

export interface MockUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  getIdToken: () => Promise<string>;
  getIdTokenResult: () => Promise<any>;
  reload: () => Promise<void>;
  delete: () => Promise<void>;
  toJSON: () => object;
  metadata: any;
  providerData: any[];
  refreshToken: string;
  tenantId: string | null;
  isAnonymous: boolean;
  multiFactor: any;
  phoneNumber: string | null;
  providerId: string;
}

class MockAuth extends EventEmitter {
  private currentUser: MockUser | null = null;
  private authStateCallbacks: Array<(user: MockUser | null) => void> = [];

  constructor() {
    super();
    // Auto-login in mock mode after a brief delay
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        const hasLoggedOut = sessionStorage.getItem('offline-logged-out') === 'true';
        if (!hasLoggedOut) {
          this.signInMockUser();
        }
      }, 100);
    }
  }

  private createMockUser(): MockUser {
    return {
      uid: 'mock-user-123',
      email: 'test@debark.ai',
      displayName: 'Test Developer',
      photoURL: null,
      emailVerified: true,
      getIdToken: async () => 'mock-test-token',
      getIdTokenResult: async () => ({
        token: 'mock-test-token',
        expirationTime: new Date(Date.now() + 3600000).toISOString(),
        authTime: new Date().toISOString(),
        issuedAtTime: new Date().toISOString(),
        signInProvider: 'google.com',
        claims: {},
      }),
      reload: async () => {},
      delete: async () => {},
      toJSON: () => ({
        uid: 'mock-user-123',
        email: 'test@debark.ai',
        displayName: 'Test Developer',
      }),
      metadata: {
        creationTime: new Date().toISOString(),
        lastSignInTime: new Date().toISOString(),
      },
      providerData: [],
      refreshToken: 'mock-refresh-token',
      tenantId: null,
      isAnonymous: false,
      multiFactor: { enrolledFactors: [] },
      phoneNumber: null,
      providerId: 'firebase',
    };
  }

  signInMockUser() {
    this.currentUser = this.createMockUser();
    // Notify all listeners
    this.authStateCallbacks.forEach(callback => callback(this.currentUser));
  }

  signOutMockUser() {
    this.currentUser = null;
    sessionStorage.setItem('offline-logged-out', 'true');
    // Notify all listeners
    this.authStateCallbacks.forEach(callback => callback(null));
  }

  onAuthStateChanged(callback: (user: MockUser | null) => void) {
    this.authStateCallbacks.push(callback);
    // Immediately call with current state
    callback(this.currentUser);
    
    // Return unsubscribe function
    return () => {
      const index = this.authStateCallbacks.indexOf(callback);
      if (index > -1) {
        this.authStateCallbacks.splice(index, 1);
      }
    };
  }

  signInWithPopup() {
    sessionStorage.removeItem('offline-logged-out');
    this.signInMockUser();
    return Promise.resolve({
      user: this.currentUser!,
      credential: null,
      operationType: 'signIn',
      providerId: 'google.com',
    });
  }

  signOut() {
    this.signOutMockUser();
    return Promise.resolve();
  }

  get currentUserValue() {
    return this.currentUser;
  }
}

// Create mock auth instance
const mockAuth = new MockAuth();

// Mock Firebase functions
export const getAuth = () => mockAuth;

export const onAuthStateChanged = (auth: any, callback: (user: MockUser | null) => void, errorCallback?: (error: any) => void) => {
  return mockAuth.onAuthStateChanged(callback);
};

export const signInWithPopup = async (auth: any, provider: any) => {
  return mockAuth.signInWithPopup();
};

export const signOut = async (auth: any) => {
  return mockAuth.signOut();
};

export const GoogleAuthProvider = class {
  providerId = 'google.com';
  static PROVIDER_ID = 'google.com';
};

export const getAdditionalUserInfo = (result: any) => {
  return {
    isNewUser: false,
    providerId: 'google.com',
    profile: {},
  };
};

// Re-export the mock auth
export const auth = mockAuth;