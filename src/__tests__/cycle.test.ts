import {
  markStart,
  markEnd,
  unmarkDay,
  buildCycleCalendar,
  phaseFor,
  isLoggedPeriod,
  phaseInfo,
} from '@/utils/cycle';
import type { CycleRecord } from '@/types/trackers';

describe('cycle mutations', () => {
  it('marks a start once, kept sorted', () => {
    let c: CycleRecord[] = [];
    c = markStart(c, '2026-02-01');
    c = markStart(c, '2026-01-01');
    c = markStart(c, '2026-02-01'); // dup ignored
    expect(c).toEqual([{ start: '2026-01-01' }, { start: '2026-02-01' }]);
  });

  it('closes the most recent open cycle on/before the date', () => {
    const c = markEnd(
      [{ start: '2026-01-01' }, { start: '2026-02-01' }],
      '2026-02-05',
    );
    expect(c).toEqual([
      { start: '2026-01-01' },
      { start: '2026-02-01', end: '2026-02-05' },
    ]);
  });

  it('does nothing when there is no open cycle before the date', () => {
    const input = [{ start: '2026-02-10' }];
    expect(markEnd(input, '2026-02-05')).toEqual(input);
  });

  it('unmarks a start (drops record) and an end (re-opens)', () => {
    expect(unmarkDay([{ start: '2026-01-01', end: '2026-01-05' }], '2026-01-01')).toEqual([]);
    expect(unmarkDay([{ start: '2026-01-01', end: '2026-01-05' }], '2026-01-05')).toEqual([
      { start: '2026-01-01' },
    ]);
  });
});

describe('cycle prediction', () => {
  it('reports no data for an empty log', () => {
    const cal = buildCycleCalendar([]);
    expect(cal.based).toBe('none');
    expect(cal.nextStart).toBeNull();
  });

  it('uses the 28-day default with a single logged start', () => {
    const cal = buildCycleCalendar([{ start: '2026-01-01' }]);
    expect(cal.based).toBe('default');
    expect(cal.avgCycleLength).toBe(28);
    expect(cal.nextStart).toBe('2026-01-29');
    expect(phaseFor(cal, '2026-01-01')).toBe('menstrual');
    expect(isLoggedPeriod(cal, '2026-01-01')).toBe(true);
  });

  it('barely moves the cadence for one new in-range cycle (sticky)', () => {
    const cal = buildCycleCalendar([
      { start: '2026-01-01' },
      { start: '2026-01-31' }, // a single 30-day gap
    ]);
    expect(cal.based).toBe('data');
    // Weighted/smoothed: stays put rather than jumping toward 30.
    expect(cal.avgCycleLength).toBeLessThan(30);

    // Even a big (but in-range) 36-day cycle only nudges it a little.
    const cal2 = buildCycleCalendar([
      { start: '2026-01-01' },
      { start: '2026-02-06' }, // 36-day gap
    ]);
    expect(cal2.avgCycleLength).toBeLessThanOrEqual(30);
  });

  it('converges toward a consistent cadence over many cycles', () => {
    const key = (offsetDays: number) => {
      const d = new Date(2026, 0, 1);
      d.setDate(d.getDate() + offsetDays);
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${d.getFullYear()}-${m}-${day}`;
    };
    const starts = Array.from({ length: 20 }, (_, i) => ({ start: key(i * 31) }));
    const cal = buildCycleCalendar(starts);
    expect(cal.avgCycleLength).toBeGreaterThanOrEqual(30);
    expect(cal.avgCycleLength).toBeLessThanOrEqual(31);
  });

  it('ignores a way-late cycle and clamps to 21–38', () => {
    // One huge 90-day gap (e.g. a missed log) must not drag the cadence.
    const cal = buildCycleCalendar([
      { start: '2026-01-01' },
      { start: '2026-04-01' }, // ~90-day gap → ignored
    ]);
    expect(cal.based).toBe('default');
    expect(cal.avgCycleLength).toBe(28);
  });

  it('sizes the window to the user’s variability (e.g. 24 and 38)', () => {
    const cal = buildCycleCalendar([
      { start: '2026-01-01' },
      { start: '2026-01-25' }, // 24-day gap
      { start: '2026-03-04' }, // 38-day gap
    ]);
    // Window spans the observed spread (24…38 days from the last start).
    expect(cal.nextWindowStart).toBe('2026-03-28'); // Mar 4 + 24
    expect(cal.nextWindowEnd).toBe('2026-04-11'); // Mar 4 + 38
  });

  it('learns the period length from logged spans', () => {
    const cal = buildCycleCalendar([{ start: '2026-01-01', end: '2026-01-04' }]);
    expect(cal.avgPeriodLength).toBe(4);
  });

  it('labels every day of the cycle with a phase', () => {
    const cal = buildCycleCalendar([{ start: '2026-01-01' }]);
    // 28-day cycle, 5-day period; nextStart 2026-01-29 → ovulation 2026-01-15.
    expect(phaseFor(cal, '2026-01-01')).toBe('menstrual'); // period
    expect(phaseFor(cal, '2026-01-10')).toBe('follicular'); // post-period, pre-ovulation
    expect(phaseFor(cal, '2026-01-15')).toBe('ovulation'); // ovulation window
    expect(phaseFor(cal, '2026-01-22')).toBe('luteal'); // post-ovulation
    expect(phaseFor(cal, '2026-01-29')).toBe('menstrual'); // next predicted period
    expect(isLoggedPeriod(cal, '2026-01-29')).toBe(false); // predicted, not logged
  });

  it('re-derives prior days when a new start is logged (no menstrual bleed)', () => {
    // Single open cycle: the day before the predicted next period reads as a
    // predicted period day.
    let cycles = [{ start: '2026-06-01' }];
    let cal = buildCycleCalendar(cycles);
    expect(phaseFor(cal, '2026-06-29')).toBe('menstrual');
    expect(isLoggedPeriod(cal, '2026-06-29')).toBe(false);

    // Logging an actual start on Jun 30 must flip Jun 29 to luteal (lead-up),
    // and Jun 30 becomes the logged period — nothing stale.
    cycles = markStart(cycles, '2026-06-30');
    cal = buildCycleCalendar(cycles);
    expect(phaseFor(cal, '2026-06-29')).toBe('luteal');
    expect(phaseFor(cal, '2026-06-30')).toBe('menstrual');
    expect(isLoggedPeriod(cal, '2026-06-30')).toBe(true);
    // The earlier open cycle stays a normal-length period, not a 30-day span.
    expect(isLoggedPeriod(cal, '2026-06-20')).toBe(false);
  });

  it('reports phase + day-of-cycle for a date', () => {
    const cycles = [{ start: '2026-01-01' }];
    expect(phaseInfo(cycles, '2026-01-03')).toEqual({
      phase: 'menstrual',
      label: 'Menstrual',
      dayOfCycle: 3,
    });
    expect(phaseInfo(cycles, '2026-01-10')?.phase).toBe('follicular');
    expect(phaseInfo(cycles, '2026-01-10')?.dayOfCycle).toBe(10);
  });
});
