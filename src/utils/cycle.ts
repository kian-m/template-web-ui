import type { CyclePhaseName, CycleRecord } from '../types/trackers';
import { toDateKey } from './tracker-storage';

// Sensible defaults until the user has logged enough of their own data.
const DEFAULT_CYCLE_LENGTH = 28;
const DEFAULT_PERIOD_LENGTH = 5;
const LUTEAL_PHASE = 14; // days from ovulation to the next period
const FUTURE_CYCLES = 3; // how many cycles ahead to predict

// Physiologic bounds — gaps outside this are treated as missed logs / anomalies
// (e.g. a "way late" cycle) and ignored so they don't drag the cadence.
const MIN_CYCLE = 21;
const MAX_CYCLE = 38;
const MIN_PERIOD = 2;
const MAX_PERIOD = 10;

// Exponential smoothing: each new in-range cycle only nudges the estimate ~20%,
// so the cadence is "sticky" and hard to swing with one odd cycle.
const SMOOTHING = 0.2;
const WINDOW_SAMPLES = 12; // recent cycles used to size the prediction window

const clamp = (n: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, n));

// --- date helpers (local, string-keyed) -----------------------------------

const parse = (key: string): Date => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
};
const addDays = (key: string, n: number): string => {
  const d = parse(key);
  d.setDate(d.getDate() + n);
  return toDateKey(d);
};
const diffDays = (a: string, b: string): number =>
  Math.round((parse(a).getTime() - parse(b).getTime()) / 86_400_000);
const mean = (xs: number[]): number =>
  xs.reduce((a, b) => a + b, 0) / xs.length;

// --- pure mutations (used by the day editor) --------------------------------

const byStart = (a: CycleRecord, b: CycleRecord) =>
  a.start < b.start ? -1 : a.start > b.start ? 1 : 0;

export const markStart = (cycles: CycleRecord[], date: string): CycleRecord[] => {
  if (cycles.some((c) => c.start === date)) return cycles;
  return [...cycles, { start: date }].sort(byStart);
};

/** Close the most recent open cycle that started on/before `date`. */
export const markEnd = (cycles: CycleRecord[], date: string): CycleRecord[] => {
  const open = [...cycles]
    .filter((c) => !c.end && c.start <= date)
    .sort(byStart)
    .pop();
  if (!open) return cycles;
  return cycles.map((c) => (c === open ? { ...c, end: date } : c));
};

/** Remove a start (drops the record) or clear an end (re-opens the cycle). */
export const unmarkDay = (cycles: CycleRecord[], date: string): CycleRecord[] => {
  if (cycles.some((c) => c.start === date))
    return cycles.filter((c) => c.start !== date);
  return cycles.map((c) => (c.end === date ? { start: c.start } : c));
};

// --- prediction -------------------------------------------------------------

export interface CycleCalendar {
  /** dateKey → which phase that day falls in (logged or predicted). */
  dayPhase: Map<string, CyclePhaseName>;
  /** Subset of menstrual days that come from logged data (vs predicted). */
  loggedPeriod: Set<string>;
  avgCycleLength: number;
  avgPeriodLength: number;
  nextStart: string | null; // point estimate
  nextWindowStart: string | null; // earliest the next period might begin
  nextWindowEnd: string | null; // latest it might begin
  based: 'data' | 'default' | 'none';
}

const setPhase = (
  map: Map<string, CyclePhaseName>,
  from: string,
  to: string,
  phase: CyclePhaseName,
) => {
  for (let d = from; d <= to; d = addDays(d, 1)) map.set(d, phase);
};
const addRange = (set: Set<string>, from: string, to: string) => {
  for (let d = from; d <= to; d = addDays(d, 1)) set.add(d);
};

