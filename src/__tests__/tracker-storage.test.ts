import {
  daysSober,
  getTrackerConfig,
  saveTrackerConfig,
  getEnabledDailyTrackers,
  getDayEntry,
  getRating,
  setRating,
  setDayEntry,
  getSobrietyStreaks,
  saveSobrietyStreaks,
  getSymptomsForDate,
  setSymptomSeverity,
  toDateKey,
} from '@/utils/tracker-storage';
import { DEFAULT_TRACKER_CONFIG } from '@/types/trackers';

beforeEach(() => {
  localStorage.clear();
});

describe('toDateKey', () => {
  it('formats a date as local YYYY-MM-DD', () => {
    expect(toDateKey(new Date(2026, 0, 5))).toBe('2026-01-05');
    expect(toDateKey(new Date(2025, 11, 31))).toBe('2025-12-31');
  });
});

describe('tracker config', () => {
  it('returns defaults when nothing is stored', () => {
    expect(getTrackerConfig()).toEqual(DEFAULT_TRACKER_CONFIG);
  });

  it('persists and reloads config', () => {
    saveTrackerConfig({ ...DEFAULT_TRACKER_CONFIG, symptoms: { enabled: true } });
    expect(getTrackerConfig().symptoms.enabled).toBe(true);
  });

  it('merges newly-added defaults into older stored config', () => {
    localStorage.setItem(
      'trackerConfig',
      JSON.stringify({ daily: DEFAULT_TRACKER_CONFIG.daily, sobriety: { enabled: true } }),
    );
    const config = getTrackerConfig();
    expect(config.sobriety.enabled).toBe(true);
    expect(config.symptoms).toEqual({ enabled: false });
  });

  it('lists only enabled daily trackers', () => {
    const config = {
      ...DEFAULT_TRACKER_CONFIG,
      daily: {
        ...DEFAULT_TRACKER_CONFIG.daily,
        food: { enabled: false, label: 'Eating', icon: 'utensils' as const },
      },
    };
    expect(getEnabledDailyTrackers(config)).toEqual(['sleep', 'workout']);
  });
});

describe('day log (1-5 ratings)', () => {
  it('stores and reads a rating', () => {
    setRating('2026-06-12', 'sleep', 4);
    expect(getRating('2026-06-12', 'sleep')).toBe(4);
  });

  it('clamps out-of-range ratings', () => {
    setRating('2026-06-12', 'sleep', 9);
    expect(getRating('2026-06-12', 'sleep')).toBe(5);
  });

  it('clearing a rating (0) removes it', () => {
    setRating('2026-06-12', 'sleep', 3);
    setRating('2026-06-12', 'sleep', 0);
    expect(getDayEntry('2026-06-12')).toEqual({});
  });

  it('merges multiple trackers on the same day', () => {
    setRating('2026-06-12', 'sleep', 4);
    setRating('2026-06-12', 'workout', 2);
    expect(getDayEntry('2026-06-12')).toEqual({ sleep: 4, workout: 2 });
  });

  it('replaces a whole day via setDayEntry, dropping zeros', () => {
    setRating('2026-06-12', 'sleep', 4);
    setDayEntry('2026-06-12', { food: 5, workout: 0 });
    expect(getDayEntry('2026-06-12')).toEqual({ food: 5 });
  });

  it('normalizes legacy {rating,note} entries to numbers', () => {
    localStorage.setItem(
      'dayLog',
      JSON.stringify({ '2026-06-12': { sleep: { rating: 3, note: 'x' } } }),
    );
    expect(getRating('2026-06-12', 'sleep')).toBe(3);
  });
});

describe('sobriety', () => {
  it('persists streaks', () => {
    const streaks = [{ id: 's1', label: 'Sugar', startDate: '2026-01-01' }];
    saveSobrietyStreaks(streaks);
    expect(getSobrietyStreaks()).toEqual(streaks);
  });

  it('counts whole days since the start date', () => {
    const now = new Date(2026, 0, 11);
    expect(daysSober({ id: 's', label: 'x', startDate: '2026-01-01' }, now)).toBe(10);
  });

  it('never returns a negative count for a future start date', () => {
    const now = new Date(2026, 0, 1);
    expect(daysSober({ id: 's', label: 'x', startDate: '2026-06-01' }, now)).toBe(0);
  });

  it('returns 0 for a malformed start date', () => {
    expect(daysSober({ id: 's', label: 'x', startDate: 'nope' })).toBe(0);
  });
});

describe('symptom diary (1-5 severity)', () => {
  it('stores and reads a region severity', () => {
    setSymptomSeverity('2026-06-12', 'front:chest', 3);
    expect(getSymptomsForDate('2026-06-12')).toEqual({ 'front:chest': 3 });
  });

  it('removes a region when severity is cleared to 0', () => {
    setSymptomSeverity('2026-06-12', 'front:chest', 3);
    setSymptomSeverity('2026-06-12', 'front:chest', 0);
    expect(getSymptomsForDate('2026-06-12')).toEqual({});
  });
});

describe('legacy sleep migration', () => {
  it('folds legacy sleep scores into the day log', () => {
    jest.resetModules();
    localStorage.setItem('sleep', JSON.stringify({ '2025-01-10': 3 }));
    const mod = require('@/utils/tracker-storage');
    mod.migrateLegacySleep();
    expect(mod.getRating('2025-01-10', 'sleep')).toBe(3);
  });

  it('does not overwrite an existing day-log sleep entry', () => {
    jest.resetModules();
    localStorage.setItem('sleep', JSON.stringify({ '2025-01-10': 3 }));
    localStorage.setItem('dayLog', JSON.stringify({ '2025-01-10': { sleep: 5 } }));
    const mod = require('@/utils/tracker-storage');
    mod.migrateLegacySleep();
    expect(mod.getRating('2025-01-10', 'sleep')).toBe(5);
  });
});
