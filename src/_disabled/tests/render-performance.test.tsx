import React from 'react';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import { render } from '@testing-library/react';
import Providers from '@/app/providers';
import NumberCard from '@/app/components/dashboard/widgets/number-card';
import BarChart from '@/app/components/dashboard/widgets/bar-chart';
import LineChart from '@/app/components/dashboard/widgets/line-chart';
import PieChart from '@/app/components/dashboard/widgets/pie-chart';
import DataTable from '@/app/components/dashboard/widgets/data-table';

jest.mock('posthog-js', () => {
  const mock = {
    init: jest.fn(),
    capture: jest.fn(),
    identify: jest.fn(),
  };
  return { __esModule: true, default: mock };
});

jest.mock('posthog-js/react', () => ({
  PostHogProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  usePostHog: () => require('posthog-js').default,
}));

jest.mock('@/app/providers', () => {
  const { PostHogProvider } = require('@/app/providers/PostHogProvider');
  return {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => (
      <PostHogProvider>{children}</PostHogProvider>
    ),
  };
});

jest.mock('next/font/google', () => ({
  Noto_Sans: () => ({ variable: '' }),
  Playfair_Display: () => ({ className: '' }),
}));
jest.mock('@/components/ui/toast', () => ({ Toaster: () => null }));
jest.mock('@/components/cookie-consent', () => () => null);

beforeAll(() => {
  (global as any).IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  class ResizeObserverMock {
    callback: ResizeObserverCallback;
    constructor(callback: ResizeObserverCallback) {
      this.callback = callback;
    }
    observe() {
      this.callback([{ contentRect: { width: 800, height: 600 } } as ResizeObserverEntry], this);
    }
    unobserve() {}
    disconnect() {}
  }
  (global as any).ResizeObserver = ResizeObserverMock;
});

const AllWidgetsPage = () => {
  const chartData = [
    { name: 'Jan', value: 100 },
    { name: 'Feb', value: 200 },
  ];
  const pieData = [
    { name: 'A', value: 30 },
    { name: 'B', value: 70 },
  ];
  const tableData = [
    { id: 1, name: 'Alice', status: 'active', created_at: '2024-01-01T00:00:00Z' },
    { id: 2, name: 'Bob', status: 'pending', created_at: '2024-01-02T00:00:00Z' },
  ];

  return (
    <>
      <NumberCard title="Users" value={12345} change={0.05} widgetId="number-card" />
      <BarChart title="Revenue" data={chartData} widgetId="bar-chart" />
      <LineChart title="Growth" data={chartData} widgetId="line-chart" />
      <PieChart title="Share" data={pieData} widgetId="pie-chart" />
      <DataTable title="Recent Users" data={tableData} widgetId="data-table" />
    </>
  );
};

const baselinePath = path.resolve(__dirname, '..', '..', 'render-baseline.json');

function getBaseline(): number {
  try {
    return JSON.parse(fs.readFileSync(baselinePath, 'utf8')).baselineMs as number;
  } catch {
    return 0;
  }
}

async function postComment(
  duration: number,
  diffMs: number,
  diffPercent: number,
  baselineMs: number,
): Promise<void> {
  try {
    const token = process.env.GITHUB_TOKEN;
    const repo = process.env.GITHUB_REPOSITORY;
    let prNumber: number | undefined;
    const eventPath = process.env.GITHUB_EVENT_PATH;
    if (eventPath && fs.existsSync(eventPath)) {
      const event = JSON.parse(fs.readFileSync(eventPath, 'utf8'));
      prNumber = event.pull_request?.number;
    }
    if (!token || !repo || !prNumber) return;
    await fetch(`https://api.github.com/repos/${repo}/issues/${prNumber}/comments`, {
      method: 'POST',
      headers: {
        Authorization: `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        body: `Render time: ${duration.toFixed(2)} ms (${diffMs >= 0 ? '+' : ''}${diffMs.toFixed(
          2,
        )} ms, ${diffPercent >= 0 ? '+' : ''}${diffPercent.toFixed(2)}% vs baseline ${baselineMs.toFixed(
          2,
        )} ms)`,
      }),
    });
  } catch {
    // ignore failures
  }
}

test('full app renders within baseline performance budget', async () => {
  const baselineMs = getBaseline();
  const start = performance.now();
  render(
    <Providers>
      <AllWidgetsPage />
    </Providers>,
  );
  const duration = performance.now() - start;
  const diffMs = duration - baselineMs;
  const diffPercent = (diffMs / baselineMs) * 100;
  await postComment(duration, diffMs, diffPercent, baselineMs);
  const threshold = baselineMs * 1.15;
  expect(require('posthog-js').default.init).toHaveBeenCalled();
  expect(duration).toBeLessThanOrEqual(threshold);
});
