'use client';

import { ReactNode, useEffect, useState } from 'react';
import { GISAuthProvider as AuthProvider } from '@/app/context/gis-auth-context';
import { ThemeProvider } from 'next-themes';
import { PostHogProvider } from '@/app/providers/PostHogProvider';
import { GoogleSheetsAuthProvider } from '@/app/context/google-sheets-auth';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration issues by not rendering until mounted
  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <PostHogProvider>
        <GoogleSheetsAuthProvider>
          <AuthProvider>{children}</AuthProvider>
        </GoogleSheetsAuthProvider>
      </PostHogProvider>
    </ThemeProvider>
  );
}
