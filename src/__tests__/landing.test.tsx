import { render, screen } from '@testing-library/react';
import Landing from '@/views/landing';
import { FadingTextProvider } from '@/contexts/FadingTextContext';

const renderLanding = () =>
  render(
    <FadingTextProvider>
      <Landing />
    </FadingTextProvider>,
  );

describe('Landing', () => {
  beforeEach(() => localStorage.clear());

  it('shows the main action buttons on the home screen', () => {
    renderLanding();
    expect(screen.getByRole('button', { name: /gym/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /eat/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sleep/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /calendar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /config/i })).toBeInTheDocument();
  });

  it('hides the optional trackers until enabled in config', () => {
    renderLanding();
    expect(screen.queryByRole('button', { name: /sober/i })).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /symptoms/i }),
    ).not.toBeInTheDocument();
  });

  it('removes the gym/food buttons when their daily trackers are disabled', () => {
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
    renderLanding();
    expect(screen.queryByRole('button', { name: /gym/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /eat/i })).not.toBeInTheDocument();
    // Sleep stays — it's the calculator, always available.
    expect(screen.getByRole('button', { name: /sleep/i })).toBeInTheDocument();
  });

  it('shows the sober/symptoms buttons when enabled in config', () => {
    localStorage.setItem(
      'trackerConfig',
      JSON.stringify({ sobriety: { enabled: true }, symptoms: { enabled: true } }),
    );
    renderLanding();
    expect(screen.getByRole('button', { name: /sober/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /symptoms/i })).toBeInTheDocument();
  });
});
