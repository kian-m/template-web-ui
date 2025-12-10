import posthog from 'posthog-js';

const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com';

if (typeof window !== 'undefined' && apiKey) {
  posthog.init(apiKey, {
    api_host: apiHost,
    autocapture: false,
    capture_pageview: false,
  });
}

export const captureEvent = (
  name: string,
  properties?: Record<string, string | number | boolean | null>,
) => {
  if (typeof window === 'undefined' || !apiKey) {
    return;
  }

  posthog.capture(name, properties);
};
