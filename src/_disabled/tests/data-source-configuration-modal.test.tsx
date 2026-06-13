import { render, fireEvent, waitFor } from '@testing-library/react';
import DataSourceConfigurationModal from '@/app/components/modals/data-source-configuration-modal';
import * as nextNav from 'next/navigation';
import { useAppStore } from '@/app/store/root-store';

jest.mock('next/navigation', () => ({ useRouter: jest.fn() }));

jest.mock('@/app/store/root-store', () => ({
  useAppStore: jest.fn(),
}));

const mockUseAppStore = useAppStore as unknown as jest.Mock;

const mockPush = jest.fn();

beforeEach(() => {
  (nextNav.useRouter as jest.Mock).mockReturnValue({ push: mockPush });
});

afterEach(() => {
  jest.clearAllMocks();
});

test('returns null when closed', () => {
  mockUseAppStore.mockReturnValue({ isDataSourceConfigured: () => false });
  const { container } = render(<DataSourceConfigurationModal isOpen={false} />);
  expect(container.firstChild).toBeNull();
});

test('pushes to settings on configure', async () => {
  mockUseAppStore.mockReturnValue({ isDataSourceConfigured: () => false });
  const { getByText } = render(<DataSourceConfigurationModal isOpen={true} />);
  fireEvent.click(getByText(/configure data source/i));
  await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/settings'));
});

test('auto closes when already configured', () => {
  jest.useFakeTimers();
  const onClose = jest.fn();
  mockUseAppStore.mockReturnValue({ isDataSourceConfigured: () => true });
  render(<DataSourceConfigurationModal isOpen={true} onClose={onClose} canClose />);
  jest.advanceTimersByTime(150);
  expect(onClose).toHaveBeenCalled();
  jest.useRealTimers();
});
