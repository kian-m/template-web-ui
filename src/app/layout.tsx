import './globals.css';
import { Inter } from 'next/font/google';
import React from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'clkly | Effortless Link Shortening',
  description: 'A modern, server-inspired landing for clkly link shortening.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta property="og:image" content="/icon.jpg" />
        <link
          rel="icon"
          sizes="16x16 32x32 64x64"
          href="/icon.jpg"
          type="image/jpg"
        />
        <link rel="icon" href="/browsericon.png" type="image/png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icon.jpg" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/browsericon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/browsericon.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
