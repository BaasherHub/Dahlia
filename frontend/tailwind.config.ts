import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#FAF9F6",
        cream: "#F5F0EB",
        charcoal: "#252320",
        graphite: "#5A5652",
        gold: {
          DEFAULT: "#BFAF8A",
          light: "#D4C9A8",
          dark: "#8B7D5E",
        },
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        script: ["var(--font-script)", "cursive"],
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
