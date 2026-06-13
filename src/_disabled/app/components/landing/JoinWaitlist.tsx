'use client';

export default function JoinWaitlist() {
  return (
    <div className="text-center">
      <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Join our blog</h3>
      <p className="mx-auto mb-4 max-w-2xl text-gray-600 dark:text-gray-300">
        Be the first to know when we launch new features and updates.
      </p>
      <div className="flex justify-center">
        <a
          href="https://debarkai.substack.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-10 py-4 text-lg font-medium text-white shadow-md transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg"
        >
          Join Blog
        </a>
      </div>
    </div>
  );
}
