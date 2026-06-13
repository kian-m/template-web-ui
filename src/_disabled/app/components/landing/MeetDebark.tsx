import Link from 'next/link';
import { AuroraText } from '@/components/magicui/aurora-text';
import { Highlighter } from '@/components/magicui/highlighter';

const connectionsNow = [
  // {
  //   title: 'Agentic Intelligence',
  //   description:
  //     'AI agents understand your data context and automatically generate the right queries for any platform',
  // },
  //   {
  //     title: "Universal Connectivity",
  //     description: "Connect to BigQuery, PostHog, Snowflake, Databricks, and 25+ other analytics platforms"
  //   },
  {
    title: 'Connect Posthog Today',
    description: 'Grab an API key from PostHog and connect it to Debark in seconds.',
  },
  {
    title: 'More Connections Coming Soon',
    description:
      "We're working hard to support more data sources and platforms. If you have a platform you'd love to see supported, please let us know!",
  },
];

export default function MeetDebark() {
  return (
    <div className="relative min-h-screen w-full">
      {/* Blue Glow Right */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(
              circle at right center,
              rgba(59, 130, 246, 0.2),
              transparent 45%
            )
          `,
          filter: 'blur(80px)',
          backgroundRepeat: 'no-repeat',
        }}
      />
      {/* Right Fade Grid Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(59, 130, 246, 0.1) 2px, transparent 2px),
            linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 2px, transparent 2px)
          `,
          backgroundSize: '20px 30px',
          WebkitMaskImage:
            'radial-gradient(ellipse 60% 70% at 100% 50%, #000 40%, transparent 100%)',
          maskImage: 'radial-gradient(ellipse 60% 70% at 100% 50%, #000 40%, transparent 100%)',
        }}
      />

      <section className="relative z-10 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            {/* Main Heading */}
            <div className="mb-16 text-center">
              <h2 className="mb-6 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-6xl dark:text-white">
                Meet{' '}
                <AuroraText colors={['#3b82f6', '#1d4ed8', '#60a5fa', '#93c5fd']} speed={3}>
                  Debark
                </AuroraText>
              </h2>
              <p className="mx-auto max-w-4xl text-xl leading-relaxed text-gray-700 sm:text-2xl dark:text-gray-300">
                The{' '}
                <Highlighter lightColor="#dbeafe" darkColor="#1e40af">
                  agentic-first analytics platform
                </Highlighter>{' '}
                that connects to all your data sources so you can build insights without learning
                dozens of query languages.
              </p>
            </div>

            {/* Two-Column Layout */}
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Left Column - Main Value Proposition */}
              <div className="flex flex-col justify-center rounded-lg border-2 border-black bg-white/50 p-8 backdrop-blur-sm dark:bg-gray-800/50">
                <div className="space-y-6">
                  <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                    One Platform, Every Data Source
                  </h3>
                  <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                    Instead of learning BigQuery's GoogleSQL, PostHog's HogQL, Snowflake SQL, and
                    25+ other query languages, just tell Debark what you want to know in{' '}
                    <Highlighter lightColor="#dbeafe" darkColor="#1e40af">
                      plain English.
                    </Highlighter>
                    .
                  </p>
                  <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                    Our AI agents understand your data context, automatically connect to the right
                    databases, and generate the perfect queries—so you can focus on insights, not
                    syntax.
                  </p>
                  <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                    From idea to dashboard in minutes, not weeks.
                  </p>
                </div>
              </div>

              {/* Right Column - Feature Cards */}
              <div className="grid gap-6">
                {connectionsNow.map((feature, index) => (
                  <div
                    key={index}
                    className="rounded-lg border-2 border-black bg-white p-6 shadow-lg shadow-black/30 transition-all duration-300 hover:shadow-xl hover:shadow-black/40 dark:bg-gray-800"
                  >
                    <div className="flex items-start gap-4">
                      <div>
                        <h4 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                          {feature.title}
                        </h4>
                        <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
