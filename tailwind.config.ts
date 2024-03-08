import type { Config } from 'tailwindcss';

const config = {
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
        '2xl': '1400px',
      },
    },
    zIndex: {
      inspectorView: '10',
      overlay: '100',
      dialog: '101',
    },
    colors: {
      white: '#FFFFFF',
      paleGrey: '#EFF2F7',
      paleBlueGrey: '#FAFDFF',
      greyText: '#686B72',
      gridHeaderColor: '#F6F8FA',
      gridHeaderTextColor: '#727E89',
      gridBorderColor: '#E6E6E7',
      gridCellTextColor: '#212326CC',
      gray800: '#1F2937',
      slateGray950: '#2F333C',
      slateGray700: '#67748E',
      slateGray500: '#8597AC',
      borderActive: '#B4C2CD',
      green550: '#1CB454',
      agDataColor: '#49515f',
      agGridHeaderHoverGrey: '#D2DDE580',
    },
    extend: {
      colors: {
        agWrongLabelColor: 'hsl(var(--ag-row-background-wrong-color))',
        agGroundMatch: 'hsl(var(--ag-background-match-color))',
        agOddGroundMatch: 'hsl(var(--ag-odd-row-background-match-color))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        overlay: 'hsl(var(--overlay))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      width: {
        inspectorView: 'var(--inspectorViewWidth)',
      },
      maxWidth: {
        inspectorView: 'var(--inspectorViewWidth)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

export const colors = config.theme.colors;
export default config;
