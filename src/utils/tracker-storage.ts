'use client';

import {
  DEFAULT_TRACKER_CONFIG,
  type CycleRecord,
  type DayEntry,
  type DayLog,
  type MedicationLog,
  type MedicationLogEntry,
  type Prescription,
  type SobrietyStreak,
  type SymptomLog,
  type TrackerConfig,
} from '../types/trackers';

const CONFIG_KEY = 'trackerConfig';
const DAY_LOG_KEY = 'dayLog';
const SOBRIETY_KEY = 'sobriety';
const PRESCRIPTIONS_KEY = 'prescriptions';
const MEDICATION_LOG_KEY = 'medicationLog';
const SYMPTOMS_KEY = 'symptoms';
const CYCLE_KEY = 'cycles';
const LEGACY_SLEEP_KEY = 'sleep';

const hasWindow = (): boolean => global?.window !== undefined;

const read = <T>(key: string, fallback: T): T => {
  if (!hasWindow()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key: string, value: unknown): void => {
  if (!hasWindow()) return;
  localStorage.setItem(key, JSON.stringify(value));
};

/** Coerce any stored shape (number, legacy {rating,note}, string) to a 0-5 rating. */
const toRating = (value: unknown): number => {
  if (typeof value === 'number') return clamp(value);
  if (value && typeof value === 'object' && 'rating' in value) {
    return clamp(Number((value as { rating: unknown }).rating));
  }
  return 0;
};

const clamp = (n: number): number =>
  Number.isFinite(n) ? Math.max(0, Math.min(5, Math.round(n))) : 0;

/** Local (not UTC) "YYYY-MM-DD" key for a date. */
export const toDateKey = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// ---------------------------------------------------------------------------
// Tracker config
// ---------------------------------------------------------------------------

export const getTrackerConfig = (): TrackerConfig => {
  const stored = read<Partial<TrackerConfig> | null>(CONFIG_KEY, null);
  if (!stored) return DEFAULT_TRACKER_CONFIG;
  return {
    daily: { ...DEFAULT_TRACKER_CONFIG.daily, ...(stored.daily ?? {}) },
    sobriety: {
      ...DEFAULT_TRACKER_CONFIG.sobriety,
      ...(stored.sobriety ?? {}),
    },
    medications: {
      ...DEFAULT_TRACKER_CONFIG.medications,
      ...(stored.medications ?? {}),
    },
    symptoms: {
      ...DEFAULT_TRACKER_CONFIG.symptoms,
      ...(stored.symptoms ?? {}),
    },
    cycle: {
      ...DEFAULT_TRACKER_CONFIG.cycle,
      ...(stored.cycle ?? {}),
      phases: {
        ...DEFAULT_TRACKER_CONFIG.cycle.phases,
        ...(stored.cycle?.phases ?? {}),
      },
    },
  };
};

export const saveTrackerConfig = (config: TrackerConfig): void => {
  write(CONFIG_KEY, config);
};

/** Daily-tracker keys that are currently enabled, in stable order. */
export const getEnabledDailyTrackers = (
  config: TrackerConfig = getTrackerConfig(),
): string[] =>
  Object.keys(config.daily).filter((key) => config.daily[key].enabled);

/** The core trackers that are always logged each day, regardless of toggles. */
export const CORE_DAILY_TRACKERS = ['sleep', 'workout', 'food'];

/**
 * Trackers shown when logging a day (editor / calendar / strip): the core
 * three are always present; the enable toggles only govern the home-screen
 * quick buttons. Custom enabled trackers are appended.
 */
export const getLoggableTrackers = (
  config: TrackerConfig = getTrackerConfig(),
): string[] =>
  Object.keys(config.daily).filter(
    (key) => CORE_DAILY_TRACKERS.includes(key) || config.daily[key].enabled,
  );

// ---------------------------------------------------------------------------
// Day log (1-5 rating per tracker per day)
// ---------------------------------------------------------------------------

export const getDayLog = (): DayLog => {
  migrateLegacySleep();
  const raw = read<Record<string, Record<string, unknown>>>(DAY_LOG_KEY, {});
  // Normalize any legacy {rating,note} entries to plain numbers.
  const log: DayLog = {};
  for (const [date, entry] of Object.entries(raw)) {
    const day: DayEntry = {};
    for (const [key, value] of Object.entries(entry ?? {})) {
      const rating = toRating(value);
      if (rating > 0) day[key] = rating;
    }
    log[date] = day;
  }
  return log;
};

export const getDayEntry = (date: string): DayEntry => getDayLog()[date] ?? {};

export const getRating = (date: string, trackerKey: string): number =>
  getDayEntry(date)[trackerKey] ?? 0;

export const setRating = (
  date: string,
  trackerKey: string,
  rating: number,
): void => {
  const log = getDayLog();
  const day = { ...(log[date] ?? {}) };
  const value = clamp(rating);
  if (value > 0) day[trackerKey] = value;
  else delete day[trackerKey];
  if (Object.keys(day).length) log[date] = day;
  else delete log[date];
  write(DAY_LOG_KEY, log);
};

/** Replace all of a day's ratings at once (used by the day editor). */
export const setDayEntry = (date: string, entry: DayEntry): void => {
  const log = getDayLog();
  const day: DayEntry = {};
  for (const [key, value] of Object.entries(entry)) {
    const rating = clamp(value);
    if (rating > 0) day[key] = rating;
  }
  if (Object.keys(day).length) log[date] = day;
  else delete log[date];
  write(DAY_LOG_KEY, log);
};

// ---------------------------------------------------------------------------
// Sobriety streaks
// ---------------------------------------------------------------------------

export const getSobrietyStreaks = (): SobrietyStreak[] =>
  read<SobrietyStreak[]>(SOBRIETY_KEY, []);

export const saveSobrietyStreaks = (streaks: SobrietyStreak[]): void => {
  write(SOBRIETY_KEY, streaks);
};

/** Whole days elapsed since the streak's start date (>= 0). */
export const daysSober = (
  streak: SobrietyStreak,
  now: Date = new Date(),
): number => {
  const [y, m, d] = streak.startDate.split('-').map(Number);
  if (!y || !m || !d) return 0;
  const start = new Date(y, m - 1, d);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffMs = today.getTime() - start.getTime();
  return Math.max(0, Math.floor(diffMs / 86_400_000));
};

// ---------------------------------------------------------------------------
// Medication tracking
// ---------------------------------------------------------------------------

export const getPrescriptions = (): Prescription[] =>
  read<Prescription[]>(PRESCRIPTIONS_KEY, []).filter(
    (prescription) => prescription.id && prescription.label,
  );

export const savePrescriptions = (prescriptions: Prescription[]): void => {
  write(PRESCRIPTIONS_KEY, prescriptions);
};

export const getMedicationLog = (): MedicationLog => {
  const raw = read<Record<string, Record<string, unknown>>>(
    MEDICATION_LOG_KEY,
    {},
  );
  const log: MedicationLog = {};
  for (const [date, entry] of Object.entries(raw)) {
    const day: MedicationLogEntry = {};
    for (const [prescriptionId, taken] of Object.entries(entry ?? {})) {
      if (taken === true) day[prescriptionId] = true;
    }
    if (Object.keys(day).length) log[date] = day;
  }
  return log;
};

export const getMedicationLogForDate = (date: string): MedicationLogEntry =>
  getMedicationLog()[date] ?? {};

export const setMedicationTaken = (
  date: string,
  prescriptionId: string,
  taken: boolean,
): void => {
  const log = getMedicationLog();
  const day = { ...(log[date] ?? {}) };
  if (taken) day[prescriptionId] = true;
  else delete day[prescriptionId];
  if (Object.keys(day).length) log[date] = day;
  else delete log[date];
  write(MEDICATION_LOG_KEY, log);
};

// ---------------------------------------------------------------------------
// Symptom diary (body map) — 1-5 severity per region per day
// ---------------------------------------------------------------------------

export const getSymptomLog = (): SymptomLog => {
  const raw = read<Record<string, Record<string, unknown>>>(SYMPTOMS_KEY, {});
  const log: SymptomLog = {};
  for (const [date, day] of Object.entries(raw)) {
    const regions: Record<string, number> = {};
    for (const [region, value] of Object.entries(day ?? {})) {
      const severity = toRating(value);
      if (severity > 0) regions[region] = severity;
    }
    if (Object.keys(regions).length) log[date] = regions;
  }
  return log;
};

export const getSymptomsForDate = (date: string): Record<string, number> =>
  getSymptomLog()[date] ?? {};

export const setSymptomSeverity = (
  date: string,
  regionKey: string,
  severity: number,
): void => {
  const log = getSymptomLog();
  const day = { ...(log[date] ?? {}) };
  const value = clamp(severity);
  if (value > 0) day[regionKey] = value;
  else delete day[regionKey];
  if (Object.keys(day).length) log[date] = day;
  else delete log[date];
  write(SYMPTOMS_KEY, log);
};

// ---------------------------------------------------------------------------
// Menstrual cycle records
// ---------------------------------------------------------------------------

export const getCycles = (): CycleRecord[] =>
  read<CycleRecord[]>(CYCLE_KEY, []);

export const saveCycles = (cycles: CycleRecord[]): void => {
  write(CYCLE_KEY, cycles);
};

// ---------------------------------------------------------------------------
// Reset / clear data (per section, or everything)
// ---------------------------------------------------------------------------

export type ResetSection =
  | 'daily'
  | 'sobriety'
  | 'medications'
  | 'symptoms'
  | 'cycles'
  | 'all';

const SECTION_KEYS: Record<Exclude<ResetSection, 'all'>, string> = {
  daily: DAY_LOG_KEY,
  sobriety: SOBRIETY_KEY,
  medications: MEDICATION_LOG_KEY,
  symptoms: SYMPTOMS_KEY,
  cycles: CYCLE_KEY,
};

/** Clear logged data for one section, or all of it. Keeps tracker settings. */
export const clearTrackerData = (section: ResetSection): void => {
  if (!hasWindow()) return;
  if (section === 'all') {
    [
      DAY_LOG_KEY,
      SOBRIETY_KEY,
      PRESCRIPTIONS_KEY,
      MEDICATION_LOG_KEY,
      SYMPTOMS_KEY,
      CYCLE_KEY,
      LEGACY_SLEEP_KEY,
    ].forEach((k) => localStorage.removeItem(k));
  } else {
    localStorage.removeItem(SECTION_KEYS[section]);
  }
};

// ---------------------------------------------------------------------------
// Migration: legacy `sleep` key (date -> score) into dayLog.sleep
// ---------------------------------------------------------------------------

let migrationDone = false;

export const migrateLegacySleep = (): void => {
  if (migrationDone || !hasWindow()) return;
  migrationDone = true;
  const legacy = read<Record<string, number> | null>(LEGACY_SLEEP_KEY, null);
  if (!legacy || !Object.keys(legacy).length) return;
  const log = read<Record<string, Record<string, unknown>>>(DAY_LOG_KEY, {});
  let changed = false;
  for (const [date, score] of Object.entries(legacy)) {
    if (log[date]?.sleep === undefined) {
      log[date] = { ...(log[date] ?? {}), sleep: clamp(Number(score)) };
      changed = true;
    }
  }
  if (changed) write(DAY_LOG_KEY, log);
};
