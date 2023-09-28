'use client';

import React, { useReducer, useState, useRef, forwardRef } from 'react';
import Links, { Action, State } from '../components/Links';

import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import { FaSpotify } from 'react-icons/fa';

import EmailListSignUp from '../components/EmailListSignUp';
import Image from 'next/image';
import PageBottom from '../components/PageBottom';
export default function Landing() {
  const bottomRef = React.useRef();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [bottomVisible, setBottomVisible] = useState(false);
  const [showSubscribe, setShowSubscribe] = useState(true);

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div>
      <button
        role={'menu-button'}
        className="group rounded-lg border border-transparent px-4 py-3 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        onClick={toggleMenu}
      >
        {isMenuOpen ? <MinusIcon /> : <AddIcon />}
      </button>
      {isMenuOpen && <Links dispatch={dispatch} />}
      <div className="relative">
        <Image
          src="/album-art.webp"
          alt="album art"
          width="2000"
          height="1000"
        />
        <div className="absolute bottom-10 left-0 right-0 text-center">
          <button className="w-5/6 h-20 bg-gray-100 bg-opacity-10 text-white text-2xl  times-italic drop-shadow-lg ">
            <a
              href={
                'https://open.spotify.com/artist/3R1c8eb89rUzGW6Ac1EhPj?si=0ksVJXvNQEe_AIE7R1dJeg'
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              {' '}
              <div className={'flex flex-col items-center justify-between'}>
                {'"SLOW MOVING" OUT NOW'}
                <FaSpotify />
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
              <div>
                email:
                <a
                  style={{ color: 'navy' }}
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
              <p>
                {' '}
                <b>Next Show:</b> October 13th{' '}
                <a
                  style={{ color: 'blue' }}
                  href={
                    'https://www.google.com/travel/hotels/s/FPq7sHiCP9SJJucX8'
                  }
                >
                  Smiley`s Saloon
                </a>{' '}
                in Bolinas, CA with Freight Train Lady & Dana (Big Dog)
              </p>
            ),
            visible: state.showShows,
            name: 'shows',
          },
          {
            component: (
              <>
                <p>
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
