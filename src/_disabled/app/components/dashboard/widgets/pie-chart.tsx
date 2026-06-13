'use client';

import { ComponentProps, useCallback, useMemo, useState } from 'react';
import {
  Cell,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
  type TooltipProps,
} from 'recharts';
import { usePostHog } from 'posthog-js/react';
import { Filter } from 'lucide-react';
import WidgetShell from './widget-shell';
import { formatNumber } from '@/app/lib/utils';

interface PieChartProps {
  title: string;
  data: { name: string; value: number }[];
  widgetId: string;
  onRefresh?: () => void;
  onViewDetails?: () => void;
  onDragStart?: () => void;
}

// Memoized function to get base colors from CSS variables
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

const getDynamicColors = (count: number = 8) => {
  const baseColors = getBaseColors();
  const colors = [...baseColors];

  // If we need more colors, generate variations
  if (count > 4) {
    const additionalNeeded = count - 4;
    for (let i = 0; i < additionalNeeded; i++) {
      const baseIndex = i % 4;
      const hueShift = Math.floor(i / 4 + 1) * 20; // Shift hue by 20 degrees for each round
      const saturationShift = i % 2 ? -10 : 10; // Alternate saturation
      colors.push(adjustHueSaturation(baseColors[baseIndex], hueShift, saturationShift));
    }
  }

  return colors;
};

