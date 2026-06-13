import { render, waitFor } from '@testing-library/react';
import SettingsPage from '@/app/settings/page';
import { useAppStore } from '@/app/store/root-store';
import { posthogApi } from '@/app/services/posthog-api';
import * as nextNav from 'next/navigation';

jest.mock('@/app/services/posthog-api', () => ({
  posthogApi: {
    checkPosthog: jest.fn(),
    updatePosthog: jest.fn(),
  },
}));

jest.mock('@/app/components/dashboard/layout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('next/navigation', () => ({ useRouter: jest.fn() }));

beforeEach(() => {
  (nextNav.useRouter as jest.Mock).mockReturnValue({ back: jest.fn() });
  useAppStore.setState({
    dataSources: { posthog: { apiKey: 'key', projectId: '1' } },
    posthogConfigured: false,
  });
});

afterEach(() => {
  jest.clearAllMocks();
  useAppStore.setState({ dataSources: {}, posthogConfigured: false });
});

test('hides credential fields when backend confirms connection', async () => {
  (posthogApi.checkPosthog as jest.Mock).mockResolvedValue({ isValid: true });
  const { queryByLabelText, getByRole } = render(<SettingsPage />);
  await waitFor(() => expect(getByRole('button', { name: /edit/i })).toBeInTheDocument());
  expect(queryByLabelText(/api key/i)).toBeNull();
});
