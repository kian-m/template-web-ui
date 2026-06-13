import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

function parseAdminEmails() {
  const raw = process.env.ADMIN_EMAILS || '';
  return raw
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      // Attach basic user info on first sign-in
      if (user) {
        token.name = user.name || token.name;
        token.email = (user as any).email || token.email;
        token.picture = (user as any).image || token.picture;
      }

      const admins = parseAdminEmails();
      const email = (token.email || '').toLowerCase();
      (token as any).isAdmin = email && admins.includes(email);
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.name = token.name as string | undefined;
        session.user.email = token.email as string | undefined;
        (session.user as any).image = token.picture as string | undefined;
        (session.user as any).isAdmin = (token as any).isAdmin;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
