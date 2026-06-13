'use client';

import { useEffect, useRef, useState } from 'react';

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

/** Animate an integer from 0 to `target` once on mount. */
export function useCountUp(target: number, duration = 1200): number {
  const [value, setValue] = useState(0);
  const startedAt = useRef<number | null>(null);

  useEffect(() => {
    let raf = 0;
    startedAt.current = null;
    const tick = (now: number) => {
      if (startedAt.current === null) startedAt.current = now;
      const t = Math.min(1, (now - startedAt.current) / duration);
      setValue(Math.round(target * easeOutCubic(t)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}
