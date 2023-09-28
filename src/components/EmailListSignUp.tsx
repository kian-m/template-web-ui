import { CloseIcon, EmailIcon } from '@chakra-ui/icons';
import { FaFacebook, FaTwitter, FaInstagram, FaMailBulk } from 'react-icons/fa';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

export default function EmailListSignUp({
  showSubscribe,
  setShowSubscribe,
}: {
  showSubscribe: boolean;
  setShowSubscribe: (b: boolean) => void;
}) {
  return (
    <>
      <main className="grid grid-cols-4 gap-4 m-4 ml-12">
        <a
          href={'https://www.instagram.com/kaciehillmusic/?hl=en'}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaFacebook className="text-2xl" />
        </a>
        <a
          href={'https://www.instagram.com/kaciehillmusic/?hl=en'}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaInstagram className="text-2xl" />
        </a>
        <a
          href={'https://www.instagram.com/kaciehillmusic/?hl=en'}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaTwitter className="text-2xl" />
        </a>
        <button
          onClick={() => {
            setShowSubscribe(!showSubscribe);
          }}
        >
          <FaMailBulk className="text-2xl" />
        </button>
      </main>
      <div
        style={{ width: '100%', height: '1px', backgroundColor: 'white' }}
      ></div>
      {showSubscribe && (
        <CloseIcon
          boxSize={12}
          padding={2}
          onClick={() => {
            setShowSubscribe(!showSubscribe);
          }}
        />
      )}
      {showSubscribe && (
        <iframe
          src="https://kaciehill.substack.com/embed"
          width={'100%'}
          height="355"
        ></iframe>
      )}
    </>
  );
}
