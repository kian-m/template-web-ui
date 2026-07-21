type PostHogLike = {
  capture?: (eventName: string, properties?: Record<string, unknown>) => void;
};

declare global {
  interface Window {
    posthog?: PostHogLike;
  }
}

/** Best-effort PostHog capture without requiring PostHog to be installed. */
export const captureEvent = (
  eventName: string,
  properties?: Record<string, unknown>,
): void => {
  if (typeof window === 'undefined') return;
  window.posthog?.capture?.(eventName, properties);
};
