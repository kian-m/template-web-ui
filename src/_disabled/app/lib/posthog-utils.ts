import type { Widget } from '@/app/store/dashboard-store';

export interface PostHogApiResponse {
  results?: unknown[];
  columns?: string[];
  types?: string[];
  error?: string;
  error_code?: string;
  error_details?: unknown;
  clickhouse?: string;
}

export function formatQueryResult(widget: Widget, result: PostHogApiResponse): any {
  switch (widget.type) {
    case 'number-card': {
      let value = 0;
      if (Array.isArray(result.results) && Array.isArray(result.results[0])) {
        const firstVal = (result.results[0] as unknown[])[0];
        value = typeof firstVal === 'number' ? firstVal : Number(firstVal);
      }
      const prev = (widget.data as { previous_value?: number } | undefined)?.previous_value;
      let change = 0;
      let isPositive = true;
      if (typeof prev === 'number' && prev > 0) {
        change = ((value - prev) / prev) * 100;
        isPositive = change >= 0;
      }
      return {
        value: typeof value === 'number' ? Math.round(value) : value,
        change: Math.round(change * 10) / 10,
        isPositive,
        format: (widget.data as { format?: string } | undefined)?.format,
      };
    }
    case 'line-chart': {
      const series: Array<{ name: string; value: number }> = [];
      if (Array.isArray(result.results)) {
        for (const row of result.results) {
          if (Array.isArray(row) && row.length >= 2) {
            series.push({ name: String(row[0]), value: Number(row[1] ?? 0) });
          }
        }
      }
      return { series };
    }
    case 'bar-chart': {
      const series: Array<{ name: string; value: number }> = [];
      if (Array.isArray(result.results)) {
        for (const row of result.results) {
          if (Array.isArray(row) && row.length >= 2) {
            series.push({ name: String(row[0]), value: Number(row[1] ?? 0) });
          }
        }
      }
      return { series };
    }
    case 'pie-chart': {
      const series: Array<{ name: string; value: number }> = [];
      if (Array.isArray(result.results)) {
        for (const row of result.results) {
          if (Array.isArray(row) && row.length >= 2) {
            series.push({ name: String(row[0]), value: Number(row[1] ?? 0) });
          }
        }
      }
      return { series };
    }
    case 'data-table': {
      let columns: string[] = [];
      if (widget.data && Array.isArray((widget.data as { columns?: string[] }).columns)) {
        columns = (widget.data as { columns?: string[] }).columns || [];
      } else if (Array.isArray(result.columns)) {
        columns = result.columns;
      }
      const items: Record<string, unknown>[] = [];
      if (Array.isArray(result.results)) {
        for (const row of result.results) {
          const item: Record<string, unknown> = {};
          columns.forEach((col, idx) => {
            if (Array.isArray(row) && idx < row.length) {
              item[col] = (row as unknown[])[idx];
            }
          });
          items.push(item);
        }
      }
      return { items, columns };
    }
    default:
      return widget.data;
  }
}
