'use client';
import { useState, Suspense, useContext, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faBed,
  faClock,
  faSun,
} from '@fortawesome/free-solid-svg-icons';
import TimeOptions from './sleep-now';
import SleepTimePrompt from './sleep-time';
import { FadingTextContext } from '../../contexts/FadingTextContext';
import WakeTimePrompt from './wake-time';
import { set } from 'yaml/dist/schema/yaml-1.1/set';

export default function Sleep() {
  const searchParams = useSearchParams();
  const { setText, setShow } = useContext(FadingTextContext);
  const router = useRouter();
  const page = searchParams?.get('sleep');
  const [date, setDate] = useState(new Date());
  const [sleepNowClicked, setSleepNowClicked] = useState(page === 'now');
  const [sleepLaterClicked, setSleepLaterClicked] = useState(page === 'time');
  const [wakeUpAtClicked, setWakeUpAtClicked] = useState(false);
  const [wake, setWake] = useState(false);

  const anyButtonClicked =
    sleepNowClicked || sleepLaterClicked || wakeUpAtClicked;

  useEffect(() => {
    if (!sleepNowClicked && !sleepLaterClicked)
      setText('Sleep now, later, or set a wake time');
  }, []);
  const resetButtons = () => {
    setText('');
    setSleepNowClicked(false);
    setSleepLaterClicked(false);
    setWakeUpAtClicked(false);
    const newUrl = `${window.location.pathname}`;
    router.replace(newUrl);
  };

  const SleepWakeOptions = useCallback(
    () => <TimeOptions date={date} wake={wake} />,
    [wake, setWake],
  );

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {sleepNowClicked && <SleepWakeOptions />}
      {sleepLaterClicked && (
        <SleepTimePrompt
          setDate={(d: Date) => {
            setDate(d);
            setWake(false);
            setSleepLaterClicked(false);
            setSleepNowClicked(true);
          }}
        />
      )}
      {wakeUpAtClicked && (
        <WakeTimePrompt
          setDate={(d: Date) => {
            setDate(d);
            setSleepLaterClicked(false);
            setWake(true);
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
            setWake(false);
            setSleepNowClicked(true);
            setSleepLaterClicked(false);
            setWakeUpAtClicked(false);
            router.replace(`${window.location.pathname}?sleep=now`);
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
            router.replace(`${window.location.pathname}?sleep=time`);
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
            setText('Select the time you wish to wake up');
            setWakeUpAtClicked(true);
            setSleepNowClicked(false);
            setSleepLaterClicked(false);
          }}
        >
          <FontAwesomeIcon icon={faSun} size="lg" color="white" />
        </button>
      </div>
    </Suspense>
  );
}
