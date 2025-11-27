import { google } from 'googleapis';

export type LinkRow = {
  alias: string;
  destinationUrl: string;
  shortUrl: string;
  createdAt: string;
};

type ServiceAccountConfig = {
  client_email: string;
  private_key: string;
};

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const DEFAULT_SHEET_NAME = 'Links';
const SHEET_HEADERS = ['Alias', 'Destination URL', 'Short URL', 'Created At'];

function decodeServiceAccountKey(key: string): ServiceAccountConfig {
  const trimmed = key.trim();
  try {
    return JSON.parse(trimmed) as ServiceAccountConfig;
  } catch (error) {
    const decoded = Buffer.from(trimmed, 'base64').toString('utf-8');
    return JSON.parse(decoded) as ServiceAccountConfig;
  }
}

function resolveServiceAccount(): ServiceAccountConfig {
  const inlineJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (inlineJson) {
    return decodeServiceAccountKey(inlineJson);
  }

  const client_email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  if (client_email && privateKey) {
    return {
      client_email,
      private_key: privateKey.replace(/\\n/g, '\n'),
    };
  }

  throw new Error('Google service account credentials are not configured.');
}

function getSheetsClient() {
  const credentials = resolveServiceAccount();
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: SCOPES,
  });

  return google.sheets({ version: 'v4', auth });
}

function spreadsheetIdFromEnv(): string {
  const documentId = process.env.GOOGLE_SHEETS_DOCUMENT_ID;
  if (!documentId) {
    throw new Error('GOOGLE_SHEETS_DOCUMENT_ID is required to access Sheets.');
  }
  return documentId;
}

async function ensureHeaderRow(sheetsApi: ReturnType<typeof getSheetsClient>, spreadsheetId: string, sheetName: string) {
  const current = await sheetsApi.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A1:D1`,
  });

  const existingHeaders = current.data.values?.[0];
  if (existingHeaders && existingHeaders.length >= SHEET_HEADERS.length) {
    return;
  }

  await sheetsApi.spreadsheets.values.update({
    spreadsheetId,
    range: `${sheetName}!A1:D1`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [SHEET_HEADERS],
    },
  });
}

function mapRow(row: string[]): LinkRow | null {
  if (row.length < 4) return null;

  const [alias, destinationUrl, shortUrl, createdAt] = row;
  if (!alias || !destinationUrl || !shortUrl || !createdAt) return null;

  return {
    alias,
    destinationUrl,
    shortUrl,
    createdAt,
  };
}

export async function fetchLinksFromSheet(sheetName = DEFAULT_SHEET_NAME): Promise<LinkRow[]> {
  const sheetsApi = getSheetsClient();
  const spreadsheetId = spreadsheetIdFromEnv();

  await ensureHeaderRow(sheetsApi, spreadsheetId, sheetName);

  const response = await sheetsApi.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A2:D`,
  });

  const rows = response.data.values ?? [];
  const records = rows
    .map(mapRow)
    .filter((row): row is LinkRow => Boolean(row))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return records;
}

export async function appendLinkRow(
  link: LinkRow,
  sheetName = DEFAULT_SHEET_NAME,
): Promise<LinkRow> {
  const sheetsApi = getSheetsClient();
  const spreadsheetId = spreadsheetIdFromEnv();

  await ensureHeaderRow(sheetsApi, spreadsheetId, sheetName);

  await sheetsApi.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A:D`,
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values: [[link.alias, link.destinationUrl, link.shortUrl, link.createdAt]],
    },
  });

  return link;
}
