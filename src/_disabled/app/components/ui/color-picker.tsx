'use client';

import { useState, useCallback, useEffect } from 'react';
import { Palette, Sun, Moon, Monitor } from 'lucide-react';
import { Button } from './button';
import { SimpleDropdownMenu, SimpleMenuItem, SimpleMenuSeparator } from './simple-dropdown-menu';
import { useTheme } from 'next-themes';
import { AdvancedColorPicker } from './advanced-color-picker';

const CHART_COLOR_PALETTES = [
  // PostHog Professional Set
  {
    name: 'PostHog',
    colors: [
      { name: 'PostHog Blue', value: '#1d4aff' },
      { name: 'PostHog Yellow', value: '#f9bd2b' },
      { name: 'PostHog Red', value: '#f54e00' },
      { name: 'PostHog Purple', value: '#9b59b6' },
    ],
  },
  // Enterprise Navy Set
  {
    name: 'Navy',
    colors: [
      { name: 'Navy Blue', value: '#2C5282' },
      { name: 'Steel Gray', value: '#4A5568' },
      { name: 'Charcoal', value: '#2D3748' },
      { name: 'Slate Blue', value: '#553C9A' },
    ],
  },
  // Forest Professional Set
  {
    name: 'Forest',
    colors: [
      { name: 'Forest Green', value: '#2F855A' },
      { name: 'Sage Green', value: '#68D391' },
      { name: 'Pine Green', value: '#1A365D' },
      { name: 'Moss Green', value: '#38A169' },
    ],
  },
  // Warm Copper Set
  {
    name: 'Copper',
    colors: [
      { name: 'Copper', value: '#B7791F' },
      { name: 'Bronze', value: '#8B4513' },
      { name: 'Rust', value: '#B91C1C' },
      { name: 'Brass', value: '#CA8A04' },
    ],
  },
  // Ocean Set
  {
    name: 'Ocean',
    colors: [
      { name: 'Deep Ocean', value: '#0891b2' },
      { name: 'Coral', value: '#f97316' },
      { name: 'Seafoam', value: '#10b981' },
      { name: 'Pearl', value: '#64748b' },
    ],
  },
  // Sunset Set
  {
    name: 'Sunset',
    colors: [
      { name: 'Sunset Orange', value: '#ea580c' },
      { name: 'Sunset Pink', value: '#ec4899' },
      { name: 'Sunset Purple', value: '#a855f7' },
      { name: 'Sunset Gold', value: '#f59e0b' },
    ],
  },
];

const WEBSITE_THEMES = [
  // Single color themes for website appearance
  {
    name: 'PostHog Blue',
    value: '#1d4aff',
    css: 'blue-posthog',
    lightCompat: true,
    darkCompat: true,
  },
  {
    name: 'Forest Green',
    value: '#059669',
    css: 'green-forest',
    lightCompat: true,
    darkCompat: true,
  },
  {
    name: 'Sunset Orange',
    value: '#ea580c',
    css: 'orange-sunset',
    lightCompat: true,
    darkCompat: true,
  },
  {
    name: 'Deep Purple',
    value: '#7c3aed',
    css: 'purple-deep',
    lightCompat: true,
    darkCompat: true,
  },
  {
    name: 'Crimson Red',
    value: '#dc2626',
    css: 'red-crimson',
    lightCompat: true,
    darkCompat: true,
  },
  { name: 'Ocean Teal', value: '#0891b2', css: 'teal-ocean', lightCompat: true, darkCompat: true },
];

const TEXT_COLORS = [
  // Light theme appropriate text colors
  { name: 'Dark Gray', value: '#374151', css: 'gray-700', lightTheme: true, darkTheme: false },
  { name: 'Charcoal', value: '#1f2937', css: 'gray-800', lightTheme: true, darkTheme: false },
  { name: 'Black', value: '#111827', css: 'gray-900', lightTheme: true, darkTheme: false },

  // Dark theme appropriate text colors
  { name: 'Light Gray', value: '#d1d5db', css: 'gray-300', lightTheme: false, darkTheme: true },
  { name: 'Off White', value: '#f9fafb', css: 'gray-50', lightTheme: false, darkTheme: true },
  { name: 'White', value: '#ffffff', css: 'white', lightTheme: false, darkTheme: true },

  // Universal colors (work on both)
  { name: 'PostHog Blue', value: '#1d4aff', css: 'blue-600', lightTheme: true, darkTheme: true },
  { name: 'Success Green', value: '#059669', css: 'green-600', lightTheme: true, darkTheme: true },
];

