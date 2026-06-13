// app/context/unified-auth-context.tsx
'use client';

import { createContext, ReactNode, useContext, useEffect, useState, useCallback } from 'react';
import { usePostHog } from 'posthog-js/react';
import { useRouter } from 'next/navigation';
import {
  GoogleAuthProvider,
  getAdditionalUserInfo,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '@/app/lib/firebase';
import { apiClient } from '@/app/services/api-client';
import { login } from '@/client';
import { fetchDashboards } from '@/app/services/dashboard-api';
import { useAppStore, clearAppStoreCache } from '@/app/store/root-store';
import type { Dashboard } from '@/app/store/dashboard-store';

// Unified user type that works for both modes
type User = FirebaseUser | {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  emailVerified?: boolean;
  getIdToken: () => Promise<string>;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
  getUserInitials: () => string;
  isOfflineMode: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

// Mock user for offline mode
const MOCK_USER: User = {
  uid: 'mock-user-123',
  email: 'test@debark.ai',
  displayName: 'Test Developer',
  photoURL: undefined,
  emailVerified: true,
  getIdToken: async () => 'mock-test-token',
};

// Token management functions
const setAuthToken = (token: string) => {
  sessionStorage.setItem('auth-token', token);
  document.cookie = `auth-token=${token}; path=/; max-age=${60 * 60}; SameSite=Strict`;
};

const removeAuthToken = () => {
  sessionStorage.removeItem('auth-token');
  document.cookie = 'auth-token=; path=/; max-age=0';
};

export const UnifiedAuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const setPosthogConfigured = useAppStore((state) => state.setPosthogConfigured);
  const posthog = usePostHog();
  
  // Check if we're in offline mode
  const isOfflineMode = process.env.NEXT_PUBLIC_OFFLINE_MODE === 'true';

  // Generate user initials from display name or email
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

  // Initialize auth based on mode
  useEffect(() => {
    if (isOfflineMode) {
      // Offline mode: Auto-login with mock user
      const initOfflineAuth = async () => {
        try {
          setUser(MOCK_USER);
          const token = await MOCK_USER.getIdToken();
          setAuthToken(token);
          
          // Set PostHog configured
          setPosthogConfigured(true);
          useAppStore.getState().setRemainingCredits(50);
          
          // Prefetch dashboards
          let dashboardData: Dashboard[] = [];
          try {
            dashboardData = await fetchDashboards();
            useAppStore.getState().syncDashboards(dashboardData);
          } catch (dashboardError) {
            // Silent failure - dashboards will be fetched later
          }
          
          // Create a default dashboard for new users in offline mode
          if (dashboardData.length === 0) {
            try {
              const dashboardApi = (await import('@/app/services/dashboard-api')).dashboardApi;
              const res = await dashboardApi.createDashboard('My Dashboard');
              if (res.data?.dashboardId) {
                dashboardData = [{
                  id: res.data.dashboardId,
                  name: 'My Dashboard',
                  position: 0,
                  widgets: []
                }];
                useAppStore.getState().syncDashboards(dashboardData);
              }
            } catch (err) {
              // Silent failure - user can create dashboard manually
            }
          }
          
          // Redirect to specific dashboard if on login page
          if (window.location.pathname === '/login' || window.location.pathname === '/signup') {
            if (dashboardData && dashboardData.length > 0) {
              router.push(`/dashboard/${dashboardData[0].id}`);
            } else {
              router.push('/dashboard');
            }
          }
          
          setLoading(false);
        } catch (err) {
          posthog?.capture('offline_auth_failed', {
            error_message: err instanceof Error ? err.message : 'Unknown error'
          });
          setError('Failed to initialize offline mode');
          setLoading(false);
        }
      };

      // Small delay to simulate loading
      setTimeout(initOfflineAuth, 300);
    } else {
      // Online mode: Listen for Firebase auth state changes
      const unsubscribe = onAuthStateChanged(
        auth,
        async (firebaseUser) => {
          setUser(firebaseUser);
          if (firebaseUser) {
            // Get and store the auth token when user is authenticated
            const token = await firebaseUser.getIdToken();
            setAuthToken(token);
            
            posthog?.identify(firebaseUser.uid, {
              email: firebaseUser.email ?? undefined,
              name: firebaseUser.displayName ?? undefined,
            });
            posthog?.capture('user_login');
          } else {
            // Clear token when user is logged out
            removeAuthToken();
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
    }
  }, [isOfflineMode, router, setPosthogConfigured, posthog]);

  // Google sign-in handler
  const signInWithGoogle = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    if (isOfflineMode) {
      // Offline mode: Instant mock sign-in
      try {
        await new Promise(resolve => setTimeout(resolve, 300)); // Simulate delay
        
        setUser(MOCK_USER);
        const token = await MOCK_USER.getIdToken();
        setAuthToken(token);
        
        setPosthogConfigured(true);
        useAppStore.getState().setRemainingCredits(50);
        
        const data = await fetchDashboards();
        useAppStore.getState().syncDashboards(data);
        
        // Redirect to specific dashboard
        if (data && data.length > 0) {
          router.push(`/dashboard/${data[0].id}`);
        } else {
          router.push('/dashboard');
        }
      } catch (err) {
        setError('Failed to sign in');
        posthog?.capture('google_signin_failed', {
          error_message: err instanceof Error ? err.message : 'Unknown error'
        });
      } finally {
        setLoading(false);
      }
    } else {
      // Online mode: Firebase sign-in
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
        
        const response = await login({
          client: apiClient,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (response && response.data) {
          const data = response.data;
          setPosthogConfigured(data.isPosthogValid);
          useAppStore.getState().setRemainingCredits(data.remainingCredits);
        }

        const { dashboards, syncDashboards } = useAppStore.getState();
        let dashboardData = dashboards;
        if (dashboards.length === 0) {
          dashboardData = await fetchDashboards();
          syncDashboards(dashboardData);
        }
        
        // Create a default dashboard for new users
        if (dashboardData.length === 0) {
          try {
            const dashboardApi = (await import('@/app/services/dashboard-api')).dashboardApi;
            const res = await dashboardApi.createDashboard('My Dashboard');
            if (res.data?.dashboardId) {
              dashboardData = [{
                id: res.data.dashboardId,
                name: 'My Dashboard',
                position: 0,
                widgets: []
              }];
              syncDashboards(dashboardData);
            }
          } catch (err) {
            console.error('Failed to create default dashboard:', err);
          }
        }
        
        // Redirect to specific dashboard
        if (dashboardData && dashboardData.length > 0) {
          router.push(`/dashboard/${dashboardData[0].id}`);
        } else {
          router.push('/dashboard');
        }
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    }
  };

  // Unified logout handler
  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      if (!isOfflineMode && auth.currentUser) {
        // Only try Firebase signout if we're online and have a Firebase user
        try {
          await firebaseSignOut(auth);
        } catch (firebaseError) {
          // Silent failure - continuing with local cleanup
        }
      }
      
      // Always clear local state and tokens
      removeAuthToken();
      clearAppStoreCache();
      setUser(null);
      
      // Track logout if possible
      try {
        posthog?.capture('user_logout');
      } catch (e) {
        // Ignore PostHog errors
      }
      
      // Navigate to homepage
      router.push('/');
    } catch (error) {
      posthog?.capture('logout_error', {
        error_message: error instanceof Error ? error.message : 'Unknown error'
      });
      // Even if there's an error, clear local state
      removeAuthToken();
      clearAppStoreCache();
      setUser(null);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    signInWithGoogle,
    signOut: logout,  // Both use the same function
    logout,
    getUserInitials,
    isOfflineMode,
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

// Export as AuthProvider for compatibility
export const AuthProvider = UnifiedAuthProvider;