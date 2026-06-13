// Dynamic theme-aware color utilities

export const getThemeAwareColor = (baseColor: string, isDark: boolean): string => {
  const colors: Record<string, { light: string; dark: string }> = {
    // Blues
    blue: {
      light: '#1e40af', // dark blue for light mode
      dark: '#93c5fd',  // light blue for dark mode
    },
    'blue-500': {
      light: '#1e40af',
      dark: '#93c5fd',
    },
    
    // Greens
    green: {
      light: '#15803d', // dark green for light mode
      dark: '#86efac',  // light green for dark mode
    },
    'green-500': {
      light: '#15803d',
      dark: '#86efac',
    },
    
    // Purples
    purple: {
      light: '#6b21a8', // dark purple for light mode
      dark: '#d8b4fe',  // light purple for dark mode
    },
    'purple-500': {
      light: '#6b21a8',
      dark: '#d8b4fe',
    },
    
    // Reds
    red: {
      light: '#b91c1c', // dark red for light mode
      dark: '#fca5a5',  // light red for dark mode
    },
    'red-500': {
      light: '#b91c1c',
      dark: '#fca5a5',
    },
    
    // Oranges
    orange: {
      light: '#c2410c', // dark orange for light mode
      dark: '#fdba74',  // light orange for dark mode
    },
    'orange-500': {
      light: '#c2410c',
      dark: '#fdba74',
    },
    
    // Yellows
    yellow: {
      light: '#a16207', // dark yellow for light mode
      dark: '#fde047',  // light yellow for dark mode
    },
    'yellow-500': {
      light: '#a16207',
      dark: '#fde047',
    },
    
    // Grays for borders and backgrounds
    'border-primary': {
      light: '#d1d5db', // gray-300 for light mode
      dark: '#374151',  // gray-700 for dark mode
    },
    'border-secondary': {
      light: '#e5e7eb', // gray-200 for light mode
      dark: '#1f2937',  // gray-800 for dark mode
    },
    'text-primary': {
      light: '#111827', // gray-900 for light mode
      dark: '#f9fafb',  // gray-50 for dark mode
    },
    'text-secondary': {
      light: '#4b5563', // gray-600 for light mode
      dark: '#9ca3af',  // gray-400 for dark mode
    },
    'bg-card': {
      light: '#ffffff', // white for light mode
      dark: '#1f2937',  // gray-800 for dark mode
    },
    'bg-hover': {
      light: '#f9fafb', // gray-50 for light mode
      dark: '#374151',  // gray-700 for dark mode
    },
  };
  
  const colorConfig = colors[baseColor] || colors['blue'];
  return isDark ? colorConfig.dark : colorConfig.light;
};

export const getBorderStyle = (isDark: boolean): string => {
  return isDark 
    ? 'border-gray-700/50 shadow-lg shadow-black/20' 
    : 'border-gray-300 shadow-md shadow-gray-200/50';
};

export const getCardStyle = (isDark: boolean): string => {
  return isDark
    ? 'bg-gray-800/50 border-gray-700/50 shadow-xl shadow-black/20'
    : 'bg-white border-gray-200 shadow-lg shadow-gray-100/50';
};

export const getTextColorClasses = (isDark: boolean) => ({
  primary: isDark ? 'text-gray-100' : 'text-gray-900',
  secondary: isDark ? 'text-gray-400' : 'text-gray-600',
  muted: isDark ? 'text-gray-500' : 'text-gray-500',
  accent: isDark ? 'text-blue-400' : 'text-blue-600',
});

export const getChartColors = (isDark: boolean) => ({
  line: isDark ? '#60a5fa' : '#2563eb', // blue-400 dark, blue-600 light
  bar: isDark ? '#34d399' : '#059669',   // emerald-400 dark, emerald-600 light
  pie: [
    isDark ? '#60a5fa' : '#2563eb', // blue
    isDark ? '#34d399' : '#059669', // green
    isDark ? '#fbbf24' : '#d97706', // yellow
    isDark ? '#f87171' : '#dc2626', // red
    isDark ? '#a78bfa' : '#7c3aed', // purple
    isDark ? '#fb923c' : '#ea580c', // orange
  ],
  grid: isDark ? '#374151' : '#e5e7eb',   // gray-700 dark, gray-200 light
  text: isDark ? '#9ca3af' : '#4b5563',   // gray-400 dark, gray-600 light
});