interface ColorPickerProps {
  onChartColorsChange?: (colors: { name: string; value: string }[]) => void;
  onWebsiteThemeChange?: (theme: { name: string; value: string; css: string }) => void;
  onTextColorChange?: (color: { name: string; value: string; css: string }) => void;
}

export default function ColorPicker({
  onChartColorsChange,
  onWebsiteThemeChange,
  onTextColorChange,
}: ColorPickerProps) {
  const { theme, setTheme } = useTheme();
  const [selectedChartPalette, setSelectedChartPalette] = useState(CHART_COLOR_PALETTES[0]);
  const [selectedWebsiteTheme, setSelectedWebsiteTheme] = useState(WEBSITE_THEMES[0]);
  const [selectedTextColor, setSelectedTextColor] = useState(TEXT_COLORS[0]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const applyChartColors = useCallback(
    (palette: { name: string; colors: { name: string; value: string }[] }) => {
      const root = document.documentElement;

      // Apply chart colors for visualizations
      palette.colors.forEach((color, index) => {
        root.style.setProperty(`--chart-color-${index + 1}`, color.value);
      });

      // Primary visualization color for single-color charts
      root.style.setProperty(
        '--color-visualization-primary',
        palette.colors[0]?.value || '#1d4aff',
      );
      root.style.setProperty(
        '--color-visualization-secondary',
        palette.colors[1]?.value || '#f9bd2b',
      );
      root.style.setProperty(
        '--color-visualization-tertiary',
        palette.colors[2]?.value || '#f54e00',
      );
      root.style.setProperty(
        '--color-visualization-quaternary',
        palette.colors[3]?.value || '#9b59b6',
      );

      localStorage.setItem('chart-color-palette', JSON.stringify(palette));
      onChartColorsChange?.(palette.colors);
    },
    [onChartColorsChange],
  );

  const applyWebsiteTheme = useCallback(
    (themeColor: { name: string; value: string; css: string }) => {
      const root = document.documentElement;

      // Convert hex to HSL values for CSS custom properties
      const hexToHsl = (hex: string) => {
        const r = parseInt(hex.substr(1, 2), 16) / 255;
        const g = parseInt(hex.substr(3, 2), 16) / 255;
        const b = parseInt(hex.substr(5, 2), 16) / 255;

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
              h = (g - b) / d + (g < b ? 6 : 0);
              break;
            case g:
              h = (b - r) / d + 2;
              break;
            case b:
              h = (r - g) / d + 4;
              break;
          }
          h /= 6;
        }

        return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
      };

      // Determine if color is light or dark for text contrast
      const getLuminance = (hex: string) => {
        const r = parseInt(hex.substr(1, 2), 16) / 255;
        const g = parseInt(hex.substr(3, 2), 16) / 255;
        const b = parseInt(hex.substr(5, 2), 16) / 255;

        // Convert to linear RGB
        const toLinear = (c: number) =>
          c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        const rLinear = toLinear(r);
        const gLinear = toLinear(g);
        const bLinear = toLinear(b);

        // Calculate luminance
        return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
      };

      const luminance = getLuminance(themeColor.value);
      const isLightColor = luminance > 0.5;
      const textColor = isLightColor ? '41 37 36' : '255 255 255'; // dark gray or white

      // Apply website theme colors (buttons, accents, borders, etc.)
      const hslValue = hexToHsl(themeColor.value);
      root.style.setProperty('--primary', hslValue);
      root.style.setProperty('--accent', hslValue);
      root.style.setProperty('--primary-foreground', textColor);

      // Update ring (focus) color
      root.style.setProperty('--ring', hslValue);

      // Update sidebar primary color
      root.style.setProperty('--sidebar-primary', hslValue);
      root.style.setProperty('--sidebar-primary-foreground', textColor);
      root.style.setProperty('--sidebar-ring', hslValue);

      // Apply to buttons and interactive elements
      root.style.setProperty('--color-primary', themeColor.value);
      root.style.setProperty('--color-primary-hover', adjustColorBrightness(themeColor.value, -10));
      root.style.setProperty('--color-primary-light', adjustColorBrightness(themeColor.value, 20));

      localStorage.setItem('website-theme', JSON.stringify(themeColor));
      onWebsiteThemeChange?.(themeColor);
    },
    [onWebsiteThemeChange],
  );

  const adjustColorBrightness = (hex: string, percent: number) => {
    // Remove # if present
    hex = hex.replace(/^#/, '');

    // Parse r, g, b values
    const num = parseInt(hex, 16);
    const r = (num >> 16) + percent;
    const g = ((num >> 8) & 0x00ff) + percent;
    const b = (num & 0x0000ff) + percent;

    return `#${(
      0x1000000 +
      (Math.min(255, Math.max(0, r)) << 16) +
      (Math.min(255, Math.max(0, g)) << 8) +
      Math.min(255, Math.max(0, b))
    )
      .toString(16)
      .slice(1)}`;
  };

  const handleChartPaletteSelect = useCallback(
    (palette: { name: string; colors: { name: string; value: string }[] }) => {
      setSelectedChartPalette(palette);
      applyChartColors(palette);
    },
    [applyChartColors],
  );

  const handleWebsiteThemeSelect = useCallback(
    (theme: (typeof WEBSITE_THEMES)[0]) => {
      setSelectedWebsiteTheme(theme);
      applyWebsiteTheme(theme);
    },
    [applyWebsiteTheme],
  );

  const handleTextColorSelect = useCallback((color: (typeof TEXT_COLORS)[0]) => {
    setSelectedTextColor(color);
    applyTextColor(color);
  }, []);

  const applyTextColor = useCallback(
    (textColor: { name: string; value: string; css: string }) => {
      const root = document.documentElement;

      // Apply text color to foreground
      const hexToHsl = (hex: string) => {
        const r = parseInt(hex.substr(1, 2), 16) / 255;
        const g = parseInt(hex.substr(3, 2), 16) / 255;
        const b = parseInt(hex.substr(5, 2), 16) / 255;

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
              h = (g - b) / d + (g < b ? 6 : 0);
              break;
            case g:
              h = (b - r) / d + 2;
              break;
            case b:
              h = (r - g) / d + 4;
              break;
          }
          h /= 6;
        }

        return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
      };

      const hslValue = hexToHsl(textColor.value);
      root.style.setProperty('--foreground', hslValue);
      root.style.setProperty('--card-foreground', hslValue);
      root.style.setProperty('--popover-foreground', hslValue);

      localStorage.setItem('text-color', JSON.stringify(textColor));
      onTextColorChange?.(textColor);
    },
    [onTextColorChange],
  );

  // Initialize colors on mount
  useEffect(() => {
    const savedChartPalette = localStorage.getItem('chart-color-palette');
    const savedWebsiteTheme = localStorage.getItem('website-theme');
    const savedTextColor = localStorage.getItem('text-color');

    let chartPalette = selectedChartPalette;
    let websiteTheme = selectedWebsiteTheme;
    let textColor = selectedTextColor;

    if (savedChartPalette) {
      try {
        chartPalette = JSON.parse(savedChartPalette);
        setSelectedChartPalette(chartPalette);
      } catch (e) {
        console.warn('Failed to parse saved chart palette');
      }
    }

    if (savedWebsiteTheme) {
      try {
        websiteTheme = JSON.parse(savedWebsiteTheme);
        setSelectedWebsiteTheme(websiteTheme);
      } catch (e) {
        console.warn('Failed to parse saved website theme');
      }
    }

    if (savedTextColor) {
      try {
        textColor = JSON.parse(savedTextColor);
        setSelectedTextColor(textColor);
      } catch (e) {
        console.warn('Failed to parse saved text color');
      }
    }

    // Always apply colors on mount to ensure they're set
    applyChartColors(chartPalette);
    applyWebsiteTheme(websiteTheme);
    applyTextColor(textColor);
  }, []); // Only run once on mount

  return (
    <SimpleDropdownMenu
      trigger={
        <div className="flex items-center space-x-1">
          <button className="posthog-button-ghost compact-dashboard-item hover:bg-accent/50 flex items-center space-x-1 transition-colors">
            <Palette className="h-4 w-4" />
            <span className="text-xs">Theme</span>
          </button>
        </div>
      }
    >
      <div className="w-[320px] max-w-[90vw] bg-white p-4 dark:bg-gray-800">
        {/* Theme Mode Selection - PostHog Style */}
        <div className="mb-4">
          <div className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
            Appearance
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'light', icon: Sun, label: 'Light' },
              { value: 'dark', icon: Moon, label: 'Dark' },
              { value: 'system', icon: Monitor, label: 'System' },
            ].map((option) => {
              const Icon = option.icon;
              const isSelected = theme === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                  className={`flex items-center justify-center space-x-1.5 rounded-lg border-2 p-2 text-xs font-medium transition-all duration-200 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="my-4 border-t border-gray-200 dark:border-gray-600"></div>

        {/* Chart Color Palettes - PostHog Style */}
        <div className="mb-4">
          <div className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
            Chart Colors
          </div>
          <div className="space-y-3">
            {CHART_COLOR_PALETTES.map((palette) => (
              <div key={palette.name}>
                <div className="mb-2 text-xs font-medium tracking-wide text-gray-600 uppercase dark:text-gray-400">
                  {palette.name}
                </div>
                <button
                  onClick={() => handleChartPaletteSelect(palette)}
                  className={`w-full rounded-lg border-2 p-2 transition-all duration-200 hover:shadow-sm ${
                    selectedChartPalette.name === palette.name
                      ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
                      : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="grid grid-cols-4 gap-2">
                    {palette.colors.map((color) => (
                      <div
                        key={color.name}
                        className="h-8 w-full rounded-md border border-black/10 shadow-sm dark:border-white/10"
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="my-4 border-t border-gray-200 dark:border-gray-600"></div>

        {/* Website Theme Colors - PostHog Style */}
        <div className="mb-4">
          <div className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
            Accent Color
          </div>
          <div className="grid grid-cols-3 gap-2">
            {WEBSITE_THEMES.map((themeColor) => (
              <button
                key={themeColor.name}
                onClick={() => handleWebsiteThemeSelect(themeColor)}
                className={`group relative flex h-10 w-full items-center justify-center rounded-lg border-2 transition-all duration-200 hover:shadow-sm ${
                  selectedWebsiteTheme.value === themeColor.value
                    ? 'border-gray-900 dark:border-gray-100'
                    : 'border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500'
                }`}
                style={{ backgroundColor: themeColor.value }}
                title={themeColor.name}
                aria-label={`Select ${themeColor.name} website theme`}
              >
                {selectedWebsiteTheme.value === themeColor.value && (
                  <div className="text-sm font-bold text-white drop-shadow-sm dark:text-black">
                    ✓
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="my-4 border-t border-gray-200 dark:border-gray-600"></div>

        {/* Text Colors - PostHog Style */}
        <div className="mb-2">
          <div className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
            Text Color
          </div>
          <div className="grid grid-cols-4 gap-2">
            {TEXT_COLORS.filter((textColor) => {
              // Filter based on current theme
              if (theme === 'dark') return textColor.darkTheme;
              if (theme === 'light') return textColor.lightTheme;
              // For system theme, show all universal colors
              return textColor.lightTheme && textColor.darkTheme;
            }).map((textColor) => (
              <button
                key={textColor.name}
                onClick={() => handleTextColorSelect(textColor)}
                className={`relative flex h-8 w-full items-center justify-center rounded-lg border-2 transition-all duration-200 hover:shadow-sm ${
                  selectedTextColor.value === textColor.value
                    ? 'border-gray-900 dark:border-gray-100'
                    : 'border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500'
                }`}
                style={{ backgroundColor: textColor.value }}
                title={textColor.name}
                aria-label={`Select ${textColor.name} text color`}
              >
                <div
                  className="text-xs font-semibold"
                  style={{
                    color:
                      textColor.value === '#ffffff' || textColor.value.startsWith('#f')
                        ? '#000000'
                        : '#ffffff',
                  }}
                >
                  Aa
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </SimpleDropdownMenu>
  );
}
