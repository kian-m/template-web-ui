import { render, screen } from '@testing-library/react';
import Sleep from '../pages/sleep';

describe('Sleep Page', () => {
  test('renders Sleep page', () => {
    render(<Sleep />);
    const sleepNowButton = screen.getByRole('button', { name: /now/i });
    const sleepLaterButton = screen.getByRole('button', { name: /later/i });
    const wakeUpAtButton = screen.getByRole('button', { name: /wake/i });
    expect(sleepNowButton).toBeInTheDocument();
    expect(sleepLaterButton).toBeInTheDocument();
    expect(wakeUpAtButton).toBeInTheDocument();
  });
});
