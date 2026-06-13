'use client';

import React, { useEffect, useState } from 'react';
import {
  getSymptomsForDate,
  setSymptomSeverity,
  toDateKey,
} from '../../utils/tracker-storage';
import RatingScale from '../../components/RatingScale';
import type { BodyView } from '../../types/trackers';

// ---------------------------------------------------------------------------
// Anatomical paths (viewBox 200 x 520, symmetric about x = 100).
// Side limbs are authored for the viewer's RIGHT and mirrored for the left.
// ---------------------------------------------------------------------------

const HEAD =
  'M100,12 C83,12 73,27 73,43 C73,60 84,74 100,74 C116,74 127,60 127,43 C127,27 117,12 100,12 Z';
const NECK = 'M89,71 L111,71 L110,87 C107,92 93,92 90,87 Z';

// Torso panels differ between front and back.
const CHEST = 'M72,104 C84,96 116,96 128,104 C133,126 131,150 126,170 L74,170 C69,150 67,126 72,104 Z';
const ABDOMEN = 'M75,172 L125,172 C127,200 123,230 115,248 L85,248 C77,230 73,200 75,172 Z';
const PELVIS = 'M85,250 L115,250 C119,266 114,288 100,296 C86,288 81,266 85,250 Z';
const GLUTES = 'M83,250 L117,250 C121,272 112,295 100,295 C88,295 79,272 83,250 Z';

// Right-side limbs (mirrored to make the left).
const SHOULDER = 'M120,98 C134,93 149,99 151,112 C151,121 142,125 132,122 C123,119 119,109 120,98 Z';
const UPPER_ARM = 'M150,112 C159,115 161,128 159,144 L155,184 C154,190 146,190 144,184 L140,130 C140,119 144,114 150,112 Z';
const FOREARM = 'M155,188 C159,193 159,212 157,234 L153,272 C152,279 145,279 144,272 L140,234 C139,212 140,194 145,189 C148,186 152,186 155,188 Z';
const HAND = 'M153,276 C159,281 161,295 156,307 C152,317 143,317 139,307 C136,296 138,282 144,277 C147,275 150,275 153,276 Z';
const THIGH = 'M101,252 C116,252 125,263 125,281 L121,360 C120,372 105,372 104,360 L99,289 C99,268 99,256 101,252 Z';
const SHIN = 'M119,366 C123,371 123,400 121,430 L117,470 C116,476 107,476 106,470 L103,420 C102,396 104,372 108,368 C111,365 116,365 119,366 Z';
const FOOT_FRONT = 'M106,472 C115,472 123,477 125,487 C126,493 121,497 113,497 L104,497 C101,497 100,490 100,482 C100,476 102,472 106,472 Z';
const FOOT_BACK = 'M105,472 C114,472 121,478 122,488 C122,495 116,498 108,497 L102,496 C100,494 100,488 100,481 C100,475 101,472 105,472 Z';

interface Region {
  id: string;
  label: string;
  d: string;
  mirror?: boolean;
}

const SIDE = [
  { id: 'shoulder', label: 'Shoulder', d: SHOULDER },
  { id: 'upper-arm', label: 'Upper arm', d: UPPER_ARM },
  { id: 'forearm', label: 'Forearm', d: FOREARM },
  { id: 'hand', label: 'Hand', d: HAND },
  { id: 'thigh', label: 'Thigh', d: THIGH },
  { id: 'shin', label: 'Shin', d: SHIN },
];

const buildRegions = (view: BodyView): Region[] => {
  const back = view === 'back';
  const sfx = back ? ' (back)' : '';
  const foot = back ? FOOT_BACK : FOOT_FRONT;

  const center: Region[] = back
    ? [
        { id: 'head', label: 'Head (back)', d: HEAD },
        { id: 'neck', label: 'Neck (back)', d: NECK },
        { id: 'upper-back', label: 'Upper back', d: CHEST },
        { id: 'lower-back', label: 'Lower back', d: ABDOMEN },
        { id: 'glutes', label: 'Glutes', d: GLUTES },
      ]
    : [
        { id: 'head', label: 'Head / Face', d: HEAD },
        { id: 'neck', label: 'Neck', d: NECK },
        { id: 'chest', label: 'Chest', d: CHEST },
        { id: 'abdomen', label: 'Abdomen', d: ABDOMEN },
        { id: 'pelvis', label: 'Pelvis', d: PELVIS },
      ];

  const sides = [...SIDE, { id: 'foot', label: back ? 'Heel' : 'Foot', d: foot }];

  const right = sides.map((s) => ({
    id: `r-${s.id}`,
    label: `Right ${s.label.toLowerCase()}${sfx}`,
    d: s.d,
  }));
  const left = sides.map((s) => ({
    id: `l-${s.id}`,
    label: `Left ${s.label.toLowerCase()}${sfx}`,
    d: s.d,
    mirror: true,
  }));

  return [...center, ...right, ...left];
};

