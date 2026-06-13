'use client';

import { useState, useContext, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faBed,
  faClock,
  faSun,
} from '@fortawesome/free-solid-svg-icons';
import TimeOptions from './sleep-now';
import SleepTimePrompt from './sleep-time';
import WakeTimePrompt from './wake-time';
import { FadingTextContext } from '../../contexts/FadingTextContext';

type Mode = 'menu' | 'now' | 'later' | 'wake';

// Top fading-text hint shown for each page of the sleep flow.
const HINT: Record<Mode, (wake: boolean) => string> = {
  menu: () => 'Sleep now, later, or set a wake time',
  later: () => 'Select the time you wish to go to bed',
  wake: () => 'Select the time you wish to wake up',
  now: (wake) =>
    wake
      ? 'Select a time to sleep to wake between deep sleep cycles'
      : 'Select a time to wake between deep sleep cycles',
};

export default function Sleep({ onExit }: { onExit: () => void }) {
  const { setText } = useContext(FadingTextContext);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState<Mode>('menu');
  const [wake, setWake] = useState(false);

  // Single source of truth: the hint follows the current page.
  useEffect(() => {
    setText(HINT[mode](wake));
  }, [mode, wake, setText]);

  // Back goes up one level (to the menu), or exits to the home screen.
  const back = () => {
    if (mode === 'menu') onExit();
    else setMode('menu');
  };

  return (
    <>
      {mode === 'now' && <TimeOptions date={date} />}
      {mode === 'later' && (
        <SleepTimePrompt
          setDate={(d: Date) => {
            setDate(d);
            setWake(false);
            setMode('now');
          }}
        />
      )}
      {mode === 'wake' && (
        <WakeTimePrompt
          setDate={(d: Date) => {
            setDate(d);
            setWake(true);
            setMode('now');
          }}
        />
      )}

      <button
        className="circle-button button-return"
        onClick={back}
        aria-label="back"
      >
        <FontAwesomeIcon icon={faArrowLeft} size="lg" color="white" />
      </button>

      {mode === 'menu' && (
        <div className="button-container">
          <button
            aria-label="sleep now"
            className="circle-button button1"
            onClick={() => {
              setDate(new Date());
              setWake(false);
              setMode('now');
            }}
          >
            <FontAwesomeIcon icon={faBed} size="lg" color="white" />
            <span className="circle-button-label">Sleep now</span>
          </button>
          <button
            aria-label="sleep at a time"
            className="circle-button button2"
            onClick={() => setMode('later')}
          >
            <FontAwesomeIcon icon={faClock} size="lg" color="white" />
            <span className="circle-button-label">Sleep at…</span>
          </button>
          <button
            aria-label="wake at a time"
            className="circle-button button3"
            onClick={() => setMode('wake')}
          >
            <FontAwesomeIcon icon={faSun} size="lg" color="white" />
            <span className="circle-button-label">Wake at…</span>
          </button>
        </div>
      )}
    </>
  );
}
