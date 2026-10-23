import type { Config } from 'tailwindcss';

/**
 * Maga — Neo-Apple 3D Tactile Design System
 * Soft neumorphism + glassy gradients on a warm cream canvas.
 *
 *  Canvas      #F4F2EE  warm off-white / cream
 *  Card        matte white, rounded-3xl, 10px 20px 30px rgba(0,0,0,.05)
 *  Deep emerald#0E6A47  solid 3D pill buttons (top bevel highlight)
 *  Amber glass #FFB347 → #FF7B00  highlight cards & moments of delight
 *  Ink         #17211C  deep green-black headings
 */
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
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
        cream: {
          DEFAULT: '#F4F2EE',
          deep: '#EDE9E1',
          line: '#E7E1D3',
        },
        ink: '#17211C',
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
          50: '#EDF7F1',
          100: '#D3EDDF',
          200: '#A9DCC2',
          300: '#6FC79B',
          400: '#2E9E6B',
          500: '#12805A',
          600: '#0E6A47',
          700: '#0A5739',
          800: '#08452E',
          900: '#063724',
        },
        tang: {
          300: '#FFB347',
          400: '#FF9A1F',
          500: '#FF7B00',
          600: '#E86A00',
        },
      },
      boxShadow: {
        /* Matte card resting on the cream canvas */
        card: '10px 20px 30px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.95)',
        lift: '16px 30px 44px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.95)',
        pop: '22px 38px 64px rgba(23,33,28,0.14), inset 0 1px 0 rgba(255,255,255,0.9)',
        /* 3D extruded pill buttons — bevel top-light, weighted base */
        btn3d:
          'inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -3px 6px rgba(0,0,0,0.20), 0 12px 22px rgba(14,106,71,0.28)',
        btn3dPress: 'inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 3px rgba(0,0,0,0.20), 0 5px 10px rgba(14,106,71,0.22)',
        btnAmber:
          'inset 0 1px 0 rgba(255,255,255,0.50), inset 0 -3px 6px rgba(146,64,0,0.28), 0 12px 22px rgba(255,123,0,0.30)',
        btnMatte:
          'inset 0 1px 0 rgba(255,255,255,1), inset 0 -2px 4px rgba(0,0,0,0.05), 0 8px 18px rgba(23,33,28,0.08)',
        /* Neumorphic wells & tiles */
        insetSoft: 'inset 0 2px 5px rgba(23,33,28,0.06), inset 0 -1px 0 rgba(255,255,255,0.85)',
        neu: '6px 6px 14px rgba(166,155,132,0.20), -6px -6px 14px rgba(255,255,255,0.95)',
        neuSm: '3px 3px 8px rgba(166,155,132,0.18), -3px -3px 8px rgba(255,255,255,0.95)',
        /* Back-compat alias */
        cta: '0 12px 22px rgba(14,106,71,0.28)',
        glowAmber: '0 18px 36px rgba(255,123,0,0.28), inset 0 1px 0 rgba(255,255,255,0.45)',
      },
      backgroundImage: {
        'amber-glass': 'linear-gradient(135deg, #FFB347 0%, #FF7B00 100%)',
        'emerald-deep': 'linear-gradient(160deg, #12805A 0%, #0E6A47 55%, #0A5739 100%)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'pulse-dot': {
          '0%': { boxShadow: '0 0 0 0 rgba(14,106,71,0.40)' },
          '70%': { boxShadow: '0 0 0 7px rgba(14,106,71,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(14,106,71,0)' },
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
        'pop-in': {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 0.3s ease both',
        'pulse-dot': 'pulse-dot 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'map-ping': 'map-ping 2.2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'toast-in': 'toast-in 0.3s cubic-bezier(0.22, 1, 0.36, 1) both',
        'pop-in': 'pop-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both',
      },
    },
  },
  plugins: [],
};

export default config;
