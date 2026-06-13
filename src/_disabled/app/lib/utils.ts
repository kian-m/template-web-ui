// app/lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class names into a single string,
 * resolving conflicts between Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Rounds a number to two decimals and removes decimals if they are 0 or start with 0.
 * Used internally by other formatting helpers.
 */
function roundAndClean(value: number): number {
  if (value == null || isNaN(value)) return 0;
  const rounded = Number(value.toFixed(2));
  const firstDecimal = Math.floor(Math.abs(rounded % 1) * 10);
  return firstDecimal === 0 ? Math.round(rounded) : rounded;
}

/**
 * Formats a number with thousands separators, rounding to two decimals.
 * If the decimal portion is .00 or .0x it is omitted entirely.
 */
export function formatNumber(value: number): string {
  if (value == null || isNaN(value)) return '0';
  const num = roundAndClean(value);
  const options: Intl.NumberFormatOptions = Number.isInteger(num)
    ? { maximumFractionDigits: 0 }
    : { minimumFractionDigits: 0, maximumFractionDigits: 2 };
  return new Intl.NumberFormat('en-US', options).format(num);
}

/**
 * Formats a number as currency
 */
export function formatCurrency(value: number): string {
  if (value == null || isNaN(value)) return '$0';
  const num = roundAndClean(value);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: Number.isInteger(num) ? 0 : 2,
  }).format(num);
}

/**
 * Formats a number as a percentage
 */
export function formatPercentage(value: number): string {
  if (value == null || isNaN(value)) return '0%';
  return `${formatNumber(value)}%`;
}

/**
 * Formats a large number with K/M/B suffixes
 * e.g. 1500 -> 1.5K, 1500000 -> 1.5M
 */
export function formatCompactNumber(value: number): string {
  if (value == null || isNaN(value)) return '0';
  const formatter = Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
  });
  return formatter.format(value);
}

/**
 * Formats an ISO 8601 timestamp (e.g. 2025-07-26T19:24:30.842000Z)
 * into a human-readable string in the user's local timezone
 */
export function formatDate(value: string | Date): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  if (isNaN(date.getTime())) return String(value);
  return date.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}
