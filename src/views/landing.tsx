'use client';

import { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faCalendarDays,
  faDumbbell,
  faGear,
  faMoon,
  faPerson,
  faPills,
  faUtensils,
  faWineBottle,
} from '@fortawesome/free-solid-svg-icons';
import Sleep from './sleep/sleep';
import ProgressStrip from '../components/ProgressStrip';
import { FadingTextContext } from '../contexts/FadingTextContext';
import { getTrackerConfig } from '../utils/tracker-storage';
import type { TrackerConfig } from '../types/trackers';
import Gym from './gym';
import Food from './food/food';
import Calendar from './calendar/calendar';
import DayEditor from './calendar/day-editor';
import Config from './config/config';
import Sober from './sober/sober';
import BodyMap from './symptoms/body-map';
import Medications from './medications';

type View =
  | 'gym'
  | 'food'
  | 'sleep'
  | 'calendar'
  | 'config'
  | 'sober'
  | 'symptoms'
  | 'medications';

export default function Landing() {
  const { setText } = useContext(FadingTextContext);
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState<View | null>(null);
  const [bodyMapDate, setBodyMapDate] = useState<string | undefined>(undefined);
  const [stripDate, setStripDate] = useState<string | null>(null);
  const [stripVersion, setStripVersion] = useState(0);
  const [config, setConfig] = useState<TrackerConfig | null>(null);

  useEffect(() => {
    setLoaded(true);
    setConfig(getTrackerConfig());
  }, []);

  const goHome = () => {
    setText('');
    setView(null);
    setBodyMapDate(undefined);
    // Re-read config so trackers toggled in the config view appear/disappear.
    setConfig(getTrackerConfig());
  };

  const openBodyMap = (date?: string) => {
    setBodyMapDate(date);
    setView('symptoms');
  };

  // Avoid hydration mismatch: config is read from localStorage on the client only.
  if (!loaded) return null;

  // Sleep has its own two-level navigation, so it owns its back button.
  const showSharedBack = view !== null && view !== 'sleep';

  return (
    <>
      {showSharedBack && (
        <button
          className="circle-button button-return"
          onClick={goHome}
          aria-label="back"
        >
          <FontAwesomeIcon icon={faArrowLeft} size="lg" color="white" />
        </button>
      )}

      {view === 'sleep' && <Sleep onExit={goHome} />}
      {view === 'gym' && <Gym />}
      {view === 'food' && <Food />}
      {view === 'calendar' && <Calendar onOpenBodyMap={openBodyMap} />}
      {view === 'config' && (
        <Config onChanged={() => setConfig(getTrackerConfig())} />
      )}
      {view === 'sober' && <Sober />}
      {view === 'symptoms' && <BodyMap date={bodyMapDate} />}
      {view === 'medications' && <Medications />}

      {view === null && (
        <div className="button-container">
          {config?.daily.workout?.enabled && (
            <button
              aria-label="gym"
              className="circle-button button1"
              onClick={() => setView('gym')}
            >
              <FontAwesomeIcon icon={faDumbbell} size="lg" color="white" />
            </button>
          )}
          {config?.daily.food?.enabled && (
            <button
              aria-label="eat"
              className="circle-button button2"
              onClick={() => setView('food')}
            >
              <FontAwesomeIcon icon={faUtensils} size="lg" color="white" />
            </button>
          )}
          <button
            aria-label="sleep"
            className="circle-button button3"
            onClick={() => setView('sleep')}
          >
            <FontAwesomeIcon icon={faMoon} size="lg" color="white" />
          </button>
          {config?.sobriety.enabled && (
            <button
              aria-label="sober"
              className="circle-button button4"
              onClick={() => setView('sober')}
            >
              <FontAwesomeIcon icon={faWineBottle} size="lg" color="white" />
            </button>
          )}
          {config?.medications.enabled && (
            <button
              aria-label="medications"
              className="circle-button button5"
              onClick={() => setView('medications')}
            >
              <FontAwesomeIcon icon={faPills} size="lg" color="white" />
            </button>
          )}
          {config?.symptoms.enabled && (
            <button
              aria-label="symptoms"
              className="circle-button button6"
              onClick={() => openBodyMap(undefined)}
            >
              <FontAwesomeIcon icon={faPerson} size="lg" color="white" />
            </button>
          )}
          <button
            aria-label="calendar"
            className="corner-button corner-calendar"
            onClick={() => setView('calendar')}
          >
            <FontAwesomeIcon icon={faCalendarDays} size="lg" color="white" />
          </button>
          <button
            aria-label="config"
            className="corner-button corner-config"
            onClick={() => setView('config')}
          >
            <FontAwesomeIcon icon={faGear} size="lg" color="white" />
          </button>

          <ProgressStrip
            version={stripVersion}
            onSelectDate={(d) => setStripDate(d)}
          />
        </div>
      )}

      {stripDate && (
        <DayEditor
          date={stripDate}
          onClose={() => {
            setStripDate(null);
            setStripVersion((v) => v + 1);
          }}
          onOpenBodyMap={(d) => {
            setStripDate(null);
            openBodyMap(d);
          }}
        />
      )}
    </>
  );
}
