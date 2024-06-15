'use client';

import { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faDumbbell,
  faMoon,
  faUtensils,
} from '@fortawesome/free-solid-svg-icons';
import Sleep from './sleep';
import MenuDropdown from '../components/MenuDropdown';
import { addLastVisitDate, getDaysSinceLastVisit } from '../utils/date-util';
import { FadingTextContext } from '../contexts/FadingTextContext';
import { addToLocalStorage, getFromLocalStorage } from '../utils/local-storage';

export default function Landing() {
  const { setText } = useContext(FadingTextContext);
  const [gymButtonClicked, setgymButtonClicked] = useState(false);
  const [foodButtonClicked, setfoodButtonClicked] = useState(false);
  const [sleepButtonClicked, setsleepButtonClicked] = useState(false);
  const lastVisitDays = getDaysSinceLastVisit();
  const anyButtonClicked =
    gymButtonClicked || foodButtonClicked || sleepButtonClicked;

  const resetButtons = () => {
    setgymButtonClicked(false);
    setfoodButtonClicked(false);
    setsleepButtonClicked(false);
  };

  useEffect(() => {
    if (lastVisitDays == -1) {
      setText(
        'Welcome! \n Save, or load your progress by clicking the menu button.',
      );
    } else {
      if (lastVisitDays == 1) {
        //TODO: fix double render so this isnt 0.5
        addToLocalStorage('visits', getFromLocalStorage('visits') + 0.5);
      }
      if (lastVisitDays > 1) {
        addToLocalStorage('visits', '1');
      }
      if (lastVisitDays > 0) {
        setText(
          'Welcome back!' +
            (getFromLocalStorage('visits')
              ? '\n Congratulations on a ' +
                getFromLocalStorage('visits') +
                ' day streak!'
              : ''),
        );
      }
    }
    addLastVisitDate();
  }, []);

  return (
    <>
      {!anyButtonClicked && <MenuDropdown />}
      {anyButtonClicked && (
        <button className="circle-button button-return" onClick={resetButtons}>
          <FontAwesomeIcon icon={faArrowLeft} size="lg" color="white" />
        </button>
      )}
      {sleepButtonClicked && <Sleep />}
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
    </>
  );
}
