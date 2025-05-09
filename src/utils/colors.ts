// Color utility functions and constants

// Main color palette
export const colors = {
    navy: {
        50: '#f0f4f9',
        100: '#d9e2ec',
        200: '#bccdde',
        300: '#94abc5',
        400: '#6885a8',
        500: '#4d6890',
        600: '#3d5478',
        700: '#334163',
        800: '#092f5e', // Primary navy blue
        900: '#051e3e',
    },
    yellow: {
        50: '#fffde7',
        100: '#fff9c4',
        200: '#fff59d',
        300: '#fff176',
        400: '#ffee58',
        500: '#ffeb3b',
        600: '#c6a100', // Primary rustic yellow
        700: '#c67c00',
        800: '#c67100',
        900: '#c62828',
    },
};

// Function to get color with opacity
// Function to generate rgba values from hex
export const hexToRgba = (hex: string, alpha: number): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Function to get gradient strings
export const getGradient = (direction: string, startColor: string, endColor: string): string => {
    return `linear-gradient(${direction}, ${startColor}, ${endColor})`;
};

// Common color combinations for the site
export const colorCombinations = {
    primary: {
        background: colors.navy[800],
        text: '#ffffff',
        accent: colors.yellow[600],
    },
    secondary: {
        background: '#ffffff',
        text: colors.navy[800],
        accent: colors.yellow[600],
    },
    tertiary: {
        background: colors.navy[50],
        text: colors.navy[800],
        accent: colors.yellow[600],
    },
};

// Helper for CSS variables insertion in global stylesheet
export const colorVariables = Object.entries(colors).reduce((acc, [ colorName, shades ]) => {
    return {
        ...acc,
        ...Object.entries(shades).reduce((shadesAcc, [ shade, value ]) => {
            return {
                ...shadesAcc,
                [`--color-${colorName}-${shade}`]: value,
            };
        }, {}),
    };
}, {});