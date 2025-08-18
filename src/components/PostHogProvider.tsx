'use client';

import { useEffect } from 'react';
import posthog from 'posthog-js';

export default function PostHogProvider () {
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;

    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    });

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      posthog.capture('ui_interaction', {
        tag: target.tagName,
        id: target.id,
        classes: target.className,
        text: target.textContent?.trim().slice(0, 100),
      });
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return null;
}
