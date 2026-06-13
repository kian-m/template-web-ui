import { render, screen, fireEvent, within } from '@testing-library/react';
import BodyMap from '@/views/symptoms/body-map';
import Sober from '@/views/sober/sober';
import DayEditor from '@/views/calendar/day-editor';
import {
  getSymptomsForDate,
  getRating,
  saveSobrietyStreaks,
  toDateKey,
} from '@/utils/tracker-storage';

beforeEach(() => localStorage.clear());

describe('BodyMap', () => {
  it('shows front/back tabs and rates a region by severity', () => {
    render(<BodyMap date="2026-06-12" />);
    expect(screen.getByRole('button', { name: /front/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();

    // Tap the chest region → severity sheet opens.
    fireEvent.click(screen.getByRole('button', { name: /chest/i }));
    const group = screen.getByRole('radiogroup', { name: /chest severity/i });
    fireEvent.click(within(group).getByRole('radio', { name: '3 of 5' }));

    expect(getSymptomsForDate('2026-06-12')).toEqual({ 'front:chest': 3 });
  });
});

describe('Sober', () => {
  it('renders an animated counter for a configured streak', () => {
    saveSobrietyStreaks([
      { id: 's1', label: 'Alcohol', startDate: '2026-01-01' },
    ]);
    render(<Sober />);
    expect(screen.getByText('Alcohol')).toBeInTheDocument();
    expect(screen.getAllByText(/day/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
  });

  it('prompts to add a streak when none exist', () => {
    render(<Sober />);
    expect(screen.getByText(/no streaks yet/i)).toBeInTheDocument();
  });
});

describe('DayEditor', () => {
  it('persists a 1-5 rating per tracker (no text inputs)', () => {
    const date = toDateKey(new Date());
    render(<DayEditor date={date} onClose={() => {}} />);

    // No free-text inputs anywhere.
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();

    const sleep = screen.getByRole('radiogroup', { name: /sleep/i });
    fireEvent.click(within(sleep).getByRole('radio', { name: '4 of 5' }));
    expect(getRating(date, 'sleep')).toBe(4);
  });

  it('always shows sleep, workout and food even when toggled off in config', () => {
    localStorage.setItem(
      'trackerConfig',
      JSON.stringify({
        daily: {
          sleep: { enabled: true, label: 'Sleep', icon: 'moon' },
          workout: { enabled: false, label: 'Workout', icon: 'dumbbell' },
          food: { enabled: false, label: 'Eating', icon: 'utensils' },
        },
      }),
    );
    const date = toDateKey(new Date());
    render(<DayEditor date={date} onClose={() => {}} />);
    expect(screen.getByRole('radiogroup', { name: /sleep/i })).toBeInTheDocument();
    expect(screen.getByRole('radiogroup', { name: /workout/i })).toBeInTheDocument();
    expect(screen.getByRole('radiogroup', { name: /eating/i })).toBeInTheDocument();
  });
});
