'use client';

import React, {
  useReducer,
  useState,
  ReactNode,
  useEffect,
  useRef,
} from 'react';
import PageTopNavBar, { Action, State } from '../components/PageTopNavBar';

import { FaSpotify } from 'react-icons/fa';

import BottomSocialMediaLinks from '../components/SocialMediaIconLinks';
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
import sixteen from '../../public/16.webp';
import seventeen from '../../public/17.webp';
import eighteen from '../../public/18.webp';
import nineteen from '../../public/19.webp';
import twentyone from '../../public/21.webp';
import twentytwo from '../../public/22.webp';
import twentythree from '../../public/23.webp';

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
  eleven,
  twelve,
];
export default function Landing() {
  const [bottomVisible, setBottomVisible] = useState(true);
  const [showSubscribe, setShowSubscribe] = useState(true);
  const [outNowVisible, setOutNowVisible] = useState(false);
  const [upcomingShows, setUpcomingShows] = useState<ReactNode[]>([]);
  const [pastShows, setPastShows] = useState<ReactNode[]>([]);
  const [aboutMeContent, setAboutMeContent] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [songLink, setSongLink] = useState('');

  const aboutMeRef = useRef(null);
  const galleryRef = useRef(null);
  const showsRef = useRef(null);
  const contactMeRef = useRef(null);
  // @ts-ignore
  const scrollToExample = (ref) => {
    // @ts-ignore
    ref.current.scrollIntoView({ behavior: 'smooth' });
  };
  const setBottomAndButtonVisible = () => {
    // setOutNowVisible(true);
    setBottomVisible(false);
  };

  const initialState = {
    showContact: false,
    showShows: false,
    showGallery: false,
    showAboutMe: false,
  };

  const toggleToBottomContent = () => {
    setBottomVisible(true);
  };

  const reducer = (state: State, action: Action) => {
    switch (action.type) {
      case 'SHOW_CONTACT': {
        scrollToExample(contactMeRef);
        toggleToBottomContent();
        return { ...initialState, showContact: true };
      }
      case 'SHOW_SHOWS': {
        scrollToExample(showsRef);
        toggleToBottomContent();
        return { ...initialState, showShows: true };
      }
      case 'SHOW_GALLERY': {
        toggleToBottomContent();
        setOutNowVisible(false);
        scrollToExample(galleryRef);

        return { ...initialState, showGallery: true };
      }
      case 'SHOW_ABOUT_ME': {
        scrollToExample(aboutMeRef);
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
        if (data.c[4]) {
          if (data.c[4].v) {
            setAboutMeContent(data.c[4].v as string);
          }
        }
        if (data.c[5]) {
          if (data.c[5].v) {
            setVideoLink(data.c[5].v as string);
          }
        }
        if (data.c[6]) {
          if (data.c[6].v) {
            setSongLink(data.c[6].v as string);
          }
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
    <div className={'flex flex-col '}>
      <div>
        <PageTopNavBar dispatch={dispatch} />
      </div>

      <div>
        <iframe
          className="video"
          title="Youtube player"
          sandbox="allow-same-origin allow-forms allow-popups allow-scripts allow-presentation"
          height="555"
          width="100%"
          src={videoLink}
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
                {'"CHORES"\n' + 'THE SINGLE AND MUSIC VIDEO OUT NOW'}
                <FaSpotify className="hover:text-green-700 hover:opacity-30" />
              </div>
            </a>
          </button>
        </div>
      )}
      <button className="mb-10 mt-20 self-center w-32 bg-orange-100 hover:bg-yellow-300 text-black  py-2 px-4 times-italic ">
        <a href={songLink} target="_blank" rel="noopener noreferrer">
          {' '}
          <div
            ref={showsRef}
            className={
              'flex flex-col items-center justify-between whitespace-nowrap'
            }
          >
            {'LISTEN HERE'}
          </div>
        </a>
      </button>

      <div className={'  overflow-auto '}>
        <PageBottomWindow
          components={[
            {
              component: (
                <div
                  className={
                    'flex flex-col items-center border-2 p-10 m-5 mt-16 mb-32'
                  }
                >
                  {upcomingShows?.length > 0 && (
                    <>
                      <p
                        className={
                          'text-xl opacity-90 flex flex-col items-center justify-center times-italic font-extrabold mb-3'
                        }
                      >
                        Upcoming Shows
                      </p>

                      <p className={'opacity-90 mb-3 justify-self-center'}>
                        {upcomingShows}
                      </p>
                    </>
                  )}
                  {pastShows?.length > 0 && (
                    <>
                      <p
                        className={
                          'text-xl opacity-80 mb-3 flex flex-col items-center justify-center times-italic font-extrabold '
                        }
                      >
                        Past Shows
                      </p>
                      <p className={'opacity-50 justify-self-center'}>
                        {pastShows}
                      </p>
                    </>
                  )}
                </div>
              ),
              visible: true,
              name: 'shows',
            },
            {
              name: 'gallery',
              visible: true,
              component: (
                <div
                  ref={galleryRef}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                >
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
                <>
                  <p
                    ref={aboutMeRef}
                    className={
                      'text-white lg:text-1xl drop-shadow-lg p-5 times-italic  opacity-75  border-2 m-10 lg:m-40 md:m-40'
                    }
                  >
                    {aboutMeContent}
                  </p>
                </>
              ),
              visible: true,
              name: 'about me',
            },
            {
              component: (
                <div
                  ref={contactMeRef}
                  className={'times-italic p-4 m-20 mb-28 border-b-2'}
                >
                  email:
                  <a href="mailto:kaciehillmusic@gmail.com">
                    kaciehillmusic@gmail.com
                  </a>
                </div>
              ),
              visible: true,
              name: 'contact',
            },
          ]}
          setVisible={setBottomAndButtonVisible}
          visible={bottomVisible}
        />

        <BottomSocialMediaLinks
          showSubscribe={showSubscribe}
          setShowSubscribe={setShowSubscribe}
        />
      </div>
    </div>
  );
}
