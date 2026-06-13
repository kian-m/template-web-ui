import Image from 'next/image';

export default function HowItWorks() {
  const steps = [
    {
      title: 'Connect PostHog',
      description: 'Link your PostHog account securely in just a few clicks.',
      icon: (
        <svg
          className="h-8 w-8 text-indigo-900 dark:text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
          />
        </svg>
      ),
      color: 'from-indigo-500 to-blue-500',
    },
    {
      title: 'Ask for Widgets',
      description: 'Simply describe what analytics you want in natural language.',
      icon: (
        <svg
          className="h-8 w-8 text-blue-900 dark:text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      ),
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'AI Creates Widgets',
      description: 'Our agents automatically generate SQL queries and create your widgets.',
      icon: (
        <svg
          className="h-8 w-8 text-cyan-900 dark:text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      color: 'from-cyan-500 to-teal-500',
    },
    {
      title: 'View Dashboard',
      description: 'Widgets are automatically placed in your dashboard for instant insights.',
      icon: (
        <svg
          className="h-8 w-8 text-teal-900 dark:text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      color: 'from-teal-500 to-green-500',
    },
  ];

  return (
    <section id="how-it-works" className="relative py-16">
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-50 to-white dark:from-gray-950 dark:to-gray-900"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl dark:from-blue-400 dark:to-indigo-400">
            How It Works
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-lg text-gray-600 dark:text-gray-400">
            Four simple steps to get analytics widgets from your PostHog data.
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="relative">
            <div className="absolute top-0 right-0 bottom-0 left-0 mx-auto h-full w-1 bg-gradient-to-b from-indigo-500 via-blue-500 to-teal-500 opacity-30 lg:left-1/2 lg:mt-12 lg:h-1 lg:w-full lg:-translate-x-1/2 lg:transform lg:bg-gradient-to-r"></div>

            <div className="relative z-10 space-y-12 lg:grid lg:grid-cols-4 lg:space-y-0 lg:gap-x-8">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="flex flex-col items-center">
                    <div
                      className={`h-14 w-14 rounded-full bg-gradient-to-br ${step.color} mb-4 flex items-center justify-center border-2 border-white p-2 shadow-lg dark:border-gray-800`}
                    >
                      {step.icon}
                    </div>

                    <div className="w-full max-w-xs rounded-xl bg-white p-5 shadow-md transition-all duration-300 hover:shadow-xl dark:bg-gray-800">
                      <h3 className="mb-2 text-center text-xl font-bold text-gray-900 dark:text-white">
                        {step.title}
                      </h3>
                      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-4xl">
          <div className="overflow-hidden rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-blue-50 shadow-lg dark:border-indigo-800/30 dark:from-indigo-900/20 dark:to-blue-900/20">
            <div className="grid grid-cols-1 gap-0 md:grid-cols-2">
              <div className="p-6 md:p-8">
                <h3 className="mb-3 text-xl font-bold text-indigo-700 dark:text-indigo-400">
                  AI-Powered Widget Creation
                </h3>
                <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                  Our AI agents understand your requests and automatically create the perfect
                  analytics widgets from your PostHog data.
                </p>
                <ul className="space-y-2">
                  {[
                    'Natural language requests',
                    'Automatic SQL generation',
                    'Instant widget creation',
                    'Dashboard integration',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center text-sm">
                      <svg
                        className="mr-2 h-4 w-4 flex-shrink-0 text-green-500 dark:text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center justify-center bg-gradient-to-br from-indigo-500 to-blue-600 p-6">
                <div className="w-full overflow-hidden rounded-lg bg-gray-800/90 p-4 text-sm text-gray-300 shadow-inner">
                  <div className="mb-2 flex">
                    <div className="mr-2 h-3 w-3 rounded-full bg-red-500"></div>
                    <div className="mr-2 h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-blue-300">{'> Show me user signup trends this month'}</p>
                    <p className="text-green-300">✓ Widget created! Signups up 15%</p>
                    <p className="text-blue-300">{'> Create conversion funnel by country'}</p>
                    <p className="text-green-300">✓ Funnel widget added to dashboard</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
