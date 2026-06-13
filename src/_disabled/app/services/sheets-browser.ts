export type SheetKeyValues = Record<string, string>;

export async function readKeyValuesFromSheet(params: {
  accessToken: string;
  spreadsheetId: string;
  range?: string; // default Config!A:B
}): Promise<SheetKeyValues> {
  const { accessToken, spreadsheetId, range = 'Config!A:B' } = params;
  const url = new URL(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(
      range,
    )}`,
  );
  url.searchParams.set('majorDimension', 'ROWS');
  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Sheets read failed ${res.status}: ${text}`);
  }
  const json = (await res.json()) as { values?: string[][] };
  const values = json.values || [];
  const kv: SheetKeyValues = {};
  for (const row of values) {
    if (!row || row.length < 2) continue;
    const key = String(row[0] || '').trim();
    const val = String(row[1] || '').trim();
    if (key) kv[key] = val;
  }
  return kv;
}

export async function upsertEncryptedKeys(params: {
  accessToken: string;
  spreadsheetId: string;
  userKey: string; // user identifier (e.g., Google sub)
  cipherB64: string;
  ivB64: string;
  sheetName?: string; // default 'Config'
}): Promise<void> {
  const { accessToken, spreadsheetId, userKey, cipherB64, ivB64, sheetName = 'Config' } = params;
  // 1) Read first column to find existing row
  const urlBase = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}`;
  const colRes = await fetch(`${urlBase}/values/${encodeURIComponent(sheetName + '!A:A')}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!colRes.ok) throw new Error(`Sheets read col failed ${colRes.status}`);
  const colJson = (await colRes.json()) as { values?: string[][] };
  const values = colJson.values || [];
  let rowIndex = -1;
  for (let i = 0; i < values.length; i++) {
    const cell = (values[i] && values[i][0]) || '';
    if (String(cell).trim() === userKey) {
      rowIndex = i + 1; // 1-based row number
      break;
    }
  }

  if (rowIndex === -1) {
    // Append new row
    const appendUrl = new URL(`${urlBase}/values/${encodeURIComponent(sheetName + '!A:C')}:append`);
    appendUrl.searchParams.set('valueInputOption', 'RAW');
    const res = await fetch(appendUrl.toString(), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values: [[userKey, cipherB64, ivB64]] }),
    });
    if (!res.ok) throw new Error(`Sheets append failed ${res.status}`);
    return;
  }

  // Update existing row
  const range = `${sheetName}!A${rowIndex}:C${rowIndex}`;
  const updateUrl = new URL(`${urlBase}/values/${encodeURIComponent(range)}`);
  updateUrl.searchParams.set('valueInputOption', 'RAW');
  const res = await fetch(updateUrl.toString(), {
    method: 'PUT',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ values: [[userKey, cipherB64, ivB64]] }),
  });
  if (!res.ok) throw new Error(`Sheets update failed ${res.status}`);
}

