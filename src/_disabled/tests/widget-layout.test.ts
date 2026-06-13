import { getRowHeight } from '@/app/lib/widget-layout';
import { Widget } from '@/app/store/dashboard-store';

describe('getRowHeight', () => {
  const base: Widget = {
    id: 'w',
    type: 'pie-chart',
    title: '',
    size: 'small',
    position: 0,
    query: '',
    data: {},
  };

  it('doubles height for pie charts', () => {
    expect(getRowHeight(base, false)).toBe('min-h-[240px]');
  });

  it('keeps regular height for other widgets', () => {
    const lineWidget: Widget = { ...base, type: 'line-chart' };
    expect(getRowHeight(lineWidget, false)).toBe('min-h-[220px]');
  });
});
