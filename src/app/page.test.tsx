import { fireEvent, render, screen } from '@testing-library/react';
import Page from '../app/page';

describe('Home', () => {
  it('should render menu ', function () {
    render(<Page />);

    expect(screen.getByText('Contact')).toBeInTheDocument();
    expect(screen.getByText('Shows')).toBeInTheDocument();
    expect(screen.getByText('Gallery')).toBeInTheDocument();
    expect(screen.getByText('About Me')).toBeInTheDocument();
  });
});
