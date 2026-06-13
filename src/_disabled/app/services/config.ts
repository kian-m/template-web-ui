export const config = {
  // Backend URL for server-side requests
  backendUrl: process.env.BACKEND_URL || 'https://api.debark.ai',

  // Client-side API URL (always points to Next.js API routes)

  // Environment
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
} as const;

export type Config = typeof config;
