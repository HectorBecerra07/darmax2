/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'nav': '1262px',
      },
      colors: {
        primary: "#24d4da",
        secondary: "#1b9b9f",
        accent: "#ccff00",
        textDark: "#333333",
        bgLight: "#f9f9f9",
      },
      fontFamily: {
        bangers: ['Bangers', 'cursive'],
      },
      backgroundImage: {
        'gradient-negocio': 
          "linear-gradient(to bottom, #24d4da, #0ad9d6, #00ded0, #00e2c9, #00eab1, #19f18e, #5bf560, #8df607)"
      },
      keyframes: {
        waveRise: {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0%)" },
        },
        waveWiggle: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        fadeInUp: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        waveRise: "waveRise 0.8s ease-out forwards",
        waveWiggle: "waveWiggle 2s ease-in-out infinite",
        fadeInUp: "fadeInUp 0.6s ease-out both",
      },
    },
  },
  plugins: [],
};
