'use client';
export const addToLocalStorage = (key: string, value: string): void => {
  if (global?.window !== undefined) {
    let existing: Record<string, any> = JSON.parse(
      localStorage.getItem('data') || '{}',
    );

    existing[key] = value;

    localStorage.setItem('data', JSON.stringify(existing));
  }
};

export const getFromLocalStorage = (key: string): string => {
  if (global?.window !== undefined) {
    const existing: Record<string, any> = JSON.parse(
      localStorage.getItem('data') || '{}',
    );

    return existing[key];
  }
  return '';
};

export const addSleepToLocalStorage = (date: string, score: number): void => {
  if (global?.window !== undefined) {
    let existing: Record<string, any> = JSON.parse(
      localStorage.getItem('sleep') || '{}',
    );

    existing[date] = score;
    localStorage.setItem('sleep', JSON.stringify(existing));
  }
};

export const getSleepScoreFromLocalStorage = (date: string): number => {
  if (global?.window !== undefined) {
    const existing: Record<string, any> = JSON.parse(
      localStorage.getItem('sleep') || '{}',
    );

    if (existing && existing.hasOwnProperty(date)) {
      return existing[date];
    }
  }
  return 0;
};
