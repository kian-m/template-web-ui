import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      // Require auth everywhere
      if (!token) return false;
      const { pathname } = req.nextUrl;
      // Admin-only routes
      if (pathname.startsWith('/admin')) {
        return Boolean((token as any).isAdmin);
      }
      return true;
    },
  },
});

// Require auth for everything except Next internals, static assets, and NextAuth endpoints
export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|icon.jpg|browsericon.png|site.webmanifest).*)',
  ],
};
