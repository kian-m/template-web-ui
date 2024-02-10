'use client';

import React, { useReducer, useState, ReactNode, useEffect } from 'react';
import Links, { Action, State } from '../components/Links';

import { FaSpotify } from 'react-icons/fa';

import BottomSocialMediaLinks from '../components/EmailListSignUp';
import Image from 'next/image';
import PageBottomWindow from '../components/PageBottom';
import { getSheetData, SheetData } from '../services/sheets';
import one from '../../public/1.webp';
import two from '../../public/2.webp';
import three from '../../public/3.webp';
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
import { correctForTimeZone } from '../utils/time-util';

const images = [
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
  seven,
  eight,
  nine,
  ten,
  eleven,
  twelve,
  fourteen,
];
export default function Landing() {
  const [bottomVisible, setBottomVisible] = useState(false);
  const [showSubscribe, setShowSubscribe] = useState(true);
  const [outNowVisible, setOutNowVisible] = useState(true);
  const [upcomingShows, setUpcomingShows] = useState<ReactNode[]>([]);
  const [pastShows, setPastShows] = useState<ReactNode[]>([]);
  const [aboutMeContent, setAboutMeContent] = useState('');

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

  useEffect(() => {
    getSheetData().then((data: SheetData) => {
      let pastShowRows: ReactNode[] = [];
      let upComingShowRows: ReactNode[] = [];

      data.forEach((data) => {
        const place = data.c[0].v;
        const displayTime = data.c[2].v === 'Display';
        if (data.c[4].v) {
          setAboutMeContent(data.c[4].v as string);
        }
        let date = new Date(data.c[1].v as string);
        let today = new Date();

        var options = {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          timeZone: 'America/Los_Angeles',
        };

        if (date >= today) {
          date.setHours(date.getHours());
          upComingShowRows.push(
            <div
              key={place}
              className={
                'flex flex-col items-center justify-center times-italic p-3'
              }
            >
              <p>
                {date.toLocaleString('en-US', options as any)}
                {displayTime && ', ' + date.toLocaleTimeString()}
              </p>
              <p>{place}</p>
            </div>,
          );
        } else if (date < today) {
          date.setHours(date.getHours());
          pastShowRows.push(
            <div
              key={place}
              className={
                'flex flex-col items-center justify-center times-italic p-3'
              }
            >
              <p>
                {date.toLocaleString('en-US', options as any)}
                {displayTime &&
                  ', ' +
                    date.toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: 'numeric',
                      second: undefined,
                    } as any)}
              </p>
              <p>{place}</p>
            </div>,
          );
        }
      });
      setPastShows(pastShowRows.reverse());
      setUpcomingShows(upComingShowRows.reverse());
    });
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
        <div className="-mt-32 h-32 lg:sticky md:sticky bottom-1/2 flex justify-center ">
          <button className=" rounded-md w-5/6 hover:bg-emerald-800 hover:opacity-40 bg-gray-100 bg-opacity-10 text-white text-2xl font-bold times-italic drop-shadow-lg">
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
                    style={{ color: 'dodgerblue' }}
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
              component: (
                <div className={'flex flex-col items-center'}>
                  {upcomingShows?.length > 0 && (
                    <>
                      <p
                        className={
                          'text-xl opacity-90 flex flex-col items-center justify-center times-italic font-extrabold underline'
                        }
                      >
                        Upcoming Shows
                      </p>

                      <p className={'opacity-90'}>{upcomingShows}</p>
                    </>
                  )}
                  {pastShows?.length > 0 && (
                    <>
                      <p
                        className={
                          'text-xl opacity-90 flex flex-col items-center justify-center times-italic font-extrabold underline'
                        }
                      >
                        Past Shows
                      </p>
                      <p className={'opacity-90'}>{pastShows}</p>
                    </>
                  )}
                </div>
              ),
              visible: state.showShows,
              name: 'shows',
            },
            {
              component: (
                <>
                  <p
                    className={
                      'text-white text-1xl drop-shadow-lg p-5 times-italic bg-gray-800 opacity-75'
                    }
                  >
                    {aboutMeContent}
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
