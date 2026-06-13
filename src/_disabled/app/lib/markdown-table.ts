export type MarkdownTable = {
  headers: string[];
  rows: string[][];
};

export function isMarkdownTable(content: string): boolean {
  // Basic detection: a header row with pipes and a separator row of dashes
  const lines = content.split(/\r?\n/).map((l) => l.trim());
  for (let i = 0; i < lines.length - 1; i++) {
    const a = lines[i];
    const b = lines[i + 1];
    if (
      a.includes('|') &&
      /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(b)
    ) {
      return true;
    }
  }
  return false;
}

export function parseMarkdownTable(content: string): MarkdownTable | null {
  const lines = content
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  let headerIndex = -1;
  for (let i = 0; i < lines.length - 1; i++) {
    const a = lines[i];
    const b = lines[i + 1];
    if (
      a.includes('|') &&
      /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(b)
    ) {
      headerIndex = i;
      break;
    }
  }

  if (headerIndex === -1) return null;

  const headerLine = lines[headerIndex];
  const dataLines: string[] = [];
  for (let i = headerIndex + 2; i < lines.length; i++) {
    if (lines[i].includes('|')) dataLines.push(lines[i]);
    else break;
  }

  const headers = splitRow(headerLine).map((h) => cleanCell(h));
  const rows = dataLines.map((l) => splitRow(l).map((c) => cleanCell(c)));

  // Normalize row length to headers length
  const normalizedRows = rows.map((r) => {
    if (r.length < headers.length)
      return [...r, ...Array(headers.length - r.length).fill('')];
    if (r.length > headers.length) return r.slice(0, headers.length);
    return r;
  });

  return { headers, rows: normalizedRows };
}

function splitRow(line: string): string[] {
  // Remove leading/trailing pipes and split by | not within backticks
  const trimmed = line.replace(/^\|/, '').replace(/\|$/, '');
  return trimmed
    .split('|')
    .map((s) => s.trim())
    .filter((s) => s.length > 0 || trimmed.includes('||'));
}

function cleanCell(cell: string): string {
  // Remove markdown emphasis/backticks and normalize spaces
  return cell
    .replace(/^`|`$/g, '')
    .replace(/^\*+|\*+$/g, '')
    .replace(/^_+|_+$/g, '')
    .trim();
}

export function tableToObjects(table: MarkdownTable): Record<string, string>[] {
  const { headers, rows } = table;
  return rows.map((r) => {
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => {
      obj[h] = (r[i] ?? '').trim();
    });
    return obj;
  });
}

export function objectsToCsv(objs: Record<string, string>[]): string {
  if (!objs.length) return '';
  const headers = Object.keys(objs[0]);
  const escape = (v: string) => {
    const needsQuotes = /[",\n]/.test(v);
    const escaped = v.replace(/"/g, '""');
    return needsQuotes ? `"${escaped}"` : escaped;
  };
  const headerLine = headers.map(escape).join(',');
  const lines = objs.map((o) =>
    headers.map((h) => escape(String(o[h] ?? ''))).join(','),
  );
  return [headerLine, ...lines].join('\n');
}
