import { getAccessToken } from './googleServiceAccount';

const SHEETS_SCOPE = 'https://www.googleapis.com/auth/spreadsheets';

function getSpreadsheetId(spreadsheetId?: string) {
  const id = spreadsheetId || process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (!id) throw new Error('Missing spreadsheet ID. Set GOOGLE_SHEETS_SPREADSHEET_ID or pass one in.');
  return id;
}

export async function getSheetValues({
  range,
  spreadsheetId,
}: {
  range: string;
  spreadsheetId?: string;
}) {
  const token = await getAccessToken(SHEETS_SCOPE);
  const id = getSpreadsheetId(spreadsheetId);
  const url = new URL(`https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(id)}/values/${encodeURIComponent(range)}`);
  url.searchParams.set('majorDimension', 'ROWS');

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Sheets read failed ${res.status}: ${text}`);
  }
  return (await res.json()) as { range: string; majorDimension: string; values?: string[][] };
}

export async function appendSheetValues({
  range,
  values,
  spreadsheetId,
  valueInputOption = 'USER_ENTERED',
}: {
  range: string;
  values: string[][];
  spreadsheetId?: string;
  valueInputOption?: 'RAW' | 'USER_ENTERED';
}) {
  const token = await getAccessToken(SHEETS_SCOPE);
  const id = getSpreadsheetId(spreadsheetId);
  const url = new URL(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(id)}/values/${encodeURIComponent(range)}:append`
  );
  url.searchParams.set('valueInputOption', valueInputOption);

  const res = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ values }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Sheets append failed ${res.status}: ${text}`);
  }
  return await res.json();
}
