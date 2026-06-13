'use client';
import {
  Bar,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Label,
} from 'recharts';
import { useCallback } from 'react';
import WidgetShell from './widget-shell';
import { formatNumber } from '@/app/lib/utils';
import { usePostHog } from 'posthog-js/react';

const getDynamicColors = () => {
  const root = document.documentElement;
  const primary = root.style.getPropertyValue('--chart-color-1') || '#1d4aff';
  return primary;
};

interface BarChartProps {
  title: string;
  data: { name: string; value: number }[];
  widgetId: string;
  onRefresh?: () => void;
  onViewDetails?: () => void;
  onDragStart?: () => void;
}

export default function BarChart({
  title,
  data,
  widgetId,
  onRefresh,
  onViewDetails,
  onDragStart,
}: BarChartProps) {
  const posthog = usePostHog();
  const barColor = getDynamicColors();

  const handleBarHover = useCallback(
    (data: any) => {
      if (data) {
        posthog?.capture('bar_hover', {
          widget_id: widgetId,
          name: data.name,
          value: data.value,
        });
      }
    },
    [posthog, widgetId],
  );

  return (
    <WidgetShell
      title={title}
      widgetId={widgetId}
      onRefresh={onRefresh}
      onViewDetails={onViewDetails}
      onDragStart={onDragStart}
    >
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data} margin={{ top: 5, right: 10, left: 15, bottom: 25 }}>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={barColor} stopOpacity={1} />
              <stop offset="100%" stopColor={barColor} stopOpacity={0.4} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10, fill: 'currentColor' }}
            tickLine={{ stroke: 'currentColor' }}
            axisLine={{ stroke: 'currentColor' }}
            className="text-gray-600 dark:text-gray-400"
            height={50}
          >
            <Label
              value="Category"
              position="insideBottom"
              offset={-5}
              style={{ textAnchor: 'middle', fill: 'currentColor', fontSize: 11 }}
            />
          </XAxis>
          <YAxis
            tick={{ fontSize: 10, fill: 'currentColor' }}
            tickLine={{ stroke: 'currentColor' }}
            axisLine={{ stroke: 'currentColor' }}
            width={50}
            className="text-gray-600 dark:text-gray-400"
            tickFormatter={formatNumber}
          >
            <Label
              value="Count"
              angle={-90}
              position="insideLeft"
              style={{ textAnchor: 'middle', fill: 'currentColor', fontSize: 11 }}
            />
          </YAxis>
          <Tooltip
            formatter={(value: number) => formatNumber(value)}
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              borderColor: 'hsl(var(--border))',
              color: 'hsl(var(--card-foreground))',
              borderRadius: '6px',
            }}
            itemStyle={{ color: 'hsl(var(--card-foreground))' }}
            labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
          />
          <Bar
            dataKey="value"
            fill="url(#barGradient)"
            radius={[4, 4, 0, 0]}
            barSize={24}
            onMouseEnter={handleBarHover}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </WidgetShell>
  );
}
