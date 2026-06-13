import { decodeWidgetShare, encodeWidgetShare } from '@/app/lib/widget-share';

test('encode and decode widget share', () => {
  const code = encodeWidgetShare('line-chart', 'select 1', 'My Chart');
  const decoded = decodeWidgetShare(code);
  expect(decoded).toEqual({ type: 'line-chart', query: 'select 1', title: 'My Chart' });
});

test('decode invalid code returns null', () => {
  expect(decodeWidgetShare('invalid')).toBeNull();
});
