import { PostHog } from 'posthog-node';

// NOTE: This is a Node.js client, so you can use it for sending events from the server side to PostHog.
export default function PostHogClient() {
  const posthogClient = new PostHog('phc_MkLfHMkcma74ZbeGbQRN0s5eQoIv3OBCpmkbu2BMR0s', {
    host: 'https://us.i.posthog.com',
    flushAt: 1,
    flushInterval: 0,
  });

  return posthogClient;
}
