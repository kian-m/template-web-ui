'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookie-consent', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed right-0 bottom-0 left-0 z-50 flex flex-col items-center justify-center gap-4 bg-gray-900 p-4 text-sm text-white sm:flex-row">
      <p className="text-center">
        We use cookies to enhance your experience. By continuing, you agree to our{' '}
        <Link href="/terms" className="underline">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="underline">
          Privacy Policy
        </Link>
        .
      </p>
      <button
        onClick={accept}
        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        Accept
      </button>
    </div>
  );
}
