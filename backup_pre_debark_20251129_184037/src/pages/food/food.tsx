'use client';
import { useState, Suspense, useContext, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faCoffee,
  faUtensils,
  faDrumstickBite,
} from '@fortawesome/free-solid-svg-icons';
import { FadingTextContext } from '../../contexts/FadingTextContext';

export default function Food() {
  const searchParams = useSearchParams();
  const { setText, setShow } = useContext(FadingTextContext);
  const router = useRouter();
  const page = searchParams?.get('food');
  const [breakfastClicked, setBreakfastClicked] = useState(
    page === 'breakfast',
  );
  const [lunchClicked, setLunchClicked] = useState(page === 'lunch');
  const [dinnerClicked, setDinnerClicked] = useState(page === 'dinner');

  const anyButtonClicked = breakfastClicked || lunchClicked || dinnerClicked;

  useEffect(() => {
    if (!breakfastClicked && !lunchClicked && !dinnerClicked)
      setText('Select breakfast, lunch, or dinner');
  }, []);

  const resetButtons = () => {
    setText('');
    setBreakfastClicked(false);
    setLunchClicked(false);
    setDinnerClicked(false);
    const newUrl = `${window.location.pathname}`;
    router.replace(newUrl);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {anyButtonClicked && (
        <button className="circle-button button-return" onClick={resetButtons}>
          <FontAwesomeIcon icon={faArrowLeft} size="lg" color="white" />
        </button>
      )}
      <div className="button-container">
        <button
          aria-label="breakfast"
          className={`circle-button button1 ${
            breakfastClicked
              ? 'button-top-left'
              : lunchClicked || dinnerClicked
                ? 'button-top-right'
                : ''
          }`}
          onClick={() => {
            setBreakfastClicked(true);
            setLunchClicked(false);
            setDinnerClicked(false);
            router.replace(`${window.location.pathname}?food=breakfast`);
          }}
        >
          <FontAwesomeIcon icon={faCoffee} size="lg" color="white" />
        </button>
        <button
          aria-label="lunch"
          className={`circle-button button2 ${
            lunchClicked
              ? 'button-top-left'
              : breakfastClicked || dinnerClicked
                ? 'button-top-right'
                : ''
          }`}
          onClick={() => {
            setLunchClicked(true);
            setBreakfastClicked(false);
            setDinnerClicked(false);
            router.replace(`${window.location.pathname}?food=lunch`);
          }}
        >
          <FontAwesomeIcon icon={faUtensils} size="lg" color="white" />
        </button>
        <button
          aria-label="dinner"
          className={`circle-button button3 ${
            dinnerClicked
              ? 'button-top-left'
              : breakfastClicked || lunchClicked
                ? 'button-top-right'
                : ''
          }`}
          onClick={() => {
            setDinnerClicked(true);
            setBreakfastClicked(false);
            setLunchClicked(false);
            router.replace(`${window.location.pathname}?food=dinner`);
          }}
        >
          <FontAwesomeIcon icon={faDrumstickBite} size="lg" color="white" />
        </button>
      </div>
    </Suspense>
  );
}
