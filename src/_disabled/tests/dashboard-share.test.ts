import { decodeDashboardShare, encodeDashboardShare } from '@/app/lib/dashboard-share';

test('encode and decode dashboard share', () => {
  const code = encodeDashboardShare('Sales', [
    { type: 'line-chart', query: 'select 1', title: 'Chart' },
    { type: 'number-card', query: 'select 2', title: 'Card' },
  ]);
  const decoded = decodeDashboardShare(code);
  expect(decoded).toEqual({
    name: 'Sales',
    widgets: [
      { type: 'line-chart', query: 'select 1', title: 'Chart' },
      { type: 'number-card', query: 'select 2', title: 'Card' },
    ],
  });
});

test('decode invalid code returns null', () => {
  expect(decodeDashboardShare('invalid')).toBeNull();
});
