import type { DayEntry } from '../types/trackers';

/**
 * A day's score in 0..1: sum of ratings / max possible, counting missing
 * trackers as 0. So a 2-of-3 day tops out at ~0.66 even with perfect ratings.
 */
export const dayScore = (
  entry: DayEntry | undefined,
  trackerKeys: string[],
): number => {
  if (!trackerKeys.length) return 0;
  const sum = trackerKeys.reduce((acc, k) => acc + (entry?.[k] ?? 0), 0);
  return sum / (5 * trackerKeys.length);
};

/**
 * Map a 0..1 score to a colour: red → amber → muted green. Green is held back
 * (max hue 95, ^1.8 curve) so mid scores read amber rather than green.
 */
export const scoreColor = (score: number, alpha = 1): string => {
  const s = Math.max(0, Math.min(1, score));
  const hue = Math.pow(s, 1.8) * 95;
  const sat = 68 - s * 20;
  return `hsla(${Math.round(hue)}, ${Math.round(sat)}%, 50%, ${alpha})`;
};
