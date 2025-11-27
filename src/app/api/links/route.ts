import { NextResponse } from 'next/server';
import { appendLinkRow, fetchLinksFromSheet, LinkRow } from '@/lib/sheets';

export const dynamic = 'force-dynamic';

function baseHost() {
  return process.env.SHORT_LINK_BASE_URL || 'https://clk.ly';
}

function sanitizeAlias(alias?: string) {
  if (!alias) return '';
  return alias
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_]/g, '');
}

function authorize(request: Request) {
  const user = process.env.LINKS_API_USER;
  const password = process.env.LINKS_API_PASSWORD;

  if (!user || !password) {
    return { authorized: true };
  }

  const header = request.headers.get('authorization');
  if (!header?.startsWith('Basic ')) {
    return { authorized: false, response: NextResponse.json({ message: 'Unauthorized' }, { status: 401 }) };
  }

  const decoded = Buffer.from(header.replace('Basic ', ''), 'base64').toString('utf8');
  const [providedUser, providedPassword] = decoded.split(':');
  const authorized = providedUser === user && providedPassword === password;

  if (!authorized) {
    return { authorized: false, response: NextResponse.json({ message: 'Unauthorized' }, { status: 401 }) };
  }

  return { authorized: true };
}

async function readRequestBody(request: Request) {
  try {
    return await request.json();
  } catch (error) {
    return null;
  }
}

export async function GET(request: Request) {
  const authz = authorize(request);
  if (!authz.authorized) return authz.response;

  try {
    const links = await fetchLinksFromSheet();
    return NextResponse.json({ links });
  } catch (error) {
    return NextResponse.json(
      { message: 'Unable to fetch links from the sheet', details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const authz = authorize(request);
  if (!authz.authorized) return authz.response;

  const payload = await readRequestBody(request);

  if (!payload || typeof payload.destination !== 'string') {
    return NextResponse.json({ message: 'Destination URL is required' }, { status: 400 });
  }

  const sanitizedDestination = payload.destination.trim();
  const incomingAlias = sanitizeAlias(typeof payload.alias === 'string' ? payload.alias : '');
  const alias = incomingAlias || `clk-${Math.random().toString(36).slice(2, 8)}`;

  if (!sanitizedDestination) {
    return NextResponse.json({ message: 'Destination URL is required' }, { status: 400 });
  }

  try {
    const existing = await fetchLinksFromSheet();
    const conflict = existing.find((link) => link.alias === alias);
    if (conflict) {
      return NextResponse.json({ message: 'Alias already exists. Please choose another.' }, { status: 409 });
    }

    const now = new Date().toISOString();
    const shortUrl = `${baseHost().replace(/\/$/, '')}/${alias}`;
    const newLink: LinkRow = {
      alias,
      destinationUrl: sanitizedDestination,
      shortUrl,
      createdAt: now,
    };

    const persisted = await appendLinkRow(newLink);
    return NextResponse.json({ link: persisted }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Unable to create link', details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}
