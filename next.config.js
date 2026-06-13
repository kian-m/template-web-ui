/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@vercel/analytics'],
  // The legacy auth/dashboard/PostHog code is quarantined in src/_disabled and
  // excluded from tsconfig. Lint runs separately via `npm run lint`.
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
      //TODO: Remove this when the issue is fixed
    missingSuspenseWithCSRBailout: false,
  },
};

module.exports = nextConfig;
