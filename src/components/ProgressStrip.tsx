'use client';

import React, { useEffect, useState } from 'react';
import {
  getDayLog,
  getLoggableTrackers,
  getTrackerConfig,
  toDateKey,
} from '../utils/tracker-storage';
import { dayScore, scoreColor } from '../utils/score-color';

interface DayCell {
  key: string;
  dom: number;
  weekday: string;
  isToday: boolean;
  logged: number;
  fraction: number;
  color: string;
}

interface ProgressStripProps {
  onSelectDate: (date: string) => void;
  /** Bump to force a re-read after the day editor closes. */
  version?: number;
  days?: number;
}

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const ProgressStrip: React.FC<ProgressStripProps> = ({
  onSelectDate,
  version = 0,
  days = 14,
}) => {
  const [cells, setCells] = useState<DayCell[]>([]);

  useEffect(() => {
    const config = getTrackerConfig();
    const enabled = getLoggableTrackers(config);
    const log = getDayLog();
    const todayKey = toDateKey(new Date());
    const arr: DayCell[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = toDateKey(d);
      const entry = log[key] ?? {};
      const total = enabled.length;
      const logged = enabled.filter((k) => (entry[k] ?? 0) > 0).length;
      const score = dayScore(entry, enabled);
      arr.push({
        key,
        dom: d.getDate(),
        weekday: WEEKDAYS[d.getDay()],
        isToday: key === todayKey,
        logged,
        fraction: total ? logged / total : 0,
        color: scoreColor(score),
      });
    }
    setCells(arr);
  }, [version, days]);

  return (
    <div className="progress-strip" aria-label="Recent progress">
      {cells.map((c) => (
        <button
          key={c.key}
          type="button"
          className={`strip-cell ${c.isToday ? 'today' : ''} ${
            c.logged ? 'has' : ''
          }`}
          onClick={() => onSelectDate(c.key)}
          aria-label={`${c.key}, ${c.logged} tracked`}
        >
          <span className="strip-track">
            <span
              className="strip-fill"
              style={{
                height: `${Math.round(c.fraction * 100)}%`,
                background: c.color,
              }}
            />
          </span>
          <span className="strip-dom">{c.dom}</span>
        </button>
      ))}
    </div>
  );
};

export default ProgressStrip;
