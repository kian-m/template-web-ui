// app/context/auth-context.tsx
'use client';

import { createContext, ReactNode, useContext, useEffect, useState, useCallback } from 'react';
import { usePostHog } from 'posthog-js/react';
import { useRouter } from 'next/navigation';
import {
  GoogleAuthProvider,
  getAdditionalUserInfo,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User,
} from 'firebase/auth';
import { auth } from '@/app/lib/firebase';
import { apiClient } from '@/app/services/api-client';
import { login, type LoginResponseDto } from '@/client';
import { fetchDashboards } from '@/app/services/dashboard-api';
import { useAppStore, clearAppStoreCache } from '@/app/store/root-store';
import { clearTokenCache } from '@/app/services/token-cache';

type AuthContextType = {
  user: User | null;
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

// For frontend-only storage
const setAuthToken = (token: string) => {
  // Store in sessionStorage (cleared when browser is closed)
  // You could use localStorage instead for persistence
  sessionStorage.setItem('auth-token', token);

  // Optionally set a cookie that's accessible to JavaScript
  document.cookie = `auth-token=${token}; path=/; max-age=${60 * 60}; SameSite=Strict`;
};

const removeAuthToken = () => {
  sessionStorage.removeItem('auth-token');
  document.cookie = 'auth-token=; path=/; max-age=0';
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const setPosthogConfigured = useAppStore((state) => state.setPosthogConfigured);
  const posthog = usePostHog();

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        setUser(user);
        if (user) {
          // Get and store the auth token when user is authenticated (without forcing refresh)
          const token = await user.getIdToken();
          setAuthToken(token);
          
          posthog?.identify(user.uid, {
            email: user.email ?? undefined,
            name: user.displayName ?? undefined,
          });
          posthog?.capture('user_login');
        } else {
          // Clear token when user is logged out
          removeAuthToken();
          clearTokenCache();
        }
        setLoading(false);
      },
      (error) => {
        setError(error.message);
        setLoading(false);
      },
    );

    // Cleanup subscription
    return () => unsubscribe();
  }, [posthog]);

  // Generate user initials from display name or email (memoized to prevent re-renders)
  const getUserInitials = useCallback((): string => {
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
  }, [user]);

  // Google sign-in handler
  const signInWithGoogle = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const token = await result.user.getIdToken();
      setAuthToken(token);
      posthog?.identify(result.user.uid, {
        email: result.user.email ?? undefined,
        name: result.user.displayName ?? undefined,
      });
      const additionalInfo = getAdditionalUserInfo(result);
      if (additionalInfo?.isNewUser) {
        posthog?.capture('user_signup');
      }
      posthog?.capture('user_login');
      
      let loginResponse;
      try {
        loginResponse = await login({
          client: apiClient,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          throwOnError: true,
        });
      } catch (loginError: any) {
        // Backend login failed - clean up and show error
        posthog?.capture('login_backend_error', {
          error_status: loginError?.status || loginError?.response?.status || 'unknown',
          error_message: loginError?.message || loginError?.error || 'Login failed',
          error_details: JSON.stringify(loginError)
        });
        
        await signOut(auth);
        removeAuthToken();
        clearTokenCache();
        
        // DO NOT navigate anywhere - stay on login page
        throw new Error('Authentication failed. Please try again.');
      }
      
      // Only continue if login was successful
      if (!loginResponse || !loginResponse.data) {
        await signOut(auth);
        removeAuthToken();
        clearTokenCache();
        throw new Error('Login failed - no response data');
      }
      
      // Login successful, set up user data
      const data = loginResponse.data;
      setPosthogConfigured(data.isPosthogValid);
      useAppStore.getState().setRemainingCredits(data.remainingCredits);
      
      // Now fetch dashboards
      let dashboards;
      try {
        dashboards = await fetchDashboards();
      } catch (dashboardError: any) {
        posthog?.capture('dashboard_fetch_failed_after_login', {
          error_message: dashboardError?.message || 'Failed to fetch dashboards'
        });
        await signOut(auth);
        removeAuthToken();
        clearTokenCache();
        throw new Error('Failed to load dashboards. Please try again.');
      }
      
      // Navigate to first dashboard if available
      if (dashboards && dashboards.length > 0) {
        const { syncDashboards } = useAppStore.getState();
        syncDashboards(dashboards);
        router.push(`/dashboard/${dashboards[0].id}`);
      } else {
        // No dashboards - this is an error state
        await signOut(auth);
        removeAuthToken();
        clearTokenCache();
        throw new Error('No dashboards available. Please contact support.');
      }
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      // Clear token cache first to prevent any lingering tokens
      clearTokenCache();
      
      // Sign out from Firebase Auth
      await signOut(auth);
      
      // Clear all local token storage
      removeAuthToken();
      
      // Clear application store cache
      clearAppStoreCache();
      
      // Clear any cached credentials in localStorage/sessionStorage
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
      }
      
      // Track logout event
      posthog?.capture('user_logout');
      
      // Reset PostHog user identification
      posthog?.reset();
      
      // Redirect to login page
      router.push('/login');
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    signInWithGoogle,
    signOut: logout,  // Alias for logout
    logout,
    getUserInitials,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
