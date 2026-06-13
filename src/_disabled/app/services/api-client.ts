// src/app/services/api-client.ts
import { createClient, createConfig, type ClientOptions } from '@/client/client';

// Simple proxy configuration - Next.js handles the rest
// In offline mode, the service layer short-circuits and does not call the backend.
export const apiClient = createClient(
  createConfig<ClientOptions>({
    baseUrl: '/api/proxy',
    headers: {
      'Content-Type': 'application/json',
    },
    fetch: (request) => fetch(request, { signal: AbortSignal.timeout(300_000) }),
  }),
);
