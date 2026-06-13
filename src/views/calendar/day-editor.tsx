'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX, faPerson, faDroplet } from '@fortawesome/free-solid-svg-icons';
import {
  getCycles,
  getDayEntry,
  getTrackerConfig,
  getLoggableTrackers,
  saveCycles,
  setDayEntry,
} from '../../utils/tracker-storage';
import { markStart, markEnd, unmarkDay, phaseInfo } from '../../utils/cycle';
import { trackerIcon } from '../../utils/tracker-icons';
import RatingScale from '../../components/RatingScale';
import type { CycleRecord, DayEntry } from '../../types/trackers';

interface DayEditorProps {
  date: string; // YYYY-MM-DD
  onClose: () => void;
  onOpenBodyMap?: (date: string) => void;
  /** Notified immediately whenever cycle records change (live calendar update). */
  onCyclesChange?: (cycles: CycleRecord[]) => void;
}

const formatHeading = (date: string): string => {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
};

const DayEditor: React.FC<DayEditorProps> = ({
  date,
  onClose,
  onOpenBodyMap,
  onCyclesChange,
}) => {
  const config = getTrackerConfig();
  const enabled = getLoggableTrackers(config);
  const [entry, setEntry] = useState<DayEntry>(() => getDayEntry(date));
  const [cycles, setCycles] = useState<CycleRecord[]>(() => getCycles());

  // Persist on every change so nothing is lost if the sheet is dismissed.
  const setValue = (key: string, rating: number) => {
    setEntry((prev) => {
      const next = { ...prev, [key]: rating };
      setDayEntry(date, next);
      return next;
    });
  };

  const applyCycles = (next: CycleRecord[]) => {
    setCycles(next);
    saveCycles(next);
    onCyclesChange?.(next);
  };

  const isStart = cycles.some((c) => c.start === date);
  const isEnd = cycles.some((c) => c.end === date);
  // An earlier cycle still without an end date (so "End period" is meaningful).
  const openBefore = cycles.some((c) => !c.end && c.start < date);

  const renderCycleControl = () => {
    if (isStart) {
      return (
        <button
          type="button"
          className="cycle-btn active"
          onClick={() => applyCycles(unmarkDay(cycles, date))}
        >
          ● Period started — tap to undo
        </button>
      );
    }
    if (isEnd) {
      return (
        <button
          type="button"
          className="cycle-btn active"
          onClick={() => applyCycles(unmarkDay(cycles, date))}
        >
          ● Period ended — tap to undo
        </button>
      );
    }
    // Starting a new period is always available; ending is a secondary action
    // offered only when an earlier cycle is still open. (Starting a new cycle
    // never ends the old one — the phases between starts are derived.)
    return (
      <div className="cycle-actions">
        <button
          type="button"
          className="cycle-btn"
          onClick={() => applyCycles(markStart(cycles, date))}
        >
          Start period here
        </button>
        {openBefore && (
          <button
            type="button"
            className="cycle-btn ghost"
            onClick={() => applyCycles(markEnd(cycles, date))}
          >
            End current period here
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="overlay-backdrop" onClick={onClose}>
      <div
        className="day-editor"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label={`Edit ${formatHeading(date)}`}
      >
        <button className="overlay-close" onClick={onClose} aria-label="Close">
          <FontAwesomeIcon icon={faX} />
        </button>
        <h2 className="overlay-title">{formatHeading(date)}</h2>

        {enabled.length === 0 && (
          <p className="overlay-empty">
            No daily trackers are enabled. Turn some on in config.
          </p>
        )}

        {enabled.map((key) => {
          const cfg = config.daily[key];
          return (
            <div key={key} className="tracker-row">
              <div className="tracker-row-head">
                <FontAwesomeIcon icon={trackerIcon(cfg.icon)} />
                <span>{cfg.label}</span>
              </div>
              <RatingScale
                value={entry[key] ?? 0}
                onChange={(rating) => setValue(key, rating)}
                ariaLabel={cfg.label}
              />
            </div>
          );
        })}

        {config.cycle.enabled &&
          (() => {
            const info = phaseInfo(cycles, date);
            return (
              <div className="tracker-row">
                <div className="tracker-row-head">
                  <FontAwesomeIcon icon={faDroplet} />
                  <span>Cycle</span>
                </div>
                {info && (
                  <p className="cycle-phase-label">
                    <span className={`cyc-legend ${info.phase}`} />
                    {info.label} phase
                    {info.dayOfCycle ? ` · day ${info.dayOfCycle}` : ''}
                  </p>
                )}
                {renderCycleControl()}
              </div>
            );
          })()}

        <div className="editor-actions">
          {config.symptoms.enabled && onOpenBodyMap && (
            <button
              type="button"
              className="link-button"
              onClick={() => onOpenBodyMap(date)}
            >
              <FontAwesomeIcon icon={faPerson} /> Symptoms for this day
            </button>
          )}
          <button type="button" className="save-button" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default DayEditor;
