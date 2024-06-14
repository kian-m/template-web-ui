import { render, screen } from '@testing-library/react';
import Landing from '../pages/landing';

describe('Landing Page', () => {
  test('renders Landing page', () => {
    render(<Landing />);
    const gymButton = screen.getByRole('button', { name: /gym/i });
    const foodButton = screen.getByRole('button', { name: /eat/i });
    const sleepButton = screen.getByRole('button', { name: /sleep/i });
    expect(gymButton).toBeInTheDocument();
    expect(foodButton).toBeInTheDocument();
    expect(sleepButton).toBeInTheDocument();
  });
});
