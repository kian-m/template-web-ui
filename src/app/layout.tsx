import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { siteContent } from '@/data/siteContent';
import PostHogProvider from '@/components/PostHogProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: siteContent.seo.title,
    template: `%s | ${siteContent.seo.structuredData.name}`,
  },
  description: siteContent.seo.description,
  keywords: siteContent.seo.keywords,
};

export default function RootLayout ({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  return (
      <html lang="en" className="scroll-smooth">
      <head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />

        {/* Open Graph */}
        <meta property="og:title" content={siteContent.seo.title} />
        <meta property="og:description" content={siteContent.seo.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.bayareatutoring.com" />
        <meta property="og:image" content="https://www.bayareatutoring.com/images/og-image.jpg" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={siteContent.seo.title} />
        <meta name="twitter:description" content={siteContent.seo.description} />
        <meta name="twitter:image" content="https://www.bayareatutoring.com/images/twitter-image.jpg" />

        {/* Theme Color */}
        <meta name="theme-color" content="#092f5e" />

        {/* Fonts preconnect */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
      <PostHogProvider />
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <a href="/" className="flex items-center space-x-2">
              <div className="bg-navy-800 text-white font-bold text-xl p-2 rounded">BT</div>
              <span className="text-navy-800 font-bold text-xl">Bay Area Tutoring</span>
            </a>

            <nav className="hidden md:flex space-x-8">
              <a href="#services" className="text-navy-800 hover:text-yellow-600 font-medium">Services</a>
              <a href="#locations" className="text-navy-800 hover:text-yellow-600 font-medium">Locations</a>
              <a href="#results" className="text-navy-800 hover:text-yellow-600 font-medium">Results</a>
              <a href="#pricing" className="text-navy-800 hover:text-yellow-600 font-medium">Pricing</a>
              <a href="#faq" className="text-navy-800 hover:text-yellow-600 font-medium">FAQ</a>
            </nav>

            <a href="#schedule" className="hidden md:inline-block py-2 px-4 bg-yellow-600 text-white rounded-md font-medium hover:bg-yellow-700 transition-colors">
              Free Consultation
            </a>

            <button className="md:hidden text-navy-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="bg-navy-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="bg-white text-navy-800 font-bold text-xl p-2 rounded">BT</div>
                <span className="text-white font-bold text-xl">Bay Area Tutoring</span>
              </div>

              <p className="text-gray-300 mb-4">
                Expert math and physics tutoring services in the Bay Area
              </p>

              <div className="flex space-x-4">
                <a href="#" className="text-white hover:text-yellow-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-yellow-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-yellow-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#services" className="text-gray-300 hover:text-yellow-400">Services</a></li>
                <li><a href="#locations" className="text-gray-300 hover:text-yellow-400">Locations</a></li>
                <li><a href="#results" className="text-gray-300 hover:text-yellow-400">Results</a></li>
                <li><a href="#pricing" className="text-gray-300 hover:text-yellow-400">Pricing</a></li>
                <li><a href="#faq" className="text-gray-300 hover:text-yellow-400">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Tutoring Locations</h3>
              <ul className="space-y-2">
                <li><a href="#locations" className="text-gray-300 hover:text-yellow-400">Lafayette Library</a></li>
                <li><a href="#locations" className="text-gray-300 hover:text-yellow-400">Orinda Library</a></li>
                <li><a href="#locations" className="text-gray-300 hover:text-yellow-400">Dublin Library</a></li>
                <li><a href="#locations" className="text-gray-300 hover:text-yellow-400">Walnut Creek Library</a></li>
                <li><a href="#locations" className="text-gray-300 hover:text-yellow-400">Berkeley Library</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-300">{siteContent.contact.email}</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-gray-300">{siteContent.contact.phone}</span>
                </li>
                {siteContent.contact.availability.map((time, index) => (
                    <li key={index} className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-300">{time}</span>
                    </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Bay Area Tutoring. All rights reserved.
            </p>

            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-300 text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-gray-300 text-sm">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-gray-300 text-sm">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>
      </body>
      </html>
  );
}