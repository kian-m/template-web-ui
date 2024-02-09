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

import BottomSocialMediaLinks from '../components/EmailListSignUp';
import Image from 'next/image';
import PageBottomWindow from '../components/PageBottom';
import { getSheetData, SheetData } from '../services/sheets';
import one from '../../public/1.webp';
import two from '../../public/2.webp';
import three from '../../public/3.webp';
import four from '../../public/4.webp';
import five from '../../public/5.webp';
import six from '../../public/6.webp';
import seven from '../../public/7.webp';
import eight from '../../public/8.webp';
import nine from '../../public/9.webp';
import ten from '../../public/10.webp';
import eleven from '../../public/11.webp';
import twelve from '../../public/12.webp';
import thirteen from '../../public/13.webp';
import fourteen from '../../public/14.webp';
import sixteen from '../../public/16.webp';
import seventeen from '../../public/17.webp';
import eighteen from '../../public/18.webp';
import nineteen from '../../public/19.webp';
import twentyone from '../../public/21.webp';
import twentytwo from '../../public/22.webp';
import twentythree from '../../public/23.webp';

const images = [
  fourteen,
  sixteen,
  seventeen,
  eighteen,
  nineteen,
  twentyone,
  twentytwo,
  thirteen,
  twentythree,
  one,
  two,
  three,
  four,
  five,
  six,
  seven,
  eight,
  nine,
  ten,
  eleven,
  twelve,
];
export default function Landing() {
  const [bottomVisible, setBottomVisible] = useState(false);
  const [showSubscribe, setShowSubscribe] = useState(true);
  const [outNowVisible, setOutNowVisible] = useState(true);

  const setBottomAndButtonVisible = () => {
    setOutNowVisible(true);
    setBottomVisible(false);
  };

  const initialState = {
    showContact: false,
    showShows: false,
    showGallery: false,
    showAboutMe: false,
  };

  const toggleToBottomContent = () => {
    setOutNowVisible(true);
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
        setOutNowVisible(false);
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
            <p>{date}</p>
            <p>{place}</p>
          </div>,
        );
      });
    });
    return showRow;
  }, [getSheetData]);

  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <div className={'flex flex-col'}>
      <div>
        <Links dispatch={dispatch} />
      </div>
      <div>
        <Image
          src="/album-art.webp"
          alt="album art"
          width="2000"
          height="1000"
        />
      </div>
      {outNowVisible && (
        <div className="-mt-28 h-32 lg:sticky md:sticky bottom-1/2 flex justify-center ">
          <button className="w-5/6  bg-gray-100 bg-opacity-10 text-white text-2xl times-italic drop-shadow-lg">
            <a
              href={'https://spotify.link/cOgz1twyuDb'}
              target="_blank"
              rel="noopener noreferrer"
            >
              {' '}
              <div
                className={
                  'flex flex-col items-center justify-between whitespace-nowrap'
                }
              >
                {'"SLOW MOVING" OUT NOW'}
                <FaSpotify className="hover:text-green-700 hover:opacity-30" />
              </div>
            </a>
          </button>
        </div>
      )}
      <div
        className={
          'md:sticky md:bottom-0 md:mt-20 lg:sticky lg:bottom-0 lg:mt-20  overflow-auto '
        }
      >
        <BottomSocialMediaLinks
          showSubscribe={showSubscribe}
          setShowSubscribe={setShowSubscribe}
        />
        <PageBottomWindow
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
              name: 'gallery',
              visible: state.showGallery,
              component: (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative h-full">
                      <img src={image.src} />
                    </div>
                  ))}
                </div>
              ),
            },
            {
              component: <p className={'p-5 opacity-90'}>{shows}</p>,
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
                    winning over audiences in the Bay Area and Southern
                    California with her heartfelt and authentic songs, playing
                    notable venues such as The Catalyst in Santa Cruz and Cafe
                    du Nord in SF. Drawing from influences spanning folk, indie,
                    and alternative genres, Kacie has crafted a distinctive
                    sound that merges introspective storytelling with
                    captivating melodies. Kacie`s latest single Slow Moving is
                    out now, with more on the way.{' '}
                  </p>
                </>
              ),
              visible: state.showAboutMe,
              name: 'about me',
            },
          ]}
          setVisible={setBottomAndButtonVisible}
          visible={bottomVisible}
        />
      </div>
    </div>
  );
}
