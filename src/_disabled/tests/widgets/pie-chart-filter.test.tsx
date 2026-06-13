import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import PieChart from '@/app/components/dashboard/widgets/pie-chart';
import { usePostHog } from 'posthog-js/react';

jest.mock('posthog-js/react');
jest.mock('recharts', () => ({
  ...jest.requireActual('recharts'),
  ResponsiveContainer: ({ children }: any) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  PieChart: ({ children }: any) => <div data-testid="pie-chart">{children}</div>,
  Pie: ({ data }: any) => <div data-testid="pie" data-items={data?.length || 0} />,
  Cell: () => <div data-testid="cell" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Sector: () => <div data-testid="sector" />,
}));

const mockPostHog = { capture: jest.fn() };
(usePostHog as jest.Mock).mockReturnValue(mockPostHog);

const sampleData = [
  { name: 'Large Item A', value: 45 }, // 45%
  { name: 'Large Item B', value: 30 }, // 30%
  { name: 'Medium Item', value: 20 }, // 20%
  { name: 'Small Item A', value: 3 }, // 3%
  { name: 'Small Item B', value: 1.5 }, // 1.5%
  { name: 'Tiny Item', value: 0.5 }, // 0.5%
];

describe('PieChart Filter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when filter is disabled', () => {
    it('should show all items in the chart', () => {
      render(<PieChart title="Test Chart" data={sampleData} widgetId="test-widget" />);

      const pieElement = screen.getByTestId('pie');
      expect(pieElement).toHaveAttribute('data-items', '6');
    });

    it('should display all items in legend', () => {
      render(<PieChart title="Test Chart" data={sampleData} widgetId="test-widget" />);

      expect(screen.getByText(/Large Item A — 45/)).toBeInTheDocument();
      expect(screen.getByText(/Large Item B — 30/)).toBeInTheDocument();
      expect(screen.getByText(/Medium Item — 20/)).toBeInTheDocument();
      expect(screen.getByText(/Small Item A — 3/)).toBeInTheDocument();
      expect(screen.getByText(/Small Item B — 1.5/)).toBeInTheDocument();
      expect(screen.getByText(/Tiny Item — 0.5/)).toBeInTheDocument();
    });

    it('should show filter button with correct tooltip', () => {
      render(<PieChart title="Test Chart" data={sampleData} widgetId="test-widget" />);

      const filterButton = screen.getByText('Filter < 0.5%');
      expect(filterButton).toBeInTheDocument();
      expect(filterButton).toHaveAttribute('title', 'Hide values below 0.5%');
    });
  });

  describe('when filter is enabled', () => {
    it('should filter out items below threshold', () => {
      render(<PieChart title="Test Chart" data={sampleData} widgetId="test-widget" />);

      const filterButton = screen.getByText('Filter < 0.5%');
      fireEvent.click(filterButton);

      // Should keep items at or above 0.5% threshold (Tiny Item at 0.5% is kept)
      const pieElement = screen.getByTestId('pie');
      expect(pieElement).toHaveAttribute('data-items', '6');
    });

    it('should hide filtered items from legend', () => {
      render(<PieChart title="Test Chart" data={sampleData} widgetId="test-widget" />);

      const filterButton = screen.getByText('Filter < 0.5%');
      fireEvent.click(filterButton);

      // Should show items at or above threshold
      expect(screen.getByText(/Large Item A — 45/)).toBeInTheDocument();
      expect(screen.getByText(/Large Item B — 30/)).toBeInTheDocument();
      expect(screen.getByText(/Medium Item — 20/)).toBeInTheDocument();
      expect(screen.getByText(/Small Item A — 3/)).toBeInTheDocument();
      expect(screen.getByText(/Small Item B — 1.5/)).toBeInTheDocument();
      
      // Item at exactly 0.5% threshold is kept
      expect(screen.getByText(/Tiny Item — 0.5/)).toBeInTheDocument();
    });

    it('should update filter button appearance and tooltip', () => {
      render(<PieChart title="Test Chart" data={sampleData} widgetId="test-widget" />);

      const filterButton = screen.getByText('Filter < 0.5%');
      fireEvent.click(filterButton);

      const updatedButton = screen.getByText('Filtered < 0.5%');
      expect(updatedButton).toBeInTheDocument();
      expect(updatedButton).toHaveAttribute('title', 'Show all values');
    });

    it('should track filter toggle in PostHog', () => {
      render(<PieChart title="Test Chart" data={sampleData} widgetId="test-widget" />);

      const filterButton = screen.getByText('Filter < 0.5%');
      fireEvent.click(filterButton);

      expect(mockPostHog.capture).toHaveBeenCalledWith('pie-chart_filter_toggled', {
        widget_id: 'test-widget',
        filter_active: true,
      });
    });
  });

  describe('when toggling filter back off', () => {
    it('should restore all items', () => {
      render(<PieChart title="Test Chart" data={sampleData} widgetId="test-widget" />);

      const filterButton = screen.getByText('Filter < 0.5%');
      fireEvent.click(filterButton); // Enable filter

      const showAllButton = screen.getByText('Filtered < 0.5%');
      fireEvent.click(showAllButton); // Disable filter

      const pieElement = screen.getByTestId('pie');
      expect(pieElement).toHaveAttribute('data-items', '6');

      // All original items should be visible again
      expect(screen.getByText(/Small Item A — 3/)).toBeInTheDocument();
      expect(screen.getByText(/Small Item B — 1.5/)).toBeInTheDocument();
      expect(screen.getByText(/Tiny Item — 0.5/)).toBeInTheDocument();
      expect(screen.queryByText(/Others/)).not.toBeInTheDocument();
    });
  });

  describe('with edge cases', () => {
    it('should handle data with no small items', () => {
      const largeItemsOnly = [
        { name: 'Item A', value: 60 },
        { name: 'Item B', value: 40 },
      ];

      render(<PieChart title="Test Chart" data={largeItemsOnly} widgetId="test-widget" />);

      const filterButton = screen.getByText('Filter < 0.5%');
      fireEvent.click(filterButton);

      // Should still show both items, no Others category
      const pieElement = screen.getByTestId('pie');
      expect(pieElement).toHaveAttribute('data-items', '2');
      expect(screen.queryByText(/Others/)).not.toBeInTheDocument();
    });

    it('should handle empty data', () => {
      render(<PieChart title="Test Chart" data={[]} widgetId="test-widget" />);

      const filterButton = screen.getByText('Filter < 0.5%');
      fireEvent.click(filterButton);

      const pieElement = screen.getByTestId('pie');
      expect(pieElement).toHaveAttribute('data-items', '0');
    });
  });
});
