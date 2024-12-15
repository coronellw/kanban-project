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
