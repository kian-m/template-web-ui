'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUtensils,
  faDumbbell,
  faMoon,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import Sleep from './sleep';

export default function Landing() {
  const [gymButtonClicked, setgymButtonClicked] = useState(false);
  const [foodButtonClicked, setfoodButtonClicked] = useState(false);
  const [sleepButtonClicked, setsleepButtonClicked] = useState(false);

  const anyButtonClicked =
    gymButtonClicked || foodButtonClicked || sleepButtonClicked;

  const resetButtons = () => {
    setgymButtonClicked(false);
    setfoodButtonClicked(false);
    setsleepButtonClicked(false);
  };

  return (
    <>
      {anyButtonClicked && (
        <button className="circle-button button-return" onClick={resetButtons}>
          <FontAwesomeIcon icon={faArrowLeft} size="lg" color="white" />
        </button>
      )}
      {sleepButtonClicked && <Sleep />}
      <div className="button-container">
        <button
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
