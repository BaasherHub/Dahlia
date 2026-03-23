import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#FAF9F6",
        cream: "#F5F0EB",
        charcoal: "#1A1A1A",
        graphite: "#4A4A4A",
        gold: {
          DEFAULT: "#BFAF8A",
          light: "#D4C9A8",
          dark: "#8B7D5E",
        },
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      transitionTimingFunction: {
        luxury: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      transitionDuration: {
        "400": "400ms",
        "600": "600ms",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
