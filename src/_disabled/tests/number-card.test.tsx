import { render } from '@testing-library/react';
import NumberCard from '@/app/components/dashboard/widgets/number-card';

function renderCard(props: any) {
  return render(<NumberCard {...props} widgetId="w1" />);
}

test('formats numbers with commas', () => {
  const { getByText } = renderCard({ title: 'Users', value: 1000, change: 0, isPositive: true });
  expect(getByText('1,000')).toBeInTheDocument();
});

test('rounds numbers to two decimals', () => {
  const { getByText } = renderCard({ title: 'Score', value: 1.234 });
  expect(getByText('1.23')).toBeInTheDocument();
});

test('omits decimals when fraction is below one tenth', () => {
  const { getByText } = renderCard({ title: 'Score', value: 1.04 });
  expect(getByText('1')).toBeInTheDocument();
});

test('formats currency', () => {
  const { getByText } = renderCard({
    title: 'Revenue',
    value: 1200,
    change: 0,
    isPositive: true,
    format: 'currency',
  });
  expect(getByText('$1,200')).toBeInTheDocument();
});

test('shows arrow up or down based on change', () => {
  const { container: pos } = renderCard({ title: 'A', value: 0, change: 1, isPositive: true });
  expect(pos.querySelector('svg')).toBeInTheDocument();
  const { container: neg } = renderCard({ title: 'B', value: 0, change: 1, isPositive: false });
  expect(neg.querySelector('svg')).toBeInTheDocument();
});

test('hides change text when no change provided', () => {
  const { container } = renderCard({ title: 'Total', value: 10 });
  expect(container.textContent).not.toContain('from previous period');
});

test('formats ISO date strings to local time', () => {
  const iso = '2025-07-26T19:24:30.842000Z';
  const expected = new Date(iso).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  const { getByText } = renderCard({ title: 'When', value: iso });
  expect(getByText(expected)).toBeInTheDocument();
});
