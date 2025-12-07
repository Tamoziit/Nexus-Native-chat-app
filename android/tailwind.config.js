/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
  content: ["./app/**/*", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        ...colors,
        primary: "#000507",
        secondary: "#0f0f0f",

        accent: {
          300: "#6ee7b7",               // light mint-green
          400: "#34d399",               // medium natural green
          500: "#16a34a",
          600: "#166534",               // deep forest green (primary)
          "600/40": "rgba(22, 101, 52, 0.4)",  // transparent forest green
          "600/50": "rgba(22, 101, 52, 0.5)",  // transparent forest green
        },

        light: {
          100: "#f5f5f5",          // light backgrounds
          200: "#e5e5e5",          // muted borders / text
          300: "#cccccc"           // placeholder / subtle elements
        },

        dark: {
          100: "#1a1a1a",          // card surfaces
          200: "#121212",          // modal / nav backgrounds
        }
      },
      fontFamily: {
        arimo: ["Arimo-Regular"],
        "arimo-medium": ["Arimo-Medium"],
        "arimo-semibold": ["Arimo-SemiBold"],
        "arimo-bold": ["Arimo-Bold"],
        bitcount: ["Bitcount-Regular"],
        "bitcount-bold": ["Bitcount-Bold"]
      },
    },
  },
  plugins: [],
}