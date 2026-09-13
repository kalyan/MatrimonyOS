import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#e11d48', // Regal Crimson / Vermilion
          600: '#be123c',
          700: '#9f1239',
          800: '#881337',
          900: '#4c0519',
        },
        gold: {
          50: '#fdfbf7',
          100: '#f9f5eb',
          200: '#f2e8cf',
          300: '#e5d1a1',
          400: '#d7b76d',
          500: '#c59b37', // Auspicious Marigold Gold
          600: '#a67b25',
          700: '#825b1e',
        },
        wa: {
          green: '#25D366',
          dark: '#075E54',
          teal: '#128C7E',
          light: '#DCF8C6',
        }
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'premium': '0 20px 25px -5px rgba(225, 29, 72, 0.08), 0 8px 10px -6px rgba(225, 29, 72, 0.05)',
      }
    },
  },
  plugins: [],
};
export default config;
