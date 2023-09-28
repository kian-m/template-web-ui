import { fireEvent, render, screen } from '@testing-library/react';
import Page from '../app/page';

describe('Home', () => {
  it('renders a heading', () => {
    render(<Page />);

    expect(screen.getByText('"SLOW MOVING" OUT NOW')).toBeInTheDocument();
  });

  it('should render menu when plus is clicked', function () {
    render(<Page />);

    fireEvent.click(screen.getByRole('menu-button'));
    expect(screen.getByText('Contact')).toBeInTheDocument();
    expect(screen.getByText('Shows')).toBeInTheDocument();
    expect(screen.getByText('Gallery')).toBeInTheDocument();
    expect(screen.getByText('About Me')).toBeInTheDocument();
  });
});
