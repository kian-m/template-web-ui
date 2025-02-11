import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'My Health Portal',
  description: 'Fitness, Nutrition & Sleep',
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
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
    </html>
  );
}
