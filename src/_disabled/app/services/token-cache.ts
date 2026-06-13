// Centralized token caching service to avoid duplication and improve performance
import { auth } from '@/app/lib/firebase';

// Token caching with expiration
let cachedToken: string | null = null;
let tokenExpiry: number = 0;
const TOKEN_CACHE_DURATION = 55 * 60 * 1000; // 55 minutes to ensure freshness

// Retrieve token from sessionStorage or cookie
function getStoredToken(): string | undefined {
  if (typeof window !== 'undefined') {
    const token = sessionStorage.getItem('auth-token');
    if (token) return token;
    const match = document.cookie.match(/(?:^|; )auth-token=([^;]+)/);
    return match ? match[1] : undefined;
  }
  return undefined;
}

// Clear cached token on auth state changes
if (typeof window !== 'undefined' && auth?.onAuthStateChanged) {
  auth.onAuthStateChanged((user) => {
    if (!user) {
      cachedToken = null;
      tokenExpiry = 0;
    }
  });
}

/**
 * Get authentication headers with cached token
 * Automatically handles token caching to avoid unnecessary Firebase API calls
 */
export async function getAuthHeaders(): Promise<{ Authorization: string } | undefined> {
  let token: string | undefined;
  
  if (auth.currentUser) {
    // Use cached token if it's still valid
    const now = Date.now();
    if (cachedToken && now < tokenExpiry) {
      token = cachedToken;
    } else {
      // Get fresh token without forcing refresh
      token = await auth.currentUser.getIdToken();
      cachedToken = token;
      tokenExpiry = now + TOKEN_CACHE_DURATION;
    }
  } else {
    token = getStoredToken();
  }
  
  return token ? { Authorization: `Bearer ${token}` } : undefined;
}

/**
 * Clear the cached token (useful for logout or token refresh scenarios)
 */
export function clearTokenCache(): void {
  cachedToken = null;
  tokenExpiry = 0;
}

/**
 * Force a token refresh and cache the new token
 */
export async function refreshToken(): Promise<string | undefined> {
  if (!auth.currentUser) return undefined;
  
  try {
    const token = await auth.currentUser.getIdToken(true); // Force refresh only when explicitly requested
    cachedToken = token;
    tokenExpiry = Date.now() + TOKEN_CACHE_DURATION;
    return token;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    clearTokenCache();
    return undefined;
  }
}