'use client';

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useGoogleSheetsAuth } from '@/app/context/google-sheets-auth';
import { clearAppStoreCache, useAppStore } from '@/app/store/root-store';

type User = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
  getUserInitials: () => string;
};

const Ctx = createContext<AuthContextType | undefined>(undefined);

export function GISAuthProvider({ children }: { children: React.ReactNode }) {
  const gs = useGoogleSheetsAuth();
  const [error, setError] = useState<string | null>(null);
  const setPosthogConfigured = useAppStore((s) => s.setPosthogConfigured);

  const user: User | null = useMemo(() => {
    if (!gs.idToken) return null;
    try {
      const payload = JSON.parse(atob(gs.idToken.split('.')[1]));
      return {
        uid: payload.sub,
        email: payload.email || null,
        displayName: payload.name || null,
        photoURL: payload.picture || null,
      };
    } catch {
      return null;
    }
  }, [gs.idToken]);

  const getUserInitials = useCallback(() => {
    if (!user) return '?';
    if (user.displayName) {
      const parts = user.displayName.split(' ');
      if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
      return user.displayName[0].toUpperCase();
    }
    if (user.email) return user.email[0].toUpperCase();
    return '?';
  }, [user]);

  const signInWithGoogle = useCallback(async () => {
    setError(null);
    try {
      await gs.signIn();
      setPosthogConfigured(true);
    } catch (e: any) {
      setError(e?.message || 'Sign-in failed');
    }
  }, [gs, setPosthogConfigured]);

  const doLogout = useCallback(async () => {
    try {
      await gs.signOut();
    } finally {
      clearAppStoreCache();
      setPosthogConfigured(false);
    }
  }, [gs, setPosthogConfigured]);

  const value: AuthContextType = {
    user,
    loading: gs.loading || !gs.initialized,
    error,
    signInWithGoogle,
    signOut: doLogout,
    logout: doLogout,
    getUserInitials,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthContextType {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used within GISAuthProvider');
  return ctx;
}
