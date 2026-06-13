'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type GoogleSheetsAuthContextType = {
  accessToken: string | null;
  idToken: string | null;
  userSub: string | null;
  email: string | null;
  isSignedIn: boolean;
  loading: boolean;
  initialized: boolean;
  error: string | null;
  signIn: () => void;
  signOut: () => void;
  ensureSheetsToken: () => Promise<void>;
};

const GoogleSheetsAuthContext = createContext<GoogleSheetsAuthContextType | undefined>(undefined);

declare global {
  interface Window {
    google?: any;
  }
}

const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

export function GoogleSheetsAuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [userSub, setUserSub] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  // Initialize from localStorage on mount and try silent refresh
  useEffect(() => {
    const init = () => {
      try {
        const stored = localStorage.getItem('gsheets-access-token') || sessionStorage.getItem('gsheets-access-token');
        if (stored) setAccessToken(stored);
        const storedId = localStorage.getItem('gsheets-id-token') || sessionStorage.getItem('gsheets-id-token');
        if (storedId) {
          setIdToken(storedId);
          try {
            const payload = JSON.parse(atob(storedId.split('.')[1]));
            setUserSub(payload.sub || null);
            setEmail(payload.email || null);
          } catch {}
        }
      } catch {}

      // Attempt silent reauth for ID + access tokens if missing and GIS is available
      const trySilent = () => {
        if (!clientId || !(window as any).google) return setLoading(false);

        try {
          if (!idToken) {
            (window as any).google.accounts.id.initialize({
              client_id: clientId,
              callback: (resp: any) => {
                if (resp?.credential) {
                  const tok = resp.credential as string;
                  setIdToken(tok);
                  try { localStorage.setItem('gsheets-id-token', tok); sessionStorage.setItem('gsheets-id-token', tok); } catch {}
                  try {
                    const payload = JSON.parse(atob(tok.split('.')[1]));
                    setUserSub(payload.sub || null);
                    setEmail(payload.email || null);
                  } catch {}
                }
              },
              auto_select: true,
            });
            (window as any).google.accounts.id.prompt();
          }

          if (!accessToken) {
            try {
              const tokenClient = (window as any).google.accounts.oauth2.initTokenClient({
                client_id: clientId,
                scope: SCOPES,
                callback: (resp: any) => {
                  if (resp?.access_token) {
                    const tok = resp.access_token as string;
                    setAccessToken(tok);
                    try { localStorage.setItem('gsheets-access-token', tok); sessionStorage.setItem('gsheets-access-token', tok); } catch {}
                  }
                },
              });
              // Silent if prior grant exists (no prompt)
              tokenClient.requestAccessToken({ prompt: '' });
            } catch {}
          }
        } finally {
          setLoading(false);
        }
      };

      // If GIS not loaded yet, retry soon
      if (!(window as any).google) {
        const t = setTimeout(() => { trySilent(); setInitialized(true); }, 300);
        return () => clearTimeout(t);
      }
      trySilent();
      setInitialized(true);
    };

    init();
  }, [clientId]);

  const signIn = useCallback((): Promise<void> => {
    if (!clientId) {
      setError('Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID');
      return Promise.resolve();
    }
    setError(null);
    return new Promise<void>((resolve) => {
      try {
        // 1) Get ID token via Sign in With Google (One Tap or button)
        window.google?.accounts?.id?.initialize?.({
          client_id: clientId,
          callback: (resp: any) => {
            if (!resp?.credential) return resolve();
            const token = resp.credential as string;
            setIdToken(token);
            try { localStorage.setItem('gsheets-id-token', token); sessionStorage.setItem('gsheets-id-token', token); } catch {}
            try {
              const payload = JSON.parse(atob(token.split('.')[1]));
              setUserSub(payload.sub || null);
              setEmail(payload.email || null);
            } catch {}
            resolve();
          },
        });
        window.google?.accounts?.id?.prompt?.();
      } catch (e: any) {
        setError(e?.message || 'Failed to initialize Google auth');
        resolve();
      }
    });
  }, [clientId]);

  const ensureSheetsToken = useCallback(async () => {
    if (accessToken) return;
    if (!clientId) {
      setError('Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID');
      return;
    }
    await new Promise<void>((resolve) => {
      try {
        const tokenClient = (window as any).google?.accounts?.oauth2?.initTokenClient({
          client_id: clientId,
          scope: SCOPES,
          callback: (resp: any) => {
            if (resp?.access_token) {
              const tok = resp.access_token as string;
              setAccessToken(tok);
              try { localStorage.setItem('gsheets-access-token', tok); sessionStorage.setItem('gsheets-access-token', tok); } catch {}
            } else if (resp?.error) {
              setError(resp.error);
            }
            resolve();
          },
        });
        tokenClient?.requestAccessToken();
      } catch (e: any) {
        setError(e?.message || 'Failed to request Sheets token');
        resolve();
      }
    });
  }, [accessToken, clientId]);

  const signOut = useCallback(() => {
    setAccessToken(null);
    setIdToken(null);
    setUserSub(null);
    setEmail(null);
    try { localStorage.removeItem('gsheets-access-token'); sessionStorage.removeItem('gsheets-access-token'); } catch {}
    try { localStorage.removeItem('gsheets-id-token'); sessionStorage.removeItem('gsheets-id-token'); } catch {}
  }, []);

  const value = useMemo(
    () => ({ accessToken, idToken, userSub, email, isSignedIn: !!idToken, loading, initialized, error, signIn, signOut, ensureSheetsToken }),
    [accessToken, idToken, userSub, email, loading, initialized, error, signIn, signOut, ensureSheetsToken],
  );

  return (
    <GoogleSheetsAuthContext.Provider value={value}>{children}</GoogleSheetsAuthContext.Provider>
  );
}

export function useGoogleSheetsAuth() {
  const ctx = useContext(GoogleSheetsAuthContext);
  if (!ctx) throw new Error('useGoogleSheetsAuth must be used within GoogleSheetsAuthProvider');
  return ctx;
}
