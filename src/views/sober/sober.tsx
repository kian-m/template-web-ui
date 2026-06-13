'use client';

import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateLeft, faTrophy } from '@fortawesome/free-solid-svg-icons';
import {
  daysSober,
  getSobrietyStreaks,
  saveSobrietyStreaks,
  toDateKey,
} from '../../utils/tracker-storage';
import type { SobrietyStreak } from '../../types/trackers';
import { useCountUp } from '../../components/CountUp';

const MILESTONES = [1, 3, 7, 14, 30, 60, 90, 180, 365, 730, 1095];

const milestoneRange = (days: number): { prev: number; next: number } => {
  let prev = 0;
  for (const m of MILESTONES) {
    if (days < m) return { prev, next: m };
    prev = m;
  }
  return { prev, next: prev }; // past the last milestone
};

const ProgressRing: React.FC<{ progress: number; count: number }> = ({
  progress,
  count,
}) => {
  const size = 200;
  const stroke = 12;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const [offset, setOffset] = useState(circumference);
  const display = useCountUp(count);

  useEffect(() => {
    // Animate the ring fill after mount.
    const id = requestAnimationFrame(() =>
      setOffset(circumference * (1 - Math.max(0, Math.min(1, progress)))),
    );
    return () => cancelAnimationFrame(id);
  }, [progress, circumference]);

  return (
    <div className="ring-wrap">
      <svg
        className="ring"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        <defs>
          <linearGradient id="soberGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f89e9d" />
            <stop offset="100%" stopColor="#d46f93" />
          </linearGradient>
        </defs>
        <circle
          className="ring-track"
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
        />
        <circle
          className="ring-fill"
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="ring-center">
        <span className="ring-count">{display}</span>
        <span className="ring-unit">{count === 1 ? 'day' : 'days'}</span>
      </div>
    </div>
  );
};

const Sober: React.FC = () => {
  const [streaks, setStreaks] = useState<SobrietyStreak[]>([]);

  useEffect(() => {
    setStreaks(getSobrietyStreaks());
  }, []);

  const reset = (id: string) => {
    const next = streaks.map((s) =>
      s.id === id ? { ...s, startDate: toDateKey(new Date()) } : s,
    );
    setStreaks(next);
    saveSobrietyStreaks(next);
  };

  return (
    <div className="sober-view">
      {streaks.length === 0 && (
        <p className="overlay-empty">
          No streaks yet. Add one in config to start counting.
        </p>
      )}
      {streaks.map((streak) => {
        const days = daysSober(streak);
        const { prev, next } = milestoneRange(days);
        const atTop = next === prev;
        const progress = atTop ? 1 : (days - prev) / (next - prev);
        const remaining = atTop ? 0 : next - days;

        return (
          <div key={streak.id} className="sober-card">
            <ProgressRing progress={progress} count={days} />
            <div className="sober-label">{streak.label}</div>
            <div className="sober-milestone">
              <FontAwesomeIcon icon={faTrophy} />{' '}
              {atTop
                ? `${MILESTONES[MILESTONES.length - 1]}+ days — legend`
                : `${remaining} ${remaining === 1 ? 'day' : 'days'} to ${next}`}
            </div>
            <button
              type="button"
              className="link-button"
              onClick={() => reset(streak.id)}
              aria-label={`Reset ${streak.label}`}
            >
              <FontAwesomeIcon icon={faRotateLeft} /> Reset to today
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Sober;
