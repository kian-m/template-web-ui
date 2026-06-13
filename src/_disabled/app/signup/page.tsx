// app/signin/page.tsx (or wherever you want the redirect from)
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function SignInRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Immediately redirect to the login page
    router.replace('/login');
  }, [router]);

  // Show a brief loading state while redirecting
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white">
      <div className="flex flex-col items-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 dark:text-blue-500" />
      </div>
    </div>
  );
}
