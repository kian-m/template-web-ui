import { JWT } from 'google-auth-library';

type Scopes = string | string[];

export function getServiceAccountClient(scopes: Scopes) {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

  if (!clientEmail || !rawKey) {
    throw new Error('Service account env vars are missing. Set GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.');
  }

  // Replace literal \n sequences with real newlines for multiline key
  const privateKey = rawKey.replace(/\\n/g, '\n');

  return new JWT({
    email: clientEmail,
    key: privateKey,
    scopes,
  });
}

export async function getAccessToken(scopes: Scopes) {
  const client = getServiceAccountClient(scopes);
  const { token } = await client.getAccessToken();
  if (!token) throw new Error('Failed to obtain access token from service account');
  return token;
}

