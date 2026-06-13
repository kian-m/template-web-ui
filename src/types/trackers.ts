// Shared types for the configurable health-tracking features.
// All data is persisted client-side in localStorage (no backend).
//
// Everything is a 1-5 scale (0 = unset). No free text anywhere.

/** Icon keys understood by the UI (mapped to FontAwesome icons where rendered). */
export type TrackerIcon = 'moon' | 'dumbbell' | 'utensils' | 'heart' | 'star';

/** A daily-rating tracker shown on each calendar day. */
export interface DailyTrackerConfig {
  enabled: boolean;
  label: string;
  icon: TrackerIcon;
}

/** The known built-in daily trackers. Custom keys are allowed too. */
export type DailyTrackerKey = 'sleep' | 'workout' | 'food' | string;

export interface TrackerConfig {
  daily: Record<DailyTrackerKey, DailyTrackerConfig>;
  /** Show the sobriety day-counter button on the main page. */
  sobriety: { enabled: boolean };
  /** Show the body-map symptom diary button on the main page. */
  symptoms: { enabled: boolean };
}

/** A day's tracker ratings, keyed by daily-tracker key. Value is 1-5 (0 = unset). */
export type DayEntry = Record<DailyTrackerKey, number>;

/** Map of "YYYY-MM-DD" -> that day's ratings. */
export type DayLog = Record<string, DayEntry>;

/** A sobriety streak the user is counting days for. */
export interface SobrietyStreak {
  id: string;
  label: string;
  startDate: string; // "YYYY-MM-DD"
}

/** Body-map views. Region keys are stored as "<view>:<region>" e.g. "front:chest". */
export type BodyView = 'front' | 'back';

/** Map of "YYYY-MM-DD" -> { "front:chest": severity 1-5, ... }. */
export type SymptomLog = Record<string, Record<string, number>>;

export const DEFAULT_TRACKER_CONFIG: TrackerConfig = {
  daily: {
    sleep: { enabled: true, label: 'Sleep', icon: 'moon' },
    workout: { enabled: true, label: 'Workout', icon: 'dumbbell' },
    food: { enabled: true, label: 'Eating', icon: 'utensils' },
  },
  sobriety: { enabled: false },
  symptoms: { enabled: false },
};
