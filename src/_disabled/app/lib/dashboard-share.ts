'use client';
import type { Widget } from '@/app/store/dashboard-store';

export interface SharedWidget {
  type: Widget['type'];
  query: string;
  title: string;
}

export function encodeDashboardShare(name: string, widgets: SharedWidget[]): string {
  const payload = {
    name,
    widgets: widgets.map((w) => ({ type: w.type, query: w.query, title: w.title })),
  };
  return btoa(JSON.stringify(payload));
}

export function decodeDashboardShare(
  code: string,
): { name: string; widgets: SharedWidget[] } | null {
  try {
    const decoded = JSON.parse(atob(code));
    if (typeof decoded.name !== 'string' || !Array.isArray(decoded.widgets)) {
      return null;
    }
    const widgets: SharedWidget[] = [];
    for (const w of decoded.widgets) {
      if (
        typeof w.type === 'string' &&
        typeof w.query === 'string' &&
        typeof w.title === 'string'
      ) {
        widgets.push({ type: w.type as Widget['type'], query: w.query, title: w.title });
      } else {
        return null;
      }
    }
    return { name: decoded.name, widgets };
  } catch {
    return null;
  }
}
