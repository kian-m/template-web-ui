'use client';

import { useEffect } from 'react';
import { globalErrorHandler } from '@/app/lib/global-error-handler';

export function ErrorHandlerInitializer() {
  useEffect(() => {
    // Initialize global error handler on client side
    globalErrorHandler.initialize();
  }, []);

  // This component doesn't render anything
  return null;
}
