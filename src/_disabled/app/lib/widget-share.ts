'use client';
import type { Widget } from '@/app/store/dashboard-store';

export function encodeWidgetShare(type: Widget['type'], query: string, title: string): string {
  const payload = { type, query, title };
  return btoa(JSON.stringify(payload));
}

export function decodeWidgetShare(
  code: string,
): { type: Widget['type']; query: string; title: string } | null {
  try {
    const decoded = JSON.parse(atob(code));
    if (
      typeof decoded.type === 'string' &&
      typeof decoded.query === 'string' &&
      typeof decoded.title === 'string'
    ) {
      return {
        type: decoded.type as Widget['type'],
        query: decoded.query,
        title: decoded.title,
      };
    }
    return null;
  } catch {
    return null;
  }
}