// Non-interactive detail lines that distinguish front from back.
const FRONT_ACCENTS = [
  'M78,101 C88,97 112,97 122,101', // collarbone
  'M100,110 L100,168', // sternum
  'M86,120 C92,135 98,141 100,141', // left pec
  'M114,120 C108,135 102,141 100,141', // right pec
  'M100,176 L100,246', // linea alba
  'M91,192 L109,192',
  'M92,212 L108,212',
  'M93,230 L107,230',
];
const BACK_ACCENTS = [
  'M100,94 L100,250', // spine
  'M84,116 C90,122 92,132 90,140', // left scapula
  'M116,116 C110,122 108,132 110,140', // right scapula
  'M80,250 L120,250', // waist
  'M100,252 L100,292', // glute crease
  'M108,360 C112,378 112,398 110,418', // calf hints
  'M92,360 C88,378 88,398 90,418',
];

const SEVERITY_FILL = ['', '#5ec98b', '#bcd35a', '#f4c14e', '#ef8f4b', '#e25563'];

interface BodyMapProps {
  date?: string; // YYYY-MM-DD; defaults to today
}

const BodyMap: React.FC<BodyMapProps> = ({ date }) => {
  const [dateKey] = useState(date ?? toDateKey(new Date()));
  const [view, setView] = useState<BodyView>('front');
  const [severities, setSeverities] = useState<Record<string, number>>({});
  const [selected, setSelected] = useState<Region | null>(null);

  useEffect(() => {
    setSeverities(getSymptomsForDate(dateKey));
  }, [dateKey]);

  const regions = buildRegions(view);
  const accents = view === 'front' ? FRONT_ACCENTS : BACK_ACCENTS;
  const keyFor = (id: string) => `${view}:${id}`;
  const loggedCount = Object.keys(severities).length;

  const pick = (region: Region) =>
    setSelected((cur) => (cur?.id === region.id ? null : region));

  const setSeverity = (region: Region, value: number) => {
    setSymptomSeverity(dateKey, keyFor(region.id), value);
    setSeverities(getSymptomsForDate(dateKey));
  };

  const fillFor = (id: string): string => {
    const sev = severities[keyFor(id)] ?? 0;
    return sev > 0 ? SEVERITY_FILL[sev] : 'url(#bodyGrad)';
  };

  return (
    <div className="body-map">
      <div className="body-map-tabs">
        <button
          type="button"
          className={`body-tab ${view === 'front' ? 'active' : ''}`}
          onClick={() => {
            setView('front');
            setSelected(null);
          }}
        >
          Front
        </button>
        <button
          type="button"
          className={`body-tab ${view === 'back' ? 'active' : ''}`}
          onClick={() => {
            setView('back');
            setSelected(null);
          }}
        >
          Back
        </button>
      </div>

      <svg
        className="body-svg"
        viewBox="0 0 200 520"
        role="group"
        aria-label={`${view} body map`}
      >
        <defs>
          <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.26)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.09)" />
          </linearGradient>
        </defs>

        {regions.map((r) => (
          <path
            key={r.id}
            d={r.d}
            className={`body-region${selected?.id === r.id ? ' selected' : ''}`}
            fill={fillFor(r.id)}
            transform={r.mirror ? 'translate(200,0) scale(-1,1)' : undefined}
            role="button"
            tabIndex={0}
            aria-label={`${r.label}${
              severities[keyFor(r.id)]
                ? `, severity ${severities[keyFor(r.id)]}`
                : ''
            }`}
            onClick={() => pick(r)}
          />
        ))}

        <g className="body-accents">
          {accents.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
      </svg>

      {selected ? (
        <div className="region-sheet">
          <div className="region-sheet-head">
            <h3>{selected.label}</h3>
            <button
              type="button"
              className="sheet-close"
              onClick={() => setSelected(null)}
              aria-label="Close"
            >
              ×
            </button>
          </div>
          <RatingScale
            variant="severity"
            value={severities[keyFor(selected.id)] ?? 0}
            onChange={(v) => setSeverity(selected, v)}
            ariaLabel={`${selected.label} severity`}
          />
          <p className="scale-caption">1 mild · 5 severe · tap again to clear</p>
        </div>
      ) : (
        <p className="body-map-hint">
          {loggedCount > 0
            ? `${loggedCount} area${loggedCount === 1 ? '' : 's'} logged — tap a part to adjust`
            : 'Tap any body part to rate a symptom 1–5.'}
        </p>
      )}
    </div>
  );
};

export default BodyMap;
