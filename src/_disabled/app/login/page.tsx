// app/login/page.tsx
'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/use-auth';
import { Loader2 } from 'lucide-react';
// import { fetchDashboards } from '@/app/services/dashboard-api';

export default function LoginPage() {
  const { user, loading, error, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [isAnimating, setIsAnimating] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // If already logged in, go straight to the dashboard
  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      if (user) {
        router.replace('/dashboard');
      } else {
        setCheckingAuth(false);
      }
    };

    checkAuthAndRedirect();
  }, [user, router]);

  // Check for session error from redirect
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedError = sessionStorage.getItem('loginError');
      if (storedError) {
        setSessionError(storedError);
        sessionStorage.removeItem('loginError');
      }
    }
  }, []);

  const handleGoogleSignIn = useCallback(async () => {
    setIsAnimating(true);
    setSessionError(null); // Clear any session error when trying again
    await signInWithGoogle();
    // After sign-in completes (ID token set), redirect
    router.replace('/dashboard');
    setIsAnimating(false);
  }, [signInWithGoogle, router]);

  // Show loading state while checking authentication
  if (checkingAuth || loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white">
      <div className="dark:from-blue-850 relative hidden items-center justify-center overflow-hidden bg-gradient-to-br from-blue-800 via-blue-700 to-blue-400 lg:flex lg:w-1/2 dark:via-blue-800 dark:to-blue-500">
        <div className="dark:from-blue-850/40 absolute inset-0 bg-gradient-to-br from-blue-800/20 via-blue-700/10 to-blue-400/20 dark:via-blue-800/30 dark:to-blue-500/40" />
        <div className="z-10 max-w-xl p-12">
          <h1 className="mb-6 text-4xl font-bold text-white">Welcome to Debark</h1>
          <p className="mb-8 text-xl text-blue-100 dark:text-blue-200">
            Your all-in-one analytics dashboard for data-driven decisions.
          </p>
          <div className="grid grid-cols-2 gap-6">
            <div className="rounded-lg border border-white/30 bg-white/20 p-6 shadow-lg backdrop-blur-sm">
              <div className="mb-2 text-4xl font-bold text-white">5 Min</div>
              <div className="text-blue-100">Set Up Time</div>
            </div>
            <div className="rounded-lg border border-white/30 bg-white/20 p-6 shadow-lg backdrop-blur-sm">
              <div className="mb-2 text-4xl font-bold text-white">2</div>
              <div className="text-blue-100">Data Sources Supported</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-center bg-white lg:w-1/2 dark:bg-gray-900">
        <div className="w-full max-w-md space-y-8 p-8">
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-xl bg-gradient-to-r from-blue-800 to-blue-500 p-3 text-white shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
              </div>
            </div>
            <h2 className="mb-2 text-3xl font-extrabold text-gray-900 dark:text-white">
              Sign in to Debark
            </h2>
            <p className="mb-8 text-gray-600 dark:text-gray-400">
              Access your analytics dashboard and insights
            </p>
          </div>

          {(error || sessionError) && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 shadow-sm dark:border-red-500 dark:bg-red-900/30 dark:text-red-200">
              {sessionError || error}
            </div>
          )}

          <button
            onClick={handleGoogleSignIn}
            disabled={loading || isAnimating}
            className="flex w-full items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm transition duration-200 hover:bg-gray-50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
          >
            {loading || isAnimating ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin text-gray-600 dark:text-white" />
            ) : (
              <svg viewBox="0 0 24 24" className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg">
                <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                  <path
                    fill="#4285F4"
                    d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                  ></path>
                  <path
                    fill="#34A853"
                    d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                  ></path>
                  <path
                    fill="#FBBC05"
                    d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                  ></path>
                  <path
                    fill="#EA4335"
                    d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                  ></path>
                </g>
              </svg>
            )}
            Login / Sign up with Google
          </button>

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600 dark:text-gray-300">
              By signing in, you agree to our{' '}
              <a
                href="#"
                className="font-medium text-blue-600 underline underline-offset-2 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 !text-blue-600 dark:!text-blue-400"
              >
                Terms of Service
              </a>{' '}
              and{' '}
              <a
                href="#"
                className="font-medium text-blue-600 underline underline-offset-2 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 !text-blue-600 dark:!text-blue-400"
              >
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
