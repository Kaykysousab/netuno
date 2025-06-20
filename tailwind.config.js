/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#121212',
        'background-light': '#1e1e1e',
        primary: '#b026ff', // neon purple
        secondary: '#1a1a2e', // dark blue
        accent: '#4361ee',
        text: '#f1f1f1',
        'text-secondary': '#b3b3b3',
      },
      animation: {
        glow: 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          from: { boxShadow: '0 0 5px -5px #b026ff' },
          to: { boxShadow: '0 0 25px -5px #b026ff' },
        },
      },
    },
  },
  plugins: [],
};