export const correctForTimeZone = (timeZone: string | null) => {
  switch (timeZone) {
    case 'America/Anchorage': {
      return 9;
    }
    case 'Pacific/Honolulu': {
      return 10;
    }
    case 'America/New_York': {
      return 5;
    }
    case 'America/Chicago': {
      return 6;
    }
    case 'America/Denver': {
      return 7;
    }
    case 'America/Los_Angeles': {
      return 8;
    }
    default: {
      return 0;
    }
  }
};
