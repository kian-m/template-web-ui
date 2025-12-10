import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import SleepPlannerPage from '../app/page';

describe('SleepPlannerPage', () => {
  const fixedDate = new Date('2024-01-01T22:00:00Z');

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(fixedDate);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('shows the three planning options', () => {
    render(<SleepPlannerPage />);

    expect(screen.getByText('Sleep now')).toBeInTheDocument();
    expect(screen.getByText('Sleep later')).toBeInTheDocument();
    expect(screen.getByText('Wake up at')).toBeInTheDocument();
  });

  it('reveals wake time suggestions when choosing to sleep now', () => {
    render(<SleepPlannerPage />);

    fireEvent.click(screen.getByText('Sleep now'));

    const list = screen.getByRole('list');
    expect(list.querySelectorAll('li').length).toBeGreaterThan(0);
  });
});
