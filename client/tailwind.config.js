import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary — one blue. No variations on the theme.
        brand: {
          50:  '#f0f7ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        // Secondary — cyan. Used ONLY for hero gradients and small accents.
        accent: {
          50:  '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        // Semantic — only for their named purposes. Never decorative.
        success: {
          50:  '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
        warning: {
          50:  '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        danger: {
          50:  '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Inter', 'Noto Sans', 'system-ui', 'sans-serif'],
        handwriting: ['Merienda', 'cursive'],
      },
      fontSize: {
        // Tight, deliberate type scale. No in-between values.
        '2xs':  ['0.6875rem', { lineHeight: '1rem' }],     // 11px
        'xs':   ['0.75rem',   { lineHeight: '1.125rem' }], // 12px
        'sm':   ['0.8125rem', { lineHeight: '1.25rem' }],  // 13px
        'base': ['0.9375rem', { lineHeight: '1.5rem' }],   // 15px
        'lg':   ['1.0625rem', { lineHeight: '1.625rem' }], // 17px
        'xl':   ['1.25rem',   { lineHeight: '1.75rem' }],  // 20px
        '2xl':  ['1.5rem',    { lineHeight: '2rem' }],     // 24px
        '3xl':  ['1.875rem',  { lineHeight: '2.25rem' }],  // 30px
        '4xl':  ['2.25rem',   { lineHeight: '2.5rem' }],   // 36px
        '5xl':  ['3rem',      { lineHeight: '1.1' }],      // 48px
        '6xl':  ['3.75rem',   { lineHeight: '1.05' }],     // 60px
      },
      boxShadow: {
        // Four levels. That's it.
        'soft':     '0 1px 2px 0 rgba(15, 23, 42, 0.04)',
        'card':     '0 2px 8px -2px rgba(15, 23, 42, 0.06), 0 4px 16px -4px rgba(15, 23, 42, 0.04)',
        'elevated': '0 12px 32px -8px rgba(15, 23, 42, 0.12), 0 4px 12px -4px rgba(15, 23, 42, 0.06)',
        'glow':     '0 0 0 4px rgba(37, 99, 235, 0.12)',
      },
      borderRadius: {
        // Three semantic options on top of Tailwind's defaults.
        'card':  '0.75rem',  // 12px — cards, inputs, buttons
        'panel': '1rem',     // 16px — panels, sections
        'hero':  '1.5rem',   // 24px — hero cards, modals
      },
      animation: {
        'fade-in':      'fadeIn 250ms ease-out',
        'fade-up':      'fadeUp 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-down':    'fadeDown 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in':     'scaleIn 200ms cubic-bezier(0.16, 1, 0.3, 1)',
        'shimmer':      'shimmer 1.6s ease-in-out infinite',
        'float':        'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeDown: {
          '0%':   { opacity: '0', transform: 'translateY(-12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.97)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [typography],
};