import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Kacie Jewel Hill',
  description: 'Kacie Jewel Hill',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
      <meta property="og:image" content="/album-art.webp" />
      <link
        rel="icon"
        sizes="16x16 32x32 64x64"
        href="/album-art.webp"
        type="image/png"
      />
    </html>
  );
}
