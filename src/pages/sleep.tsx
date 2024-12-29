'use client';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faBed,
  faClock,
  faSun,
} from '@fortawesome/free-solid-svg-icons';
import WakeUpOptions from './sleep-now';
import SleepTimePrompt from './sleep-time';

export default function Sleep() {
  const [date, setDate] = useState(new Date());
  const [sleepNowClicked, setSleepNowClicked] = useState(false);
  const [sleepLaterClicked, setSleepLaterClicked] = useState(false);
  const [wakeUpAtClicked, setWakeUpAtClicked] = useState(false);

  const anyButtonClicked =
    sleepNowClicked || sleepLaterClicked || wakeUpAtClicked;

  const resetButtons = () => {
    setSleepNowClicked(false);
    setSleepLaterClicked(false);
    setWakeUpAtClicked(false);
  };

  return (
    <>
      {sleepNowClicked && <WakeUpOptions date={date} />}
      {sleepLaterClicked && (
        <SleepTimePrompt
          setDate={(d: Date) => {
            setDate(d);
            setSleepLaterClicked(false);
            setSleepNowClicked(true);
          }}
        />
      )}
      {anyButtonClicked && (
        <button className="circle-button button-return" onClick={resetButtons}>
          <FontAwesomeIcon icon={faArrowLeft} size="lg" color="white" />
        </button>
      )}
      <div className="button-container">
        <button
          aria-label="now"
          className={`circle-button button1 ${
            sleepNowClicked
              ? 'button-top-left'
              : sleepLaterClicked || wakeUpAtClicked
                ? 'button-top-right'
                : ''
          }`}
          onClick={() => {
            setDate(new Date());
            setSleepNowClicked(true);
            setSleepLaterClicked(false);
            setWakeUpAtClicked(false);
          }}
        >
          <FontAwesomeIcon icon={faBed} size="lg" color="white" />
        </button>
        <button
          aria-label="later"
          className={`circle-button button2 ${
            sleepLaterClicked
              ? 'button-top-left'
              : sleepNowClicked || wakeUpAtClicked
                ? 'button-top-right'
                : ''
          }`}
          onClick={() => {
            setSleepLaterClicked(true);
            setSleepNowClicked(false);
            setWakeUpAtClicked(false);
          }}
        >
          <FontAwesomeIcon icon={faClock} size="lg" color="white" />
        </button>
        <button
          aria-label="wake"
          className={`circle-button button3 ${
            wakeUpAtClicked
              ? 'button-top-left'
              : sleepNowClicked || sleepLaterClicked
                ? 'button-top-right'
                : ''
          }`}
          onClick={() => {
            setWakeUpAtClicked(true);
            setSleepNowClicked(false);
            setSleepLaterClicked(false);
          }}
        >
          <FontAwesomeIcon icon={faSun} size="lg" color="white" />
        </button>
      </div>
    </>
  );
}
