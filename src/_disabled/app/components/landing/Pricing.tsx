import Link from 'next/link';
import { AuroraText } from '@/components/magicui/aurora-text';
import { Highlighter } from '@/components/magicui/highlighter';

export default function Pricing() {
  const plans = [
    {
      name: 'Free Plan',
      price: '$0',
      billing: 'forever',
      description: 'Perfect for trying out Debark with your PostHog data.',
      features: [
        '10 agentic calls included',
        'PostHog connector',
        'Automatic widget creation',
        'Dashboard integration',
        'SQL query generation',
      ],
      cta: 'Get Started',
      ctaLink: '/login',
      highlighted: true,
    },
  ];

  return (
    <div className="relative min-h-screen w-full">
      {/* Green Glow Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(
              circle at center,
              rgba(34, 197, 94, 0.2),
              transparent 45%
            )
          `,
          filter: 'blur(80px)',
          backgroundRepeat: 'no-repeat',
        }}
      />
      {/* Grid Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(34, 197, 94, 0.1) 2px, transparent 2px),
            linear-gradient(to bottom, rgba(34, 197, 94, 0.1) 2px, transparent 2px)
          `,
          backgroundSize: '20px 30px',
          WebkitMaskImage:
            'radial-gradient(ellipse 60% 70% at 50% 50%, #000 40%, transparent 100%)',
          maskImage: 'radial-gradient(ellipse 60% 70% at 50% 50%, #000 40%, transparent 100%)',
        }}
      />

      <section id="pricing" className="relative z-10 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            {/* Main Heading */}
            <div className="mb-16 text-center">
              <h2 className="mb-6 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-6xl dark:text-white">
                Start{' '}
                <AuroraText colors={['#22c55e', '#16a34a', '#4ade80', '#86efac']} speed={3}>
                  Free
                </AuroraText>{' '}
                with PostHog
              </h2>
              <div className="mb-6">
                <span className="inline-flex items-center rounded-full border-2 border-black bg-green-100 px-4 py-2 text-sm font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                  Available Now
                </span>
              </div>
              <p className="mx-auto max-w-4xl text-xl leading-relaxed text-gray-700 sm:text-2xl dark:text-gray-300">
                Get started with{' '}
                <Highlighter lightColor="#bbf7d0" darkColor="#065f46">
                  10 agentic calls
                </Highlighter>{' '}
                on our free plan. Pro plan coming soon!
              </p>
            </div>

            {/* Pricing Card */}
            <div className="flex justify-center">
              <div className="w-full max-w-lg">
                {plans.map((plan, index) => (
                  <div
                    key={index}
                    className="flex flex-col overflow-hidden rounded-lg border-2 border-black bg-white/50 shadow-lg shadow-black/30 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-black/40 dark:bg-gray-800/50"
                  >
                    <div className="bg-gradient-to-r from-green-700 to-emerald-700 p-8 text-white">
                      <h3 className="text-3xl font-bold">{plan.name}</h3>
                      <div className="mt-6 flex items-baseline">
                        <span className="text-5xl font-extrabold">{plan.price}</span>
                        <span className="ml-2 text-xl text-green-100">{plan.billing}</span>
                      </div>
                      <p className="mt-6 text-lg text-green-100">{plan.description}</p>
                    </div>

                    <div className="flex-1 p-8">
                      <ul className="space-y-4">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start">
                            <svg
                              className="mr-3 h-6 w-6 shrink-0 text-green-500 dark:text-green-400"
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
                            <span className="text-lg text-gray-800 dark:text-gray-200">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {plan.highlighted && (
                      <div className="bg-gradient-to-r from-green-700 to-emerald-700 py-3 text-center text-sm font-medium text-white">
                        Perfect for Getting Started
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom CTA Section */}
            <div className="mt-16 text-center">
              <div className="inline-flex flex-col items-center gap-4 rounded-2xl border-2 border-black bg-gradient-to-r from-green-50 to-emerald-50 px-8 py-6 sm:flex-row dark:from-green-900/30 dark:to-emerald-900/30">
                <div className="text-left">
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    Ready to transform your analytics workflow?
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-400">
                    Start with PostHog integration and expand from there
                  </p>
                </div>
                <Link
                  href="/login"
                  className="flex items-center rounded-full bg-gradient-to-r from-blue-900 to-blue-500 px-8 py-4 text-lg font-medium text-white shadow-md transition-all duration-200 hover:from-blue-800 hover:to-blue-600 hover:shadow-lg"
                >
                  <span>Start Your Free Trial</span>
                  <svg
                    className="ml-2 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
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
        </div>
      </section>
    </div>
  );
}
