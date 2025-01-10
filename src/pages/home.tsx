import Landing from './landing';
import React from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
export default function Home() {
  return (
    <div>
      <Landing />
      <Analytics />
      <SpeedInsights />
    </div>
  );
}
