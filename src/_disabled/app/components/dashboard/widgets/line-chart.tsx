'use client';
import {
  Area,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Label,
} from 'recharts';
import { useCallback, useMemo, useState } from 'react';
import WidgetShell from './widget-shell';
import { cn, formatNumber } from '@/app/lib/utils';
import { usePostHog } from 'posthog-js/react';

const getBaseColors = () => {
  if (typeof window === 'undefined') {
    return ['#1d4aff', '#f9bd2b', '#f54e00', '#9b59b6'];
  }
  const root = document.documentElement;
  return [
    root.style.getPropertyValue('--chart-color-1') || '#1d4aff',
    root.style.getPropertyValue('--chart-color-2') || '#f9bd2b',
    root.style.getPropertyValue('--chart-color-3') || '#f54e00',
    root.style.getPropertyValue('--chart-color-4') || '#9b59b6',
  ];
};

const getDynamicColors = () => {
  const baseColors = getBaseColors();
  return baseColors[0];
};

interface LineChartProps {
  title: string;
  data: { name: string; value: number }[];
  widgetId: string;
  onRefresh?: () => void;
  onViewDetails?: () => void;
  onDragStart?: () => void;
}

export default function LineChart({
  title,
  data,
  widgetId,
  onRefresh,
  onViewDetails,
  onDragStart,
}: LineChartProps) {
  const posthog = usePostHog();
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);
  
  const lineColor = getDynamicColors();

  // Get responsive sizing based on data count
  const getResponsiveSize = useCallback(() => {
    const dataCount = data.length;
    
    return {
      tickFontSize: dataCount <= 5 ? 12 : dataCount <= 10 ? 11 : 10,
      labelFontSize: dataCount <= 5 ? 13 : dataCount <= 10 ? 12 : 11,
      strokeWidth: dataCount <= 5 ? 4 : dataCount <= 10 ? 3 : 2,
      activeDotSize: dataCount <= 5 ? 6 : dataCount <= 10 ? 5 : 4,
      margins: dataCount <= 5 
        ? { top: 20, right: 30, left: 25, bottom: 35 }
        : { top: 15, right: 20, left: 20, bottom: 30 },
    };
  }, [data.length]);

  const responsiveSize = useMemo(() => getResponsiveSize(), [getResponsiveSize]);

  const handleHover = useCallback(
    (state: any) => {
      const p = state?.activePayload?.[0];
      if (p) {
        setHoveredPoint(p.payload.name);
        posthog?.capture('line_point_hover', {
          widget_id: widgetId,
          name: p.payload.name,
          value: p.payload.value,
        });
      }
    },
    [posthog, widgetId],
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredPoint(null);
  }, []);

  return (
    <WidgetShell
      title={title}
      widgetId={widgetId}
      onRefresh={onRefresh}
      onViewDetails={onViewDetails}
      onDragStart={onDragStart}
    >
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
          data={data}
          margin={{ top: 5, right: 10, left: 15, bottom: 25 }}
          onMouseMove={handleHover}
        >
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={lineColor} stopOpacity={1} />
              <stop offset="100%" stopColor={lineColor} stopOpacity={0.2} />
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
              value="Time Period"
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
              value="Value"
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
          <Area
            type="monotone"
            dataKey="value"
            stroke="none"
            fill="url(#lineGradient)"
            fillOpacity={0.3}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="url(#lineGradient)"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 4, fill: lineColor, stroke: lineColor }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </WidgetShell>
  );
}
