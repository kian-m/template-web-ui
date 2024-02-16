import { CloseIcon } from '@chakra-ui/icons';
import { FaFacebook, FaInstagram, FaMailBulk, FaSpotify } from 'react-icons/fa';
import React from 'react';

export default function EmailListSignUp({
  showSubscribe,
  setShowSubscribe,
}: {
  showSubscribe: boolean;
  setShowSubscribe: (b: boolean) => void;
}) {
  return (
    <>
      <main className="relative flex flex-grow gap-12 m-4 justify-between">
        <a
          href={'https://m.facebook.com/profile.php/?id=61551725507991'}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaFacebook className="text-2xl hover:text-blue-600 hover:opacity-30" />
        </a>
        <a
          href={'https://www.instagram.com/kaciehillmusic/?hl=en'}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaInstagram className="text-2xl hover:text-red-500 hover:opacity-30" />
        </a>
        <button
          onClick={() => {
            setShowSubscribe(!showSubscribe);
          }}
        >
          <FaMailBulk className="text-2xl" />
        </button>
        <a
          href={'https://spotify.link/cOgz1twyuDb'}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaSpotify className="text-2xl hover:text-green-700 hover:opacity-30" />
        </a>
      </main>
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
          height="285"
        ></iframe>
      )}
    </>
  );
}
