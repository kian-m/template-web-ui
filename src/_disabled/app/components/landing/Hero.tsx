import { AuroraText } from '@/components/magicui/aurora-text';

export default function Hero() {
  return (
    <div className="relative w-full">
      <div className={`relative z-10 flex flex-col items-center justify-center pt-8 pb-8 md:pt-12`}>
        <h1 className={`text-center text-5xl font-bold text-gray-900 md:text-8xl dark:text-white`}>
          Welcome to{' '}
          <AuroraText colors={['#3b82f6', '#1d4ed8', '#60a5fa', '#93c5fd']} speed={3}>
            Debark
          </AuroraText>
        </h1>
        <p className="mt-2 text-center text-4xl text-gray-800 md:text-4xl dark:text-gray-400">
          Your all-in-one analytics dashboard for data-driven decisions.
        </p>
        <video
          src="/videos/demo.mp4"
          controls
          autoPlay
          muted
          loop
          playsInline
          className="mt-5 h-auto w-full max-w-5xl rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
}
