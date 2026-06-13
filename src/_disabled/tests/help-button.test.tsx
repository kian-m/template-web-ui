import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Sidebar from '@/app/components/dashboard/sidebar';
import { useRouter } from 'next/navigation';
import { AuthProvider } from '@/app/context/unified-auth-context';
import type { ReactElement } from 'react';

const renderWithProviders = (ui: ReactElement<any>) => {
  return render(<AuthProvider>{ui}</AuthProvider>);
};

// Mock the router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the store
jest.mock('@/app/store/root-store', () => {
  const dashboards = [{ id: '1', name: 'Test Dashboard', position: 0, widgets: [] }];
  return {
    useAppStore: Object.assign(
      () => ({
        dashboards,
        activeDashboardId: '1',
        addDashboard: jest.fn(),
        setActiveDashboard: jest.fn(),
        updateDashboard: jest.fn(),
        syncDashboards: jest.fn(),
        reorderDashboards: jest.fn(),
      }),
      { getState: () => ({ dashboards }) },
    ),
  };
});

// Mock window.open (not used anymore but keep to ensure no unexpected calls)
global.window.open = jest.fn();

describe('Help Button', () => {
  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    jest.clearAllMocks();
  });

  it('should navigate to help page when help button is clicked', () => {
    renderWithProviders(<Sidebar isOpen={true} onClose={() => {}} />);

    const helpButton = screen.getByRole('button', { name: /help/i });
    expect(helpButton).toBeInTheDocument();

    fireEvent.click(helpButton);

    expect(mockRouter.push).toHaveBeenCalledWith('/help');
    expect(window.open).not.toHaveBeenCalled();
  });

  it('should render help button with correct icon and text', () => {
    renderWithProviders(<Sidebar isOpen={true} onClose={() => {}} />);

    const helpButton = screen.getByRole('button', { name: /help/i });
    expect(helpButton).toBeInTheDocument();
    expect(helpButton).toHaveTextContent('Help');
  });
});
