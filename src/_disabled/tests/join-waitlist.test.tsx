import { render, screen } from '@testing-library/react';
import JoinWaitlist from '@/app/components/landing/JoinWaitlist';

describe('JoinWaitlist component', () => {
  it('renders link to Substack with correct text', () => {
    render(<JoinWaitlist />);
    const link = screen.getByRole('link', { name: /join blog/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://debarkai.substack.com/');
    expect(link).toHaveAttribute('target', '_blank');
  });
});
