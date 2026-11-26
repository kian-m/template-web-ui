import {
  FaFacebook,
  FaInstagram,
  FaMailBulk,
  FaSpotify,
  FaTiktok,
  FaYoutube,
} from 'react-icons/fa';
import React from 'react';

export default function SocialMediaIconLinks() {
  return (
    <div className="flex gap-2 text-lg">
      <a
        href={'https://www.tiktok.com/@kaciejewelhill'}
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaTiktok className="hover:text-blue-600 hover:opacity-30" />
      </a>
      <a
        href={'https://m.facebook.com/profile.php/?id=61551725507991'}
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaFacebook className="hover:text-blue-600 hover:opacity-30" />
      </a>
      <a
        href={'https://www.instagram.com/kaciejewelhill/'}
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaInstagram className="hover:text-red-500 hover:opacity-30" />
      </a>
      <a href="#substack">
        <FaMailBulk className="hover:opacity-30" />
      </a>
      <a
        href={'https://open.spotify.com/artist/5EJtlbDLAUpy3CPKdmpHb4?si=5JV9rdiVR52WFC4FzpK4_A'}
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaSpotify className="hover:text-green-700 hover:opacity-30" />
      </a>
      <a
        href={'https://www.youtube.com/@kaciejewelhill'}
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaYoutube className="hover:text-red-600 hover:opacity-30" />
      </a>
    </div>
  );
}
