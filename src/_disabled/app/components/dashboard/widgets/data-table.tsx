'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import WidgetShell from './widget-shell';
import { formatDate, formatNumber } from '@/app/lib/utils';
import { usePostHog } from 'posthog-js/react';

type StatusType = 'active' | 'pending' | 'inactive';

interface Column {
  key: string;
  title: string;
  type?: string;
  format?: string;
  prefix?: string;
  suffix?: string;
  width?: string;
}

interface DataTableProps {
  title: string;
  data: Record<string, unknown>[];
  columns?: (Column | string)[];
  widgetId: string;
  onRefresh?: () => void;
  onViewDetails?: () => void;
  onDragStart?: () => void;
}

export default function DataTable({
  title,
  data,
  columns: providedColumns,
  widgetId,
  onRefresh,
  onViewDetails,
  onDragStart,
}: DataTableProps) {
  // Use provided columns or generate from data
  const columns =
    providedColumns ||
    (data.length > 0
      ? Object.keys(data[0]).map((key) => ({
          key,
          title: key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
          type: 'string',
        }))
      : []);
  
  // Ensure columns are always objects, not strings
  const normalizedColumns: Column[] = columns.map((col) =>
    typeof col === 'string' 
      ? { key: col, title: col.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()), type: 'string' }
      : col
  );
  const posthog = usePostHog();

  // Get accent color for tinting
  const getAccentTint = () => {
    const root = document.documentElement;
    const accentColor = root.style.getPropertyValue('--chart-color-1') || '#1d4aff';
    // Convert to RGB and apply low opacity for tinting
    const hex = accentColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgba(${r}, ${g}, ${b}, 0.04)`;
  };

  const formatHeader = (col: Column) => col.title || col.key;

  const renderCell = (value: unknown, col: Column) => {
    const key = col.key;
    if (
      key.toLowerCase().includes('status') &&
      typeof value === 'string' &&
      ['active', 'pending', 'inactive'].includes(value)
    ) {
      return <StatusBadge status={value as StatusType} />;
    }

    if (key.toLowerCase().includes('session_replay') && typeof value === 'string') {
      return (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-700 hover:text-gray-900 hover:underline focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none dark:text-gray-300 dark:hover:text-white dark:focus:ring-gray-400"
          aria-label={`Open session replay in new tab: ${value}`}
          role="link"
        >
          View Session Replay
        </a>
      );
    }

    if (typeof value === 'number') {
      return formatNumber(value);
    }

    if (typeof value === 'string') {
      const date = new Date(value);
      if (!isNaN(date.getTime()) && value.includes('T')) {
        return formatDate(date);
      }
    }

    return String(value);
  };

  return (
    <WidgetShell
      title={title}
      widgetId={widgetId}
      onRefresh={onRefresh}
      onViewDetails={onViewDetails}
      onDragStart={onDragStart}
      scrollContent
    >
      <div className="w-full flex-1 overflow-x-auto" role="region" aria-label="Data table">
        <Table className="w-full text-sm" role="table" aria-label={`${title} data table`}>
          <TableHeader>
            <TableRow
              className="border-gray-200 hover:bg-transparent dark:border-gray-700"
              role="row"
            >
              {normalizedColumns.map((col) => (
                <TableHead
                  key={col.key}
                  className="px-2 py-1 whitespace-nowrap text-gray-600 dark:text-gray-400"
                  role="columnheader"
                  scope="col"
                  style={{ width: col && typeof col === 'object' && 'width' in col ? col.width : undefined }}
                >
                  {formatHeader(col)}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody role="rowgroup">
            {data.map((row, rowIndex) => (
              <TableRow
                key={'id' in row ? String(row.id) : String(rowIndex)}
                className="cursor-pointer border-gray-200 hover:bg-gray-100/50 focus:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-inset dark:border-gray-700 dark:hover:bg-gray-700/50 dark:focus:bg-gray-700"
                style={{
                  backgroundColor: rowIndex % 2 === 1 ? getAccentTint() : 'transparent',
                }}
                onClick={() =>
                  posthog?.capture('table_row_click', { widget_id: widgetId, row_index: rowIndex })
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    posthog?.capture('table_row_click', {
                      widget_id: widgetId,
                      row_index: rowIndex,
                    });
                  }
                }}
                tabIndex={0}
                role="row"
                aria-rowindex={rowIndex + 2}
                aria-label={`Table row ${rowIndex + 1}`}
              >
                {normalizedColumns.map((col, colIndex) => (
                  <TableCell
                    key={col.key}
                    className="px-2 py-1 whitespace-nowrap text-gray-900 dark:text-white"
                    role="cell"
                    aria-describedby={`col-${colIndex}-header`}
                  >
                    {renderCell(row[col.key], col)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </WidgetShell>
  );
}

interface StatusBadgeProps {
  status: StatusType;
}

function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    active:
      'bg-gray-100 dark:bg-gray-800/30 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800/40',
    pending:
      'bg-gray-200 dark:bg-gray-700/30 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700/40',
    inactive:
      'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600',
  };

  return (
    <Badge variant="outline" className={`${styles[status]} border-none font-normal`}>
      {status && status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}