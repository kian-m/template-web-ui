import { render } from '@testing-library/react';
import TopLine from '@/app/components/dashboard/top-line';

jest.mock('@/app/components/dashboard/header', () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <div data-testid="header">{title}</div>,
}));

jest.mock('@/app/components/dashboard/sidebar-brand', () => ({
  __esModule: true,
  default: () => <div data-testid="brand">brand</div>,
}));

test('renders header title', () => {
  const { getByTestId } = render(
    <TopLine title="My Dash" />,
  );
  expect(getByTestId('header').textContent).toBe('My Dash');
});
