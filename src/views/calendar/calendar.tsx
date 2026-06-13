'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import {
  getCycles,
  getDayLog,
  getTrackerConfig,
  getLoggableTrackers,
  toDateKey,
} from '../../utils/tracker-storage';
import { trackerIcon } from '../../utils/tracker-icons';
import { dayScore, scoreColor } from '../../utils/score-color';
import {
  buildCycleCalendar,
  phaseFor,
  isLoggedPeriod,
  phaseInfo,
  type CycleCalendar,
} from '../../utils/cycle';
import type { CycleRecord, DayLog, TrackerConfig } from '../../types/trackers';
import DayEditor from './day-editor';

const daysOfWeek = ['M', 'T', 'W', 'Th', 'F', 'Sa', 'Su'];

const formatShort = (key: string): string => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
};

interface CalendarProps {
  onOpenBodyMap?: (date: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({ onOpenBodyMap }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isClient, setIsClient] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [config, setConfig] = useState<TrackerConfig | null>(null);
  const [dayLog, setDayLog] = useState<DayLog>({});
  const [cycles, setCycles] = useState<CycleRecord[]>([]);

  // Derived so the calendar re-colours the moment cycle records change.
  const cycleCal: CycleCalendar | null = useMemo(
    () => (config?.cycle.enabled ? buildCycleCalendar(cycles) : null),
    [cycles, config],
  );

  const refresh = () => {
    setConfig(getTrackerConfig());
    setDayLog(getDayLog());
    setCycles(getCycles());
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
      const today = isCurrentDate(date);
      const entry = dayLog[dateKey];
      // Leave today un-tinted so its gray "sunken" styling stays recognizable.
      const tint =
        !today && isClient && config && entry
          ? scoreColor(dayScore(entry, getLoggableTrackers(config)), 0.55)
          : undefined;
      let cycleClass = '';
      if (isClient && cycleCal && config?.cycle.enabled) {
        const phase = phaseFor(cycleCal, dateKey);
        if (phase && config.cycle.phases[phase]) {
          cycleClass =
            phase === 'menstrual' && !isLoggedPeriod(cycleCal, dateKey)
              ? ' cyc-menstrual-pred'
              : ` cyc-${phase}`;
        }
      }
      days.push(
        <button
          key={i}
          type="button"
          className={`day day-button ${today ? 'current-day' : ''}${cycleClass}`}
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

  const todayInfo =
    config?.cycle.enabled && cycleCal
      ? phaseInfo(cycles, toDateKey(new Date()))
      : null;

  return (
    <div className="calendar">
      {todayInfo && (
        <div className="cycle-today-top">
          <span className={`cyc-legend ${todayInfo.phase}`} /> Today:{' '}
          {todayInfo.label} phase
          {todayInfo.dayOfCycle ? ` · day ${todayInfo.dayOfCycle}` : ''}
        </div>
      )}
      <div className="header">
        <span className={'month'}>
          {currentDate.toLocaleString('default', { month: 'long' })}{' '}
          {currentDate.getFullYear()}
        </span>
        <div className="cal-nav">
          <FontAwesomeIcon
            icon={faChevronLeft}
            className="cal-chevron"
            onClick={handlePrevMonth}
            aria-label="Previous month"
          />
          <button
            type="button"
            className="today-btn"
            onClick={() => setCurrentDate(new Date())}
            aria-label="Go to today"
          >
            Today
          </button>
          <FontAwesomeIcon
            icon={faChevronRight}
            className="cal-chevron"
            onClick={handleNextMonth}
            aria-label="Next month"
          />
        </div>
      </div>
      <div className="daysOfWeek">
        {daysOfWeek.map((day, index) => (
          <div key={index} className="dayOfWeek">
            {day}
          </div>
        ))}
      </div>
      <div className="days">{renderDays()}</div>

      {config?.cycle.enabled && cycleCal && cycleCal.nextStart && (
        <div className="cycle-summary">
          <div className="cyc-legend-row">
            {config.cycle.phases.menstrual && (
              <span>
                <span className="cyc-legend menstrual" /> menstrual
              </span>
            )}
            {config.cycle.phases.follicular && (
              <span>
                <span className="cyc-legend follicular" /> follicular
              </span>
            )}
            {config.cycle.phases.ovulation && (
              <span>
                <span className="cyc-legend ovulation" /> ovulation
              </span>
            )}
            {config.cycle.phases.luteal && (
              <span>
                <span className="cyc-legend luteal" /> luteal
              </span>
            )}
          </div>
          <div className="cycle-next">
            Next period{' '}
            {cycleCal.nextWindowStart &&
            cycleCal.nextWindowEnd &&
            cycleCal.nextWindowStart !== cycleCal.nextWindowEnd
              ? `${formatShort(cycleCal.nextWindowStart)}–${formatShort(cycleCal.nextWindowEnd)}`
              : `~ ${formatShort(cycleCal.nextStart)}`}{' '}
            ·{' '}
            {cycleCal.based === 'data'
              ? `~${cycleCal.avgCycleLength}-day cycle (your data)`
              : 'estimate — log more to refine'}
          </div>
        </div>
      )}

      {selectedDate && (
        <DayEditor
          date={selectedDate}
          onClose={() => {
            setSelectedDate(null);
            refresh();
          }}
          onCyclesChange={setCycles}
          onOpenBodyMap={onOpenBodyMap}
        />
      )}
    </div>
  );
};

export default Calendar;
