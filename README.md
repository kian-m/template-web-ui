This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## PostHog Analytics Setup

This project includes PostHog for comprehensive analytics and session recording. To enable PostHog:

1. Copy the `.env.example` file to `.env.local`:
```bash
cp .env.example .env.local
```

2. Update the environment variables in `.env.local`:
   - `NEXT_PUBLIC_POSTHOG_KEY`: Your PostHog project API key
   - `NEXT_PUBLIC_POSTHOG_HOST`: Your PostHog instance URL (default: https://app.posthog.com)

### Features Enabled:
- **Session Recording**: Full session replay with cross-origin iframe support
- **Autocapture**: Automatic tracking of clicks, form submissions, and input changes
- **Pageview Tracking**: Automatic pageview and page leave tracking
- **Console Logs**: Console log capture for debugging
- **Performance Monitoring**: Performance metrics tracking
- **Cross-domain Tracking**: Support for tracking across subdomains

To find your PostHog credentials:
1. Log in to [PostHog](https://app.posthog.com)
2. Go to Project Settings
3. Copy your Project API Key

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
