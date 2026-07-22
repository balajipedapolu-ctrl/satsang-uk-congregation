import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm saffron — the signature colour of Satsang
        saffron: {
          50: "#fdf6ec",
          100: "#f9e6cc",
          200: "#f2cd98",
          300: "#eab05f",
          400: "#e2953a",
          500: "#d97a1f",
          600: "#c05f16",
          700: "#9e4715",
          800: "#7f3917",
          900: "#682f16",
        },
        // Deep maroon accent
        maroon: {
          50: "#fbf1f0",
          100: "#f7dedb",
          200: "#efc0bb",
          300: "#e3968e",
          400: "#d26a5f",
          500: "#bd4a3d",
          600: "#a3372b",
          700: "#7c2d22",
          800: "#5f241d",
          900: "#4a1e19",
        },
        cream: "#fffbf4",
        ink: "#2b211b",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(124, 45, 34, 0.18)",
        card: "0 4px 24px -8px rgba(43, 33, 27, 0.15)",
      },
      backgroundImage: {
        "saffron-radial":
          "radial-gradient(circle at 50% 0%, rgba(234,176,95,0.35), transparent 60%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s ease-out both",
        "pulse-slow": "pulse-slow 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
