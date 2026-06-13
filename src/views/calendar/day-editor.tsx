'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX, faPerson } from '@fortawesome/free-solid-svg-icons';
import {
  getDayEntry,
  getTrackerConfig,
  getLoggableTrackers,
  setDayEntry,
} from '../../utils/tracker-storage';
import { trackerIcon } from '../../utils/tracker-icons';
import RatingScale from '../../components/RatingScale';
import type { DayEntry } from '../../types/trackers';

interface DayEditorProps {
  date: string; // YYYY-MM-DD
  onClose: () => void;
  onOpenBodyMap?: (date: string) => void;
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
}) => {
  const config = getTrackerConfig();
  const enabled = getLoggableTrackers(config);
  const [entry, setEntry] = useState<DayEntry>(() => getDayEntry(date));

  // Persist on every change so nothing is lost if the sheet is dismissed.
  const setValue = (key: string, rating: number) => {
    setEntry((prev) => {
      const next = { ...prev, [key]: rating };
      setDayEntry(date, next);
      return next;
    });
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
