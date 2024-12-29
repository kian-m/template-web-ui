import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });


export const metadata = {
  title: 'My Health Portal',
  description: 'Fitness, Food & Rest'
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
      <meta property="og:image" content="/img.webp" />
      <link
          rel="icon"
          sizes="16x16 32x32 64x64"
          href="/img.webp"
          type="image/png"
      />
    </html>
  );
}
