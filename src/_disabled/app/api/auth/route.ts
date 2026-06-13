import { NextRequest } from 'next/server';
import { verifyToken } from '@/app/auth/firebase';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ valid: false, message: 'No token provided' }), {
      status: 401,
    });
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix
  const isValid = await verifyToken(token);
  return new Response(JSON.stringify({ valid: isValid }), { status: isValid ? 200 : 401 });
}
