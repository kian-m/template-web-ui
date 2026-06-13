import { NextRequest, NextResponse } from 'next/server';

type ImportRequest = {
  baseId?: string;
  table?: string; // table name or ID
  records: Record<string, string>[];
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ImportRequest;
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = body.baseId || process.env.AIRTABLE_BASE_ID;
    const table = body.table || process.env.AIRTABLE_TABLE_NAME;

    if (!apiKey || !baseId || !table) {
      return NextResponse.json(
        {
          error: 'Missing Airtable configuration',
          required: [
            'AIRTABLE_API_KEY',
            'AIRTABLE_BASE_ID',
            'AIRTABLE_TABLE_NAME',
          ],
        },
        { status: 400 },
      );
    }

    if (!Array.isArray(body.records) || body.records.length === 0) {
      return NextResponse.json(
        { error: 'No records provided' },
        { status: 400 },
      );
    }

    // Airtable API: POST https://api.airtable.com/v0/{baseId}/{tableName}
    const url = `https://api.airtable.com/v0/${encodeURIComponent(baseId)}/${encodeURIComponent(
      table,
    )}`;

    const payload = {
      records: body.records.map((fields) => ({ fields })),
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Airtable error', details: data },
        { status: res.status },
      );
    }

    return NextResponse.json({
      success: true,
      inserted: data.records?.length ?? 0,
      data,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
