import { render, screen } from '@testing-library/react';
import Landing from '../pages/landing';

describe('Landing Page', () => {
  test('renders Landing page', () => {
    render(<Landing />);
    const contact = screen.getByRole('button', { name: /contact/i });
    const shows = screen.getByRole('button', { name: /shows/i });
    const gallery = screen.getByRole('button', { name: /gallery/i });
    const about = screen.getByRole('button', { name: /about me/i });
    expect(contact).toBeInTheDocument();
    expect(shows).toBeInTheDocument();
    expect(gallery).toBeInTheDocument();
    expect(about).toBeInTheDocument();
  });
});
