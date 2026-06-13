import type { Widget } from '@/app/store/dashboard-store';

export function validateWidget(widget: Omit<Widget, 'id' | 'position'>): boolean {
  if (!widget || typeof widget !== 'object') return false;
  const { type, title, size, data, query } = widget;
  if (!title || typeof title !== 'string') return false;
  if (!['number-card', 'line-chart', 'bar-chart', 'data-table', 'pie-chart', 'funnel'].includes(type))
    return false;
  if (!['small', 'medium', 'large'].includes(size)) return false;
  if (!data || typeof data !== 'object') return false;
  if (!query || typeof query !== 'string') return false;

  switch (type) {
    case 'number-card':
      return (
        typeof data.value === 'number' &&
        (data.change === undefined || typeof data.change === 'number') &&
        (data.isPositive === undefined || typeof data.isPositive === 'boolean')
      );
    case 'line-chart':
    case 'bar-chart':
    case 'pie-chart':
      return (
        Array.isArray(data.series) &&
        data.series.every(
          (p: any) => p && typeof p.name === 'string' && typeof p.value === 'number',
        )
      );
    case 'data-table':
      return (
        Array.isArray(data.items) &&
        data.items.every((item: any) => item && typeof item === 'object')
      );
    case 'funnel':
      return (
        Array.isArray(data.steps) &&
        data.steps.every(
          (step: any) => 
            step && 
            typeof step.name === 'string' && 
            typeof step.value === 'number' &&
            (step.rate === undefined || typeof step.rate === 'number')
        )
      );
    default:
      return false;
  }
}
