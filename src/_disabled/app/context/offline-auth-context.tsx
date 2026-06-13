// app/context/offline-auth-context.tsx
'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/app/services/api-client';
import { fetchDashboards } from '@/app/services/dashboard-api';
import { useAppStore, clearAppStoreCache } from '@/app/store/root-store';

// Mock user type that mimics Firebase User
type MockUser = {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  emailVerified: boolean;
  getIdToken: () => Promise<string>;
};

type AuthContextType = {
  user: MockUser | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
  getUserInitials: () => string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

// Default mock user for offline development
const MOCK_USER: MockUser = {
  uid: 'mock-user-123',
  email: 'test@debark.ai',
  displayName: 'Test Developer',
  photoURL: undefined,
  emailVerified: true,
  getIdToken: async () => 'mock-test-token',
};

// For frontend-only storage
const setAuthToken = (token: string) => {
  sessionStorage.setItem('auth-token', token);
  document.cookie = `auth-token=${token}; path=/; max-age=${60 * 60}; SameSite=Strict`;
};

const removeAuthToken = () => {
  sessionStorage.removeItem('auth-token');
  document.cookie = 'auth-token=; path=/; max-age=0';
};

export const OfflineAuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const setPosthogConfigured = useAppStore((state) => state.setPosthogConfigured);

  // Auto-login in offline mode
  useEffect(() => {
    const autoLogin = async () => {
      try {
        // Set mock user immediately
        setUser(MOCK_USER);
        
        // Set auth token for API calls
        const token = await MOCK_USER.getIdToken();
        setAuthToken(token);
        // apiClient doesn't have defaults.headers, set token in storage for API calls
        
        // Simulate login API call
        const loginResponse = {
          user: {
            id: MOCK_USER.uid,
            email: MOCK_USER.email,
            name: MOCK_USER.displayName,
            credits: 50,
          },
          posthog_configured: true,
        };
        
        // Set PostHog configured status
        setPosthogConfigured(loginResponse.posthog_configured);
        
        // Prefetch dashboards
        try {
          await fetchDashboards();
        } catch (dashboardError) {
          console.warn('Failed to fetch dashboards:', dashboardError);
        }
        
        setLoading(false);
        
        // Redirect to dashboard if on login page
        if (window.location.pathname === '/login' || window.location.pathname === '/signup') {
          router.push('/dashboard');
        }
      } catch (err) {
        console.error('Auto-login failed:', err);
        setError('Failed to auto-login in offline mode');
        setLoading(false);
      }
    };

    // Auto-login after a short delay to simulate loading
    setTimeout(autoLogin, 500);
  }, [router, setPosthogConfigured]);

  // Generate user initials from display name or email
  const getUserInitials = (): string => {
    if (!user) return '?';

    if (user.displayName) {
      const names = user.displayName.split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
      }
      return user.displayName[0].toUpperCase();
    } else if (user.email) {
      return user.email[0].toUpperCase();
    }

    return '?';
  };

  // Sign in function (instant in offline mode)
  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate sign-in delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setUser(MOCK_USER);
      const token = await MOCK_USER.getIdToken();
      setAuthToken(token);
      // apiClient doesn't have defaults.headers, set token in storage for API calls
      
      // Set PostHog configured
      setPosthogConfigured(true);
      
      // Fetch dashboards
      await fetchDashboards();
      
      // Navigate to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError('Failed to sign in');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      removeAuthToken();
      // apiClient doesn't have defaults.headers, clear storage instead
      clearAppStoreCache();
      setUser(null);
      router.push('/');  // Go to homepage instead of login
    } catch (err) {
      setError('Failed to logout');
      console.error(err);
      throw err;  // Re-throw to let caller handle it
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    signInWithGoogle,
    signOut: logout,  // Alias for compatibility
    logout,
    getUserInitials,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export AuthProvider as an alias for compatibility
export const AuthProvider = OfflineAuthProvider;