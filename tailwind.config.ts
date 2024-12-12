import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f3f5",
          100: "#d2dae0",
          200: "#a6b0b8",
          300: "#7a868f",
          400: "#4f6b66",
          500: "#272c33",
          600: "#23292f",
          700: "#1e2226",
          800: "#181b1f",
          900: "#101215",
        },
        secondary: {
          50: "#fff9d4", // Tono más claro
          100: "#fff4a3",
          200: "#ffe86f",
          300: "#ffdc3b",
          400: "#ffcf16",
          500: "#febe10", // Tono base
          600: "#e5a60f",
          700: "#c88b0d",
          800: "#a6710a",
          900: "#8b5908", // Tono más oscuro
        },
        tertiary: {
          50: "#f7f8f9", // Tono más claro
          100: "#e2e4e7",
          200: "#c6c9cc",
          300: "#a9afb2",
          400: "#8c9497",
          500: "#bebfc1", // Tono base
          600: "#a0a3a5",
          700: "#828688",
          800: "#646767",
          900: "#474b4d", // Tono más oscuro
        },
        background: {
          50: "#ffffff", // Tono más claro (blanco)
          100: "#f5f5f5",
          200: "#e0e0e0",
          300: "#c0c0c0",
          400: "#a0a0a0",
          500: "#808080", // Tono medio (gris)
          600: "#606060",
          700: "#404040",
          800: "#202020",
          900: "#000000", // Tono más oscuro (negro)
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
