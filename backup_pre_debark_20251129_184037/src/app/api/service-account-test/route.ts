import { NextResponse } from 'next/server';
import { getAccessToken } from '../../../services/googleServiceAccount';

// Example: obtain an access token for Cloud Platform scope (adjust as needed)
export async function GET() {
  try {
    const token = await getAccessToken('https://www.googleapis.com/auth/cloud-platform');
    return NextResponse.json({ ok: true, tokenPreview: token.slice(0, 16) + '...' });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Unknown error' }, { status: 500 });
  }
}