// Unified HSL color adjustment function
function adjustHueSaturation(color: string, hueShift: number = 0, saturationShift: number = 0): string {
  // Convert hex to RGB
  const num = parseInt(color.replace('#', ''), 16);
  let r = (num >> 16) / 255;
  let g = ((num >> 8) & 0x00ff) / 255;
  let b = (num & 0x0000ff) / 255;

  // Convert RGB to HSL
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  // Apply shifts
  h = ((h * 360 + hueShift) % 360) / 360;
  if (h < 0) h += 360 / 360;
  s = Math.max(0, Math.min(1, s + saturationShift / 100));

  // Convert HSL back to RGB
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  let newR, newG, newB;
  if (s === 0) {
    newR = newG = newB = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    newR = hue2rgb(p, q, h + 1 / 3);
    newG = hue2rgb(p, q, h);
    newB = hue2rgb(p, q, h - 1 / 3);
  }

  // Convert RGB to hex
  const toHex = (val: number) => {
    const hex = Math.round(val * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
}

function lighten(color: string, amount = 0.1) {
  const num = parseInt(color.replace('#', ''), 16);
  const r = Math.min(255, (num >> 16) + Math.round(255 * amount));
  const g = Math.min(255, ((num >> 8) & 0x00ff) + Math.round(255 * amount));
  const b = Math.min(255, (num & 0x0000ff) + Math.round(255 * amount));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export default function PieChart({
  title,
  data,
  widgetId,
  onRefresh,
  onViewDetails,
  onDragStart,
}: PieChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>();
  const [filterActive, setFilterActive] = useState(false);
  const [filterThreshold, setFilterThreshold] = useState(0.5); // Default 0.5%
  const [showFilterControls, setShowFilterControls] = useState(false);
  const posthog = usePostHog();
  
  // Memoize color generation
  const colors = useMemo(() => getDynamicColors(data.length + 2), [data.length])

  const { processedData, total, filteredCount } = useMemo(() => {
    const totalValue = data.reduce((s, d) => s + d.value, 0);

    if (!filterActive || totalValue === 0) {
      return { processedData: data, total: totalValue, filteredCount: 0 };
    }

    // Filter out items below the dynamic threshold
    const threshold = totalValue * (filterThreshold / 100);
    const filtered = data.filter((d) => d.value >= threshold);
    const removedCount = data.length - filtered.length;

    return { processedData: filtered, total: totalValue, filteredCount: removedCount };
  }, [data, filterActive, filterThreshold]);

  const maxVal = Math.max(...processedData.map((d) => d.value));
  const dominantPct = total ? formatNumber((maxVal / total) * 100) : '0';

  const handleSliceEnter = useCallback(
    (_: unknown, index: number) => {
      setActiveIndex(index);
      const slice = processedData[index];
      posthog?.capture('pie_slice_hover', {
        widget_id: widgetId,
        slice: slice.name,
        value: slice.value,
      });
    },
    [processedData, posthog, widgetId],
  );

  const handleSliceLeave = useCallback(() => setActiveIndex(undefined), []);

  const handleSliceTouch = useCallback(
    (_: unknown, index: number) => {
      setActiveIndex(index);
      const slice = processedData[index];
      posthog?.capture('pie_slice_press', {
        widget_id: widgetId,
        slice: slice.name,
        value: slice.value,
      });
    },
    [processedData, posthog, widgetId],
  );

  const CustomTooltip = useCallback(
    ({ active, payload }: TooltipProps<number, string>) => {
      if (active && payload && payload.length) {
        const { name, value } = payload[0];
        const pct = total ? (Number(value) / total) * 100 : 0;
        return (
          <div className="border-border bg-card rounded-md border p-2 text-xs">
            <div className="font-medium text-gray-700 dark:text-gray-200">{name}</div>
            <div className="text-gray-600 dark:text-gray-300">{formatNumber(pct)}%</div>
          </div>
        );
      }
      return null;
    },
    [total],
  );

  const handleFilter = useCallback(() => {
    setFilterActive(!filterActive);
    posthog?.capture('pie-chart_filter_toggled', {
      widget_id: widgetId,
      filter_active: !filterActive,
    });
  }, [filterActive, posthog, widgetId]);

  return (
    <WidgetShell
      title={title}
      widgetId={widgetId}
      onRefresh={onRefresh}
      onViewDetails={onViewDetails}
      onDragStart={onDragStart}
    >
      {/* Filter button and controls */}
      <div className="absolute top-2 left-2 z-10">
        <div className="flex items-start gap-2">
          <button
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              filterActive
                ? 'bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'
                : 'bg-gray-100 text-black hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700'
            }`}
            onClick={handleFilter}
            title={filterActive ? 'Show all values' : `Hide values below ${filterThreshold}%`}
          >
            <Filter className="h-3.5 w-3.5" />
            {filterActive ? `Filtered < ${filterThreshold}%` : `Filter < ${filterThreshold}%`}
          </button>
          
          {/* Dynamic threshold control */}
          {filterActive && (
            <button
              className="rounded-md bg-gray-100 p-1.5 text-black hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
              onClick={() => setShowFilterControls(!showFilterControls)}
              title="Adjust filter threshold"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </button>
          )}
        </div>
        
        {/* Threshold slider */}
        {filterActive && showFilterControls && (
          <div className="mt-2 rounded-md bg-white p-3 shadow-lg dark:bg-gray-800">
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Filter threshold: {filterThreshold}%
            </label>
            <input
              type="range"
              min="0.1"
              max="10"
              step="0.1"
              value={filterThreshold}
              onChange={(e) => setFilterThreshold(parseFloat(e.target.value))}
              className="mt-1 w-40"
            />
            <div className="mt-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>0.1%</span>
              <span>10%</span>
            </div>
          </div>
        )}
        
        {filterActive && filteredCount > 0 && (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {filteredCount} items hidden (below {filterThreshold}%)
          </p>
        )}
      </div>
      
      {/* column layout: chart fills space, legend sits below */}
      <div className="flex h-full w-full flex-col p-2">
        {/* chart container with proper min-height */}
        <div className="relative flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
              <Pie
                data={processedData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius="55%"
                outerRadius="85%"
                paddingAngle={2}
                activeIndex={activeIndex}
                activeShape={(props: ComponentProps<typeof Sector>) => (
                  <Sector
                    {...props}
                    stroke="#ffffff"
                    strokeWidth={3}
                    outerRadius={props.outerRadius}
                  />
                )}
                onMouseEnter={handleSliceEnter}
                onMouseLeave={handleSliceLeave}
                onTouchStart={handleSliceTouch}
                /* no slice labels to avoid clipping */
              >
                {processedData.map((entry, idx) => (
                  <Cell
                    key={entry.name}
                    fill={
                      activeIndex === idx
                        ? lighten(colors[idx % colors.length], 0.1)
                        : colors[idx % colors.length]
                    }
                  />
                ))}
              </Pie>

              <Tooltip content={CustomTooltip} />
            </RechartsPieChart>
          </ResponsiveContainer>

          {/* centred % label */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-semibold text-gray-600 md:text-xl dark:text-gray-300">
              {dominantPct}%
            </span>
          </div>
        </div>

        {/* legend footer with proper height constraint */}
        <div className="mt-3 flex-shrink-0 max-h-20 overflow-y-auto">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs">
            {processedData.map((d, idx) => (
              <div key={d.name} className="flex items-center space-x-1">
                <span
                  className="inline-block h-2 w-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: colors[idx % colors.length] }}
                />
                <span className="text-gray-600 dark:text-gray-300 truncate max-w-[120px]">
                  {d.name} — {formatNumber(d.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </WidgetShell>
  );
}
