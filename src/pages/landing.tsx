'use client';

import { useContext, useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faCalendarDays,
  faDumbbell,
  faMoon,
  faUtensils,
} from '@fortawesome/free-solid-svg-icons';
import Sleep from './sleep/sleep';
import MenuDropdown from '../components/MenuDropdown';
import { addLastVisitDate, getDaysSinceLastVisit } from '../utils/date-util';
import { FadingTextContext } from '../contexts/FadingTextContext';
import { addToLocalStorage, getFromLocalStorage } from '../utils/local-storage';
import Gym from './gym';
import Food from './food/food';
import Calendar from './calendar/calendar';

export default function Landing() {
  const searchParams = useSearchParams();
  const sleep = searchParams?.get('sleep');
  const [loaded, setLoaded] = useState(false);
  const { setText } = useContext(FadingTextContext);
  const [gymButtonClicked, setgymButtonClicked] = useState(false);
  const [foodButtonClicked, setfoodButtonClicked] = useState(false);
  const [sleepButtonClicked, setsleepButtonClicked] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const lastVisitDays = getDaysSinceLastVisit();
  const anyButtonClicked =
    gymButtonClicked || foodButtonClicked || sleepButtonClicked || showCalendar;

  const resetButtons = () => {
    setText('');
    setShowCalendar(false);
    setgymButtonClicked(false);
    setfoodButtonClicked(false);
    setsleepButtonClicked(false);
  };

  useEffect(() => {
    setLoaded(true);
  });

  return (
    loaded && (
      <Suspense fallback={<div>Loading...</div>}>
        {!anyButtonClicked && <MenuDropdown />}
        {anyButtonClicked && (
          <button
            className="circle-button button-return"
            onClick={resetButtons}
          >
            <FontAwesomeIcon icon={faArrowLeft} size="lg" color="white" />
          </button>
        )}
        {showCalendar && <Calendar />}
        {sleepButtonClicked && <Sleep />}
        {gymButtonClicked && <Gym />}
        {foodButtonClicked && <Food />}
        <div className="button-container">
          <button
            aria-label="gym"
            className={`circle-button button1 ${
              gymButtonClicked
                ? 'button-top-left'
                : foodButtonClicked || sleepButtonClicked
                  ? 'button-top-right'
                  : ''
            }`}
            onClick={() => {
              setgymButtonClicked(true);
              setfoodButtonClicked(false);
              setsleepButtonClicked(false);
            }}
          >
            <FontAwesomeIcon icon={faDumbbell} size="lg" color="white" />
          </button>
          <button
            aria-label="eat"
            className={`circle-button button2 ${
              foodButtonClicked
                ? 'button-top-left'
                : gymButtonClicked || sleepButtonClicked
                  ? 'button-top-right'
                  : ''
            }`}
            onClick={() => {
              setfoodButtonClicked(true);
              setgymButtonClicked(false);
              setsleepButtonClicked(false);
            }}
          >
            <FontAwesomeIcon icon={faUtensils} size="lg" color="white" />
          </button>
          <button
            aria-label="sleep"
            className={`circle-button button3 ${
              sleepButtonClicked
                ? 'button-top-left'
                : gymButtonClicked || foodButtonClicked
                  ? 'button-top-right'
                  : ''
            }`}
            onClick={() => {
              setsleepButtonClicked(true);
              setgymButtonClicked(false);
              setfoodButtonClicked(false);
            }}
          >
            <FontAwesomeIcon icon={faMoon} size="lg" color="white" />
          </button>
          {!anyButtonClicked && (
            <button
              style={{
                left: 26,
                top: 20,
                position: 'absolute',
                opacity: '70%',
              }}
              onClick={() => {
                setShowCalendar(true);
              }}
            >
              <FontAwesomeIcon icon={faCalendarDays} size="lg" color="white" />
            </button>
          )}
        </div>
      </Suspense>
    )
  );
}
