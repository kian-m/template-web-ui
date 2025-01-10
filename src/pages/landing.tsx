'use client';

import { useContext, useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
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
import Food from './food';

export default function Landing() {
  const searchParams = useSearchParams();
  const sleep = searchParams?.get('sleep');
  const { setText } = useContext(FadingTextContext);
  const [gymButtonClicked, setgymButtonClicked] = useState(false);
  const [foodButtonClicked, setfoodButtonClicked] = useState(false);
  const [sleepButtonClicked, setsleepButtonClicked] = useState(false);
  const lastVisitDays = getDaysSinceLastVisit();
  const anyButtonClicked =
    gymButtonClicked || foodButtonClicked || sleepButtonClicked;

  const resetButtons = () => {
    setText('');
    setgymButtonClicked(false);
    setfoodButtonClicked(false);
    setsleepButtonClicked(false);
  };

  useEffect(() => {
    if (lastVisitDays == -1) {
      setText('This product is currently in an open, unfinished beta. Stay tuned, and thank you for being an early adopter - Kian');
    } else {
      if (lastVisitDays == 1) {
        addToLocalStorage(
          'visits',
          (parseInt(getFromLocalStorage('visits')) + 1).toString(),
        );
      }
      if (lastVisitDays > 1) {
        addToLocalStorage('visits', '1');
      }
      if (lastVisitDays > 1) {
        setText(
          getFromLocalStorage('visits')
            ? '- Congratulations - \n' +
                getFromLocalStorage('visits') +
                ' day streak!'
            : '',
        );
      }
    }
    addLastVisitDate();
    if(sleep) {
      setsleepButtonClicked(true);
    }
  });

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {!anyButtonClicked && <MenuDropdown />}
      {anyButtonClicked && (
        <button className="circle-button button-return" onClick={resetButtons}>
          <FontAwesomeIcon icon={faArrowLeft} size="lg" color="white" />
        </button>
      )}
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
      </div>
    </Suspense>
  );
}
