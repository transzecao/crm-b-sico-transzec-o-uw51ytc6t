import type { Config } from 'tailwindcss'
import animatePlugin from 'tailwindcss-animate'
import typographyPlugin from '@tailwindcss/typography'
import aspectRatioPlugin from '@tailwindcss/aspect-ratio'

export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        display: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: '#800020',
        background: '#FFFFFF',
        foreground: '#4A4A4A',
        primary: {
          DEFAULT: '#800020',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#0056B3',
          foreground: '#FFFFFF',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: '#F4F4F4',
          foreground: '#4A4A4A',
        },
        accent: {
          DEFAULT: '#F4F4F4',
          foreground: '#800020',
        },
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#4A4A4A',
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#4A4A4A',
        },
        sidebar: {
          DEFAULT: '#F8F9FA',
          foreground: '#4A4A4A',
          primary: '#800020',
          'primary-foreground': '#FFFFFF',
          accent: '#E9ECEF',
          'accent-foreground': '#800020',
          border: '#DEE2E6',
          ring: '#800020',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [animatePlugin, typographyPlugin, aspectRatioPlugin],
} satisfies Config
