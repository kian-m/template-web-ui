import { render, waitFor } from '@testing-library/react';
import PieChart from '@/app/components/dashboard/widgets/pie-chart';

jest.mock('posthog-js/react', () => ({
  usePostHog: () => ({ capture: jest.fn() }),
}));

class ResizeObserverMock {
  callback: ResizeObserverCallback;
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }
  observe() {
    this.callback([{ contentRect: { width: 400, height: 400 } } as ResizeObserverEntry], this);
  }
  unobserve() {}
  disconnect() {}
}
(global as any).ResizeObserver = ResizeObserverMock;

test('renders slices with different colors', async () => {
  const data = [
    { name: 'A', value: 10 },
    { name: 'B', value: 20 },
  ];
  const { container } = render(
    <div style={{ width: 400, height: 400 }}>
      <PieChart title="Test" data={data} widgetId="w1" />
    </div>,
  );
  await waitFor(() => {
    expect(container.querySelectorAll('path[fill]').length).toBeGreaterThanOrEqual(data.length);
  });
  const paths = container.querySelectorAll('path[fill]');
  const fills = Array.from(paths).map((p) => p.getAttribute('fill'));
  expect(new Set(fills).size).toBeGreaterThan(1);
});
