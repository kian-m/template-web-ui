'use client';

import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import {
  getDayLog,
  getTrackerConfig,
  getLoggableTrackers,
  toDateKey,
} from '../../utils/tracker-storage';
import { trackerIcon } from '../../utils/tracker-icons';
import { dayScore, scoreColor } from '../../utils/score-color';
import type { DayLog, TrackerConfig } from '../../types/trackers';
import DayEditor from './day-editor';

const daysOfWeek = ['M', 'T', 'W', 'Th', 'F', 'Sa', 'Su'];

interface CalendarProps {
  onOpenBodyMap?: (date: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({ onOpenBodyMap }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isClient, setIsClient] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [config, setConfig] = useState<TrackerConfig | null>(null);
  const [dayLog, setDayLog] = useState<DayLog>({});

  const refresh = () => {
    setConfig(getTrackerConfig());
    setDayLog(getDayLog());
  };

  useEffect(() => {
    setIsClient(true);
    refresh();
  }, []);

  const startOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  );
  const endOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  );
  // Make Monday the first column (getDay: Sun=0..Sat=6 -> Mon=0..Sun=6).
  const startDay = (startOfMonth.getDay() + 6) % 7;
  const daysInMonth = endOfMonth.getDate();

  const handlePrevMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );

  const handleNextMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );

  const isCurrentDate = (date: Date): boolean => {
    const today = new Date();
    return toDateKey(date) === toDateKey(today);
  };

  const dayIndicators = (dateKey: string) => {
    if (!config) return null;
    const entry = dayLog[dateKey];
    if (!entry) return null;
    return getLoggableTrackers(config).map((key) => {
      const rating = entry[key] ?? 0;
      if (rating <= 0) return null;
      return (
        <FontAwesomeIcon
          key={key}
          icon={trackerIcon(config.daily[key].icon)}
          size="2xs"
          title={`${config.daily[key].label}: ${rating}/5`}
          style={{ padding: '3px' }}
        />
      );
    });
  };

  const renderDays = () => {
    const days = [];
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="day empty"></div>);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        i,
      );
      const dateKey = toDateKey(date);
      const entry = dayLog[dateKey];
      const tint =
        isClient && config && entry
          ? scoreColor(dayScore(entry, getLoggableTrackers(config)), 0.55)
          : undefined;
      days.push(
        <button
          key={i}
          type="button"
          className={`day day-button ${isCurrentDate(date) ? 'current-day' : ''}`}
          style={tint ? { backgroundColor: tint } : undefined}
          onClick={() => setSelectedDate(dateKey)}
          aria-label={`Edit ${dateKey}`}
        >
          {i}
          <div className="day-indicators">{isClient && dayIndicators(dateKey)}</div>
        </button>,
      );
    }
    return days;
  };

  return (
    <div className="calendar">
      <div className="header">
        <span className={'month'}>
          {currentDate.toLocaleString('default', { month: 'long' })}{' '}
          {currentDate.getFullYear()}
        </span>
        <FontAwesomeIcon
          icon={faChevronLeft}
          onClick={handlePrevMonth}
          style={{ position: 'absolute', right: '14%', paddingBottom: '10%' }}
        />
        <FontAwesomeIcon
          icon={faChevronRight}
          onClick={handleNextMonth}
          style={{ position: 'absolute', right: '5%', paddingBottom: '10%' }}
        />
      </div>
      <div className="daysOfWeek">
        {daysOfWeek.map((day, index) => (
          <div key={index} className="dayOfWeek">
            {day}
          </div>
        ))}
      </div>
      <div className="days">{renderDays()}</div>

      {selectedDate && (
        <DayEditor
          date={selectedDate}
          onClose={() => {
            setSelectedDate(null);
            refresh();
          }}
          onOpenBodyMap={onOpenBodyMap}
        />
      )}
    </div>
  );
};

export default Calendar;
