import { validateWidget } from '@/app/lib/widget-validation';

describe('validateWidget', () => {
  it('accepts number-card without change data', () => {
    const widget = {
      type: 'number-card',
      title: 'Users',
      size: 'small',
      query: 'SELECT 1',
      data: { value: 10 },
    };
    expect(validateWidget(widget as any)).toBe(true);
  });

  it('accepts data-table items without id field', () => {
    const widget = {
      type: 'data-table',
      title: 'Table',
      size: 'medium',
      query: 'SELECT 1',
      data: { items: [{ col: 'val' }] },
    };
    expect(validateWidget(widget as any)).toBe(true);
  });

  it('accepts pie-chart series data', () => {
    const widget = {
      type: 'pie-chart',
      title: 'Pie',
      size: 'small',
      query: 'SELECT 1',
      data: { series: [{ name: 'A', value: 1 }] },
    };
    expect(validateWidget(widget as any)).toBe(true);
  });

  it('accepts funnel with steps data', () => {
    const widget = {
      type: 'funnel',
      title: 'Conversion Funnel',
      size: 'large',
      query: 'SELECT step, count FROM funnel_data',
      data: { 
        steps: [
          { name: 'Visitors', value: 10000 },
          { name: 'Leads', value: 3500 },
          { name: 'Customers', value: 450 }
        ] 
      },
    };
    expect(validateWidget(widget as any)).toBe(true);
  });

  it('rejects funnel with invalid steps data', () => {
    const widget = {
      type: 'funnel',
      title: 'Conversion Funnel',
      size: 'large',
      query: 'SELECT step, count FROM funnel_data',
      data: { 
        steps: [
          { name: 'Visitors' }, // missing value
          { value: 3500 }, // missing name
        ] 
      },
    };
    expect(validateWidget(widget as any)).toBe(false);
  });
});
