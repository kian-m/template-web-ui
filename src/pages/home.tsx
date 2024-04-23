import Landing from './landing';
import React from 'react';
import { Analytics } from '@vercel/analytics/react';
export default function Home() {
  return (
    <div>
      <Landing />
      <Analytics />
    </div>
  );
}
