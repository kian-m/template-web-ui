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
