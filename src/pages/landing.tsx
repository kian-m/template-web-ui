'use client';

import React, {
  useReducer,
  useState,
  useRef,
  forwardRef,
  useMemo,
  ReactNode,
} from 'react';
import Links, { Action, State } from '../components/Links';

import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import { FaSpotify } from 'react-icons/fa';

import EmailListSignUp from '../components/EmailListSignUp';
import Image from 'next/image';
import PageBottom from '../components/PageBottom';
import { getSheetData, SheetData } from '../services/sheets';
export default function Landing() {
  const [bottomVisible, setBottomVisible] = useState(false);
  const [showSubscribe, setShowSubscribe] = useState(true);
  const [date, setDate] = useState('');
  const [place, setPlace] = useState('');

  const shows = useMemo(() => {
    let showRow: ReactNode[] = [];
    getSheetData().then((data: SheetData) => {
      data.forEach((data) => {
        const place = data.c[0].v;
        const date = data.c[1].f;
        showRow.push(
          <div
            className={'flex flex-col items-center justify-center times-italic'}
          >
            <p className={''}>{date}</p>
            <p className={''}>{place}</p>
          </div>,
        );
      });
    });
    return showRow;
  }, [getSheetData]);
  const initialState = {
    showContact: false,
    showShows: false,
    showGallery: false,
    showAboutMe: false,
  };

  const toggleToBottomContent = () => {
    setBottomVisible(true);
    setShowSubscribe(false);
  };

  const reducer = (state: State, action: Action) => {
    switch (action.type) {
      case 'SHOW_CONTACT': {
        toggleToBottomContent();
        return { ...initialState, showContact: true };
      }
      case 'SHOW_SHOWS': {
        toggleToBottomContent();
        return { ...initialState, showShows: true };
      }
      case 'SHOW_GALLERY': {
        toggleToBottomContent();
        return { ...initialState, showGallery: true };
      }
      case 'SHOW_ABOUT_ME': {
        toggleToBottomContent();
        return { ...initialState, showAboutMe: true };
      }
      default:
        return initialState;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <div>
      <Links dispatch={dispatch} />
      <div className="relative">
        <Image
          src="/album-art.webp"
          alt="album art"
          width="2000"
          height="1000"
        />
        <div className="absolute bottom-10 left-0 right-0 text-center">
          <button className="w-5/6 h-20 bg-gray-100 bg-opacity-10 text-white text-2xl times-italic drop-shadow-lg">
            <a
              href={'https://spotify.link/cOgz1twyuDb'}
              target="_blank"
              rel="noopener noreferrer"
            >
              {' '}
              <div className={'flex flex-col items-center justify-between '}>
                {'"SLOW MOVING" OUT NOW'}
                <FaSpotify className="hover:text-green-700 hover:opacity-30" />
              </div>
            </a>
          </button>
        </div>
      </div>
      <EmailListSignUp
        showSubscribe={showSubscribe}
        setShowSubscribe={setShowSubscribe}
      />
      <PageBottom
        components={[
          {
            component: (
              <div className={'times-italic p-4'}>
                email:
                <a
                  style={{ color: 'cyan' }}
                  href="mailto:kaciehillmusic@gmail.com"
                >
                  kaciehillmusic@gmail.com
                </a>
              </div>
            ),
            visible: state.showContact,
            name: 'contact',
          },
          {
            component: (
              <p className={'p-5 border-x-gray-600-950 opacity-90'}>{shows}</p>
            ),
            visible: state.showShows,
            name: 'shows',
          },
          {
            component: (
              <>
                <p
                  className={
                    'text-white text-1xl drop-shadow-lg p-5 times-italic bg-emerald-800 opacity-75'
                  }
                >
                  San Francisco based singer/songwriter Kacie Hill has been
                  winning over audiences in the Bay Area and Southern California
                  with her heartfelt and authentic songs, playing notable venues
                  such as The Catalyst in Santa Cruz and Cafe du Nord in SF.
                  Drawing from influences spanning folk, indie, and alternative
                  genres, Kacie has crafted a distinctive sound that merges
                  introspective storytelling with captivating melodies. Kacie`s
                  latest single Slow Moving is out now, with more on the way.{' '}
                </p>
              </>
            ),
            visible: state.showAboutMe,
            name: 'about me',
          },
        ]}
        setVisible={setBottomVisible}
        visible={bottomVisible}
      />
    </div>
  );
}
