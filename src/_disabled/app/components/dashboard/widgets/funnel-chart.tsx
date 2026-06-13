// app/components/dashboard/widgets/funnel-chart.tsx
'use client';

import { useCallback, useMemo, useState } from 'react';
import { usePostHog } from 'posthog-js/react';
import { cn, formatNumber } from '@/app/lib/utils';
import WidgetShell from './widget-shell';

interface FunnelChartProps {
  title: string;
  data: Array<{
    name: string;
    value: number;
    color?: string;
  }>;
  widgetId: string;
  className?: string;
  onRefresh?: () => void;
  onViewDetails?: () => void;
  onDragStart?: () => void;
  onEdit?: () => void;
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
      colors.push(baseColors[baseIndex]);
    }
  }

  return colors;
};

export default function FunnelChart({
  title,
  data = [],
  widgetId,
  className = '',
  onRefresh,
  onViewDetails,
  onDragStart,
  onEdit,
}: FunnelChartProps) {
  const posthog = usePostHog();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Memoize theme-based colors using CSS custom properties
  const colors = useMemo(() => {
    const baseColors = getBaseColors();
    return baseColors.map((color, index) => ({
      background: color,
      gradient: `linear-gradient(135deg, ${color}dd, ${color})`
    }));
  }, []);

  // Calculate percentages and prepare data for funnel
  const funnelData = useMemo(() => {
    if (!data || data.length === 0) {
      return [];
    }

    return data.map((item, index) => {
      const percentage = data[0]?.value ? Math.round((item.value / data[0].value) * 100) : 0;
      const conversionFromPrevious = index > 0 
        ? Math.round((item.value / data[index - 1].value) * 100) 
        : 100;
      
      return {
        ...item,
        percentage,
        conversionFromPrevious,
        gradientColor: colors[index % colors.length],
        // Calculate width for the funnel visual (minimum 20% width for visibility)
        widthPercentage: Math.max(percentage, 20),
      };
    });
  }, [data, colors]);

  // Get responsive sizing based on widget container
  const getResponsiveSize = useCallback(() => {
    const stageCount = funnelData.length;
    return {
      barHeight: stageCount <= 3 ? 'h-16' : stageCount <= 5 ? 'h-14' : 'h-12',
      fontSize: stageCount <= 3 ? 'text-base' : stageCount <= 5 ? 'text-sm' : 'text-xs',
      valueSize: stageCount <= 3 ? 'text-xl' : stageCount <= 5 ? 'text-lg' : 'text-base',
      spacing: stageCount <= 3 ? 'space-y-4' : stageCount <= 5 ? 'space-y-3' : 'space-y-2',
    };
  }, [funnelData.length]);

  const responsiveSize = useMemo(() => getResponsiveSize(), [getResponsiveSize]);

  // Show empty state if no data
  if (!funnelData.length) {
    return (
      <WidgetShell
        title={title}
        widgetId={widgetId}
        onRefresh={onRefresh}
        onViewDetails={onViewDetails}
        onDragStart={onDragStart}
        onEdit={onEdit}
        className="h-full"
      >
        <div className={cn('h-full overflow-hidden', className)}>
          <div className="flex h-full items-center justify-center p-4">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <p className="text-sm">No funnel data available</p>
            </div>
          </div>
        </div>
      </WidgetShell>
    );
  }

  return (
    <WidgetShell
      title={title}
      widgetId={widgetId}
      onRefresh={onRefresh}
      onViewDetails={onViewDetails}
      onDragStart={onDragStart}
      onEdit={onEdit}
      className="h-full"
    >
      <div className={cn('h-full overflow-hidden bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800', className)}>
        <div className="flex h-full flex-col p-4">
          {/* Modern Funnel Visualization */}
          <div className={cn("flex-1 flex flex-col justify-center", responsiveSize.spacing)}>
            {funnelData.map((stage, index) => (
              <div
                key={stage.name}
                className="relative group cursor-pointer"
                onMouseEnter={() => {
                  setHoveredIndex(index);
                  posthog?.capture('funnel_stage_hover', {
                    widget_id: widgetId,
                    stage_name: stage.name,
                    stage_index: index,
                    stage_value: stage.value,
                    stage_percentage: stage.percentage,
                  });
                }}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Funnel Stage Bar */}
                <div className="relative">
                  <div
                    className={cn(
                      'rounded-lg shadow-md transition-all duration-300 ease-in-out',
                      hoveredIndex === index ? 'scale-105 shadow-lg' : 'hover:scale-102',
                      'group-hover:shadow-xl',
                      responsiveSize.barHeight
                    )}
                    style={{
                      width: `${stage.widthPercentage}%`,
                      minWidth: '120px',
                      background: stage.gradientColor.gradient,
                    }}
                  >
                    {/* Stage Content - Page Names and Values */}
                    <div className="flex items-center justify-between h-full px-4 w-full">
                      <div className="flex flex-col justify-center flex-1 min-w-0">
                        <div className={cn(
                          "font-bold text-white leading-tight",
                          responsiveSize.fontSize
                        )} 
                        title={stage.name}
                        style={{
                          textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                          color: 'white',
                          letterSpacing: '0.025em'
                        }}>
                          {stage.name}
                        </div>
                      </div>
                      <div className="flex items-center justify-end">
                        <div className={cn(
                          "font-bold text-white", 
                          responsiveSize.valueSize
                        )}
                        style={{
                          textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                          color: 'white'
                        }}>
                          {formatNumber(stage.value)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Conversion Rate Arrow */}
                  {index < funnelData.length - 1 && (
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex items-center">
                      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-full px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-300 shadow-sm">
                        {stage.conversionFromPrevious}%
                      </div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                        <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-300 dark:border-t-gray-600"></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Hover Tooltip */}
                {hoveredIndex === index && (
                  <div className="absolute left-full ml-4 top-1/2 transform -translate-y-1/2 z-10">
                    <div className="bg-black text-white px-3 py-2 rounded-lg text-sm shadow-lg whitespace-nowrap">
                      <div className="font-semibold">{stage.name}</div>
                      <div>Users: {formatNumber(stage.value)}</div>
                      <div>Of Total: {stage.percentage}%</div>
                      {index > 0 && (
                        <div>Conversion: {stage.conversionFromPrevious}%</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Enhanced Summary Stats */}
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">TOTAL USERS</div>
                <div className={cn("font-bold text-gray-900 dark:text-white", responsiveSize.valueSize)}>
                  {formatNumber(funnelData[0]?.value || 0)}
                </div>
              </div>
              <div className="text-center border-l border-r border-gray-200 dark:border-gray-600">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">CONVERTED</div>
                <div className={cn("font-bold text-green-600 dark:text-green-400", responsiveSize.valueSize)}>
                  {formatNumber(funnelData[funnelData.length - 1]?.value || 0)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">SUCCESS RATE</div>
                <div className={cn("font-bold text-blue-600 dark:text-blue-400", responsiveSize.valueSize)}>
                  {funnelData[funnelData.length - 1]?.percentage || 0}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WidgetShell>
  );
}
