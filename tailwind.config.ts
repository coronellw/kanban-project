import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Plus Jakarta Sans"',
          '"Inter"',
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
      fontSize: {
        'heading-xl': ['1.5rem', { lineHeight: '1.875rem', fontWeight: '700' }],
        'heading-l': ['1.125rem', { lineHeight: '1.4375rem', fontWeight: '700' }],
        'heading-m': ['0.9375rem', { lineHeight: '1.1875rem', fontWeight: '700' }],
        'heading-s': ['0.75rem', { lineHeight: '0.9375rem', fontWeight: '700', letterSpacing: '2.4' }],
        'body-l': ['0.8125rem', { lineHeight: '1.4375', fontWeight: '400' }],
        'body-m': ['0.75rem', { lineHeight: '0.9375rem', fontWeight: '700' }],
      },
      colors: {
        primary: {
          DEFAULT: '#635FC7',
          light: '#A8A4FF'
        },
        secondary: {
          DEFAULT: '#EA5555',
          light: '#FF9898'
        },
        line: {
          DEFAULT: '#E4EBFA',
          dark: '#3E3F4E'
        },
        kgray: {
          DEFAULT: '#828FA3',
          dark: '#2B2C37',
          light: '#F4F7FD',
          darkest: '#20212C'
        }
      }
    },
  },
  plugins: [],
} satisfies Config;
