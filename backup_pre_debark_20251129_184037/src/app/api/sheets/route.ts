import { NextRequest, NextResponse } from 'next/server';
import { appendSheetValues, getSheetValues } from '../../../services/googleSheets';

// GET /api/sheets?range=Sheet1!A1:C10
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const range = searchParams.get('range') || 'Sheet1!A1:C10';
    const data = await getSheetValues({ range });
    return NextResponse.json({ ok: true, data });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Unknown error' }, { status: 500 });
  }
}

// POST /api/sheets  body: { range: string, values: string[][], valueInputOption?: 'RAW'|'USER_ENTERED' }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { range, values, valueInputOption } = body || {};
    if (!range || !Array.isArray(values)) {
      return NextResponse.json({ ok: false, error: 'range and values are required' }, { status: 400 });
    }
    const result = await appendSheetValues({ range, values, valueInputOption });
    return NextResponse.json({ ok: true, result });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Unknown error' }, { status: 500 });
  }
}
