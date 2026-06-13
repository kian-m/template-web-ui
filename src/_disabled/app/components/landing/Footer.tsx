import { AuroraText } from '@/components/magicui/aurora-text';

export default function Footer() {
  return (
    <div className="relative w-full">
      {/* Grid Background coming from bottom */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(59, 130, 246, 0.1) 2px, transparent 2px),
            linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 2px, transparent 2px)
          `,
          backgroundSize: '20px 30px',
          WebkitMaskImage:
            'radial-gradient(ellipse 60% 70% at 50% 100%, #000 40%, transparent 100%)',
          maskImage: 'radial-gradient(ellipse 60% 70% at 50% 100%, #000 40%, transparent 100%)',
        }}
      />

      <footer className="relative z-10 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            {/* Contact Section */}
            <div className="text-center transition-all duration-300">
              <h2 className="mb-6 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl dark:text-white">
                Get In{' '}
                <AuroraText colors={['#3b82f6', '#1d4ed8', '#60a5fa', '#93c5fd']} speed={3}>
                  Touch
                </AuroraText>
              </h2>
              <div className="mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8">
                <a
                  href="mailto:help@debark.ai"
                  className="text-3xl font-bold text-blue-600 transition-colors duration-200 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  help@debark.ai
                </a>
              </div>
            </div>

            {/* Copyright */}
            <div className="mt-12 text-center">
              <p className="text-lg font-bold text-gray-600 dark:text-gray-400">
                &copy; 2025 Debark.AI. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
