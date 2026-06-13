import { addToLocalStorage, getFromLocalStorage } from './local-storage';

export const addLastVisitDate = (): void => {
  const today = new Date();
  addToLocalStorage('lastVisit', today.toISOString());
};

export const getDaysSinceLastVisit = (): number => {
  const lastVisitDateStr = getFromLocalStorage('lastVisit');
  if (!lastVisitDateStr) {
    return -1;
  }

  const lastVisitDate = new Date(lastVisitDateStr);
  const today = new Date();

  const diffInTime = today.getTime() - lastVisitDate.getTime();
  const diffInDays = diffInTime / (1000 * 3600 * 24);

  return Math.floor(diffInDays);
};
