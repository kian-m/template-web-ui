/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@vercel/analytics'],
  experimental: {
      //TODO: Remove this when the issue is fixed
    missingSuspenseWithCSRBailout: false,
  },
};

module.exports = nextConfig;