/** Build the logged + predicted phase picture used to colour the calendar. */
export const buildCycleCalendar = (cycles: CycleRecord[]): CycleCalendar => {
  const cal: CycleCalendar = {
    dayPhase: new Map(),
    loggedPeriod: new Set(),
    avgCycleLength: DEFAULT_CYCLE_LENGTH,
    avgPeriodLength: DEFAULT_PERIOD_LENGTH,
    nextStart: null,
    nextWindowStart: null,
    nextWindowEnd: null,
    based: 'none',
  };

  const sorted = [...cycles].filter((c) => c.start).sort(byStart);
  if (!sorted.length) return cal;

  const starts = sorted.map((c) => c.start);

  // Gaps between consecutive starts, keeping only physiologically plausible
  // ones (21–38d). Anything outside is a missed log / "way late" cycle — ignored.
  const gaps: number[] = [];
  for (let i = 1; i < starts.length; i++) gaps.push(diffDays(starts[i], starts[i - 1]));
  const validGaps = gaps.filter((g) => g >= MIN_CYCLE && g <= MAX_CYCLE);

  if (validGaps.length) {
    // Sticky weighted (exponential) average — recent cycles count more, but one
    // odd cycle barely moves it. Clamped to the 21–38 range.
    let est = DEFAULT_CYCLE_LENGTH;
    for (const g of validGaps) est += SMOOTHING * (g - est);
    cal.avgCycleLength = clamp(Math.round(est), MIN_CYCLE, MAX_CYCLE);
    cal.based = 'data';
  } else {
    cal.based = 'default';
  }

  // Period length: average of logged spans (clamped to a sane range).
  const periodLens = sorted
    .filter((c) => c.end)
    .map((c) => diffDays(c.end as string, c.start) + 1)
    .filter((n) => n >= MIN_PERIOD && n <= MAX_PERIOD);
  if (periodLens.length) {
    cal.avgPeriodLength = clamp(Math.round(mean(periodLens)), MIN_PERIOD, MAX_PERIOD);
  }

  const recordByStart = new Map(sorted.map((c) => [c.start, c]));

  // Logged period spans (so they can render solid vs dashed predictions).
  for (const c of sorted) {
    if (c.end) addRange(cal.loggedPeriod, c.start, c.end);
    else addRange(cal.loggedPeriod, c.start, addDays(c.start, cal.avgPeriodLength - 1));
  }

  // Prediction window: as wide as the user's recent variability (e.g. 24…38).
  const lastStart = starts[starts.length - 1];
  let windowLow = cal.avgCycleLength;
  let windowHigh = cal.avgCycleLength;
  if (validGaps.length) {
    const recent = validGaps.slice(-WINDOW_SAMPLES);
    windowLow = clamp(Math.min(...recent, cal.avgCycleLength), MIN_CYCLE, MAX_CYCLE);
    windowHigh = clamp(Math.max(...recent, cal.avgCycleLength), MIN_CYCLE, MAX_CYCLE);
  }
  cal.nextStart = addDays(lastStart, cal.avgCycleLength);
  cal.nextWindowStart = addDays(lastStart, windowLow);
  cal.nextWindowEnd = addDays(lastStart, windowHigh);

  // Anchor starts = logged starts + a few predicted future starts (point est).
  const anchors = [...starts];
  for (let n = 1; n <= FUTURE_CYCLES; n++) {
    anchors.push(addDays(lastStart, n * cal.avgCycleLength));
  }

  // Walk each cycle interval [S, Snext) and label every day with its phase.
  for (let i = 0; i < anchors.length - 1; i++) {
    const S = anchors[i];
    const Snext = anchors[i + 1];
    const rec = recordByStart.get(S);
    const periodLen = rec?.end ? diffDays(rec.end, S) + 1 : cal.avgPeriodLength;

    const periodEnd = addDays(S, periodLen - 1);
    const ov = addDays(Snext, -LUTEAL_PHASE); // ovulation ~14 days before next
    const ovStart = addDays(ov, -1);
    const ovEnd = addDays(ov, 1);

    // Luteal first (lowest priority), then earlier phases overwrite it.
    setPhase(cal.dayPhase, addDays(ovEnd, 1), addDays(Snext, -1), 'luteal');
    if (ovStart > periodEnd) setPhase(cal.dayPhase, addDays(periodEnd, 1), addDays(ovStart, -1), 'follicular');
    setPhase(cal.dayPhase, ovStart, ovEnd, 'ovulation');
    setPhase(cal.dayPhase, S, periodEnd, 'menstrual');
  }

  // Widen the *next* predicted period to the full uncertainty window so a
  // variable cycle shows a correspondingly large "could start here" band.
  setPhase(
    cal.dayPhase,
    cal.nextWindowStart,
    addDays(cal.nextWindowEnd, cal.avgPeriodLength - 1),
    'menstrual',
  );

  return cal;
};

export const phaseFor = (
  cal: CycleCalendar,
  dateKey: string,
): CyclePhaseName | null => cal.dayPhase.get(dateKey) ?? null;

export const isLoggedPeriod = (cal: CycleCalendar, dateKey: string): boolean =>
  cal.loggedPeriod.has(dateKey);

export const PHASE_LABEL: Record<CyclePhaseName, string> = {
  menstrual: 'Menstrual',
  follicular: 'Follicular',
  ovulation: 'Ovulation',
  luteal: 'Luteal',
};

/** Phase + 1-based day-of-cycle for a date (null if outside the known window). */
export const phaseInfo = (
  cycles: CycleRecord[],
  dateKey: string,
): { phase: CyclePhaseName; label: string; dayOfCycle: number | null } | null => {
  const cal = buildCycleCalendar(cycles);
  const phase = phaseFor(cal, dateKey);
  if (!phase) return null;

  // Day of cycle = days since the most recent start on/before the date.
  const priorStarts = cycles
    .map((c) => c.start)
    .filter((s) => s <= dateKey)
    .sort();
  const lastStart = priorStarts[priorStarts.length - 1];
  const dayOfCycle = lastStart ? diffDays(dateKey, lastStart) + 1 : null;

  return { phase, label: PHASE_LABEL[phase], dayOfCycle };
};
