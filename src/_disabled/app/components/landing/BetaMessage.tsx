'use client';

import Link from 'next/link';

export const BetaMessage = () => {
  return (
    <section className="w-full bg-gradient-to-r from-blue-50 to-indigo-100 py-4 md:py-6 lg:py-8 dark:from-blue-900/20 dark:to-indigo-900/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-center text-3xl font-bold tracking-tighter text-transparent sm:text-4xl md:text-5xl">
              Ready to Get Started?
            </h2>
            <p className="mx-auto max-w-[700px] text-center text-gray-700 md:text-xl dark:text-gray-300">
              Connect your PostHog account and start creating analytics widgets with AI agents. Get
              10 free agentic calls to explore what Debark can do for your data.
            </p>
          </div>
          <div className="w-full max-w-md">
            <Link
              href="/signup"
              className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
            >
              Get Started Free
              <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
