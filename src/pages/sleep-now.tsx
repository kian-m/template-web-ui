import { useState, useEffect } from 'react';

const getWakeUpTimes = (time: number) => {
  const sleepCycleMinutes = 90;
  const fallAsleepMinutes = 20;
  const cycles = 6;
  const wakeUpTimes = [];

  let currentTime = new Date(time + fallAsleepMinutes * 60000);

  for (let i = 1; i <= cycles; i++) {
    currentTime = new Date(currentTime.getTime() + sleepCycleMinutes * 60000);
    wakeUpTimes.push(currentTime);
  }

  return wakeUpTimes;
};

const getColor = (index: number) => {
  const colors = [
    'rgb(144,86,115)',
    'rgba(212,111,147)',
    'rgba(248,158,157)',
    'rgb(248,158,157)',
    'rgba(249,220,144)',
    'rgba(253,241,205)',
  ];
  return colors[index];
};

export default function WakeUpOptions({ date }: { date: Date }) {
  const [wakeUpTimes, setWakeUpTimes] = useState<Date[]>([]);

  useEffect(() => {
    setWakeUpTimes(getWakeUpTimes(date.getTime()));
  }, []);

  return (
    <div className="wakeUpContainer">
      <ul className="wakeUpList">
        {wakeUpTimes.map((time, index) => {
          const timeString = time.toLocaleTimeString([], {
            hour: 'numeric',
            minute: '2-digit',
          });
          const [mainTime, period] = timeString.split(' ');

          return (
            <li
              key={index}
              className="wakeUpTime"
              style={{ color: getColor(index) }}
            >
              {mainTime} <span className="small-period">{period}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
