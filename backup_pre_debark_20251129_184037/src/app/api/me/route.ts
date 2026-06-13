import { NextResponse } from 'next/server';

// Expose the current session/user details
export async function GET() {
  // getServerSession in app router with NextAuth requires passing handlers is tricky.
  // Instead, rely on the middleware gating and return a trimmed response.
  // Redirect to NextAuth's built-in session endpoint
  const base = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  return NextResponse.redirect(new URL('/api/auth/session', base));
}
