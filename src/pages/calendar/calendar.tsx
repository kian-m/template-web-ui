'use client';

import React, { ReactElement, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faArrowRight,
  faChevronLeft,
  faChevronRight,
  faDumbbell,
  faMoon,
  faUtensils,
} from '@fortawesome/free-solid-svg-icons';
import { getSleepScoreFromLocalStorage } from '../../utils/local-storage';

const daysOfWeek = ['M', 'T', 'W', 'Th', 'F', 'Sa', 'Su'];

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const daySleepScore = (date: string): number => {
    return getSleepScoreFromLocalStorage(date);
  };

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
  const startDay = startOfMonth.getDay() % 7; // Adjust to make Monday the first day of the week
  const daysInMonth = endOfMonth.getDate();

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  };

  const metSleepGoal = (date: string): ReactElement | null => {
    if (daySleepScore(date) > 0) {
      return (
        <FontAwesomeIcon icon={faMoon} size="2xs" style={{ padding: '3px' }} />
      );
    }
    return null;
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  };

  useEffect(() => {}, [currentDate]);

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
      const dateString = date.toISOString().split('T')[0];
      days.push(
        <div key={i} className="day">
          {i}
          <div>
            <FontAwesomeIcon
              icon={faDumbbell}
              size="2xs"
              style={{ padding: '3px' }}
            />
            <FontAwesomeIcon
              icon={faUtensils}
              size="2xs"
              style={{ padding: '3px' }}
            />
            {isClient && metSleepGoal(dateString)}
          </div>
        </div>,
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
    </div>
  );
};

export default Calendar;
