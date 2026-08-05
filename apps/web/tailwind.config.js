/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Ludo Nexus Design System
        background: {
          DEFAULT: '#0C0A09', // Deep premium
          secondary: '#111827', // Dark navy
          tertiary: '#1F2937', // Elevated
        },
        primary: {
          DEFAULT: '#0EA5E9', // Trust blue
          glow: '#22D3EE', // Cyan glow
          dark: '#0284C7',
        },
        secondary: {
          DEFAULT: '#A16207', // Warm gold
          glow: '#FBBF24', // Gold glow
          dark: '#854D0E',
        },
        accent: {
          cyan: '#06B6D4',
          magenta: '#D946EF',
          violet: '#8B5CF6',
          green: '#16A34A',
          orange: '#EA580C',
          red: '#EF4444',
        },
        surface: {
          glass: 'rgba(17, 24, 39, 0.7)',
          glassStrong: 'rgba(17, 24, 39, 0.85)',
          border: 'rgba(148, 163, 184, 0.2)',
          borderGlow: 'rgba(34, 211, 238, 0.3)',
        },
        text: {
          primary: '#F9FAFB',
          secondary: '#D1D5DB',
          muted: '#9CA3AF',
          inverse: '#0C0A09',
        },
        // Player colors
        player: {
          red: '#EF4444',
          redGlow: '#F87171',
          green: '#22C55E',
          greenGlow: '#4ADE80',
          yellow: '#EAB308',
          yellowGlow: '#FDE047',
          blue: '#3B82F6',
          blueGlow: '#60A5FA',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'display-xl': ['clamp(3rem, 8vw, 6rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2.25rem, 6vw, 4rem)', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
        'display-md': ['clamp(1.875rem, 4vw, 3rem)', { lineHeight: '1.2' }],
        'display-sm': ['clamp(1.5rem, 3vw, 2.25rem)', { lineHeight: '1.3' }],
        'heading-xl': ['clamp(1.5rem, 2.5vw, 2rem)', { lineHeight: '1.3' }],
        'heading-lg': ['clamp(1.25rem, 2vw, 1.5rem)', { lineHeight: '1.4' }],
        'heading-md': ['clamp(1.125rem, 1.5vw, 1.25rem)', { lineHeight: '1.4' }],
        'heading-sm': ['clamp(1rem, 1.25vw, 1.125rem)', { lineHeight: '1.5' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],
        'body-xs': ['0.75rem', { lineHeight: '1.5' }],
        'caption': ['0.75rem', { lineHeight: '1.4' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        'card': '1.5rem',
        'panel': '2rem',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(34, 211, 238, 0.3)',
        'glow-strong': '0 0 40px rgba(34, 211, 238, 0.5)',
        'glow-gold': '0 0 20px rgba(251, 191, 36, 0.4)',
        'glow-magenta': '0 0 20px rgba(217, 70, 239, 0.3)',
        'inner-glow': 'inset 0 0 20px rgba(34, 211, 238, 0.1)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.4)',
        'glass-strong': '0 16px 48px rgba(0, 0, 0, 0.5)',
      },
      backdropBlur: {
        'glass': '16px',
        'glass-strong': '24px',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'rotate-slow': 'rotate 20s linear infinite',
        'shimmer': 'shimmer 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'dice-roll': 'diceRoll 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'token-move': 'tokenMove 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'capture': 'capture 0.5s ease-out',
        'win': 'win 1s ease-out',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        rotate: {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        slideUp: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          'from': { opacity: '0', transform: 'translateY(-20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          'from': { opacity: '0', transform: 'scale(0.9)' },
          'to': { opacity: '1', transform: 'scale(1)' },
        },
        diceRoll: {
          '0%': { transform: 'rotate(0deg) scale(1)' },
          '25%': { transform: 'rotate(90deg) scale(1.1)' },
          '50%': { transform: 'rotate(180deg) scale(1)' },
          '75%': { transform: 'rotate(270deg) scale(1.1)' },
          '100%': { transform: 'rotate(360deg) scale(1)' },
        },
        tokenMove: {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(var(--tx), var(--ty)) scale(1.15)' },
          '100%': { transform: 'translate(var(--tx), var(--ty)) scale(1)' },
        },
        capture: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.5) rotate(180deg)', opacity: '0.5' },
          '100%': { transform: 'scale(0)', opacity: '0' },
        },
        win: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.2)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'mesh-gradient': 'linear-gradient(135deg, #0C0A09 0%, #111827 50%, #0C0A09 100%)',
        'neon-grid': 'linear-gradient(rgba(34, 211, 238, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.05) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
    },
  },
  plugins: [],
};