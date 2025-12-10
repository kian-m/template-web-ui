'use client';

import { useMemo, useState } from 'react';
import { captureEvent } from '../utils/posthogClient';

type SleepMode = 'now' | 'later' | 'wake' | null;

const FALL_ASLEEP_MINUTES = 20;
const CYCLE_MINUTES = 90;
const RECOMMENDED_CYCLES = 4;

const formatClock = (date: Date) =>
  date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

const toInputTime = (date: Date) =>
  `${date.getHours().toString().padStart(2, '0')}:${date
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;

const wakeTimesFromBedtime = (bedtime: Date) => {
  const start = bedtime.getTime() + FALL_ASLEEP_MINUTES * 60000;

  return Array.from({ length: RECOMMENDED_CYCLES }, (_, index) =>
    new Date(start + (index + 1) * CYCLE_MINUTES * 60000),
  );
};

const bedtimesFromWake = (wakeTime: Date) => {
  const wakeMillis = wakeTime.getTime();

  return Array.from({ length: RECOMMENDED_CYCLES }, (_, index) => {
    const cyclesBack = (index + 1) * CYCLE_MINUTES * 60000;
    const bedtime = new Date(wakeMillis - cyclesBack - FALL_ASLEEP_MINUTES * 60000);
    return bedtime;
  }).reverse();
};

function TimeList({ title, items }: { title: string; items: Date[] }) {
  return (
    <section className="card">
      <h2 className="card-title">{title}</h2>
      {items.length === 0 ? (
        <p className="muted">Choose an option to see simple suggestions.</p>
      ) : (
        <ul className="time-list" role="list">
          {items.map((time) => (
            <li key={time.toISOString()}>{formatClock(time)}</li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default function SleepPlannerPage() {
  const [mode, setMode] = useState<SleepMode>(null);
  const [timeInput, setTimeInput] = useState<string>(() => toInputTime(new Date()));

  const selectedTime = useMemo(() => {
    const [hours, minutes] = timeInput.split(':').map(Number);
    const updated = new Date();
    updated.setHours(hours);
    updated.setMinutes(minutes);
    updated.setSeconds(0);
    updated.setMilliseconds(0);
    return updated;
  }, [timeInput]);

  const times = useMemo(() => {
    if (mode === 'wake') {
      return bedtimesFromWake(selectedTime);
    }

    if (mode === 'later') {
      return wakeTimesFromBedtime(selectedTime);
    }

    if (mode === 'now') {
      return wakeTimesFromBedtime(new Date());
    }

    return [];
  }, [mode, selectedTime]);

  const handleModeChange = (nextMode: SleepMode) => {
    setMode(nextMode);
    if (nextMode === 'now') {
      setTimeInput(toInputTime(new Date()));
    }
    captureEvent('sleep_mode_selected', { mode: nextMode ?? 'none' });
  };

  const handleTimeChange = (value: string) => {
    setTimeInput(value);
    if (mode) {
      captureEvent('sleep_time_updated', { mode, time: value });
    }
  };

  return (
    <main className="page">
      <section className="panel">
        <h1 className="title">Sleep</h1>
        <p className="lead">
          Pick one of the three options below and we will keep the math simple.
        </p>

        <div className="button-row">
          <button
            className={`action-button ${mode === 'now' ? 'active' : ''}`}
            onClick={() => handleModeChange('now')}
            type="button"
          >
            Sleep now
          </button>
          <button
            className={`action-button ${mode === 'later' ? 'active' : ''}`}
            onClick={() => handleModeChange('later')}
            type="button"
          >
            Sleep later
          </button>
          <button
            className={`action-button ${mode === 'wake' ? 'active' : ''}`}
            onClick={() => handleModeChange('wake')}
            type="button"
          >
            Wake up at
          </button>
        </div>

        {(mode === 'later' || mode === 'wake') && (
          <label className="input-row" htmlFor="time-input">
            <span>{mode === 'wake' ? 'Wake time' : 'Bedtime'}</span>
            <input
              id="time-input"
              type="time"
              value={timeInput}
              onChange={(event) => handleTimeChange(event.target.value)}
            />
          </label>
        )}

        {mode === null && <p className="muted">Start by choosing an option.</p>}

        <TimeList
          title={
            mode === 'wake'
              ? 'Head to bed at one of these times'
              : 'Try waking up at one of these times'
          }
          items={times}
        />
      </section>
    </main>
  );
}
