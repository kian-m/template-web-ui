// app/components/dashboard/widgets/number-card.tsx
'use client';

import { useCallback, useMemo, useState } from 'react';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';
import WidgetShell from './widget-shell';
import { cn, formatCurrency, formatDate, formatNumber, formatPercentage } from '@/app/lib/utils';
import { usePostHog } from 'posthog-js/react';
import { WidgetErrorBoundary } from '@/app/components/error-boundary';
import { createSafeFallback, isNumber, isString } from '@/app/lib/data-validation';

interface NumberCardProps {
  title: string;
  value: number | string;
  change?: number;
  isPositive?: boolean;
  format?: 'number' | 'percentage' | 'currency';
  widgetId: string;
  onRefresh?: () => void;
  onViewDetails?: () => void;
  onDragStart?: () => void;
}

// Safe component wrapper
function NumberCardContent({
  title,
  value,
  change,
  isPositive = true,
  format = 'number',
  widgetId,
  onRefresh,
  onViewDetails,
  onDragStart,
}: NumberCardProps) {
  /* ---------- Safe data processing ---------- */
  const safeValue = createSafeFallback(
    value,
    0,
    (val): val is number | string => isNumber(val) || isString(val),
  );

  const safeChange = createSafeFallback(
    change,
    undefined,
    (val): val is number | undefined => val === undefined || isNumber(val),
  );

  const safeFormat = createSafeFallback(
    format,
    'number',
    (val): val is 'number' | 'percentage' | 'currency' =>
      val === 'number' || val === 'percentage' || val === 'currency',
  );

  const formattedValue = () => {
    try {
      if (isString(safeValue)) {
        const date = new Date(safeValue);
        if (!isNaN(date.getTime()) && safeValue.includes('T')) {
          return formatDate(date);
        }
        return safeValue;
      }

      if (!isNumber(safeValue)) {
        return '0';
      }

      switch (safeFormat) {
        case 'percentage':
          return formatPercentage(safeValue);
        case 'currency':
          return formatCurrency(safeValue);
        default:
          return formatNumber(safeValue);
      }
    } catch (error) {
      console.error('Error formatting value:', error);
      return '0';
    }
  };

  const changeText = () => {
    try {
      if (safeChange === undefined) return '';
      if (!Number.isFinite(safeChange)) return 'Data not available';
      return `${formatPercentage(Math.abs(safeChange))} from previous period`;
    } catch (error) {
      console.error('Error formatting change:', error);
      return '';
    }
  };

  /* ---------- responsive design ---------- */
  const [isHovered, setIsHovered] = useState(false);
  
  // Get responsive sizing based on widget container and value length
  const getResponsiveSize = useCallback(() => {
    const valueStr = formattedValue();
    const valueLength = valueStr.length;
    
    return {
      valueSize: valueLength <= 4 ? 'text-6xl' : valueLength <= 8 ? 'text-5xl' : 'text-4xl',
      changeSize: 'text-base',
      iconSize: 'h-5 w-5',
      padding: 'p-6',
    };
  }, [safeValue, safeFormat]);

  const responsiveSize = useMemo(() => getResponsiveSize(), [getResponsiveSize]);

  /* ---------- render ---------- */
  const posthog = usePostHog();

  const handleClick = () => {
    try {
      posthog?.capture('number-card_click', { widget_id: widgetId });
    } catch (error) {
      console.error('Analytics error:', error);
    }
  };

  return (
    <WidgetShell
      title={title}
      widgetId={widgetId}
      onRefresh={onRefresh}
      onViewDetails={onViewDetails}
      onDragStart={onDragStart}
      className="h-full"
    >
      <div className="h-full overflow-hidden bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div
          className={cn(
            "flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg transition-all duration-300 ease-in-out",
            "bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-800 dark:via-gray-850 dark:to-gray-900",
            "shadow-sm hover:shadow-lg border border-gray-100 dark:border-gray-700",
            isHovered ? 'scale-102 shadow-xl' : 'hover:scale-101',
            responsiveSize.padding
          )}
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Main Value Display */}
          <div className="text-center mb-2">
            <div className={cn(
              "font-bold tracking-tight text-gray-900 dark:text-white transition-all duration-300",
              responsiveSize.valueSize,
              isHovered && "text-blue-600 dark:text-blue-400"
            )}>
              {formattedValue()}
            </div>
            
            {/* Format Type Indicator */}
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">
              {safeFormat === 'percentage' ? 'Percentage' : safeFormat === 'currency' ? 'Currency' : 'Count'}
            </div>
          </div>

          {/* Change Indicator */}
          {safeChange !== undefined && (
            <div className="flex flex-col items-center space-y-1">
              <div
                className={cn(
                  "flex items-center transition-all duration-300",
                  responsiveSize.changeSize,
                  isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                )}
              >
                {isPositive ? (
                  <ArrowUpIcon className={cn("mr-2", responsiveSize.iconSize)} />
                ) : (
                  <ArrowDownIcon className={cn("mr-2", responsiveSize.iconSize)} />
                )}
                <span className="font-medium">{changeText()}</span>
              </div>
              
              {/* Trend Visualization Bar */}
              <div className="w-16 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full transition-all duration-500 rounded-full",
                    isPositive ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gradient-to-r from-red-400 to-red-600'
                  )}
                  style={{ 
                    width: `${Math.min(Math.abs(safeChange || 0), 100)}%` 
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </WidgetShell>
  );
}

// Main export with error boundary
export default function NumberCard(props: NumberCardProps) {
  return (
    <WidgetErrorBoundary>
      <NumberCardContent {...props} />
    </WidgetErrorBoundary>
  );
}
