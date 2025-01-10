import { useState } from 'react';
import {
  faArrowRight,
  faBed,
  faClock,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { VStack } from '@chakra-ui/react';

export default function WakeTimePrompt({
  setDate,
}: {
  setDate: (t: Date) => void;
}) {
  const [hour, setHour] = useState<string>('12');
  const [minute, setMinute] = useState<string>('00');
  const [period, setPeriod] = useState<string>('AM');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedTime = `${hour}:${minute} ${period}`;

    // Create a new Date object
    const date = new Date();
    let hours = parseInt(hour, 10);
    const minutes = parseInt(minute, 10);

    // Adjust hours for AM/PM
    if (period === 'PM' && hours < 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }

    // Set the hours and minutes of the Date object
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);

    setDate(new Date(date));
  };

  return (
    <div className="sleepTimeContainer">
      <form onSubmit={handleSubmit} className="sleepForm">
        <label
          htmlFor="hour"
          className="sleepLabel"
          style={{ marginBottom: '10vmin' }}
        >
          <VStack style={{ marginLeft: '-1rem' }}>
            <FontAwesomeIcon icon={faClock} size="2xs" color="white" />
            <FontAwesomeIcon
              style={{ marginLeft: '1rem' }}
              icon={faBed}
              size="lg"
              color="white"
            />
          </VStack>
        </label>
        <div className="dropdownContainer">
          <select
            id="hour"
            value={hour}
            onChange={(e) => setHour(e.target.value)}
            style={{ backgroundColor: 'black', fontSize: '1.5rem' }}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
          <select
            id="minute"
            value={minute}
            onChange={(e) => setMinute(e.target.value)}
            style={{
              backgroundColor: 'black',
              fontSize: '1.5rem',
              marginLeft: '1rem',
            }}
          >
            {Array.from({ length: 60 }, (_, i) => (
              <option key={i} value={i.toString().padStart(2, '0')}>
                {i.toString().padStart(2, '0')}
              </option>
            ))}
          </select>
          <select
            id="period"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            style={{
              backgroundColor: 'black',
              fontSize: '0.75rem',
              marginLeft: '1rem',
            }}
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
        <button
          type="submit"
          className="submitButton"
          style={{ marginTop: '2rem', backgroundColor: 'transparent' }}
        >
          <FontAwesomeIcon icon={faArrowRight} size="lg" color="white" />
        </button>
      </form>
    </div>
  );
}
