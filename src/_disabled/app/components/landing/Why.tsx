'use client';
import { AnimatedList } from '@/components/magicui/animated-list';
import { AuroraText } from '@/components/magicui/aurora-text';
import { Highlighter } from '@/components/magicui/highlighter';
import { useInView } from 'react-intersection-observer';

const sqlLanguages = [
  { platform: 'BigQuery', language: 'GoogleSQL' },
  { platform: 'PostHog', language: 'HogQL' },
  { platform: 'ClickHouse', language: 'ClickHouse SQL' },
  { platform: 'Databricks', language: 'Spark SQL' },
  { platform: 'Shopify', language: 'ShopifyQL' },
  { platform: 'Mixpanel', language: 'JQL' },
  { platform: 'Amplitude', language: 'Snowflake SQL' },
  { platform: 'Looker', language: 'LookML + SQL' },
  { platform: 'Metabase', language: 'MBQL + SQL' },
  { platform: 'Tableau', language: 'VizQL' },
  { platform: 'Azure Data Explorer', language: 'KQL' },
  { platform: 'Snowflake', language: 'Snowflake SQL' },
  { platform: 'AWS Redshift', language: 'Redshift SQL' },
  { platform: 'CloudWatch', language: 'Logs Insights QL' },
  { platform: 'Grafana', language: 'PromQL' },
  { platform: 'Elasticsearch', language: 'ESQL' },
  { platform: 'Splunk', language: 'SPL' },
  { platform: 'New Relic', language: 'NRQL' },
  { platform: 'Datadog', language: 'DQL' },
  { platform: 'Oracle BI', language: 'Oracle BI SQL' },
  { platform: 'SAP BusinessObjects', language: 'WebI QL' },
  { platform: 'IBM Cognos', language: 'Cognos SQL' },
  { platform: 'Teradata', language: 'Teradata SQL' },
  { platform: 'Druid', language: 'Druid SQL' },
  { platform: 'Presto', language: 'Presto SQL' },
  { platform: 'AWS Athena', language: 'Trino/Presto SQL' },
  { platform: 'Google Analytics', language: 'GA4 Data API / GoogleSQL' },
  { platform: 'Adobe Analytics', language: 'ANSI SQL' },
  { platform: 'Power BI', language: 'DAX + Power Query M' },
];

export default function Why() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  return (
    <div ref={ref} className="relative min-h-screen w-full">
      {/* Red Glow Left */}
      <div
        className="absolute inset-0 z-0 bg-white dark:bg-gray-900"
        style={{
          backgroundImage: `
            radial-gradient(
              circle at left center,
              rgba(220, 38, 38, 0.2),
              transparent 45%
            )
          `,
          filter: 'blur(80px)',
          backgroundRepeat: 'no-repeat',
        }}
      />
      {/* Left Fade Grid Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(220, 38, 38, 0.1) 2px, transparent 2px),
            linear-gradient(to bottom, rgba(220, 38, 38, 0.1) 2px, transparent 2px)
          `,
          backgroundSize: '20px 30px',
          WebkitMaskImage: 'radial-gradient(ellipse 60% 70% at 0% 50%, #000 40%, transparent 100%)',
          maskImage: 'radial-gradient(ellipse 60% 70% at 0% 50%, #000 40%, transparent 100%)',
        }}
      />
      {/* Dark Mode Grid Overlay */}
      <div
        className="absolute inset-0 z-0 hidden dark:block"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(220, 38, 38, 0.3) 2px, transparent 2px),
            linear-gradient(to bottom, rgba(220, 38, 38, 0.3) 2px, transparent 2px)
          `,
          backgroundSize: '20px 30px',
          WebkitMaskImage: 'radial-gradient(ellipse 60% 70% at 0% 50%, #000 40%, transparent 100%)',
          maskImage: 'radial-gradient(ellipse 60% 70% at 0% 50%, #000 40%, transparent 100%)',
        }}
      />
      {/* Your Content/Components */}
      <section className="relative z-10 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            {/* Shared Heading */}
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-6xl dark:text-white">
                The Analytics Stack is{' '}
                <AuroraText colors={['#dc2626', '#b91c1c', '#ef4444', '#f87171']} speed={3}>
                  Fragmented
                </AuroraText>
              </h2>
            </div>

            {/* Two-Column Layout */}
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Left Column - Animated Query Language Cards */}
              <div className="flex flex-col">
                <div className="h-[800px] overflow-hidden">
                  {inView && (
                    <AnimatedList delay={1500} className="h-full">
                      {sqlLanguages.map((item, index) => (
                        <div
                          key={index}
                          className="mx-auto mb-6 w-full max-w-md rounded-lg border-2 border-black bg-white p-6 shadow-lg shadow-black/30 transition-all hover:shadow-xl hover:shadow-black/40 dark:border-gray-600 dark:bg-gray-800 dark:shadow-gray-800/50 dark:hover:shadow-gray-700/60"
                        >
                          <div className="flex items-center justify-between">
                            <div className="text-base text-gray-900 dark:text-white">
                              {item.platform}
                            </div>
                            <div className="text-base font-bold text-gray-900 dark:text-white">
                              {item.language}
                            </div>
                          </div>
                        </div>
                      ))}
                    </AnimatedList>
                  )}
                </div>
              </div>

              {/* Right Column - Explanation Text */}
              <div className="flex flex-col justify-center rounded-lg border-2 border-black bg-transparent p-6 dark:border-gray-600 dark:bg-gray-800/50">
                <div className="space-y-6">
                  <p className="text-xl leading-relaxed text-gray-800 dark:text-gray-300">
                    With so many different query languages, getting a complete view of your business
                    in{' '}
                    <Highlighter lightColor="#ffb3b3" darkColor="#dc2626">
                      one place
                    </Highlighter>{' '}
                    is nearly impossible.
                  </p>
                  <p className="text-xl leading-relaxed text-gray-800 dark:text-gray-300">
                    Every platform comes with its own syntax, quirks, and learning curve leaving
                    teams spending more time figuring out how to query data than actually analyzing
                    it and turning it into insights.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
