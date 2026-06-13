'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { useEffect } from 'react';

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize PostHog only when not in offline mode; can be overridden later by Settings
    posthog.init('phc_MkLfHMkcma74ZbeGbQRN0s5eQoIv3OBCpmkbu2BMR0s', {
      api_host: '/ingest',
      ui_host: 'https://us.i.posthog.com',
      defaults: '2025-05-24',
      capture_exceptions: true,
      debug: process.env.NODE_ENV === 'development',
      secure_cookie: true,
      cross_subdomain_cookie: false,
    });

    const clickHandler = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const element = target?.closest<HTMLElement>('button, a, [data-ph-event]');
      if (!element) return;
      const eventName = element.getAttribute('data-ph-event') || 'ui_click';
      posthog.capture(eventName, {
        tag: element.tagName.toLowerCase(),
        id: element.id || undefined,
        text: element.textContent?.trim().slice(0, 100),
      });
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
