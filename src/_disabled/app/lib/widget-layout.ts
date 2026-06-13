import { Widget } from '@/app/store/dashboard-store';

export const getColSpan = (size: Widget['size'], isMobile: boolean) => {
  const s = isMobile ? 'medium' : size;
  return s === 'large' ? 'col-span-3' : s === 'medium' ? 'col-span-2' : 'col-span-1';
};

export const getRowHeight = (widget: Widget, isMobile: boolean) => {
  const s = isMobile ? 'medium' : widget.size;
  
  // Number cards: Optimized for metric display (following Material Design principles)
  if (widget.type === 'number-card') {
    if (isMobile) {
      return 'min-h-[140px] max-h-[160px]'; // ~4 cards per mobile screen
    }
    return s === 'large' ? 'min-h-[180px]' : s === 'medium' ? 'min-h-[160px]' : 'min-h-[140px]';
  }
  
  // Data tables: Need more height for rows + headers
  if (widget.type === 'data-table') {
    if (isMobile) {
      return 'min-h-[280px] max-h-[400px]'; // Allow scrolling for table content
    }
    return s === 'large' ? 'min-h-[320px]' : s === 'medium' ? 'min-h-[280px]' : 'min-h-[240px]';
  }
  
  // Charts (line, bar): Need space for axes, labels, and data visualization
  if (widget.type === 'line-chart' || widget.type === 'bar-chart') {
    if (isMobile) {
      return 'min-h-[240px] max-h-[280px]'; // Compact but readable
    }
    return s === 'large' ? 'min-h-[280px]' : s === 'medium' ? 'min-h-[240px]' : 'min-h-[220px]';
  }
  
  // Pie charts: Need space for legend + circular visualization
  if (widget.type === 'pie-chart') {
    if (isMobile) {
      return 'min-h-[260px] max-h-[300px]'; // Account for legend below
    }
    return s === 'large' ? 'min-h-[300px]' : s === 'medium' ? 'min-h-[260px]' : 'min-h-[240px]';
  }
  
  // Default widget height (for extensibility)
  if (isMobile) {
    return 'min-h-[200px] max-h-[280px]';
  }
  return s === 'large' ? 'min-h-[240px]' : s === 'medium' ? 'min-h-[200px]' : 'min-h-[180px]';
};
