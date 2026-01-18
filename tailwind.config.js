/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/modules/portal/**/*.{html,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        display: {
          // Light theme colors (matching display styles.css)
          primary: '#1e73be',
          accent: '#fbff00',
          'text-primary': '#ebf2f3',
          'text-secondary': '#afe9f1',
          'bg-primary': '#53ceff',
          'bg-secondary': '#00b0e6',
          'bg-tertiary': '#00c5e4',
          // Dark theme colors
          dark: {
            primary: '#1e73be',
            accent: '#fbff00',
            'text-primary': '#e0f4ff',
            'text-secondary': '#7da5c4',
            'bg-primary': '#0a1929',
            'bg-secondary': '#162f47',
            'bg-tertiary': '#1a4568',
          },
        },
      },
    },
  },
  plugins: [],
};
