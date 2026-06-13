import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from '@/app/components/ui/theme-toggle';

export default function Navbar() {
  return (
    <header className="w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex flex-shrink-0 items-center">
            <Link href="/" className="group flex items-center">
              <div className="relative mr-3 flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-900 to-blue-500 shadow-md transition-all duration-300 group-hover:shadow-lg">
                <div className="absolute h-6 w-6 rounded-full bg-white transition-transform duration-300 group-hover:scale-95 dark:bg-gray-800"></div>
                <div className="absolute h-3 w-3 rounded-full bg-gradient-to-br from-blue-800 to-blue-400 transition-transform duration-300 group-hover:scale-110"></div>
              </div>
              <span className="bg-gradient-to-r from-blue-900 to-blue-500 bg-clip-text text-xl font-bold text-transparent transition-all duration-300 group-hover:from-blue-500 group-hover:to-blue-900 dark:from-blue-500 dark:to-blue-200 dark:group-hover:from-blue-200 dark:group-hover:to-blue-500">
                Debark.AI
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {/* TODO: Fix theme toggle functionality
            <ThemeToggle />
            */}
            <Link
              href="/signup"
              className="flex items-center rounded-full bg-gradient-to-r from-blue-900 to-blue-500 px-5 py-2 text-sm font-medium text-white shadow-md transition-all duration-200 hover:from-blue-800 hover:to-blue-600 hover:shadow-lg"
            >
              <span>Get Started</span>
              <svg className="ml-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    </header>
  );
}
