import { render } from '@testing-library/react';
import DataTable from '@/app/components/dashboard/widgets/data-table';

test('renders ISO timestamps in local format', () => {
  const iso = '2025-07-26T19:24:30.842000Z';
  const expected = new Date(iso).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  const { getByText } = render(
    <DataTable title="Test" data={[{ time: iso, value: 1 }]} widgetId="w1" />,
  );
  expect(getByText(expected)).toBeInTheDocument();
});
