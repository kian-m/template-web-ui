'use client';

import React from 'react';

interface RatingScaleProps {
  value: number; // 0 = unset, 1..5
  onChange: (value: number) => void;
  /** 'quality' = higher is better (brand gradient); 'severity' = green→red. */
  variant?: 'quality' | 'severity';
  ariaLabel?: string;
}

/** A 1-5 segmented scale. Tapping the active segment clears back to 0. */
const RatingScale: React.FC<RatingScaleProps> = ({
  value,
  onChange,
  variant = 'quality',
  ariaLabel,
}) => (
  <div
    className={`rating-scale rating-scale--${variant}`}
    role="radiogroup"
    aria-label={ariaLabel}
  >
    {[1, 2, 3, 4, 5].map((n) => (
      <button
        key={n}
        type="button"
        role="radio"
        aria-checked={value === n}
        aria-label={`${n} of 5`}
        className={`rating-seg ${n <= value ? 'on' : ''} sev-${value}`}
        onClick={() => onChange(value === n ? 0 : n)}
      >
        {n}
      </button>
    ))}
  </div>
);

export default RatingScale;
