'use client';

import React, { useContext } from 'react';
import { FadingTextProvider } from '../contexts/FadingTextContext';
import Landing from './landing';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Calendar from './calendar/calendar';

export default function Home() {
  return (
    <div>
      <FadingTextProvider>
        <Landing />
        <Analytics />
        <SpeedInsights />
      </FadingTextProvider>
    </div>
  );
}
