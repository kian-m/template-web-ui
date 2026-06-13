'use client';

import React, { useState } from 'react';

type ReadResult = {
  ok: boolean;
  data?: { values?: string[][] };
  error?: string;
};

type AppendResult = { ok: boolean; result?: unknown; error?: string };

export default function Admin() {
  const [range, setRange] = useState('Sheet1!A1:C10');
  const [readLoading, setReadLoading] = useState(false);
  const [readResult, setReadResult] = useState<ReadResult | null>(null);

  const [appendRange, setAppendRange] = useState('Sheet1!A:C');
  const [appendRows, setAppendRows] = useState('2025-01-01,Workout,OK');
  const [appendLoading, setAppendLoading] = useState(false);
  const [appendResult, setAppendResult] = useState<AppendResult | null>(null);

  const onRead = async () => {
    setReadLoading(true);
    setReadResult(null);
    try {
      const res = await fetch(`/api/sheets?range=${encodeURIComponent(range)}`);
      const json = (await res.json()) as ReadResult;
      setReadResult(json);
    } catch (e: any) {
      setReadResult({ ok: false, error: e?.message || 'Request failed' });
    } finally {
      setReadLoading(false);
    }
  };

  const onAppend = async () => {
    setAppendLoading(true);
    setAppendResult(null);
    try {
      // Support multiple lines; CSV split by comma per line
      const values = appendRows
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => line.split(',').map((c) => c.trim()));

      const res = await fetch('/api/sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ range: appendRange, values, valueInputOption: 'USER_ENTERED' }),
      });
      const json = (await res.json()) as AppendResult;
      setAppendResult(json);
    } catch (e: any) {
      setAppendResult({ ok: false, error: e?.message || 'Request failed' });
    } finally {
      setAppendLoading(false);
    }
  };

  return (
    <div style={{ padding: 24, color: 'white' }}>
      <h1 style={{ fontSize: 24, marginBottom: 16 }}>Sheets Admin</h1>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>Read Values</h2>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
          <label htmlFor="range">Range</label>
          <input
            id="range"
            value={range}
            onChange={(e) => setRange(e.target.value)}
            style={{ color: 'black', padding: '6px 8px', borderRadius: 6 }}
          />
          <button onClick={onRead} disabled={readLoading} style={{ padding: '6px 10px', borderRadius: 6 }}>
            {readLoading ? 'Loading…' : 'Read'}
          </button>
        </div>
        {readResult && (
          <pre style={{ background: 'rgba(255,255,255,0.1)', padding: 12, borderRadius: 8, overflow: 'auto' }}>
            {JSON.stringify(readResult, null, 2)}
          </pre>
        )}
      </section>

      <section>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>Append Rows</h2>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
          <label htmlFor="appendRange">Range</label>
          <input
            id="appendRange"
            value={appendRange}
            onChange={(e) => setAppendRange(e.target.value)}
            style={{ color: 'black', padding: '6px 8px', borderRadius: 6 }}
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label htmlFor="rows">Rows (CSV per line)</label>
          <textarea
            id="rows"
            rows={4}
            value={appendRows}
            onChange={(e) => setAppendRows(e.target.value)}
            style={{ width: '100%', color: 'black', padding: 8, borderRadius: 6, marginTop: 4 }}
          />
        </div>
        <button onClick={onAppend} disabled={appendLoading} style={{ padding: '6px 10px', borderRadius: 6 }}>
          {appendLoading ? 'Appending…' : 'Append'}
        </button>
        {appendResult && (
          <pre style={{ background: 'rgba(255,255,255,0.1)', padding: 12, borderRadius: 8, overflow: 'auto', marginTop: 8 }}>
            {JSON.stringify(appendResult, null, 2)}
          </pre>
        )}
      </section>
    </div>
  );
}

