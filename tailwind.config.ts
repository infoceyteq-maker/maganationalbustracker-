import type { Config } from 'tailwindcss';

/**
 * National Bus Digitization Project — Design Tokens
 * Premium Light Theme · Corporate · Minimalist · Classy
 *
 *  Canvas        #FFFFFF  (pure white)
 *  Surface       #F9FAFB / #F3F4F6 (light ash)
 *  Ink           #111827  (deep black — headings & primary text)
 *  Secondary ink #4B5563 / #374151 (dark ash)
 *  Brand         #059669 → #10B981 (premium emerald)
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Plus Jakarta Sans"',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
      },
      colors: {
        ink: '#111827',
        ash: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
        },
        brand: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(17, 24, 39, 0.04), 0 1px 3px rgba(17, 24, 39, 0.06)',
        lift: '0 8px 24px -8px rgba(17, 24, 39, 0.12), 0 2px 6px rgba(17, 24, 39, 0.05)',
        pop: '0 16px 40px -12px rgba(17, 24, 39, 0.18), 0 4px 12px rgba(17, 24, 39, 0.06)',
        cta: '0 4px 14px -4px rgba(5, 150, 105, 0.45)',
      },
      borderRadius: {
        xl2: '20px',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'pulse-dot': {
          '0%': { boxShadow: '0 0 0 0 rgba(16, 185, 129, 0.45)' },
          '70%': { boxShadow: '0 0 0 7px rgba(16, 185, 129, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(16, 185, 129, 0)' },
        },
        'map-ping': {
          '0%': { transform: 'scale(0.6)', opacity: '0.7' },
          '80%': { transform: 'scale(2.4)', opacity: '0' },
          '100%': { transform: 'scale(2.4)', opacity: '0' },
        },
        'toast-in': {
          '0%': { opacity: '0', transform: 'translateY(10px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.45s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 0.3s ease both',
        'pulse-dot': 'pulse-dot 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'map-ping': 'map-ping 2.2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'toast-in': 'toast-in 0.3s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [],
};

export default config;
