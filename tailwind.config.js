/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                academic: {
                    navy: '#0B1426',
                    'dark-blue': '#1a2332',
                    'medium-blue': '#2a3441',
                    'light-blue': '#3a4551',
                    gold: '#D4AF37',
                    'light-gold': '#E6C757',
                    'dark-gold': '#B8941F',
                    white: '#FFFFFF',
                    'off-white': '#F5F1E6',
                    gray: '#6C757D',
                },
                background: 'var(--background)',
                foreground: 'var(--foreground)',
                muted: 'var(--muted)',
            },
            fontFamily: {
                'title': ['Playfair Display', 'serif'],
                'sans': ['Inter', 'system-ui', 'sans-serif'],
                'mono': ['JetBrains Mono', 'monospace'],
                'brand': ['Montserrat', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.6s ease-in-out',
                'slide-up': 'slideUp 0.8s ease-out',
                'academic-glow': 'academicGlow 2s ease-in-out infinite alternate',
                'pulse-slow': 'pulse 3s ease-in-out infinite',
                'logo-scroll': 'logoScroll 40s linear infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                academicGlow: {
                    '0%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)' },
                    '100%': { boxShadow: '0 0 30px rgba(212, 175, 55, 0.6)' },
                },
                logoScroll: {
                    '0%': { transform: 'translateX(-50%)' },
                    '100%': { transform: 'translateX(0)' },
                }
            }
        },
    },
    plugins: [],
}